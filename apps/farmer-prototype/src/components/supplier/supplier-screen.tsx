/**
 * The supplier base screen, deliberately empty.
 *
 * Nothing is built behind this view yet, so the screen says exactly that and points at the one
 * control that does work: the view switcher in the top bar. No placeholder cards, no greyed-out
 * charts, nothing that reads as data waiting to load.
 */

import { Card, PackageIcon } from "@majistudio/ogcr-design-system";
import { SupplierChrome } from "./supplier-chrome";

const EMPTY_ICON_SIZE = 24;

export function SupplierScreen({ userName }: { userName: string }) {
  return (
    <div className="min-h-screen bg-surface-page">
      <SupplierChrome userName={userName} />

      <main className="mx-auto flex max-w-[1440px] flex-col gap-16 px-16 py-16 md:px-24 md:py-24">
        <h1 className="text-h3 text-text-primary">Supplier overview</h1>

        <Card padding="l">
          <div className="flex flex-col items-center gap-12 py-72 text-center">
            <span className="flex h-48 w-48 items-center justify-center rounded-full bg-surface-neutral text-icon-secondary">
              <PackageIcon size={EMPTY_ICON_SIZE} />
            </span>
            <h2 className="text-h4 text-text-primary">Nothing here yet</h2>
            <p className="max-w-320 text-body-s text-text-secondary">
              The supplier view has no screens yet. To go back to the farm, switch to Farmer at the
              top of this page.
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}
