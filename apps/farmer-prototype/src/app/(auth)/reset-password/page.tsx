/**
 * Password reset page
 * Allows users to reset their password using a token from email
 */
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth";

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-[400px] mx-auto">
      <div className="mb-128 text-center">
        <h1 className="title-heading-2 mb-128">Reset your password</h1>
        <p className="body-medium text-[var(--color-text-secondary)]">
          Enter your new password below
        </p>
      </div>

      <div className="bg-[var(--color-background-white)] rounded-[var(--radius-8)] border border-[var(--color-border-primary)] p-128 shadow-sm">
        <Suspense
          fallback={
            <div className="text-center py-l text-[var(--color-text-secondary)]">
              Loading...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
