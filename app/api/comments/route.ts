import { NextResponse } from "next/server";
import { requireUser, isAdmin } from "@/lib/auth";
import { resolveParentCommentId } from "@/lib/comments";

type CommentRow = {
  id: string;
  user_id: string;
  parent_comment_id: string | null;
  body: string | null;
  created_at: string;
  deleted_at: string | null;
};

type CommentNode = CommentRow & { children: CommentNode[] };

export async function GET() {
  // CLAUDE.md constraint #7 / tech design §4: unauthenticated requests get
  // a 401, never partial data.
  const auth = await requireUser();
  if ("response" in auth) return auth.response;
  const { user, supabase } = auth;

  const [{ data, error }, adminStatus] = await Promise.all([
    supabase
      .from("comments")
      .select("id, user_id, parent_comment_id, body, created_at, deleted_at")
      .order("created_at", { ascending: true }),
    isAdmin(supabase, user.id),
  ]);

  if (error) {
    console.error("GET /api/comments failed:", error);
    return NextResponse.json(
      { error: "Failed to load comments" },
      { status: 500 }
    );
  }

  // Redact the body of soft-deleted comments server-side so removed
  // content never leaves the API, even though the row (and its place in
  // the thread) is retained.
  const rows: CommentRow[] = (data ?? []).map((row) => ({
    ...row,
    body: row.deleted_at ? null : row.body,
  }));

  const byId = new Map<string, CommentNode>();
  for (const row of rows) {
    byId.set(row.id, { ...row, children: [] });
  }

  const roots: CommentNode[] = [];
  for (const row of rows) {
    const node = byId.get(row.id)!;
    const parent = row.parent_comment_id
      ? byId.get(row.parent_comment_id)
      : undefined;

    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  // Top-level comments newest first (PRD Flow A); replies stay in the
  // chronological order they were fetched in.
  roots.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return NextResponse.json({
    comments: roots,
    currentUser: { id: user.id, isAdmin: adminStatus },
  });
}

export async function POST(request: Request) {
  const auth = await requireUser();
  if ("response" in auth) return auth.response;
  const { user, supabase } = auth;

  let payload: { body?: unknown; parent_comment_id?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const body = typeof payload.body === "string" ? payload.body.trim() : "";
  if (!body) {
    return NextResponse.json(
      { error: "Comment body is required" },
      { status: 400 }
    );
  }

  const requestedParentId =
    typeof payload.parent_comment_id === "string"
      ? payload.parent_comment_id
      : null;

  let parentCommentId: string | null;
  try {
    parentCommentId = await resolveParentCommentId(
      supabase,
      requestedParentId
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid parent comment" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("comments")
    // user_id always comes from the verified session, never the request
    // body -- a client cannot post as another user (CLAUDE.md #3).
    .insert({ user_id: user.id, parent_comment_id: parentCommentId, body })
    .select("id, user_id, parent_comment_id, body, created_at, deleted_at")
    .single();

  if (error) {
    console.error("POST /api/comments failed:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }

  return NextResponse.json({ comment: data }, { status: 201 });
}
