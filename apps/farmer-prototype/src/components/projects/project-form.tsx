"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@majistudio/ogcr-design-system/Button";
import { Input } from "@majistudio/ogcr-design-system/Input";
import { Textarea } from "@majistudio/ogcr-design-system/Textarea";
import { projectFormSchema, type ProjectFormData } from "@/schemas/projects";

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => Promise<void> | void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  defaultValues?: ProjectFormData;
  submitLabel: string;
}

export function ProjectForm({
  onSubmit,
  onCancel,
  isSubmitting,
  defaultValues,
  submitLabel,
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-24">
      <Input
        label="Project name"
        type="text"
        placeholder="e.g. Marketing Site"
        disabled={isSubmitting}
        errorText={errors.name?.message}
        {...register("name")}
      />

      <Textarea
        label="Description (optional)"
        placeholder="Describe the purpose of this project"
        rows={4}
        disabled={isSubmitting}
        errorText={errors.description?.message}
        {...register("description")}
      />

      <div className="flex items-center justify-end gap-12">
        {onCancel ? (
          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        ) : null}
        <Button type="submit" variant="filled" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
