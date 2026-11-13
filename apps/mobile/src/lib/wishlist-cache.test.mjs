import assert from "node:assert/strict";
import { test } from "node:test";
import { MutationObserver, QueryClient } from "@tanstack/react-query";

import {
  selectWishlistIds,
  selectWishlistItems,
  wishlistMutationOptions,
  wishlistQueryOptions,
} from "./wishlist-cache.ts";

const item = (id) => ({
  id: `wishlist-${id}`,
  createdAt: "2026-11-13T12:00:00Z",
  product: {
    id,
    albumId: `album-${id}`,
    title: `Album ${id}`,
    artist: { id: "artist", name: "Artist", slug: "artist" },
    sku: `sku-${id}`,
    format: "vinyl",
    edition: "standard",
    price: "100.00",
    compareAtPrice: null,
    currency: "BRL",
    stockQuantity: 1,
    inStock: true,
    isImported: false,
    genre: null,
    releaseDate: null,
    image: null,
  },
});

function setup(t, initial = []) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  t.after(() => client.clear());
  let server = initial;
  let readsFail = false;
  const calls = [];
  const api = {
    getWishlist: async () => {
      if (readsFail) throw new Error("offline");
      return server;
    },
    addToWishlist: (id) => request(id, true),
    removeFromWishlist: (id) => request(id, false),
  };
  function request(id, add) {
    return new Promise((resolve, reject) => {
      calls.push({
        id,
        succeed: () => {
          server = add
            ? [...server, item(id)]
            : server.filter((i) => i.product.id !== id);
          resolve();
        },
        fail: () => reject(new Error("request failed")),
      });
    });
  }
  const query = wishlistQueryOptions(client, api);
  const cache = () => client.getQueryData(query.queryKey);
  const ids = () => [...selectWishlistIds(cache())].sort();
  const toggle = (id, isFavorited) => {
    const observer = new MutationObserver(
      client,
      wishlistMutationOptions(client, api),
    );
    // Attach an error handler immediately, including for deliberately failed requests.
    return observer.mutate({ productId: id, isFavorited }).then(
      () => undefined,
      (error) => error,
    );
  };
  const flush = () => new Promise((resolve) => setImmediate(resolve));
  return {
    api,
    client,
    query,
    cache,
    ids,
    toggle,
    calls,
    flush,
    failReads: (value) => {
      readsFail = value;
    },
  };
}

test("adds to the cache without inventing a product, then loads the real item", async (t) => {
  const s = setup(t);
  const result = s.toggle("a", false);
  await s.flush();
  assert.deepEqual(s.ids(), ["a"]);
  assert.deepEqual(selectWishlistItems(s.cache()), []);
  s.calls[0].succeed();
  assert.equal(await result, undefined);
  assert.deepEqual(selectWishlistItems(s.cache()), [item("a")]);
  assert.deepEqual(s.cache().changes, {});
});

test("failed addition rolls back even before the first wishlist load", async (t) => {
  const s = setup(t);
  s.failReads(true);
  const result = s.toggle("a", false);
  await s.flush();
  s.calls[0].fail();
  assert.ok((await result) instanceof Error);
  assert.deepEqual(s.ids(), []);
  assert.deepEqual(s.cache().changes, {});
});

for (const firstFails of [true, false]) {
  test(`concurrent removals preserve the other product when ${firstFails ? "first" : "second"} fails`, async (t) => {
    const s = setup(t, [item("a"), item("b")]);
    await s.client.fetchQuery(s.query);
    const a = s.toggle("a", true);
    const b = s.toggle("b", true);
    await s.flush();
    assert.deepEqual(selectWishlistItems(s.cache()), []);
    const failure = s.calls[firstFails ? 0 : 1];
    const success = s.calls[firstFails ? 1 : 0];
    failure.fail();
    await (firstFails ? a : b);
    assert.deepEqual(s.ids(), [failure.id]);
    success.succeed();
    await (firstFails ? b : a);
    assert.deepEqual(s.ids(), [failure.id]);
    assert.deepEqual(s.cache().changes, {});
  });
}

test("a successful addition survives another product's rollback", async (t) => {
  const s = setup(t, [item("b")]);
  await s.client.fetchQuery(s.query);
  const a = s.toggle("a", false);
  const b = s.toggle("b", true);
  await s.flush();
  s.calls[0].succeed();
  await a;
  assert.deepEqual(s.ids(), ["a"]);
  s.calls[1].fail();
  await b;
  assert.deepEqual(s.ids(), ["a", "b"]);
  assert.deepEqual(selectWishlistItems(s.cache()), [item("b"), item("a")]);
});

test("refetch preserves pending changes and reconciles them after success", async (t) => {
  const s = setup(t, [item("a")]);
  await s.client.fetchQuery(s.query);
  const result = s.toggle("a", true);
  await s.flush();
  await s.client.fetchQuery(s.query);
  assert.deepEqual(s.ids(), []);
  assert.deepEqual(selectWishlistItems(s.cache()), []);
  s.calls[0].succeed();
  await result;
  assert.deepEqual(s.cache(), { items: [], changes: {} });
});

test("duplicate mutations for the same product send only one request", async (t) => {
  const s = setup(t);
  const first = s.toggle("a", false);
  const duplicate = s.toggle("a", false);
  await s.flush();
  assert.ok((await duplicate) instanceof Error);
  assert.equal(s.calls.length, 1);
  assert.deepEqual(s.ids(), ["a"]);
  s.calls[0].succeed();
  await first;
  assert.deepEqual(s.ids(), ["a"]);
});

test("failed refetch retains confirmed state; a later failed toggle restores it", async (t) => {
  const s = setup(t);
  s.failReads(true);
  const add = s.toggle("a", false);
  await s.flush();
  s.calls[0].succeed();
  await add;
  assert.deepEqual(s.ids(), ["a"]);
  const remove = s.toggle("a", true);
  await s.flush();
  assert.deepEqual(s.ids(), []);
  s.calls[1].fail();
  await remove;
  assert.deepEqual(s.ids(), ["a"]);
  s.failReads(false);
  await s.client.fetchQuery(s.query);
  assert.deepEqual(selectWishlistItems(s.cache()), [item("a")]);
  assert.deepEqual(s.cache().changes, {});
});

test("a cancelled stale read cannot overwrite an optimistic addition", async (t) => {
  const s = setup(t);
  await s.client.fetchQuery(s.query);
  const originalRead = s.api.getWishlist;
  let finishRead;
  let readSignal;
  s.api.getWishlist = (signal) => {
    readSignal = signal;
    return new Promise((resolve) => {
      finishRead = resolve;
    });
  };
  const read = s.client.fetchQuery(s.query).catch(() => undefined);
  const add = s.toggle("a", false);
  await s.flush();
  assert.equal(readSignal.aborted, true);
  finishRead([]);
  await read;
  assert.deepEqual(s.ids(), ["a"]);
  s.api.getWishlist = originalRead;
  s.calls[0].succeed();
  await add;
  assert.deepEqual(selectWishlistItems(s.cache()), [item("a")]);
});

test("a new operation during reconciliation survives the older response", async (t) => {
  const s = setup(t);
  await s.client.fetchQuery(s.query);
  const originalRead = s.api.getWishlist;
  let finishRead;
  s.api.getWishlist = () =>
    new Promise((resolve) => {
      finishRead = resolve;
    });
  const add = s.toggle("a", false);
  await s.flush();
  s.calls[0].succeed();
  await s.flush();
  const remove = s.toggle("a", true);
  await s.flush();
  finishRead([item("a")]);
  await add;
  assert.deepEqual(s.ids(), []);
  s.api.getWishlist = originalRead;
  s.calls[1].succeed();
  await remove;
  assert.deepEqual(s.cache(), { items: [], changes: {} });
});

test("cancelling a read preserves changes confirmed while it was in flight", async (t) => {
  const s = setup(t);
  await s.client.fetchQuery(s.query);
  const a = s.toggle("a", false);
  const b = s.toggle("b", false);
  await s.flush();
  const originalRead = s.api.getWishlist;
  let finishRead;
  s.api.getWishlist = () =>
    new Promise((resolve) => {
      finishRead = resolve;
    });
  const read = s.client.fetchQuery(s.query).catch(() => undefined);
  s.calls[0].succeed();
  await a;
  assert.equal(s.cache().changes.a.pending, false);
  const c = s.toggle("c", false);
  await s.flush();
  assert.equal(s.cache().changes.a.pending, false);
  finishRead([]);
  await read;
  s.api.getWishlist = originalRead;
  s.calls[1].succeed();
  s.calls[2].succeed();
  await Promise.all([b, c]);
  assert.deepEqual(s.ids(), ["a", "b", "c"]);
  assert.deepEqual(s.cache().changes, {});
});
