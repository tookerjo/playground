"use client";

import { useState } from "react";
import { CommentForm } from "@/components/CommentForm";
import type { CommentData } from "@/components/CommentThread";

// Explicit per-depth styling instead of relying on nested padding to
// compound -- deterministic pixel offsets and a visibly darkening tint,
// so the tree reads as a tree at a glance rather than on close
// inspection. Depth is capped at 4 in the data (server-side flattening,
// see lib/comments.ts), so index 4 also covers any deeper fallback.
const INDENT_PX = 28;
const DEPTH_STYLES: Record<number, string> = {
  1: "bg-transparent border-transparent",
  2: "bg-muted/50 border-primary/40",
  3: "bg-muted border-primary/70",
  4: "bg-accent border-primary",
};

function styleForDepth(depth: number) {
  const clamped = Math.min(depth, 4);
  return DEPTH_STYLES[clamped];
}

export function CommentNode({
  comment,
  currentUserId,
  isAdmin,
  onChange,
  depth = 1,
}: {
  comment: CommentData;
  currentUserId: string;
  isAdmin: boolean;
  onChange: () => void;
  depth?: number;
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwner = comment.user_id === currentUserId;
  const canDelete = (isOwner || isAdmin) && !comment.deleted_at;

  const handleDelete = async () => {
    if (!window.confirm("Delete this comment?")) return;

    setIsDeleting(true);
    setError(null);
    const res = await fetch(`/api/comments/${comment.id}`, {
      method: "DELETE",
    });
    setIsDeleting(false);

    if (!res.ok) {
      setError("Failed to delete comment.");
      return;
    }

    onChange();
  };

  return (
    <li style={{ marginLeft: depth > 1 ? INDENT_PX : 0 }}>
      <div
        className={`rounded-md border-l-4 p-3 text-sm ${styleForDepth(depth)}`}
      >
        {comment.deleted_at ? (
          <p className="italic text-muted-foreground">[deleted]</p>
        ) : (
          <p className="whitespace-pre-wrap">{comment.body}</p>
        )}

        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span>{new Date(comment.created_at).toLocaleString()}</span>
          {!comment.deleted_at && (
            <button
              type="button"
              className="hover:underline"
              onClick={() => setIsReplying((value) => !value)}
            >
              Reply
            </button>
          )}
          {canDelete && (
            <button
              type="button"
              className="hover:underline disabled:opacity-50"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              Delete
            </button>
          )}
        </div>

        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}

        {isReplying && (
          <div className="mt-2">
            <CommentForm
              parentCommentId={comment.id}
              onPosted={onChange}
              onCancel={() => setIsReplying(false)}
              autoFocus
            />
          </div>
        )}
      </div>

      {comment.children.length > 0 && (
        <ul className="mt-3 space-y-3">
          {comment.children.map((child) => (
            <CommentNode
              key={child.id}
              comment={child}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onChange={onChange}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
