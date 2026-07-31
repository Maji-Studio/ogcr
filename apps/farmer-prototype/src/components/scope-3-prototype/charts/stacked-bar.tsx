// 100% stacked allocation bar — who holds a share of the campaign's eligible sugar.
//
// The OGCR brand green is low-chroma (fails a chroma floor on its own), so identity is never carried
// by colour alone: every segment is direct-labelled and a legend is always present. Segments are
// separated by a 2px surface gap rather than a stroke, so the fills never touch.

interface Segment {
  id: string;
  name: string;
  volume: number;
  share: number;
  color: string;
}

const GAP = 2;
const RADIUS = 4;

export function StackedBar({ segments, unit = "t" }: { segments: Segment[]; unit?: string }) {
  const total = segments.reduce((sum, segment) => sum + segment.share, 0);

  return (
    <figure className="m-0">
      <div
        className="flex h-40 overflow-hidden rounded-4"
        role="img"
        aria-label={segments.map((s) => `${s.name}: ${s.volume} ${unit}, ${s.share}%`).join("; ")}
      >
        {segments.map((segment, index) => (
          <div
            key={segment.id}
            className="flex items-center justify-center overflow-hidden"
            style={{
              width: `${(segment.share / total) * 100}%`,
              backgroundColor: segment.color,
              // A surface-coloured gap between fills, and rounded outer ends.
              marginLeft: index === 0 ? 0 : GAP,
              borderTopLeftRadius: index === 0 ? RADIUS : 0,
              borderBottomLeftRadius: index === 0 ? RADIUS : 0,
              borderTopRightRadius: index === segments.length - 1 ? RADIUS : 0,
              borderBottomRightRadius: index === segments.length - 1 ? RADIUS : 0,
            }}
          />
        ))}
      </div>

      <figcaption className="mt-8 grid gap-8 sm:grid-cols-3">
        {segments.map((segment) => (
          <div key={segment.id} className="flex items-center gap-8">
            <span
              aria-hidden="true"
              className="h-[10px] w-[10px] shrink-0 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <div className="min-w-0">
              <p className="text-body-s font-bold text-text-primary">{segment.name}</p>
              <p className="text-body-s text-text-secondary">
                {segment.volume.toLocaleString("en-GB")} {unit} · {segment.share}%
              </p>
            </div>
          </div>
        ))}
      </figcaption>
    </figure>
  );
}
