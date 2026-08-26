import type { Item, ItemStatus, Project } from "@/db/schema";

export const MOCK_USER_ID = "mock-user";

export const MOCK_PROJECT_ID = "11111111-1111-4111-8111-111111111111";
const SECONDARY_PROJECT_ID = "22222222-2222-4222-8222-222222222222";

interface MockStore {
  projects: Project[];
  items: Item[];
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: MOCK_PROJECT_ID,
    name: "Willow Creek Farm",
    description: "Regenerative farming and soil carbon prototype",
    ownerId: MOCK_USER_ID,
    createdAt: new Date("2026-05-04T09:00:00.000Z"),
    updatedAt: new Date("2026-08-18T14:30:00.000Z"),
  },
  {
    id: SECONDARY_PROJECT_ID,
    name: "Soil & Sugar 2027",
    description: "Scope 3 campaign with Südzucker and regional growers",
    ownerId: MOCK_USER_ID,
    createdAt: new Date("2026-06-12T08:00:00.000Z"),
    updatedAt: new Date("2026-08-12T11:15:00.000Z"),
  },
];

const INITIAL_ITEMS: Item[] = [
  {
    id: "33333333-3333-4333-8333-333333333333",
    projectId: MOCK_PROJECT_ID,
    title: "Upload July soil sample results",
    description: "Attach the laboratory report for parcels 3–7.",
    status: "active",
    createdAt: new Date("2026-08-16T10:00:00.000Z"),
    updatedAt: new Date("2026-08-16T10:00:00.000Z"),
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    projectId: MOCK_PROJECT_ID,
    title: "Confirm cover crop establishment",
    description: "Review the field photos from the north parcel.",
    status: "active",
    createdAt: new Date("2026-08-10T13:20:00.000Z"),
    updatedAt: new Date("2026-08-10T13:20:00.000Z"),
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    projectId: SECONDARY_PROJECT_ID,
    title: "Review grower evidence package",
    description: "Check completeness before the campaign approval gate.",
    status: "active",
    createdAt: new Date("2026-08-14T08:45:00.000Z"),
    updatedAt: new Date("2026-08-14T08:45:00.000Z"),
  },
];

const globalMockStore = globalThis as typeof globalThis & {
  __ogcrMockStore?: MockStore;
};

function cloneProject(project: Project): Project {
  return {
    ...project,
    createdAt: new Date(project.createdAt),
    updatedAt: new Date(project.updatedAt),
  };
}

function cloneItem(item: Item): Item {
  return {
    ...item,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
  };
}

function createInitialStore(): MockStore {
  return {
    projects: INITIAL_PROJECTS.map(cloneProject),
    items: INITIAL_ITEMS.map(cloneItem),
  };
}

function getStore(): MockStore {
  globalMockStore.__ogcrMockStore ??= createInitialStore();
  return globalMockStore.__ogcrMockStore;
}

export function getMockProjects(): Project[] {
  return getStore()
    .projects.toSorted(
      (left, right) => right.updatedAt.getTime() - left.updatedAt.getTime()
    )
    .map(cloneProject);
}

export function getMockProjectById(id: string): Project | undefined {
  const project = getStore().projects.find((candidate) => candidate.id === id);
  return project ? cloneProject(project) : undefined;
}

export function createMockProject(
  userId: string,
  data: { name: string; description?: string }
): Project {
  const now = new Date();
  const project: Project = {
    id: crypto.randomUUID(),
    ownerId: userId,
    name: data.name,
    description: data.description ?? null,
    createdAt: now,
    updatedAt: now,
  };

  getStore().projects.push(project);
  return cloneProject(project);
}

export function updateMockProject(
  id: string,
  data: { name?: string; description?: string }
): Project | undefined {
  const project = getStore().projects.find((candidate) => candidate.id === id);
  if (!project) return undefined;

  if (data.name !== undefined) project.name = data.name;
  if (data.description !== undefined) project.description = data.description;
  project.updatedAt = new Date();
  return cloneProject(project);
}

export function deleteMockProject(id: string): void {
  const store = getStore();
  store.projects = store.projects.filter((project) => project.id !== id);
  store.items = store.items.filter((item) => item.projectId !== id);
}

export function getMockItems(projectId: string, status: ItemStatus): Item[] {
  return getStore()
    .items.filter((item) => item.projectId === projectId && item.status === status)
    .toSorted(
      (left, right) => right.createdAt.getTime() - left.createdAt.getTime()
    )
    .map(cloneItem);
}

export function createMockItem(
  projectId: string,
  data: { title: string; description?: string }
): Item {
  const now = new Date();
  const item: Item = {
    id: crypto.randomUUID(),
    projectId,
    title: data.title,
    description: data.description ?? null,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  getStore().items.push(item);
  return cloneItem(item);
}

export function getMockItemById(id: string): Item | undefined {
  const item = getStore().items.find((candidate) => candidate.id === id);
  return item ? cloneItem(item) : undefined;
}

export function updateMockItem(
  id: string,
  data: { title?: string; description?: string; status?: ItemStatus }
): Item | undefined {
  const item = getStore().items.find((candidate) => candidate.id === id);
  if (!item) return undefined;

  if (data.title !== undefined) item.title = data.title;
  if (data.description !== undefined) item.description = data.description;
  if (data.status !== undefined) item.status = data.status;
  item.updatedAt = new Date();
  return cloneItem(item);
}

export function resetMockStore(): void {
  globalMockStore.__ogcrMockStore = createInitialStore();
}
