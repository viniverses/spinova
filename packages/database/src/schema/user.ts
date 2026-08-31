import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  lang: text("lang").default("pt-BR"),
  phone: text("phone"),
  document: text("document"),
  birthDate: text("birth_date"),
  postalCode: text("postal_code"),
  city: text("city"),
  state: text("state"),
  addressLine: text("address_line"),
  country: text("country").default("BR"),
});
