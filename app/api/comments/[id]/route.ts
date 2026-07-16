import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: comment, error: fetchError } = await supabase
    .from("comments")
    .select("id, user_id, deleted_at")
    .eq("id", id)
    .single();

  if (fetchError || !comment) {
    if (fetchError) {
      console.error("DELETE /api/comments/[id] fetch failed:", fetchError);
    }
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  // Already deleted: no-op rather than erroring, since the anti-edit
  // trigger (task 2) would reject a second write to deleted_at anyway.
  if (comment.deleted_at) {
    return NextResponse.json({ comment });
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const isOwner = comment.user_id === user.id;
  const isAdmin = profile?.role === "admin";

  // Checked here in application code, and independently re-checked by the
  // comments_update_own_or_admin RLS policy below when the update runs --
  // neither layer is trusted alone (CLAUDE.md constraint #6).
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: updated, error: updateError } = await supabase
    .from("comments")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .select("id, user_id, parent_comment_id, deleted_at")
    .single();

  if (updateError || !updated) {
    console.error("DELETE /api/comments/[id] update failed:", updateError);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }

  return NextResponse.json({ comment: updated });
}
