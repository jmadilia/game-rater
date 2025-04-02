import SignUpForm from "@/components/signup-form";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Message } from "@/components/form-message";

export default async function SignUp({
  searchParams,
}: {
  searchParams: Promise<Message>;
}) {
  const resolvedSearchParams = await searchParams;
  const supabase = createClient();
  const {
    data: { session },
  } = await (await supabase).auth.getSession();

  if (session) {
    return redirect("/protected");
  }

  return (
    <div className="max-w-md mx-auto px-4 text-retro-primary dark:text-dark-text">
      <SignUpForm searchParams={resolvedSearchParams} />
    </div>
  );
}
