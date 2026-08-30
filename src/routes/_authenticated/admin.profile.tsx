import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/profile")({
  component: MyProfilePage,
});

function MyProfilePage() {
  const qc = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      setEmail(data.user?.email ?? null);
    });
  }, []);

  const q = useQuery({
    queryKey: ["my-profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id,display_name,avatar_url,bio")
        .eq("id", userId as string)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (q.data && !initialized) {
      setDisplayName(q.data.display_name ?? "");
      setBio(q.data.bio ?? "");
      setAvatarUrl(q.data.avatar_url ?? "");
      setInitialized(true);
    }
  }, [q.data, initialized]);

  const save = async () => {
    if (!userId) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim() || null,
        bio: bio.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      })
      .eq("id", userId);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
    qc.invalidateQueries({ queryKey: ["my-profile", userId] });
  };

  if (q.isLoading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-1 font-serif text-3xl font-black">My Profile</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Signed in as <span className="font-semibold text-foreground">{email}</span>. Your
        display name and bio appear publicly on articles you write.
      </p>

      <div className="space-y-4 border border-border bg-background p-5">
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-lg font-bold">
              {(displayName || "?").slice(0, 2).toUpperCase()}
            </span>
          )}
          <div className="flex-1">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Avatar URL
            </label>
            <input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full border border-input bg-background px-3 py-2 text-sm"
              placeholder="https://…"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Display name
          </label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full border border-input bg-background px-3 py-2 text-sm"
            placeholder="Name shown publicly"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Bio (shown under "Written by" on your articles)
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={8}
            className="w-full border border-input bg-background px-3 py-2 text-sm"
            placeholder="Write your full author biography…"
          />
        </div>

        <button
          onClick={save}
          className="bg-[var(--brand)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-[var(--brand)]/90"
        >
          Save profile
        </button>
      </div>
    </div>
  );
}