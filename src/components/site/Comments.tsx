import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchApprovedComments, postComment } from "@/lib/site";
import { relativeDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function Comments({ articleId }: { articleId: string }) {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const q = useQuery({
    queryKey: ["comments", articleId],
    queryFn: () => fetchApprovedComments(articleId),
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await postComment(articleId, body);
      setBody("");
      toast.success("Comment submitted — it will appear once approved by a moderator.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not post comment");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mx-auto mt-16 max-w-3xl">
      <h2 className="mb-6 border-b-2 border-[var(--ink)] pb-2 font-serif text-2xl font-bold uppercase tracking-wider">
        Comments {q.data ? `(${q.data.length})` : ""}
      </h2>

      {user ? (
        <form onSubmit={submit} className="mb-8">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            maxLength={2000}
            placeholder="Share your thoughts…"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{body.length}/2000</span>
            <Button
              type="submit"
              disabled={busy || !body.trim()}
              className="bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90"
            >
              Post comment
            </Button>
          </div>
        </form>
      ) : (
        <p className="mb-8 border-l-4 border-[var(--brand)] bg-muted/40 p-4 text-sm">
          <Link to="/auth" className="font-semibold underline">
            Sign in
          </Link>{" "}
          to join the conversation.
        </p>
      )}

      {q.isLoading && <p className="text-sm text-muted-foreground">Loading comments…</p>}
      {q.data?.length === 0 && (
        <p className="text-sm text-muted-foreground">No comments yet. Be the first.</p>
      )}
      <ul className="space-y-6">
        {(q.data ?? []).map((c) => (
          <li key={c.id} className="border-b border-border pb-5 last:border-b-0">
            <div className="mb-1 flex items-center gap-2 text-sm">
              <span className="font-semibold">{c.author_name}</span>
              <span className="text-muted-foreground">· {relativeDate(c.created_at)}</span>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{c.content}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
