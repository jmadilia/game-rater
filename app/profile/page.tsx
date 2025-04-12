import { getCurrentUserProfile } from "@/lib/user/user";
import ProfileForm from "@/components/profile-form";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

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
      <Link href={`/profile/${profile?.username}`}>
        <span className="mt-4 px-2 py-2 bg-retro-primary text-white rounded">
          Go to profile
        </span>
      </Link>
      <ProfileForm profile={profile} />
    </div>
  );
}
