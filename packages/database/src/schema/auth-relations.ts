import { relations } from "drizzle-orm";

import { account } from "./account.ts";
import { addresses } from "./addresses.ts";
import { carts } from "./carts.ts";
import { orders } from "./orders.ts";
import { reviews } from "./reviews.ts";
import { session } from "./session.ts";
import { stockNotifications } from "./stock-notifications.ts";
import { user } from "./user.ts";
import { wishlists } from "./wishlists.ts";

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
