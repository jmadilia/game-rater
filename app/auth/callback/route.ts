import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  let username: string | null = null;
  if (code) {
    const supabase = createClient();
    await (await supabase).auth.exchangeCodeForSession(code);
    // Fetch user and username
    const {
      data: { user },
    } = await (await supabase).auth.getUser();
    if (user) {
      const { data: profile } = await (await supabase)
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();
      if (profile?.username) {
        username = profile.username;
      }
    }
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // URL to redirect to after sign up process completes
  if (username) {
    return NextResponse.redirect(`${origin}/profile/${username}`);
  }
  return NextResponse.redirect(`${origin}/profile`);
}
