import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { env } from "@/config/env";
import {
  createItem,
  getProjectItems,
  archiveItem,
} from "@/data-access/items";
import {
  createProject,
  deleteProject,
  getProjectRole,
  getProjects,
} from "@/data-access/projects";
import {
  MOCK_PROJECT_ID,
  MOCK_USER_ID,
  resetMockStore,
} from "@/lib/mock-data-store";

describe("self-contained mock data mode", () => {
  beforeEach(() => {
    env.MOCK_DATA = true;
    resetMockStore();
  });

  afterEach(() => {
    env.MOCK_DATA = false;
  });

  it("loads seeded projects and authorizes their routes without a database", async () => {
    const projects = await getProjects(MOCK_USER_ID);

    expect(projects).toHaveLength(2);
    await expect(getProjectRole(MOCK_PROJECT_ID, MOCK_USER_ID)).resolves.toBe(
      "owner"
    );
  });

  it("supports project CRUD in memory", async () => {
    const project = await createProject(MOCK_USER_ID, {
      name: "New mock project",
    });

    expect(await getProjects(MOCK_USER_ID)).toContainEqual(project);

    await deleteProject(project.id, MOCK_USER_ID);
    expect(await getProjects(MOCK_USER_ID)).not.toContainEqual(project);
  });

  it("supports item creation and archiving in memory", async () => {
    const item = await createItem(MOCK_PROJECT_ID, MOCK_USER_ID, {
      title: "Mock task",
    });

    expect(await getProjectItems(MOCK_PROJECT_ID, MOCK_USER_ID)).toContainEqual(
      item
    );

    await archiveItem(item.id, MOCK_USER_ID);
    expect(
      await getProjectItems(MOCK_PROJECT_ID, MOCK_USER_ID)
    ).not.toContainEqual(item);
  });
});
