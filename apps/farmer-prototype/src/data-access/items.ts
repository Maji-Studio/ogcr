import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { items, type Item, type ItemStatus } from "@/db/schema";
import { requireProjectMember } from "./projects";

const DEFAULT_ITEM_STATUS: ItemStatus = "active";

/**
 * Get items for a project, filtered by status (active by default)
 * Requires user to be a project member
 */
export async function getProjectItems(
  projectId: string,
  userId: string,
  status: ItemStatus = DEFAULT_ITEM_STATUS
): Promise<Item[]> {
  await requireProjectMember(projectId, userId);

  return db
    .select()
    .from(items)
    .where(and(eq(items.projectId, projectId), eq(items.status, status)))
    .orderBy(desc(items.createdAt));
}

/**
 * Create a new item
 * Requires user to be a project member
 */
export async function createItem(
  projectId: string,
  userId: string,
  data: { title: string; description?: string }
): Promise<Item> {
  await requireProjectMember(projectId, userId);

  const [item] = await db
    .insert(items)
    .values({
      projectId,
      title: data.title,
      description: data.description,
    })
    .returning();

  return item;
}

/**
 * Update an item
 * Requires user to be a member of the item's project
 */
export async function updateItem(
  itemId: string,
  userId: string,
  data: { title?: string; description?: string; status?: ItemStatus }
): Promise<Item> {
  // Get the item to check project membership
  const [item] = await db.select().from(items).where(eq(items.id, itemId));

  if (!item) {
    throw new Error("Item not found");
  }

  await requireProjectMember(item.projectId, userId);

  const [updatedItem] = await db
    .update(items)
    .set(data)
    .where(eq(items.id, itemId))
    .returning();

  return updatedItem;
}

/**
 * Archive an item (soft delete)
 * Requires user to be a member of the item's project
 */
export async function archiveItem(
  itemId: string,
  userId: string
): Promise<void> {
  // Get the item to check project membership
  const [item] = await db.select().from(items).where(eq(items.id, itemId));

  if (!item) {
    throw new Error("Item not found");
  }

  await requireProjectMember(item.projectId, userId);

  await db
    .update(items)
    .set({ status: "archived" })
    .where(eq(items.id, itemId));
}
