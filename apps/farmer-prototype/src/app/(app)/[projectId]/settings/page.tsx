/**
 * Project settings page
 * Manage project configuration and permissions
 */
import { Card } from "@majistudio/ogcr-design-system/Card";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <div className="flex flex-col gap-32">
      <div className="flex flex-col gap-4">
        <h1 className="text-h1 text-text-primary">Settings</h1>
        <p className="text-body text-text-secondary">Configure your project</p>
      </div>

      <Card title="Project details" className="p-24">
        <dl className="flex flex-col gap-4">
          <dt className="text-body-s text-text-secondary">Project ID</dt>
          <dd className="font-mono text-body-s text-text-primary">
            {projectId}
          </dd>
        </dl>
        <p className="text-body-s text-text-secondary">
          More settings are coming soon.
        </p>
      </Card>
    </div>
  );
}
