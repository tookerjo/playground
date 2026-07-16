import type { SupabaseClient } from "@supabase/supabase-js";

// PRD/tech design: nesting is capped at 3 levels. A reply to a comment
// already at depth 3 (or deeper) attaches to that comment's depth-3
// ancestor instead of creating a new, deeper level.
const MAX_NESTING_DEPTH = 3;

/**
 * Given the parent_comment_id a client wants to reply to, returns the
 * parent_comment_id that should actually be stored, walking up the
 * ancestor chain to the depth-3 ancestor when the requested parent is
 * already at or past the cap. Throws if requestedParentId doesn't exist.
 */
export async function resolveParentCommentId(
  supabase: SupabaseClient,
  requestedParentId: string | null
): Promise<string | null> {
  if (!requestedParentId) return null;

  const chain: string[] = [requestedParentId];
  let currentId = requestedParentId;

  // Bounded well beyond the expected max chain length (~4) as a defensive
  // guard -- comments are never re-parented after creation (the anti-edit
  // trigger blocks it), so a cycle should be impossible.
  for (let i = 0; i < 20; i++) {
    const { data, error } = await supabase
      .from("comments")
      .select("parent_comment_id")
      .eq("id", currentId)
      .single();

    if (error || !data) {
      throw new Error("PARENT_NOT_FOUND");
    }
    if (!data.parent_comment_id) break;
    chain.push(data.parent_comment_id);
    currentId = data.parent_comment_id;
  }

  if (chain.length <= MAX_NESTING_DEPTH) {
    return requestedParentId;
  }

  return chain[chain.length - MAX_NESTING_DEPTH];
}
