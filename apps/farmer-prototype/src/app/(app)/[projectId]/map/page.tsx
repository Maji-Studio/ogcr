import { MapView } from "@/components/map";

// Map viewport sizing: most of the fold, but never cramped on short screens.
const MAP_CONTAINER_CLASS = "h-[70vh] min-h-[420px]";

interface MapPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function MapPage({ params }: MapPageProps) {
  // Route is project-scoped for nav parity; projectId isn't used by the base map
  // yet (it will be once project locations / features are plotted).
  await params;

  return (
    <div className="flex flex-col gap-24">
      <div className="flex flex-col gap-4">
        <h1 className="text-h1 text-text-primary">Map</h1>
        <p className="text-body text-text-secondary">
          Satellite imagery themed to the OGCR design system. Use the control on
          the map to switch to street view.
        </p>
      </div>
      <div className={MAP_CONTAINER_CLASS}>
        <MapView className="h-full w-full" />
      </div>
    </div>
  );
}
