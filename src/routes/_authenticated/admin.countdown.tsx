import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { db } from "@/lib/db";
import { mediaUrl, uploadMedia } from "@/lib/site";
import {
  COLOR_PRESETS,
  DEFAULT_COUNTDOWN,
  HEX_RE,
  eatInputToIso,
  fetchCountdown,
  isSafeFlagUrl,
  isoToEatInput,
  type ColorKey,
  type ElectionCountdownSettings,
} from "@/lib/countdown";
import { ElectionCountdownView } from "@/components/site/ElectionCountdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_authenticated/admin/countdown")({
  component: CountdownAdmin,
});

const selectClass = "w-full border border-input bg-background p-2 text-sm";

const COLOR_FIELDS: { key: ColorKey; label: string }[] = [
  { key: "bg_from", label: "Background (start)" },
  { key: "bg_to", label: "Background (end)" },
  { key: "accent", label: "Accent (subtitle, underline, message)" },
  { key: "tile_bg", label: "Number tiles" },
  { key: "tile_text", label: "Numbers" },
  { key: "text_color", label: "Text & labels" },
];

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const valid = HEX_RE.test(value);
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={label}
          value={valid ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 shrink-0 cursor-pointer border border-input bg-background p-0.5"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value.trim())}
          maxLength={7}
          className={valid ? "" : "border-destructive"}
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

function CountdownAdmin() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["election-countdown"], queryFn: fetchCountdown, retry: false });
  const [draft, setDraft] = useState<ElectionCountdownSettings>(DEFAULT_COUNTDOWN);
  const [dateInput, setDateInput] = useState(isoToEatInput(DEFAULT_COUNTDOWN.target_at));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (patch: Partial<ElectionCountdownSettings>) => setDraft((d) => ({ ...d, ...patch }));

  useEffect(() => {
    if (!q.data) return;
    setDraft({ ...DEFAULT_COUNTDOWN, ...q.data });
    setDateInput(isoToEatInput(q.data.target_at));
  }, [q.data]);

  const targetIso = eatInputToIso(dateInput);

  const uploadFlag = async (file: File) => {
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (file.size > 3 * 1024 * 1024) return toast.error("Image is too large (max 3 MB)");
    setUploading(true);
    try {
      const item = await uploadMedia(file);
      set({ flag_image_url: mediaUrl(item.path) });
      toast.success("Flag image uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const save = async () => {
    const title = draft.title.trim();
    if (!title || title.length > 80) return toast.error("Title is required (max 80 characters)");
    if (draft.subtitle.length > 140) return toast.error("Subtitle is too long (max 140)");
    if (draft.ended_message.length > 140) return toast.error("Ended message is too long (max 140)");
    if (!targetIso) return toast.error("Please set a valid election date and time");

    const colors = [
      draft.flag_color_1,
      draft.flag_color_2,
      draft.flag_color_3,
      draft.bg_from,
      draft.bg_to,
      draft.accent,
      draft.tile_bg,
      draft.tile_text,
      draft.text_color,
    ];
    if (!colors.every((c) => HEX_RE.test(c))) {
      return toast.error("Every colour must be a hex value like #bb0000");
    }

    const imageUrl = (draft.flag_image_url ?? "").trim();
    if (draft.flag_mode === "image") {
      if (!imageUrl) return toast.error("Upload a flag image or choose a different flag option");
      if (!isSafeFlagUrl(imageUrl)) {
        return toast.error("Flag image URL must start with https:// (or upload one here)");
      }
    }

    setSaving(true);
    const { error } = await db.from("election_countdown").upsert(
      {
        id: 1,
        is_enabled: draft.is_enabled,
        show_on_all_pages: draft.show_on_all_pages,
        title,
        subtitle: draft.subtitle.trim(),
        target_at: targetIso,
        ended_message: draft.ended_message.trim(),
        flag_mode: draft.flag_mode,
        flag_position: draft.flag_position,
        flag_image_url: imageUrl || null,
        flag_color_1: draft.flag_color_1,
        flag_color_2: draft.flag_color_2,
        flag_color_3: draft.flag_color_3,
        animation: draft.animation,
        bg_from: draft.bg_from,
        bg_to: draft.bg_to,
        accent: draft.accent,
        tile_bg: draft.tile_bg,
        tile_text: draft.tile_text,
        text_color: draft.text_color,
      },
      { onConflict: "id" },
    );
    setSaving(false);
    if (error) return toast.error(error.message);
    await qc.invalidateQueries({ queryKey: ["election-countdown"] });
    toast.success("Countdown saved");
  };

  const previewSettings: ElectionCountdownSettings = {
    ...draft,
    target_at: targetIso ?? draft.target_at,
  };

  return (
    <div className="max-w-4xl pb-24">
      <h1 className="mb-1 font-serif text-3xl font-black">Election countdown</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        The animated countdown shown under the site masthead. Changes appear in the preview straight
        away and go live when you press Save.
      </p>

      {q.isError && (
        <div className="mb-6 border-l-4 border-[var(--brand)] bg-white p-4 text-sm">
          <p className="font-semibold">Countdown table not found</p>
          <p className="mt-1 text-muted-foreground">
            Run the SQL in{" "}
            <code className="rounded bg-muted px-1">
              supabase/migrations/20261014190000_election_countdown.sql
            </code>{" "}
            in your Supabase SQL editor, then reload this page.
          </p>
        </div>
      )}

      <section className="mb-6 border border-border bg-background p-5">
        <h2 className="mb-3 font-serif text-lg font-bold">Live preview</h2>
        <ElectionCountdownView settings={previewSettings} />
      </section>

      <section className="mb-6 space-y-3 border border-border bg-background p-5">
        <h2 className="font-serif text-lg font-bold">Visibility</h2>
        <div className="flex items-center justify-between gap-4 border border-border bg-[var(--paper)] p-3">
          <div>
            <p className="text-sm font-semibold">Show the countdown on the site</p>
            <p className="text-xs text-muted-foreground">
              Off by default. Turn on when you are ready for readers to see it.
            </p>
          </div>
          <Switch checked={draft.is_enabled} onCheckedChange={(v) => set({ is_enabled: v })} />
        </div>
        <div className="flex items-center justify-between gap-4 border border-border bg-[var(--paper)] p-3">
          <div>
            <p className="text-sm font-semibold">Show on every page</p>
            <p className="text-xs text-muted-foreground">
              Off = homepage only. On = under the masthead on all public pages.
            </p>
          </div>
          <Switch
            checked={draft.show_on_all_pages}
            onCheckedChange={(v) => set({ show_on_all_pages: v })}
          />
        </div>
      </section>

      <section className="mb-6 grid gap-4 border border-border bg-background p-5 md:grid-cols-2">
        <h2 className="font-serif text-lg font-bold md:col-span-2">Content</h2>
        <div>
          <Label htmlFor="cd-title">Title</Label>
          <Input
            id="cd-title"
            value={draft.title}
            maxLength={80}
            onChange={(e) => set({ title: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="cd-subtitle">Subtitle</Label>
          <Input
            id="cd-subtitle"
            value={draft.subtitle}
            maxLength={140}
            onChange={(e) => set({ subtitle: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="cd-date">Election date &amp; time (East Africa Time)</Label>
          <Input
            id="cd-date"
            type="datetime-local"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className={targetIso ? "" : "border-destructive"}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Default is 10 August 2027, 6:00 AM. Check the date against the IEBC&apos;s official
            announcement and change it here if it moves.
          </p>
        </div>
        <div>
          <Label htmlFor="cd-ended">Message when the countdown reaches zero</Label>
          <Input
            id="cd-ended"
            value={draft.ended_message}
            maxLength={140}
            onChange={(e) => set({ ended_message: e.target.value })}
          />
        </div>
      </section>

      <section className="mb-6 grid gap-4 border border-border bg-background p-5 md:grid-cols-2">
        <h2 className="font-serif text-lg font-bold md:col-span-2">Flag</h2>
        <div>
          <Label htmlFor="cd-flag-mode">Flag style</Label>
          <select
            id="cd-flag-mode"
            className={selectClass}
            value={draft.flag_mode}
            onChange={(e) =>
              set({ flag_mode: e.target.value as ElectionCountdownSettings["flag_mode"] })
            }
          >
            <option value="kenya">Kenya flag (built in)</option>
            <option value="stripes">Three-stripe flag (pick your own colours)</option>
            <option value="image">Custom image (upload)</option>
            <option value="none">No flag</option>
          </select>
        </div>
        <div>
          <Label htmlFor="cd-flag-pos">Flag position</Label>
          <select
            id="cd-flag-pos"
            className={selectClass}
            value={draft.flag_position}
            onChange={(e) =>
              set({ flag_position: e.target.value as ElectionCountdownSettings["flag_position"] })
            }
          >
            <option value="sides">On both sides of the title</option>
            <option value="left">Left of the title</option>
            <option value="above">Above the title</option>
          </select>
        </div>

        {(draft.flag_mode === "kenya" || draft.flag_mode === "stripes") && (
          <>
            <ColorField
              label={draft.flag_mode === "kenya" ? "Top stripe (black)" : "Top stripe"}
              value={draft.flag_color_1}
              onChange={(v) => set({ flag_color_1: v })}
            />
            <ColorField
              label={draft.flag_mode === "kenya" ? "Middle stripe & shield (red)" : "Middle stripe"}
              value={draft.flag_color_2}
              onChange={(v) => set({ flag_color_2: v })}
            />
            <ColorField
              label={draft.flag_mode === "kenya" ? "Bottom stripe (green)" : "Bottom stripe"}
              value={draft.flag_color_3}
              onChange={(v) => set({ flag_color_3: v })}
            />
            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  set({
                    flag_color_1: DEFAULT_COUNTDOWN.flag_color_1,
                    flag_color_2: DEFAULT_COUNTDOWN.flag_color_2,
                    flag_color_3: DEFAULT_COUNTDOWN.flag_color_3,
                  })
                }
              >
                Reset to Kenya colours
              </Button>
            </div>
          </>
        )}

        {draft.flag_mode === "image" && (
          <div className="md:col-span-2">
            <Label htmlFor="cd-flag-url">Flag image</Label>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                id="cd-flag-url"
                className="min-w-[16rem] flex-1"
                value={draft.flag_image_url ?? ""}
                placeholder="Upload an image, or paste an https:// link"
                onChange={(e) => set({ flag_image_url: e.target.value.trim() })}
              />
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void uploadFlag(f);
                }}
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
              >
                {uploading ? "Uploading…" : "Upload image"}
              </Button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Use a 3:2 image (for example 900×600) for the best fit. It is cropped to that shape if
              it is a different ratio.
            </p>
          </div>
        )}
      </section>

      <section className="mb-6 border border-border bg-background p-5">
        <h2 className="mb-3 font-serif text-lg font-bold">Colours</h2>
        <div className="mb-4 flex flex-wrap gap-2">
          {COLOR_PRESETS.map((p) => (
            <Button
              key={p.name}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => set(p.colors)}
            >
              {p.name}
            </Button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {COLOR_FIELDS.map((f) => (
            <ColorField
              key={f.key}
              label={f.label}
              value={draft[f.key]}
              onChange={(v) => set({ [f.key]: v } as Partial<ElectionCountdownSettings>)}
            />
          ))}
        </div>
      </section>

      <section className="mb-6 border border-border bg-background p-5">
        <h2 className="mb-3 font-serif text-lg font-bold">Animation</h2>
        <Label htmlFor="cd-anim">Number animation</Label>
        <select
          id="cd-anim"
          className={`${selectClass} md:max-w-xs`}
          value={draft.animation}
          onChange={(e) =>
            set({ animation: e.target.value as ElectionCountdownSettings["animation"] })
          }
        >
          <option value="flip">Flip (numbers flip down)</option>
          <option value="slide">Slide (numbers drop in)</option>
          <option value="none">None (also stops the flag wave)</option>
        </select>
        <p className="mt-1 text-xs text-muted-foreground">
          Visitors who have &quot;reduce motion&quot; turned on in their device settings
          automatically see no animation.
        </p>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur md:left-60">
        <div className="max-w-4xl px-1 md:px-6">
          <Button
            onClick={save}
            disabled={saving}
            className="bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90"
          >
            {saving ? "Saving…" : "Save countdown"}
          </Button>
        </div>
      </div>
    </div>
  );
}
