/**
 * Auth layout
 * Provides consistent layout for authentication pages
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-page">
      <div className="max-w-md w-full">{children}</div>
    </div>
  );
}
