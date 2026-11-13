import {
  mutationOptions,
  queryOptions,
  type QueryClient,
} from "@tanstack/react-query";

import type { WishlistItem } from "../services/wishlist";

type WishlistApi = {
  getWishlist: (signal?: AbortSignal) => Promise<WishlistItem[]>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
};

type WishlistChange = {
  version: number;
  favorited: boolean;
  pending: boolean;
};

type WishlistCache = {
  items: WishlistItem[];
  changes: Record<string, WishlistChange>;
};

type ToggleWishlistVariables = {
  productId: string;
  isFavorited: boolean;
};

const wishlistQueryKey = ["wishlist", "list"] as const;
const wishlistMutationKey = ["wishlist", "toggle"] as const;
let nextVersion = 0;

export const selectWishlistItems = ({ items, changes }: WishlistCache) =>
  items.filter((item) => changes[item.product.id]?.favorited !== false);

export const selectWishlistIds = ({ items, changes }: WishlistCache) => {
  const ids = new Set(items.map((item) => item.product.id));
  for (const [productId, change] of Object.entries(changes)) {
    if (change.favorited) ids.add(productId);
    else ids.delete(productId);
  }
  return ids;
};

export const wishlistQueryOptions = (client: QueryClient, api: WishlistApi) =>
  queryOptions({
    queryKey: wishlistQueryKey,
    queryFn: async ({ signal }): Promise<WishlistCache> => {
      // Only retire changes confirmed before this request started.
      const confirmed = Object.entries(
        client.getQueryData<WishlistCache>(wishlistQueryKey)?.changes ?? {},
      ).filter(([, change]) => !change.pending);
      const items = await api.getWishlist(signal);
      const changes = {
        ...client.getQueryData<WishlistCache>(wishlistQueryKey)?.changes,
      };
      for (const [productId, change] of confirmed) {
        if (changes[productId]?.version === change.version) {
          delete changes[productId];
        }
      }
      return { items, changes };
    },
  });

export const wishlistMutationOptions = (
  client: QueryClient,
  api: WishlistApi,
) => {
  const updateChange = (
    productId: string,
    version: number,
    update: (change: WishlistChange) => WishlistChange | undefined,
  ) => {
    client.setQueryData<WishlistCache>(wishlistQueryKey, (cache) => {
      if (!cache || cache.changes[productId]?.version !== version) return cache;
      const changes = { ...cache.changes };
      const change = update(changes[productId]!);
      if (change) changes[productId] = change;
      else delete changes[productId];
      return { ...cache, changes };
    });
  };

  return mutationOptions({
    mutationKey: wishlistMutationKey,
    mutationFn: ({ productId, isFavorited }: ToggleWishlistVariables) =>
      isFavorited
        ? api.removeFromWishlist(productId)
        : api.addToWishlist(productId),
    onMutate: async ({ productId, isFavorited }) => {
      await client.cancelQueries({ queryKey: wishlistQueryKey });
      const cache = client.getQueryData<WishlistCache>(wishlistQueryKey);
      if (cache?.changes[productId]?.pending) {
        throw new Error("Já existe uma alteração pendente para este produto.");
      }
      const previous = cache?.changes[productId];
      const version = ++nextVersion;
      client.setQueryData<WishlistCache>(wishlistQueryKey, (old) => ({
        items: old?.items ?? [],
        changes: {
          ...old?.changes,
          [productId]: { version, favorited: !isFavorited, pending: true },
        },
      }));
      return { version, previous };
    },
    onError: (_error, { productId }, context) => {
      if (context)
        updateChange(productId, context.version, () => context.previous);
    },
    onSuccess: (_data, { productId }, context) => {
      updateChange(productId, context.version, (change) => ({
        ...change,
        pending: false,
      }));
    },
    onSettled: (_data, _error, _variables, context) => {
      const changes =
        client.getQueryData<WishlistCache>(wishlistQueryKey)?.changes;
      if (
        context &&
        !Object.values(changes ?? {}).some((change) => change.pending)
      ) {
        // Fetch explicitly so reconciliation also works with no mounted list.
        return client
          .invalidateQueries({
            queryKey: wishlistQueryKey,
            refetchType: "none",
          })
          .then(() => client.fetchQuery(wishlistQueryOptions(client, api)))
          .catch(() => {
            // Keep confirmed changes until a later successful read.
          });
      }
    },
  });
};
