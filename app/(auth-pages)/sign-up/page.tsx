import SignUpForm from "@/components/signup-form";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function SignUp() {
  const supabase = createClient();
  const {
    data: { session },
  } = await (await supabase).auth.getSession();

  if (session) {
    return redirect("/protected");
  }

  return (
    <div className="max-w-md mx-auto px-4 text-retro-primary dark:text-dark-text">
      <SignUpForm
        searchParams={{
          success: "",
        }}
      />
    </div>
  );
}
