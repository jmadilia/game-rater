"use client";

import { useState } from "react";
import { signUpAction } from "@/lib/actions";
import { FormMessage, Message } from "@/components/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SignUpForm({
  searchParams,
}: {
  searchParams: Message;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const result = await signUpAction(formData);
    setPending(false);
    if (result?.error) {
      setError(result.error);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <form
      className="flex flex-col min-w-64 max-w-64 mx-auto"
      onSubmit={handleSignUp}>
      <h1 className="text-2xl font-medium">Sign up</h1>
      <p className="text-sm text text-foreground">
        Already have an account?{" "}
        <Link className="text-primary font-medium underline" href="/sign-in">
          Sign in
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          minLength={6}
          required
        />
        <button
          type="submit"
          className="bg-retro-primary hover:bg-retro-secondary dark:bg-dark-primary dark:hover:bg-dark-secondary text-white py-2 rounded mt-2 disabled:opacity-50"
          disabled={pending}>
          {pending ? "Signing up..." : "Sign up"}
        </button>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
