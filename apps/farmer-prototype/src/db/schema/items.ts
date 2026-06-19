import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { projects } from "./projects";

/**
 * Example items table
 * Demonstrates CRUD patterns and architecture
 */
export const items = pgTable(
  "items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    status: text("status", { enum: ["active", "archived"] })
      .notNull()
      .default("active"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    // Covers the hot path: WHERE project_id AND status ORDER BY created_at DESC
    projectStatusCreatedIdx: index("items_project_id_status_created_at_idx").on(
      table.projectId,
      table.status,
      table.createdAt.desc()
    ),
  })
);

export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
export type ItemStatus = Item["status"];
