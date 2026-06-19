"use client";

import { useState } from "react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { ItemCard } from "./item-card";
import { ItemForm } from "./item-form";
import type { Item } from "@/db/schema";
import { ServerError } from "@/components/forms";
import {
  useProjectItems,
  useCreateItem,
  useUpdateItem,
  useArchiveItem,
} from "@/hooks/use-items";

interface ItemListProps {
  projectId: string;
}

export function ItemList({ projectId }: ItemListProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [archiveError, setArchiveError] = useState<string | null>(null);

  const { data: items, isLoading, isError, error, refetch } =
    useProjectItems(projectId);
  const createItem = useCreateItem(projectId);
  const updateItem = useUpdateItem(projectId);
  const archiveItem = useArchiveItem(projectId);

  const handleCreate = async (data: { title: string; description?: string }) => {
    setCreateError(null);
    try {
      await createItem.mutateAsync(data);
      setIsCreating(false);
    } catch (error) {
      setCreateError(
        error instanceof Error ? error.message : "Failed to create item"
      );
    }
  };

  const handleUpdate = async (data: { title: string; description?: string }) => {
    if (!editingItem) return;

    setUpdateError(null);
    try {
      await updateItem.mutateAsync({
        itemId: editingItem.id,
        ...data,
      });
      setEditingItem(null);
    } catch (error) {
      setUpdateError(
        error instanceof Error ? error.message : "Failed to update item"
      );
    }
  };

  const handleArchive = async (itemId: string) => {
    if (confirm("Are you sure you want to archive this item?")) {
      setArchiveError(null);
      try {
        await archiveItem.mutateAsync(itemId);
      } catch (error) {
        setArchiveError(
          error instanceof Error ? error.message : "Failed to archive item"
        );
      }
    }
  };

  if (isLoading) {
    return <div className="body-large">Loading items...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-xl border border-[var(--color-signal-red)] rounded-lg flex flex-col items-center gap-m">
        <p className="body-large text-[var(--color-signal-red)]">
          {error instanceof Error ? error.message : "Failed to load items."}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="px-l py-s border border-[var(--color-border-primary)] rounded-lg hover:bg-[var(--color-background-medium)]"
        >
          Try Again
        </button>
      </div>
    );
  }

  const activeItems = items ?? [];

  return (
    <div className="space-y-l">
      <div className="flex items-center justify-between">
        <h1 className="title-heading-1">Items</h1>
        {!isCreating && !editingItem && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-s px-l py-s bg-[var(--clr-dark-purple)] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={20} weight="bold" />
            New Item
          </button>
        )}
      </div>

      {isCreating && (
        <div className="border border-[var(--color-border-primary)] rounded-lg p-l">
          <h2 className="title-heading-3 mb-m">Create New Item</h2>
          {createError ? <ServerError message={createError} /> : null}
          <ItemForm
            onSubmit={handleCreate}
            onCancel={() => {
              setIsCreating(false);
              setCreateError(null);
            }}
            isSubmitting={createItem.isPending}
          />
        </div>
      )}

      {editingItem && (
        <div className="border border-[var(--color-border-primary)] rounded-lg p-l">
          <h2 className="title-heading-3 mb-m">Edit Item</h2>
          {updateError ? <ServerError message={updateError} /> : null}
          <ItemForm
            item={editingItem}
            onSubmit={handleUpdate}
            onCancel={() => {
              setEditingItem(null);
              setUpdateError(null);
            }}
            isSubmitting={updateItem.isPending}
          />
        </div>
      )}

      {archiveError ? <ServerError message={archiveError} /> : null}

      <div className="space-y-m">
        {activeItems.length === 0 ? (
          <div className="text-center py-xl border border-dashed border-[var(--color-border-primary)] rounded-lg">
            <p className="body-large text-[var(--color-text-secondary)]">
              No items yet. Create your first item to get started.
            </p>
          </div>
        ) : (
          activeItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={setEditingItem}
              onArchive={handleArchive}
            />
          ))
        )}
      </div>
    </div>
  );
}
