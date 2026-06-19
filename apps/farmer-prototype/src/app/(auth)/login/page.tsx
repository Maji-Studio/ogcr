/**
 * Login page
 * Handles user authentication via Better Auth
 */
import { Card } from "@majistudio/ogcr-design-system/Card";
import { LoginForm } from "@/components/auth";

export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-[400px] flex-col gap-24">
      <div className="text-center">
        <h1 className="text-h2 text-text-primary">Welcome back</h1>
        <p className="text-body-s text-text-secondary">Sign in to your account</p>
      </div>

      <Card floating className="p-24">
        <LoginForm />
      </Card>
    </div>
  );
}
