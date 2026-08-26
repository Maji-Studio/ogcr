/**
 * Project data access
 * Database queries for projects
 */
import { and, desc, eq } from "drizzle-orm";
import { env } from "@/config/env";
import { projectMembers, projects, type Project } from "@/db/schema";
import {
  createMockProject,
  deleteMockProject,
  getMockProjectById,
  getMockProjects,
  updateMockProject,
} from "@/lib/mock-data-store";

/**
 * Get all projects for current user
 */
export async function getProjects(userId: string): Promise<Project[]> {
  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (env.MOCK_DATA) {
    return getMockProjects();
  }

  const { db } = await import("@/db");

  if (env.DISABLE_AUTH) {
    return db.select().from(projects).orderBy(desc(projects.updatedAt));
  }

  return db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      ownerId: projects.ownerId,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
    })
    .from(projects)
    .innerJoin(
      projectMembers,
      and(
        eq(projectMembers.projectId, projects.id),
        eq(projectMembers.userId, userId)
      )
    )
    .orderBy(desc(projects.updatedAt));
}

/**
 * Get project by ID
 * Throws if project not found or user is not a member
 */
export async function getProjectById(
  id: string,
  userId: string
): Promise<Project> {
  await requireProjectMember(id, userId);

  if (env.MOCK_DATA) {
    const project = getMockProjectById(id);
    if (!project) throw new Error("Project not found");
    return project;
  }

  const { db } = await import("@/db");
  const [project] = await db.select().from(projects).where(eq(projects.id, id));
  if (!project) {
    throw new Error("Project not found");
  }
  return project;
}

/**
 * Create new project
 * Also creates owner membership for the creator
 */
export async function createProject(
  userId: string,
  data: {
    name: string;
    description?: string;
  }
): Promise<Project> {
  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (env.MOCK_DATA) {
    return createMockProject(userId, data);
  }

  const { db } = await import("@/db");
  return db.transaction(async (tx) => {
    const [project] = await tx
      .insert(projects)
      .values({
        ownerId: userId,
        name: data.name,
        description: data.description,
      })
      .returning();

    await tx.insert(projectMembers).values({
      projectId: project.id,
      userId,
      role: "owner",
    });

    return project;
  });
}

/**
 * Update project
 * Only project owner can update
 */
export async function updateProject(
  id: string,
  userId: string,
  data: { name?: string; description?: string }
): Promise<Project> {
  const isOwner = await isProjectOwner(id, userId);
  if (!isOwner) {
    throw new Error("Forbidden: Only project owners can update projects");
  }

  if (env.MOCK_DATA) {
    const project = updateMockProject(id, data);
    if (!project) throw new Error("Project not found");
    return project;
  }

  const { db } = await import("@/db");
  const [updatedProject] = await db
    .update(projects)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id))
    .returning();

  if (!updatedProject) {
    throw new Error("Project not found");
  }

  return updatedProject;
}

/**
 * Delete project
 * Only project owner can delete
 */
export async function deleteProject(id: string, userId: string): Promise<void> {
  const isOwner = await isProjectOwner(id, userId);
  if (!isOwner) {
    throw new Error("Forbidden: Only project owners can delete projects");
  }

  if (env.MOCK_DATA) {
    deleteMockProject(id);
    return;
  }

  const { db } = await import("@/db");
  await db.delete(projects).where(eq(projects.id, id));
}

/**
 * Require user to be a project member
 * Throws error if user is not a member
 */
export async function requireProjectMember(
  projectId: string,
  userId: string
): Promise<void> {
  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (env.MOCK_DATA) {
    if (!getMockProjectById(projectId)) {
      throw new Error("Forbidden: Not a project member");
    }
    return;
  }

  if (env.DISABLE_AUTH) {
    return;
  }

  const { db } = await import("@/db");
  const membership = await db.query.projectMembers.findFirst({
    where: and(
      eq(projectMembers.projectId, projectId),
      eq(projectMembers.userId, userId)
    ),
  });

  if (!membership) {
    throw new Error("Forbidden: Not a project member");
  }
}

/**
 * Check if user is project owner
 */
export async function isProjectOwner(
  projectId: string,
  userId: string
): Promise<boolean> {
  if (!userId) {
    return false;
  }

  if (env.MOCK_DATA) {
    return !!getMockProjectById(projectId);
  }

  if (env.DISABLE_AUTH) {
    return true;
  }

  const { db } = await import("@/db");
  const membership = await db.query.projectMembers.findFirst({
    where: and(
      eq(projectMembers.projectId, projectId),
      eq(projectMembers.userId, userId),
      eq(projectMembers.role, "owner")
    ),
  });

  return !!membership;
}

/**
 * Get user's role in project
 */
export async function getProjectRole(
  projectId: string,
  userId: string
): Promise<string | null> {
  if (!userId) {
    return null;
  }

  if (env.MOCK_DATA) {
    return getMockProjectById(projectId) ? "owner" : null;
  }

  if (env.DISABLE_AUTH) {
    return "owner";
  }

  const { db } = await import("@/db");
  const membership = await db.query.projectMembers.findFirst({
    where: and(
      eq(projectMembers.projectId, projectId),
      eq(projectMembers.userId, userId)
    ),
  });

  return membership?.role ?? null;
}
