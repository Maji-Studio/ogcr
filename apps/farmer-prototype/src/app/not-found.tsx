/**
 * Global not-found page
 * Shown for unknown routes and notFound() calls
 */
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="title-heading-1 mb-m">Page not found</h1>
        <p className="body-large mb-l text-[var(--color-text-secondary)]">
          The page you are looking for does not exist or you do not have access
          to it.
        </p>
        <Link
          href="/projects"
          className="inline-block rounded-lg bg-[var(--clr-dark-purple)] px-l py-m text-white hover:opacity-90"
        >
          Go to Projects
        </Link>
      </div>
    </div>
  );
}
