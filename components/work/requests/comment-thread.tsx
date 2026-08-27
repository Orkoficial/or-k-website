"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { Comment, WorkUserRecord } from "@/types/work/domain";
import { WORKFLOW } from "@/lib/work/workflow";
import { relativeTime } from "@/lib/work/format";
import { addCommentAction } from "@/lib/work/actions";
import { PersonAvatar } from "@/components/work/shared/people";
import { Button } from "@/components/work/ui/button";
import { Textarea } from "@/components/work/ui/textarea";

export function CommentThread({
  requestId,
  comments,
  users,
}: {
  requestId: string;
  comments: Comment[];
  users: WorkUserRecord[];
}) {
  const [value, setValue] = useState("");
  const [pending, start] = useTransition();
  const userById = (id: string) => users.find((u) => u.id === id);

  return (
    <div className="flex flex-col gap-4">
      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin comentarios todavía.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {comments.map((c) => {
            const author = userById(c.authorId);
            return (
              <li key={c.id} className="flex gap-3">
                {author ? <PersonAvatar person={author} size="sm" /> : null}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {author?.name ?? "—"}
                    </span>
                    <span>{relativeTime(c.createdAt)}</span>
                    <span className="rounded bg-muted px-1.5 py-0.5">
                      {WORKFLOW[c.state].label}
                    </span>
                    {c.versionLabel ? (
                      <span className="font-mono">{c.versionLabel}</span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{c.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="rounded-lg border border-border p-2">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Escribe un comentario…  usa @nombre para mencionar"
          className="min-h-16 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
        />
        <div className="flex justify-end">
          <Button
            size="sm"
            disabled={pending || !value.trim()}
            onClick={() =>
              start(async () => {
                await addCommentAction(requestId, value);
                setValue("");
                toast.success("Comentario añadido");
              })
            }
          >
            Comentar
          </Button>
        </div>
      </div>
    </div>
  );
}
