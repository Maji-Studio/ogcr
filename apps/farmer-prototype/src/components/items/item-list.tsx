"use client";

import { useState } from "react";
import { Plus, Pencil, Trash } from "@phosphor-icons/react/dist/ssr";
import { formatDistanceToNow } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";
import { Table } from "@majistudio/ogcr-design-system/Table";
import { Button } from "@majistudio/ogcr-design-system/Button";
import { Dialog } from "@majistudio/ogcr-design-system/Dialog";
import { AlertDialog } from "@majistudio/ogcr-design-system/AlertDialog";
import { Pill } from "@majistudio/ogcr-design-system/Pill";
import { Message } from "@majistudio/ogcr-design-system/Message";
import { ItemForm } from "./item-form";
import type { Item } from "@/db/schema";
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
  const [archivingItem, setArchivingItem] = useState<Item | null>(null);
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

  const handleConfirmArchive = async () => {
    if (!archivingItem) return;

    setArchiveError(null);
    try {
      await archiveItem.mutateAsync(archivingItem.id);
      setArchivingItem(null);
    } catch (error) {
      setArchiveError(
        error instanceof Error ? error.message : "Failed to archive item"
      );
    }
  };

  const columns: ColumnDef<Item>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <span className="font-medium text-text-primary">
          {row.original.title}
        </span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) =>
        row.original.description ? (
          <span className="line-clamp-1 text-text-secondary">
            {row.original.description}
          </span>
        ) : (
          <span className="text-text-secondary">—</span>
        ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Pill tone={row.original.status === "active" ? "positive" : "neutral"}>
          {row.original.status}
        </Pill>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-text-secondary">
          {formatDistanceToNow(new Date(row.original.createdAt), {
            addSuffix: true,
          })}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      meta: { align: "right" },
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-8">
          <Button
            variant="text"
            aria-label="Edit item"
            iconLeft={<Pencil size={18} />}
            onClick={() => setEditingItem(row.original)}
          />
          <Button
            variant="text"
            aria-label="Archive item"
            iconLeft={<Trash size={18} />}
            onClick={() => setArchivingItem(row.original)}
          />
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <p className="text-body text-text-secondary">Loading items…</p>;
  }

  if (isError) {
    return (
      <Message
        state="error"
        title="Failed to load items."
        description={error instanceof Error ? error.message : undefined}
        actionLabel="Try again"
        onAction={() => refetch()}
      />
    );
  }

  const activeItems = items ?? [];

  return (
    <div className="flex flex-col gap-24">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 text-text-primary">Items</h1>
        <Button
          variant="filled"
          iconLeft={<Plus size={18} weight="bold" />}
          onClick={() => setIsCreating(true)}
        >
          New item
        </Button>
      </div>

      {archiveError && <Message state="error" title={archiveError} />}

      <Table
        columns={columns}
        data={activeItems}
        regionLabel="Items"
        emptyState="No items yet. Create your first item to get started."
      />

      {/* Create */}
      <Dialog
        title="Create item"
        open={isCreating}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreating(false);
            setCreateError(null);
          }
        }}
      >
        {createError && <Message state="error" title={createError} />}
        <ItemForm
          onSubmit={handleCreate}
          onCancel={() => {
            setIsCreating(false);
            setCreateError(null);
          }}
          isSubmitting={createItem.isPending}
        />
      </Dialog>

      {/* Edit */}
      <Dialog
        title="Edit item"
        open={!!editingItem}
        onOpenChange={(open) => {
          if (!open) {
            setEditingItem(null);
            setUpdateError(null);
          }
        }}
      >
        {editingItem && (
          <>
            {updateError && <Message state="error" title={updateError} />}
            <ItemForm
              item={editingItem}
              onSubmit={handleUpdate}
              onCancel={() => {
                setEditingItem(null);
                setUpdateError(null);
              }}
              isSubmitting={updateItem.isPending}
            />
          </>
        )}
      </Dialog>

      {/* Archive confirm */}
      <AlertDialog
        tone="danger"
        title="Archive item?"
        description={
          archivingItem
            ? `"${archivingItem.title}" will be moved to the archive.`
            : undefined
        }
        confirmLabel={archiveItem.isPending ? "Archiving…" : "Archive"}
        cancelLabel="Cancel"
        open={!!archivingItem}
        onOpenChange={(open) => {
          if (!open) setArchivingItem(null);
        }}
        onConfirm={handleConfirmArchive}
      />
    </div>
  );
}
