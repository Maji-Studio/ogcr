"use client";

import { useState } from "react";
import {
  FileText,
  Plant,
  SealCheck,
  TestTube,
} from "@phosphor-icons/react/dist/ssr";
import { Avatar, Card, Kpi, Select } from "@majistudio/ogcr-design-system";
import { MapView } from "@/components/map";
import {
  ACTIVITIES,
  FARMS,
  peerTone,
  type Activity,
  type ActivityKind,
} from "./data";

const MAP_ZOOM = 12;

const ACTIVITY_ICONS: Record<ActivityKind, typeof Plant> = {
  sampling: TestTube,
  practice: Plant,
  verification: SealCheck,
  report: FileText,
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
});

function formatDelta(pct: number): string {
  return `${pct > 0 ? "+" : ""}${pct}%`;
}

interface DashboardViewProps {
  userName: string;
}

export function DashboardView({ userName }: DashboardViewProps) {
  const [farmId, setFarmId] = useState(FARMS[0].id);
  const farm = FARMS.find((f) => f.id === farmId) ?? FARMS[0];
  const { currentSoc, estimatedSoc, peerDeltaPct } = farm.kpis;
  const peer = peerTone(peerDeltaPct);

  return (
    <div className="flex flex-col gap-24">
      <header className="flex flex-wrap items-center gap-16">
        <div className="flex items-center gap-12">
          <Avatar name={userName} size="l" />
          <div className="flex flex-col">
            <span className="text-body-s text-text-secondary">
              Welcome back
            </span>
            <h1 className="text-h3 text-text-primary">{userName}</h1>
          </div>
        </div>
        <Select
          aria-label="Select farm"
          options={FARMS.map((f) => ({ value: f.id, label: f.name }))}
          value={farmId}
          onValueChange={(value) => value && setFarmId(value)}
          className="w-[260px]"
        />
      </header>

      <div className="grid grid-cols-1 gap-16 sm:grid-cols-3">
        <Kpi
          label="Current SOC"
          value={`${currentSoc} t C/ha`}
          secondaryText="Latest measured stock"
          tone="positive"
        />
        <Kpi
          label="Estimated SOC"
          value={`${estimatedSoc} t C/ha`}
          secondaryText="Projected end of season"
          tone="neutral"
          status={{
            label: formatDelta(
              Math.round(((estimatedSoc - currentSoc) / currentSoc) * 100)
            ),
            tone: estimatedSoc >= currentSoc ? "positive" : "warning",
          }}
        />
        <Kpi
          label="Peer comparison"
          value={formatDelta(peerDeltaPct)}
          secondaryText="vs regional peer median"
          tone={peer.kpi}
          status={{
            label: peerDeltaPct >= 0 ? "Above peers" : "Below peers",
            tone: peer.pill,
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="h-[480px] min-h-[360px]">
          {/* Remount on farm change: MapView's center/zoom are initial-only. */}
          <MapView
            key={farm.id}
            className="h-full w-full"
            center={farm.center}
            zoom={MAP_ZOOM}
          />
        </div>

        <Card title="Recent activity" subtitle={farm.name}>
          <ul className="m-0 flex list-none flex-col gap-12 p-0">
            {ACTIVITIES.map((activity) => (
              <ActivityRow key={activity.id} activity={activity} />
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function ActivityRow({ activity }: { activity: Activity }) {
  const Icon = ACTIVITY_ICONS[activity.kind];
  return (
    <li className="flex items-start gap-12">
      <span className="flex h-32 w-32 shrink-0 items-center justify-center rounded-8 bg-surface-neutral text-icon-secondary">
        <Icon size={16} />
      </span>
      <div className="flex min-w-0 flex-col gap-2">
        <span className="text-body-s font-medium text-text-primary">
          {activity.title}
        </span>
        <span className="text-body-s text-text-secondary">
          {activity.detail}
        </span>
      </div>
      <span className="ml-auto shrink-0 text-body-s text-text-secondary">
        {dateFormatter.format(new Date(activity.date))}
      </span>
    </li>
  );
}
