import { relations } from "drizzle-orm";

import { account } from "./account.ts";
import { addresses } from "../address/addresses.ts";
import { carts } from "../cart/carts.ts";
import { orders } from "../order/orders.ts";
import { reviews } from "../catalog/reviews.ts";
import { session } from "./session.ts";
import { stockNotifications } from "../inventory/stock-notifications.ts";
import { user } from "./user.ts";
import { wishlists } from "../wishlist/wishlists.ts";

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  wishlistEntries: many(wishlists),
  carts: many(carts),
  orders: many(orders),
  addresses: many(addresses),
  reviews: many(reviews),
  stockNotifications: many(stockNotifications),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
