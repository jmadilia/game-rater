import SignInForm from "@/components/signin-form";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Message } from "@/components/form-message";

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<Message>;
}) {
  const supabase = await createClient();
  const resolvedSearchParams = await searchParams;
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return redirect("/protected");
  }

  return (
    <div className="max-w-md mx-auto px-4 text-retro-primary dark:text-dark-text">
      <SignInForm searchParams={resolvedSearchParams} />
    </div>
  );
}
