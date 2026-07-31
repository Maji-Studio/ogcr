// A compact single-series trend: a forecast that moves through the campaign and lands on one final
// actual value. Single series, so no legend — the surrounding heading names it. The forecast run is
// drawn dashed and the settled value gets a distinct, ringed marker, because "this is still a
// forecast" versus "this is the reportable number" is the whole point of the chart.

interface Point {
  label: string;
  value: number;
  /** The one settled value. Everything before it is a projection. */
  actual: boolean;
}

const WIDTH = 320;
const HEIGHT = 96;
const PAD_X = 8;
const PAD_Y = 12;

export function TrendLine({
  points,
  format,
  tone = "primary",
}: {
  points: Point[];
  format: (value: number) => string;
  tone?: "primary" | "progress";
}) {
  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  // A flat series would divide by zero; give it a nominal band so the line sits mid-height.
  const span = max - min || 1;

  const x = (index: number) => PAD_X + (index / (points.length - 1)) * (WIDTH - PAD_X * 2);
  const y = (value: number) => PAD_Y + (1 - (value - min) / span) * (HEIGHT - PAD_Y * 2);

  const stroke =
    tone === "primary" ? "var(--ds-interaction-primary-default)" : "var(--ds-brand-blue-300)";

  const path = points.map((point, index) => `${index === 0 ? "M" : "L"}${x(index)} ${y(point.value)}`).join(" ");
  const settledIndex = points.findIndex((point) => point.actual);
  const settled = settledIndex === -1 ? points.length - 1 : settledIndex;
  const last = points[settled];

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-[96px] w-full"
        role="img"
        aria-label={`Trend from ${format(points[0].value)} in ${points[0].label} to ${format(last.value)} in ${last.label}`}
      >
        {/* Recessive baseline. */}
        <line
          x1={PAD_X}
          y1={HEIGHT - PAD_Y}
          x2={WIDTH - PAD_X}
          y2={HEIGHT - PAD_Y}
          stroke="var(--ds-border-light)"
          strokeWidth="1"
        />
        {/* The forecast run: dashed, because none of it is reportable. */}
        <path d={path} fill="none" stroke={stroke} strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" />
        {/* The settled value: solid marker, ringed against the surface so it reads as distinct. */}
        <circle cx={x(settled)} cy={y(last.value)} r="6" fill={stroke} stroke="var(--ds-surface-light)" strokeWidth="2" />
      </svg>

      <figcaption className="flex items-baseline justify-between gap-8">
        <span className="text-body-s text-text-secondary">{points[0].label}</span>
        <span className="text-body-s text-text-secondary">
          {last.label} · <strong className="text-text-primary">{format(last.value)}</strong>
        </span>
      </figcaption>
    </figure>
  );
}
