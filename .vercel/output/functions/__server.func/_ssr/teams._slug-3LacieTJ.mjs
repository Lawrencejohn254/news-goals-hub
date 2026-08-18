import { H as notFound, _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as Header, t as Footer } from "./Footer-CdYgFB21.mjs";
import { a as Route$21 } from "./router-C9TCD_gT.mjs";
import { l as fetchTeamBySlug, t as computeTeamStats, u as fetchTeamMatches } from "./football-DKHVh4O4.mjs";
import { t as AdSlot } from "./AdSlot-DT4WPkar.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/teams._slug-3LacieTJ.js
var import_jsx_runtime = require_jsx_runtime();
function FormPips({ value }) {
	const chars = value.split("");
	if (!chars.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-xs text-muted-foreground",
		children: "No results yet"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex gap-1",
		children: chars.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `flex h-6 w-6 items-center justify-center text-[11px] font-bold text-white ${c === "W" ? "bg-[#1b8a3f]" : c === "D" ? "bg-[#8a8a8a]" : "bg-[var(--brand)]"}`,
			children: c
		}, i))
	});
}
function Stat({ label, value, sub }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border border-border bg-background p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-serif text-2xl font-black text-[var(--ink)]",
				children: value
			}),
			sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-muted-foreground",
				children: sub
			})
		]
	});
}
function Row({ m, teamId }) {
	const isHome = m.home_team_id === teamId;
	const opp = isHome ? m.away_team : m.home_team;
	const done = m.status === "finished" && m.home_score != null && m.away_score != null;
	const gf = (isHome ? m.home_score : m.away_score) ?? null;
	const ga = (isHome ? m.away_score : m.home_score) ?? null;
	const outcome = done ? gf > ga ? "W" : gf === ga ? "D" : "L" : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
		className: "border-t border-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "whitespace-nowrap p-2 text-xs text-muted-foreground",
				children: new Date(m.kickoff_at).toLocaleDateString("en-GB", {
					day: "numeric",
					month: "short",
					year: "numeric"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "p-2 text-xs text-muted-foreground",
				children: m.competitions?.name ?? "—"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
				className: "p-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-bold uppercase text-muted-foreground",
						children: isHome ? "H" : "A"
					}),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: opp?.name ?? "?"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "p-2 text-center font-serif font-black",
				children: done ? `${gf}-${ga}` : new Date(m.kickoff_at).toLocaleTimeString("en-GB", {
					hour: "2-digit",
					minute: "2-digit"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "p-2 text-center",
				children: outcome ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `inline-flex h-5 w-5 items-center justify-center text-[10px] font-bold text-white ${outcome === "W" ? "bg-[#1b8a3f]" : outcome === "D" ? "bg-[#8a8a8a]" : "bg-[var(--brand)]"}`,
					children: outcome
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] uppercase text-muted-foreground",
					children: "Upcoming"
				})
			})
		]
	});
}
function TeamPage() {
	const { slug } = Route$21.useParams();
	const team = useQuery({
		queryKey: ["team", slug],
		queryFn: () => fetchTeamBySlug(slug)
	});
	const teamId = team.data?.id;
	const matches = useQuery({
		queryKey: ["team-matches", teamId],
		queryFn: () => fetchTeamMatches(teamId),
		enabled: !!teamId
	});
	if (team.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "container-page py-12 text-muted-foreground",
				children: "Loading team…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
	if (!team.data) throw notFound();
	const t = team.data;
	const all = matches.data ?? [];
	const stats = computeTeamStats(t.id, all);
	const now = Date.now();
	const recent = all.filter((m) => new Date(m.kickoff_at).getTime() <= now).slice(0, 10);
	const upcoming = all.filter((m) => new Date(m.kickoff_at).getTime() > now).sort((a, b) => a.kickoff_at.localeCompare(b.kickoff_at)).slice(0, 5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "container-page py-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 border-b-4 border-[var(--brand)] pb-5",
						children: [t.crest_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: t.crest_url,
							alt: `${t.name} crest`,
							className: "h-16 w-16 object-contain"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-serif text-4xl font-black text-[var(--ink)]",
							children: t.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								t.country ?? "Football club",
								" · ",
								stats.played,
								" matches on record"
							]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
							children: "Recent form"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormPips, { value: stats.form })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Win rate",
								value: `${stats.winPct}%`,
								sub: `${stats.won}W ${stats.drawn}D ${stats.lost}L`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Goals scored",
								value: stats.goalsFor,
								sub: `${stats.avgScored} per game`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Goals conceded",
								value: stats.goalsAgainst,
								sub: `${stats.avgConceded} per game`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Clean sheets",
								value: stats.cleanSheets
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Both teams scored",
								value: `${stats.bttsPct}%`,
								sub: "of matches"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Over 2.5 goals",
								value: `${stats.over25Pct}%`,
								sub: "of matches"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Matches played",
								value: stats.played
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Goal difference",
								value: `${stats.goalsFor - stats.goalsAgainst > 0 ? "+" : ""}${stats.goalsFor - stats.goalsAgainst}`
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdSlot, {
						placement: "home-top",
						className: "mt-8"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "bg-[var(--ink)] px-3 py-2 font-serif text-lg font-bold uppercase text-white",
							children: "Recent results"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "overflow-x-auto border border-t-0 border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full min-w-[560px] text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-muted/60 text-[10px] uppercase tracking-widest text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2 text-left",
											children: "Date"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2 text-left",
											children: "Competition"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2 text-left",
											children: "Opponent"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2 text-center",
											children: "Score"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2 text-center",
											children: "Res"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: recent.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									m,
									teamId: t.id
								}, m.id)) })]
							}), !recent.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "p-4 text-sm text-muted-foreground",
								children: "No results recorded yet."
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "bg-[var(--ink)] px-3 py-2 font-serif text-lg font-bold uppercase text-white",
							children: "Upcoming fixtures"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "overflow-x-auto border border-t-0 border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
								className: "w-full min-w-[560px] text-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: upcoming.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									m,
									teamId: t.id
								}, m.id)) })
							}), !upcoming.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "p-4 text-sm text-muted-foreground",
								children: "No scheduled fixtures right now."
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/predictions",
						className: "mt-8 inline-block text-sm font-bold uppercase tracking-wider text-[var(--brand)] hover:underline",
						children: "← All football tips"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { TeamPage as component };
