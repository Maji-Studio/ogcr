"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Item } from "@/db/schema";
import { itemFormSchema, type ItemFormData } from "@/schemas/items";
import { Button } from "@majistudio/ogcr-design-system/Button";
import { Input } from "@majistudio/ogcr-design-system/Input";
import { Textarea } from "@majistudio/ogcr-design-system/Textarea";

interface ItemFormProps {
  item?: Item;
  onSubmit: (data: ItemFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ItemForm({
  item,
  onSubmit,
  onCancel,
  isSubmitting,
}: ItemFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      title: item?.title ?? "",
      description: item?.description ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-24">
      <Input
        label="Title"
        type="text"
        placeholder="Enter item title"
        disabled={isSubmitting}
        errorText={errors.title?.message}
        {...register("title")}
      />

      <Textarea
        label="Description (optional)"
        placeholder="Enter item description"
        rows={4}
        disabled={isSubmitting}
        errorText={errors.description?.message}
        {...register("description")}
      />

      <div className="flex items-center justify-end gap-12">
        <Button
          type="button"
          variant="outlined"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" variant="filled" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : item ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
