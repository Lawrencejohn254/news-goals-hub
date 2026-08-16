import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign in — The Dispatch" },
      { name: "description", content: "Sign in to The Dispatch to publish, comment, and follow stories." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

type Step = "email" | "code";

function AuthPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownTimer = useRef<ReturnType<typeof setInterval>>();

  const startCooldown = () => {
    setResendCooldown(30);
    clearInterval(cooldownTimer.current);
    cooldownTimer.current = setInterval(() => {
      setResendCooldown((s) => {
        if (s <= 1) {
          clearInterval(cooldownTimer.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const sendCode = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPendingMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          data: name ? { display_name: name } : undefined,
        },
      });
      if (error) throw error;
      toast.success("Code sent — check your email");
      setStep("code");
      startCooldown();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPendingMessage(null);
    try {
      const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
      if (error) {
        // Accounts awaiting or denied approval fail here with our own
        // message (set by the custom_access_token_hook), not a generic error.
        if (/pending admin approval|request was declined/i.test(error.message)) {
          setPendingMessage(error.message);
          return;
        }
        throw error;
      }
      toast.success("Signed in");
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-page flex items-center justify-center py-16">
        <div className="w-full max-w-md border border-border bg-card p-8">
          <div className="mb-6">
            <span className="inline-block h-1 w-10 bg-[var(--brand)]" />
            <h1 className="mt-3 font-serif text-3xl font-black">
              {step === "email" ? "Sign in" : "Enter your code"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {step === "email"
                ? "No password needed — we'll email you a 8-digit code. New here? This creates your account too."
                : `We sent a code to ${email}.`}
            </p>
          </div>

          {pendingMessage && (
            <div className="mb-4 border border-[var(--brand)] bg-[var(--brand)]/10 p-4 text-sm">
              <p className="font-semibold text-[var(--ink)]">Account not yet active</p>
              <p className="mt-1 text-muted-foreground">{pendingMessage}</p>
            </div>
          )}

          {step === "email" ? (
            <form onSubmit={sendCode} className="space-y-4">
              <div>
                <Label htmlFor="name">Display name (optional)</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Only used if this is a new account.
                </p>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90"
              >
                {loading ? "Sending…" : "Send code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="space-y-4">
              <div>
                <Label htmlFor="code">8-digit code</Label>
                <Input
                  id="code"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={8}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  autoComplete="one-time-code"
                  autoFocus
                  className="text-center text-2xl tracking-[0.5em]"
                  placeholder="········"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || code.length !== 8}
                className="w-full bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90"
              >
                {loading ? "Verifying…" : "Verify & continue"}
              </Button>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setPendingMessage(null);
                  }}
                  className="hover:text-foreground"
                >
                  ← Use a different email
                </button>
                <button
                  type="button"
                  disabled={resendCooldown > 0}
                  onClick={(e) => sendCode(e as unknown as FormEvent)}
                  className="hover:text-foreground disabled:opacity-50"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:underline">← Back to home</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}