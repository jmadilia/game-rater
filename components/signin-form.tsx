"use client";

import { useState } from "react";
import { signInAction } from "@/lib/actions";
import { FormMessage, Message } from "@/components/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SignInForm({
  searchParams,
}: {
  searchParams: Message;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const result = await signInAction(formData);
    setPending(false);
    if (result?.error) {
      setError(result.error);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <form className="flex-1 flex flex-col min-w-64" onSubmit={handleSignIn}>
      <h1 className="text-2xl font-medium">Sign in</h1>
      <p className="text-sm text-foreground">
        Don't have an account?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Sign up
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password">
            Forgot Password?
          </Link>
        </div>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          required
        />
        <button
          type="submit"
          className="bg-retro-primary hover:bg-retro-secondary dark:bg-dark-primary dark:hover:bg-dark-secondary text-white py-2 rounded mt-2 disabled:opacity-50"
          disabled={pending}>
          {pending ? "Signing In..." : "Sign in"}
        </button>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
