import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { slugify } from "@/lib/format";
import { fetchTeams, fetchCompetitions, fetchMatches, matchLabel } from "@/lib/football";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/football")({
  component: FootballAdmin,
});

function FootballAdmin() {
  const qc = useQueryClient();
  const teams = useQuery({ queryKey: ["teams"], queryFn: fetchTeams });
  const comps = useQuery({ queryKey: ["competitions"], queryFn: fetchCompetitions });
  const matches = useQuery({ queryKey: ["admin", "matches"], queryFn: () => fetchMatches(200) });

  const [teamName, setTeamName] = useState("");
  const [compName, setCompName] = useState("");
  const [home, setHome] = useState("");
  const [away, setAway] = useState("");
  const [comp, setComp] = useState("");
  const [kickoff, setKickoff] = useState("");
  const [venue, setVenue] = useState("");

  const addTeam = async () => {
    if (!teamName.trim()) return;
    const { error } = await supabase
      .from("teams")
      .insert({ name: teamName.trim(), slug: slugify(teamName) });
    if (error) return toast.error(error.message);
    setTeamName("");
    toast.success("Team added");
    qc.invalidateQueries({ queryKey: ["teams"] });
  };

  const addComp = async () => {
    if (!compName.trim()) return;
    const { error } = await supabase
      .from("competitions")
      .insert({ name: compName.trim(), slug: slugify(compName) });
    if (error) return toast.error(error.message);
    setCompName("");
    toast.success("Competition added");
    qc.invalidateQueries({ queryKey: ["competitions"] });
  };

  const addMatch = async () => {
    if (!home || !away || !kickoff) return toast.error("Home, away and kickoff are required");
    if (home === away) return toast.error("Teams must differ");
    const { error } = await supabase.from("matches").insert({
      home_team_id: home,
      away_team_id: away,
      competition_id: comp || null,
      kickoff_at: new Date(kickoff).toISOString(),
      venue: venue || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Fixture added");
    setKickoff("");
    setVenue("");
    qc.invalidateQueries({ queryKey: ["admin", "matches"] });
  };

  const setScore = async (id: string, h: string, a: string) => {
    const { error } = await supabase
      .from("matches")
      .update({
        home_score: h === "" ? null : Number(h),
        away_score: a === "" ? null : Number(a),
        status: h !== "" && a !== "" ? "finished" : "scheduled",
      })
      .eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "matches"] });
  };

  const removeMatch = async (id: string) => {
    if (!confirm("Delete fixture?")) return;
    const { error } = await supabase.from("matches").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "matches"] });
  };

  return (
    <div className="space-y-10">
      <h1 className="font-serif text-3xl font-black">Football data</h1>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="border border-border bg-background p-5">
          <h2 className="mb-3 font-serif text-xl font-bold">Teams ({teams.data?.length ?? 0})</h2>
          <div className="flex gap-2">
            <Input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Team name" />
            <Button onClick={addTeam}>Add</Button>
          </div>
          <ul className="mt-4 max-h-56 space-y-1 overflow-y-auto text-sm">
            {(teams.data ?? []).map((t) => (
              <li key={t.id} className="flex justify-between border-b border-border py-1">
                <span>{t.name}</span>
                <span className="text-muted-foreground">{t.country}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-border bg-background p-5">
          <h2 className="mb-3 font-serif text-xl font-bold">
            Competitions ({comps.data?.length ?? 0})
          </h2>
          <div className="flex gap-2">
            <Input
              value={compName}
              onChange={(e) => setCompName(e.target.value)}
              placeholder="Competition name"
            />
            <Button onClick={addComp}>Add</Button>
          </div>
          <ul className="mt-4 max-h-56 space-y-1 overflow-y-auto text-sm">
            {(comps.data ?? []).map((c) => (
              <li key={c.id} className="flex justify-between border-b border-border py-1">
                <span>{c.name}</span>
                <span className="text-muted-foreground">{c.season}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border border-border bg-background p-5">
        <h2 className="mb-4 font-serif text-xl font-bold">Add fixture</h2>
        <div className="grid gap-3 md:grid-cols-5">
          <div>
            <Label>Home</Label>
            <select
              value={home}
              onChange={(e) => setHome(e.target.value)}
              className="h-10 w-full border border-input bg-background px-2 text-sm"
            >
              <option value="">—</option>
              {(teams.data ?? []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Away</Label>
            <select
              value={away}
              onChange={(e) => setAway(e.target.value)}
              className="h-10 w-full border border-input bg-background px-2 text-sm"
            >
              <option value="">—</option>
              {(teams.data ?? []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Competition</Label>
            <select
              value={comp}
              onChange={(e) => setComp(e.target.value)}
              className="h-10 w-full border border-input bg-background px-2 text-sm"
            >
              <option value="">—</option>
              {(comps.data ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Kickoff</Label>
            <Input type="datetime-local" value={kickoff} onChange={(e) => setKickoff(e.target.value)} />
          </div>
          <div>
            <Label>Venue</Label>
            <Input value={venue} onChange={(e) => setVenue(e.target.value)} />
          </div>
        </div>
        <Button onClick={addMatch} className="mt-4 bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90">
          Add fixture
        </Button>
      </section>

      <section className="border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="p-3 text-left">Fixture</th>
              <th className="p-3 text-left">Kickoff</th>
              <th className="p-3 text-left">Score</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {(matches.data ?? []).map((m) => (
              <tr key={m.id} className="border-b border-border last:border-b-0">
                <td className="p-3 font-medium">{matchLabel(m)}</td>
                <td className="p-3 text-muted-foreground">
                  {new Date(m.kickoff_at).toLocaleString()}
                </td>
                <td className="p-3">
                  <ScoreInputs
                    home={m.home_score}
                    away={m.away_score}
                    onSave={(h, a) => setScore(m.id, h, a)}
                  />
                </td>
                <td className="p-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeMatch(m.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function ScoreInputs({
  home,
  away,
  onSave,
}: {
  home: number | null;
  away: number | null;
  onSave: (h: string, a: string) => void;
}) {
  const [h, setH] = useState(home != null ? String(home) : "");
  const [a, setA] = useState(away != null ? String(away) : "");
  return (
    <div className="flex items-center gap-1">
      <Input className="h-8 w-12" value={h} onChange={(e) => setH(e.target.value)} />
      <span>–</span>
      <Input className="h-8 w-12" value={a} onChange={(e) => setA(e.target.value)} />
      <Button size="sm" variant="outline" onClick={() => onSave(h, a)}>
        Save
      </Button>
    </div>
  );
}
