"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

export function CommentForm({
  parentCommentId,
  onPosted,
  onCancel,
  autoFocus,
}: {
  parentCommentId?: string;
  onPosted: () => void;
  onCancel?: () => void;
  autoFocus?: boolean;
}) {
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;

    startTransition(async () => {
      setError(null);

      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: trimmed,
          parent_comment_id: parentCommentId ?? null,
        }),
      });

      if (!res.ok) {
        setError("Failed to post comment. Please try again.");
        return;
      }

      setBody("");
      onPosted();
      onCancel?.();
    });
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <textarea
        className="w-full rounded-md border border-input bg-background p-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        rows={parentCommentId ? 2 : 3}
        placeholder={parentCommentId ? "Write a reply…" : "Write a comment…"}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        autoFocus={autoFocus}
        disabled={isPending}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending || !body.trim()}>
          {parentCommentId ? "Reply" : "Post"}
        </Button>
        {onCancel && (
          <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
