import Link from "next/link";
import { ArrowRight, List, Gear } from "@phosphor-icons/react/dist/ssr";

interface DashboardPageProps {
  params: Promise<{ projectId: string }>;
}

const SECTIONS = [
  {
    slug: "items",
    title: "Items",
    description: "Manage your project items",
    icon: List,
  },
  {
    slug: "settings",
    title: "Settings",
    description: "Configure your project",
    icon: Gear,
  },
];

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { projectId } = await params;

  return (
    <div className="flex flex-col gap-32">
      <div className="flex flex-col gap-4">
        <h1 className="text-h1 text-text-primary">Dashboard</h1>
        <p className="text-body text-text-secondary">
          Welcome to your project dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
        {SECTIONS.map(({ slug, title, description, icon: Icon }) => (
          <Link
            key={slug}
            href={`/${projectId}/${slug}`}
            className="group flex items-center justify-between gap-16 rounded-16 border border-border-medium bg-surface-light p-24 transition-colors hover:border-border-strong"
          >
            <div className="flex items-center gap-16">
              <span className="flex h-40 w-40 shrink-0 items-center justify-center rounded-12 bg-interaction-primary-default text-surface-page">
                <Icon size={20} />
              </span>
              <div className="flex flex-col gap-2">
                <h2 className="text-h4 text-text-primary">{title}</h2>
                <p className="text-body-s text-text-secondary">{description}</p>
              </div>
            </div>
            <ArrowRight
              size={20}
              className="shrink-0 text-icon-secondary transition-transform group-hover:translate-x-2"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
