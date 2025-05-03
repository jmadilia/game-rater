import { getCurrentUserProfile } from "@/lib/user/user";
import ProfileForm from "@/components/profile-form";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DeleteProfileButton from "@/components/delete-profile-button";

export default async function Profile() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const profile = await getCurrentUserProfile();

  return (
    <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <ProfileForm profile={profile} />
      <DeleteProfileButton />
    </div>
  );
}
