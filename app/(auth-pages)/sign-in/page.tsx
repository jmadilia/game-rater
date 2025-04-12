import SignInForm from "@/components/signin-form";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Message } from "@/components/form-message";

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<Message>;
}) {
  const resolvedSearchParams = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/profile");
  }

  return (
    <div className="max-w-md mx-auto px-4 text-retro-primary dark:text-dark-text">
      <SignInForm searchParams={resolvedSearchParams} />
    </div>
  );
}
