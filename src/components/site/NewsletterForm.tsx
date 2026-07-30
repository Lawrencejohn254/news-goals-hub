import { useState } from "react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/lib/site";

export function NewsletterForm({
  source = "footer",
  variant = "dark",
}: {
  source?: string;
  variant?: "dark" | "light";
}) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await subscribeToNewsletter(email, source);
      setDone(true);
      toast.success(res.alreadySubscribed ? "You're already subscribed" : "Thanks for subscribing!");
      setEmail("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Subscription failed");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <p className={variant === "dark" ? "text-sm text-white/80" : "text-sm text-muted-foreground"}>
        ✓ You're on the list. Watch your inbox for the daily brief.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        maxLength={254}
        placeholder="you@email.com"
        aria-label="Email address"
        className={
          variant === "dark"
            ? "flex-1 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none"
            : "flex-1 border border-input bg-background px-3 py-2 text-sm focus:outline-none"
        }
      />
      <button
        type="submit"
        disabled={busy}
        className="bg-[var(--brand)] px-4 text-sm font-semibold text-white disabled:opacity-60"
      >
        {busy ? "…" : "Join"}
      </button>
    </form>
  );
}
