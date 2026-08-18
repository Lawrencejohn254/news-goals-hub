import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CZsxps-O.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as slugify } from "./format-CG3FEzEE.mjs";
import { n as Input, r as Label } from "./router-C9TCD_gT.mjs";
import { d as fetchTeams, f as matchLabel, n as fetchCompetitions, r as fetchMatches } from "./football-DKHVh4O4.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { r as setMatchResultFn, s as useServerFn } from "./football-sync.functions-hK7EWEOG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.football-H9ie8K9p.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FootballAdmin() {
	const qc = useQueryClient();
	const saveResult = useServerFn(setMatchResultFn);
	const teams = useQuery({
		queryKey: ["teams"],
		queryFn: fetchTeams
	});
	const comps = useQuery({
		queryKey: ["competitions"],
		queryFn: fetchCompetitions
	});
	const matches = useQuery({
		queryKey: ["admin", "matches"],
		queryFn: () => fetchMatches(200)
	});
	const [teamName, setTeamName] = (0, import_react.useState)("");
	const [compName, setCompName] = (0, import_react.useState)("");
	const [home, setHome] = (0, import_react.useState)("");
	const [away, setAway] = (0, import_react.useState)("");
	const [comp, setComp] = (0, import_react.useState)("");
	const [kickoff, setKickoff] = (0, import_react.useState)("");
	const [venue, setVenue] = (0, import_react.useState)("");
	const addTeam = async () => {
		if (!teamName.trim()) return;
		const { error } = await supabase.from("teams").insert({
			name: teamName.trim(),
			slug: slugify(teamName)
		});
		if (error) return toast.error(error.message);
		setTeamName("");
		toast.success("Team added");
		qc.invalidateQueries({ queryKey: ["teams"] });
	};
	const addComp = async () => {
		if (!compName.trim()) return;
		const { error } = await supabase.from("competitions").insert({
			name: compName.trim(),
			slug: slugify(compName)
		});
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
			venue: venue || null
		});
		if (error) return toast.error(error.message);
		toast.success("Fixture added");
		setKickoff("");
		setVenue("");
		qc.invalidateQueries({ queryKey: ["admin", "matches"] });
	};
	const setScore = async (id, h, a) => {
		if (h === "" || a === "") {
			const { error } = await supabase.from("matches").update({
				home_score: null,
				away_score: null,
				status: "scheduled"
			}).eq("id", id);
			if (error) return toast.error(error.message);
			qc.invalidateQueries({ queryKey: ["admin", "matches"] });
			return;
		}
		try {
			const r = await saveResult({ data: {
				matchId: id,
				home: Number(h),
				away: Number(a)
			} });
			toast.success(r?.settled ? `Result saved — ${r.settled} tip(s) settled` : "Result saved");
			qc.invalidateQueries({ queryKey: ["admin", "matches"] });
			qc.invalidateQueries({ queryKey: ["admin", "predictions"] });
		} catch (e) {
			toast.error(e?.message ?? "Could not save result");
		}
	};
	const removeMatch = async (id) => {
		if (!confirm("Delete fixture?")) return;
		const { error } = await supabase.from("matches").delete().eq("id", id);
		if (error) return toast.error(error.message);
		qc.invalidateQueries({ queryKey: ["admin", "matches"] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl font-black",
				children: "Football data"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-6 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border border-border bg-background p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "mb-3 font-serif text-xl font-bold",
							children: [
								"Teams (",
								teams.data?.length ?? 0,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: teamName,
								onChange: (e) => setTeamName(e.target.value),
								placeholder: "Team name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: addTeam,
								children: "Add"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 max-h-56 space-y-1 overflow-y-auto text-sm",
							children: (teams.data ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between border-b border-border py-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: t.country
								})]
							}, t.id))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border border-border bg-background p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "mb-3 font-serif text-xl font-bold",
							children: [
								"Competitions (",
								comps.data?.length ?? 0,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: compName,
								onChange: (e) => setCompName(e.target.value),
								placeholder: "Competition name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: addComp,
								children: "Add"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 max-h-56 space-y-1 overflow-y-auto text-sm",
							children: (comps.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between border-b border-border py-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: c.season
								})]
							}, c.id))
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "border border-border bg-background p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-4 font-serif text-xl font-bold",
						children: "Add fixture"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 md:grid-cols-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Home" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: home,
								onChange: (e) => setHome(e.target.value),
								className: "h-10 w-full border border-input bg-background px-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "—"
								}), (teams.data ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: t.id,
									children: t.name
								}, t.id))]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Away" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: away,
								onChange: (e) => setAway(e.target.value),
								className: "h-10 w-full border border-input bg-background px-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "—"
								}), (teams.data ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: t.id,
									children: t.name
								}, t.id))]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Competition" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: comp,
								onChange: (e) => setComp(e.target.value),
								className: "h-10 w-full border border-input bg-background px-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "—"
								}), (comps.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c.id,
									children: c.name
								}, c.id))]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Kickoff" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "datetime-local",
								value: kickoff,
								onChange: (e) => setKickoff(e.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Venue" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: venue,
								onChange: (e) => setVenue(e.target.value)
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: addMatch,
						className: "mt-4 bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90",
						children: "Add fixture"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border border-border bg-background",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b border-border bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3 text-left",
								children: "Fixture"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3 text-left",
								children: "Kickoff"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3 text-left",
								children: "Score"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "p-3" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (matches.data ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border last:border-b-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 font-medium",
								children: matchLabel(m)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 text-muted-foreground",
								children: new Date(m.kickoff_at).toLocaleString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreInputs, {
									home: m.home_score,
									away: m.away_score,
									onSave: (h, a) => setScore(m.id, h, a)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									className: "text-destructive hover:text-destructive",
									onClick: () => removeMatch(m.id),
									children: "Delete"
								})
							})
						]
					}, m.id)) })]
				})
			})
		]
	});
}
function ScoreInputs({ home, away, onSave }) {
	const [h, setH] = (0, import_react.useState)(home != null ? String(home) : "");
	const [a, setA] = (0, import_react.useState)(away != null ? String(away) : "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				className: "h-8 w-12",
				value: h,
				onChange: (e) => setH(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "–" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				className: "h-8 w-12",
				value: a,
				onChange: (e) => setA(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => onSave(h, a),
				children: "Save"
			})
		]
	});
}
//#endregion
export { FootballAdmin as component };
