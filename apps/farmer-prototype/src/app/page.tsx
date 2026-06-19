import { Button } from "@majistudio/ogcr-design-system/Button";

/**
 * Phase 2 wiring smoke: proves the OGCR design system is farmer's design layer.
 * A Server Component importing a DS client component ('use client' is baked into
 * the DS entry) — if this renders green with a focus ring on Tab, the wiring is
 * end-to-end: package resolution, precompiled styles.css, and tokens all live.
 */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center">
      <div className="flex flex-col items-center gap-3">
        <span className="text-label-button text-text-secondary">
          OGCR Farmer
        </span>
        <h1 className="text-h1 text-text-neutral">On the OGCR design system.</h1>
        <p className="text-body text-text-secondary max-w-prose">
          Phase 2 wiring smoke — this Button is rendered from
          <code> @majistudio/ogcr-design-system</code>. Green brand + focus ring
          on Tab means the design system is farmer&apos;s design layer.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="filled">Get started</Button>
        <Button variant="outlined">Documentation</Button>
      </div>
    </main>
  );
}
