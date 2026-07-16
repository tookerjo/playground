import { NextResponse } from "next/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

type RequireUserResult =
  | { user: User; supabase: SupabaseClient }
  | { response: NextResponse };

/**
 * Resolves the current request's authenticated user via getUser()
 * (server-revalidated, not the spoofable getSession()). Callers should
 * check `"response" in result` and return it directly on failure --
 * same 401 shape every /api/comments* route already used before this
 * was extracted.
 */
export async function requireUser(): Promise<RequireUserResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { user, supabase };
}

export async function isAdmin(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  return profile?.role === "admin";
}
