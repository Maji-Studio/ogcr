"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/lib/auth/client";
import Link from "next/link";
import { Button } from "@majistudio/ogcr-design-system/Button";
import { Input } from "@majistudio/ogcr-design-system/Input";
import { Message } from "@majistudio/ogcr-design-system/Message";
import { loginSchema, type LoginFormData } from "@/schemas/auth";

export function LoginForm() {
  const [serverError, setServerError] = useState("");
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const { signIn, resendVerification } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    setServerError("");
    setShowResendVerification(false);
    setResendSuccess(false);

    const result = await signIn(data.email, data.password);

    if (result.success) {
      router.push("/projects");
    } else {
      setServerError(result.error || "Failed to sign in");

      // Show resend verification option if email not verified
      if (
        result.error?.toLowerCase().includes("not verified") ||
        result.error?.toLowerCase().includes("verify")
      ) {
        setShowResendVerification(true);
      }
    }
  }

  async function handleResendVerification() {
    setResendLoading(true);
    setResendSuccess(false);

    const email = getValues("email");
    const result = await resendVerification(email);

    if (result.success) {
      setResendSuccess(true);
      setServerError("");
    } else {
      setServerError(result.error || "Failed to resend verification email");
    }

    setResendLoading(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-24">
      <Input
        label="Email"
        type="email"
        placeholder="your@email.com"
        autoComplete="email"
        disabled={isSubmitting}
        errorText={errors.email?.message}
        aria-label="Email address"
        {...register("email")}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        autoComplete="current-password"
        disabled={isSubmitting}
        errorText={errors.password?.message}
        aria-label="Password"
        {...register("password")}
      />

      {serverError && <Message state="error" title={serverError} />}

      {showResendVerification && !resendSuccess && (
        <Message
          state="warning"
          title="Your email address needs to be verified."
          actionLabel={resendLoading ? "Sending..." : "Resend verification email"}
          onAction={handleResendVerification}
        />
      )}

      {resendSuccess && (
        <Message
          state="success"
          title="Verification email sent! Please check your inbox."
        />
      )}

      <div className="flex items-center justify-between">
        <Link
          href="/forgot-password"
          className="text-body-s text-interaction-primary-default hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        variant="filled"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
