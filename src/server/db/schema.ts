import { relations } from "drizzle-orm";
import {
  boolean,
  pgSchema,
  pgTableCreator,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const createTable = pgTableCreator((name) => `${name}`);
const authSchema = pgSchema("auth");

export const users = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const accounts = createTable("users", {
  id: uuid("id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  display_name: varchar("display_name").notNull().unique(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  avatar_url: text("avatar_url").notNull(),
});

export const messages = createTable("message", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  is_edited: boolean("is_edited").notNull().default(false),
  user_id: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

// Define relations
export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.id],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  user: one(users, {
    fields: [messages.user_id],
    references: [users.id],
  }),
}));
