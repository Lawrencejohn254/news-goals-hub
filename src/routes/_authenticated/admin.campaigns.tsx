import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AD_TZ, formatNairobi, nairobiInputToISO } from "@/lib/ad-time";

export const Route = createFileRoute("/_authenticated/admin/campaigns")({
  component: Campaigns,
});

type Advertiser = {
  id: string;
  name: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
};

type Pricing = "flat" | "cpm" | "cpc";
type CampaignStatus = "draft" | "active" | "paused" | "completed";

type Campaign = {
  id: string;
  advertiser_id: string;
  name: string;
  pricing_model: Pricing;
  rate: number;
  currency: string;
  budget: number | null;
  impression_goal: number | null;
  starts_at: string | null;
  ends_at: string | null;
  status: CampaignStatus;
  report_token: string;
  report_enabled: boolean;
  advertisers: { name: string } | null;
  ads: { id: string; impressions: number; clicks: number }[];
};

const emptyAdvertiser = { name: "", contact_name: "", contact_email: "", contact_phone: "" };
const emptyCampaign = {
  advertiser_id: "",
  name: "",
  pricing_model: "flat" as Pricing,
  rate: "",
  currency: "KES",
  budget: "",
  impression_goal: "",
  starts_at: "",
  ends_at: "",
};

const PRICING_LABEL: Record<Pricing, string> = {
  flat: "Flat fee",
  cpm: "CPM (per 1,000 views)",
  cpc: "CPC (per click)",
};

function money(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-KE", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function billable(c: Campaign, impressions: number, clicks: number) {
  const rate = Number(c.rate) || 0;
  if (c.pricing_model === "cpm") return (impressions / 1000) * rate;
  if (c.pricing_model === "cpc") return clicks * rate;
  return rate;
}

const newToken = () => crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
const reportUrl = (token: string) => `${window.location.origin}/report/${token}`;

function Campaigns() {
  const qc = useQueryClient();
  const [adv, setAdv] = useState(emptyAdvertiser);
  const [camp, setCamp] = useState(emptyCampaign);
  const [busy, setBusy] = useState(false);

  const advertisersQ = useQuery({
    queryKey: ["admin", "advertisers"],
    queryFn: async () => {
      const { data, error } = await db.from("advertisers").select("*").order("name");
      if (error) throw new Error(error.message);
      return (data ?? []) as Advertiser[];
    },
  });

  const campaignsQ = useQuery({
    queryKey: ["admin", "campaigns"],
    queryFn: async () => {
      const { data, error } = await db
        .from("campaigns")
        .select("*, advertisers(name), ads(id, impressions, clicks)")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as Campaign[];
    },
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin", "advertisers"] });
    qc.invalidateQueries({ queryKey: ["admin", "campaigns"] });
    qc.invalidateQueries({ queryKey: ["admin", "campaign-options"] });
  };

  const createAdvertiser = async () => {
    if (!adv.name.trim()) return toast.error("Give the advertiser a name");
    if (adv.contact_email.trim() && !/^\S+@\S+\.\S+$/.test(adv.contact_email.trim())) {
      return toast.error("That email address doesn't look right");
    }
    setBusy(true);
    const { error } = await db.from("advertisers").insert({
      name: adv.name.trim(),
      contact_name: adv.contact_name.trim() || null,
      contact_email: adv.contact_email.trim() || null,
      contact_phone: adv.contact_phone.trim() || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Advertiser added");
    setAdv(emptyAdvertiser);
    refresh();
  };

  const deleteAdvertiser = async (a: Advertiser) => {
    if (!confirm(`Delete ${a.name}?`)) return;
    const { error } = await db.from("advertisers").delete().eq("id", a.id);
    if (error) {
      return toast.error(
        error.message.includes("violates foreign key")
          ? "This advertiser still has campaigns. Delete those first."
          : error.message,
      );
    }
    toast.success("Deleted");
    refresh();
  };

  const createCampaign = async () => {
    if (!camp.advertiser_id) return toast.error("Choose an advertiser");
    if (!camp.name.trim()) return toast.error("Give the campaign a name");

    const rate = camp.rate.trim() === "" ? 0 : Number(camp.rate);
    if (!Number.isFinite(rate) || rate < 0) return toast.error("Rate must be a positive number");
    const budget = camp.budget.trim() === "" ? null : Number(camp.budget);
    if (budget !== null && (!Number.isFinite(budget) || budget < 0)) return toast.error("Budget must be a positive number");
    const goal = camp.impression_goal.trim() === "" ? null : Math.floor(Number(camp.impression_goal));
    if (goal !== null && (!Number.isFinite(goal) || goal <= 0)) return toast.error("Impression goal must be more than 0");

    const startsISO = nairobiInputToISO(camp.starts_at);
    const endsISO = nairobiInputToISO(camp.ends_at);
    if (startsISO && endsISO && new Date(endsISO) <= new Date(startsISO)) {
      return toast.error("End date must be after the start date");
    }

    setBusy(true);
    const { error } = await db.from("campaigns").insert({
      advertiser_id: camp.advertiser_id,
      name: camp.name.trim(),
      pricing_model: camp.pricing_model,
      rate,
      currency: camp.currency,
      budget,
      impression_goal: goal,
      starts_at: startsISO,
      ends_at: endsISO,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Campaign created");
    setCamp(emptyCampaign);
    refresh();
  };

  const patchCampaign = async (id: string, patch: Partial<Campaign>, message?: string) => {
    const { error } = await db.from("campaigns").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    if (message) toast.success(message);
    refresh();
  };

  const copyLink = async (c: Campaign) => {
    try {
      await navigator.clipboard.writeText(reportUrl(c.report_token));
      toast.success("Report link copied");
    } catch {
      toast.error("Could not copy. Select the link manually from the Open button.");
    }
  };

  const rotateLink = async (c: Campaign) => {
    if (!confirm("Create a new link? The old one will stop working.")) return;
    await patchCampaign(c.id, { report_token: newToken() }, "New report link created");
  };

  const removeCampaign = async (c: Campaign) => {
    if (!confirm(`Delete "${c.name}"? Its ads stay, but they will no longer belong to a campaign.`)) return;
    const { error } = await db.from("campaigns").delete().eq("id", c.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    refresh();
  };

  const advertisers = advertisersQ.data ?? [];
  const campaigns = campaignsQ.data ?? [];
  const loadError = (advertisersQ.error ?? campaignsQ.error) as Error | null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-black">Campaigns</h1>
        <Link to="/admin/ads" className="text-sm underline">
          ← Ads
        </Link>
      </div>

      {loadError && (
        <p className="mb-4 border border-destructive/40 p-3 text-sm text-destructive">
          Could not load data: {loadError.message}. If this says permission denied or returns nothing, the
          admin check in the Phase 3 migration doesn't match how your roles are stored.
        </p>
      )}

      {/* Advertisers */}
      <h2 className="mb-2 text-lg font-bold">Advertisers</h2>
      <div className="mb-4 grid gap-3 border border-border bg-background p-4 md:grid-cols-4">
        <div>
          <Label>Company name</Label>
          <Input value={adv.name} onChange={(e) => setAdv({ ...adv, name: e.target.value })} />
        </div>
        <div>
          <Label>Contact person</Label>
          <Input value={adv.contact_name} onChange={(e) => setAdv({ ...adv, contact_name: e.target.value })} />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" value={adv.contact_email} onChange={(e) => setAdv({ ...adv, contact_email: e.target.value })} />
        </div>
        <div>
          <Label>Phone</Label>
          <Input value={adv.contact_phone} onChange={(e) => setAdv({ ...adv, contact_phone: e.target.value })} />
        </div>
        <div className="md:col-span-4">
          <Button onClick={createAdvertiser} disabled={busy} className="bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90">
            Add advertiser
          </Button>
        </div>
      </div>

      <div className="mb-10 overflow-x-auto border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {advertisers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  No advertisers yet.
                </td>
              </tr>
            )}
            {advertisers.map((a) => (
              <tr key={a.id} className="border-b border-border last:border-b-0">
                <td className="p-3 font-medium">{a.name}</td>
                <td className="p-3 text-muted-foreground">{a.contact_name ?? "—"}</td>
                <td className="p-3 text-muted-foreground">{a.contact_email ?? "—"}</td>
                <td className="p-3 text-muted-foreground">{a.contact_phone ?? "—"}</td>
                <td className="p-3 text-right">
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => deleteAdvertiser(a)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Campaigns */}
      <h2 className="mb-2 text-lg font-bold">New campaign</h2>
      <div className="mb-4 grid gap-3 border border-border bg-background p-4 md:grid-cols-3">
        <div>
          <Label>Advertiser</Label>
          <select
            value={camp.advertiser_id}
            onChange={(e) => setCamp({ ...camp, advertiser_id: e.target.value })}
            className="h-10 w-full border border-input bg-background px-3 text-sm"
          >
            <option value="">Choose…</option>
            {advertisers.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <Label>Campaign name</Label>
          <Input value={camp.name} onChange={(e) => setCamp({ ...camp, name: e.target.value })} />
        </div>
        <div>
          <Label>Pricing</Label>
          <select
            value={camp.pricing_model}
            onChange={(e) => setCamp({ ...camp, pricing_model: e.target.value as Pricing })}
            className="h-10 w-full border border-input bg-background px-3 text-sm"
          >
            {(Object.keys(PRICING_LABEL) as Pricing[]).map((p) => (
              <option key={p} value={p}>
                {PRICING_LABEL[p]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>{camp.pricing_model === "flat" ? "Fee" : "Rate"}</Label>
          <Input type="number" min="0" step="0.01" value={camp.rate} onChange={(e) => setCamp({ ...camp, rate: e.target.value })} />
        </div>
        <div>
          <Label>Currency</Label>
          <select
            value={camp.currency}
            onChange={(e) => setCamp({ ...camp, currency: e.target.value })}
            className="h-10 w-full border border-input bg-background px-3 text-sm"
          >
            {["KES", "NGN", "USD"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Budget (optional)</Label>
          <Input type="number" min="0" step="0.01" value={camp.budget} onChange={(e) => setCamp({ ...camp, budget: e.target.value })} />
        </div>
        <div>
          <Label>Impression goal (optional)</Label>
          <Input type="number" min="1" step="1" value={camp.impression_goal} onChange={(e) => setCamp({ ...camp, impression_goal: e.target.value })} />
        </div>
        <div />
        <div>
          <Label>Starts at ({AD_TZ})</Label>
          <Input type="datetime-local" value={camp.starts_at} onChange={(e) => setCamp({ ...camp, starts_at: e.target.value })} />
        </div>
        <div>
          <Label>Ends at ({AD_TZ})</Label>
          <Input type="datetime-local" value={camp.ends_at} onChange={(e) => setCamp({ ...camp, ends_at: e.target.value })} />
        </div>
        <div className="flex items-end">
          <Button onClick={createCampaign} disabled={busy} className="bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90">
            Create campaign
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="p-3 text-left">Campaign</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Schedule (Nairobi)</th>
              <th className="p-3 text-left">Delivery</th>
              <th className="p-3 text-left">Clicks / CTR</th>
              <th className="p-3 text-left">Billable</th>
              <th className="p-3 text-left">Report link</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-muted-foreground">
                  No campaigns yet.
                </td>
              </tr>
            )}
            {campaigns.map((c) => {
              const impressions = c.ads.reduce((n, a) => n + (a.impressions ?? 0), 0);
              const clicks = c.ads.reduce((n, a) => n + (a.clicks ?? 0), 0);
              const pct = c.impression_goal ? Math.min(100, Math.round((impressions / c.impression_goal) * 100)) : null;
              return (
                <tr key={c.id} className="border-b border-border align-top last:border-b-0">
                  <td className="p-3">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {c.advertisers?.name ?? "—"} · {c.ads.length} ad{c.ads.length === 1 ? "" : "s"}
                    </div>
                  </td>
                  <td className="p-3">
                    <select
                      value={c.status}
                      onChange={(e) => patchCampaign(c.id, { status: e.target.value as CampaignStatus })}
                      className="h-8 border border-input bg-background px-2 text-xs"
                      aria-label="Campaign status"
                    >
                      {(["draft", "active", "paused", "completed"] as CampaignStatus[]).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    <div>{formatNairobi(c.starts_at)}</div>
                    <div>{formatNairobi(c.ends_at)}</div>
                  </td>
                  <td className="p-3">
                    <div>
                      {impressions.toLocaleString()}
                      {c.impression_goal ? ` / ${c.impression_goal.toLocaleString()}` : ""}
                    </div>
                    {pct !== null && (
                      <div className="mt-1 h-1.5 w-28 bg-muted">
                        <div className="h-full bg-[var(--brand)]" style={{ width: `${pct}%` }} />
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    {clicks.toLocaleString()}
                    <span className="ml-1 text-xs text-muted-foreground">
                      {impressions ? `${((clicks / impressions) * 100).toFixed(2)}%` : "—"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div>{money(billable(c, impressions, clicks), c.currency)}</div>
                    <div className="text-xs text-muted-foreground">{PRICING_LABEL[c.pricing_model].split(" ")[0]}</div>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex flex-wrap items-center gap-1">
                      <Button variant="outline" size="sm" onClick={() => copyLink(c)} disabled={!c.report_enabled}>
                        Copy link
                      </Button>
                      <a
                        href={`/report/${c.report_token}`}
                        target="_blank"
                        rel="noopener"
                        className={`text-xs underline ${c.report_enabled ? "" : "pointer-events-none opacity-40"}`}
                      >
                        Open
                      </a>
                    </div>
                    <div className="mt-1 flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          patchCampaign(c.id, { report_enabled: !c.report_enabled }, c.report_enabled ? "Link turned off" : "Link turned on")
                        }
                      >
                        {c.report_enabled ? "Turn off" : "Turn on"}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => rotateLink(c)}>
                        New link
                      </Button>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => removeCampaign(c)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Delivery and billable amounts use the running totals on each ad. Billable is calculated from the pricing model:
        flat fee, CPM (views ÷ 1,000 × rate) or CPC (clicks × rate). Budgets and goals are stored now and will be used to
        pause campaigns automatically in Phase 4.
      </p>
    </div>
  );
}