"use client";

import { useCallback, useEffect, useState } from "react";
import { CommentForm } from "@/components/CommentForm";
import { CommentNode } from "@/components/CommentNode";

export type CommentData = {
  id: string;
  user_id: string;
  parent_comment_id: string | null;
  body: string | null;
  created_at: string;
  deleted_at: string | null;
  children: CommentData[];
};

type CurrentUser = { id: string; isAdmin: boolean };

export function CommentThread() {
  const [comments, setComments] = useState<CommentData[] | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/comments");
    if (!res.ok) {
      setError("Failed to load comments.");
      return;
    }
    const data = await res.json();
    setComments(data.comments);
    setCurrentUser(data.currentUser);
    setError(null);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (!comments || !currentUser) {
    return (
      <p className="text-sm text-muted-foreground">Loading comments…</p>
    );
  }

  return (
    <div className="space-y-4">
      <CommentForm onPosted={load} />

      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No comments yet. Be the first to say something.
        </p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <CommentNode
              key={comment.id}
              comment={comment}
              currentUserId={currentUser.id}
              isAdmin={currentUser.isAdmin}
              onChange={load}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
