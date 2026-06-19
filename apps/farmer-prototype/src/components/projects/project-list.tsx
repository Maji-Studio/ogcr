"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Pencil, Trash, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@majistudio/ogcr-design-system/Button";
import { Card } from "@majistudio/ogcr-design-system/Card";
import { Message } from "@majistudio/ogcr-design-system/Message";
import { AlertDialog } from "@majistudio/ogcr-design-system/AlertDialog";
import type { Project } from "@/db/schema";
import {
  useCreateProject,
  useDeleteProject,
  useProjects,
  useUpdateProject,
} from "@/hooks/use-projects";
import { ProjectForm } from "./project-form";

export function ProjectList() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data: projects, isLoading, isError, error, refetch } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const handleCreate = async (data: { name: string; description?: string }) => {
    setCreateError(null);
    try {
      await createProject.mutateAsync(data);
      setIsCreating(false);
    } catch (error) {
      setCreateError(
        error instanceof Error ? error.message : "Failed to create project"
      );
    }
  };

  const handleUpdate = async (data: { name: string; description?: string }) => {
    if (!editingProject) return;

    setUpdateError(null);
    try {
      await updateProject.mutateAsync({
        projectId: editingProject.id,
        ...data,
      });
      setEditingProject(null);
    } catch (error) {
      setUpdateError(
        error instanceof Error ? error.message : "Failed to update project"
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProject || deleteProject.isPending) return;
    setDeleteError(null);
    try {
      await deleteProject.mutateAsync(deletingProject.id);
      setDeletingProject(null);
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Failed to delete project"
      );
    }
  };

  const isEditingAny = isCreating || !!editingProject;

  return (
    <div className="mx-auto flex w-full max-w-[880px] flex-col gap-24 px-24 py-32">
      <div className="flex items-center justify-between gap-16">
        <h1 className="text-h1 text-text-primary">Projects</h1>
        {!isEditingAny ? (
          <Button
            variant="filled"
            iconLeft={<Plus size={18} weight="bold" />}
            onClick={() => setIsCreating(true)}
          >
            New project
          </Button>
        ) : null}
      </div>

      {isCreating ? (
        <Card title="Create project" className="p-24">
          {createError ? <Message state="error" title={createError} /> : null}
          <ProjectForm
            onSubmit={handleCreate}
            onCancel={() => {
              setIsCreating(false);
              setCreateError(null);
            }}
            isSubmitting={createProject.isPending}
            submitLabel="Create project"
          />
        </Card>
      ) : null}

      {editingProject ? (
        <Card title="Edit project" className="p-24">
          {updateError ? <Message state="error" title={updateError} /> : null}
          <ProjectForm
            defaultValues={{
              name: editingProject.name,
              description: editingProject.description ?? "",
            }}
            onSubmit={handleUpdate}
            onCancel={() => {
              setEditingProject(null);
              setUpdateError(null);
            }}
            isSubmitting={updateProject.isPending}
            submitLabel="Save changes"
          />
        </Card>
      ) : null}

      {deleteError ? <Message state="error" title={deleteError} /> : null}

      {isLoading ? (
        <p className="text-body text-text-secondary">Loading projects…</p>
      ) : isError ? (
        <Message
          state="error"
          title="Failed to load projects."
          description={error instanceof Error ? error.message : undefined}
          actionLabel="Try again"
          onAction={() => refetch()}
        />
      ) : !projects || projects.length === 0 ? (
        <div className="flex flex-col items-center gap-8 rounded-16 border border-dashed border-border-medium bg-surface-light px-24 py-32 text-center">
          <h2 className="text-h4 text-text-primary">No projects yet</h2>
          <p className="text-body-s text-text-secondary">
            Create your first project to get started.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group flex items-center justify-between gap-16 rounded-16 border border-border-medium bg-surface-light p-24 transition-colors hover:border-border-strong"
            >
              <Link
                href={`/${project.id}/dashboard`}
                className="flex min-w-0 flex-1 flex-col gap-2"
              >
                <span className="flex items-center gap-8 text-h4 text-text-primary">
                  {project.name}
                  <ArrowRight
                    size={16}
                    className="text-icon-secondary opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </span>
                {project.description ? (
                  <span className="line-clamp-1 text-body-s text-text-secondary">
                    {project.description}
                  </span>
                ) : null}
              </Link>
              <div className="flex shrink-0 items-center gap-8">
                <Button
                  variant="text"
                  aria-label={`Edit ${project.name}`}
                  iconLeft={<Pencil size={18} />}
                  onClick={() => setEditingProject(project)}
                />
                <Button
                  variant="text"
                  aria-label={`Delete ${project.name}`}
                  iconLeft={<Trash size={18} />}
                  onClick={() => setDeletingProject(project)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog
        tone="danger"
        title="Delete project?"
        description={
          deletingProject
            ? `"${deletingProject.name}" and its items will be permanently deleted. This can't be undone.`
            : undefined
        }
        confirmLabel={deleteProject.isPending ? "Deleting…" : "Delete"}
        cancelLabel="Cancel"
        open={!!deletingProject}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingProject(null);
            setDeleteError(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
