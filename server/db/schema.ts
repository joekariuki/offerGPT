import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const offersTable = pgTable("offers_table", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id", { length: 50 }).notNull(),
  clientName: text("client_name").notNull(),
  clientAddress: text("client_address").notNull(),
  content: text("content").default(""),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertOffer = typeof offersTable.$inferInsert;
export type Offer = typeof offersTable.$inferSelect;
