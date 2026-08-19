import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CZsxps-O.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as slugify } from "./format-CG3FEzEE.mjs";
import { c as fetchPredictionsForMatches, f as matchLabel, i as fetchMatchesBetween } from "./football-DKHVh4O4.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
import { r as setMatchResultFn, s as useServerFn } from "./football-sync.functions-hK7EWEOG.mjs";
import { t as TIP_OPTIONS } from "./tips-CHUwHK4U.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.predictions.board-BjLpCViY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function dayKey(d) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
var DAY_OFFSETS = [
	-2,
	-1,
	0,
	1,
	2,
	3
];
function boardDays() {
	return DAY_OFFSETS.map((i) => {
		const d = /* @__PURE__ */ new Date();
		d.setDate(d.getDate() + i);
		return dayKey(d);
	});
}
function FixtureBoard() {
	const qc = useQueryClient();
	const days = (0, import_react.useMemo)(() => boardDays(), []);
	const [day, setDay] = (0, import_react.useState)(days[2]);
	const [comp, setComp] = (0, import_react.useState)("");
	const [edits, setEdits] = (0, import_react.useState)({});
	const [busy, setBusy] = (0, import_react.useState)(null);
	const saveResult = useServerFn(setMatchResultFn);
	const from = `${day}T00:00:00.000Z`;
	const to = `${day}T23:59:59.999Z`;
	const fixtures = useQuery({
		queryKey: [
			"board",
			"fixtures",
			day
		],
		queryFn: () => fetchMatchesBetween(from, to)
	});
	const matchIds = (fixtures.data ?? []).map((m) => m.id);
	const preds = useQuery({
		queryKey: [
			"board",
			"preds",
			day,
			matchIds.length
		],
		queryFn: () => fetchPredictionsForMatches(matchIds),
		enabled: matchIds.length > 0
	});
	const predByMatch = new Map((preds.data ?? []).map((p) => [p.match_id, p]));
	const competitions = [...new Set((fixtures.data ?? []).map((m) => m.competitions?.name).filter(Boolean))];
	const rows = (fixtures.data ?? []).filter((m) => !comp || m.competitions?.name === comp);
	const cellFor = (matchId) => {
		if (edits[matchId]) return edits[matchId];
		const p = predByMatch.get(matchId);
		return {
			tip: p?.tip ?? "",
			confidence: p?.confidence ?? 3,
			odds: p?.odds != null ? String(p.odds) : ""
		};
	};
	const patch = (matchId, p) => setEdits((e) => ({
		...e,
		[matchId]: {
			...cellFor(matchId),
			...p
		}
	}));
	const save = async (matchId, publish) => {
		const m = rows.find((r) => r.id === matchId);
		const c = cellFor(matchId);
		if (!m) return;
		if (!c.tip) return toast.error("Pick a tip first");
		setBusy(matchId);
		try {
			const existing = predByMatch.get(matchId);
			const payload = {
				tip: c.tip,
				confidence: Math.min(5, Math.max(1, Number(c.confidence) || 3)),
				odds: c.odds ? Number(c.odds) : null,
				is_published: publish ? true : existing?.is_published ?? false
			};
			if (existing) {
				const { error } = await supabase.from("predictions").update(payload).eq("id", existing.id);
				if (error) throw error;
			} else {
				const { data: auth } = await supabase.auth.getUser();
				const title = `${matchLabel(m)} prediction`;
				const { error } = await supabase.from("predictions").insert({
					...payload,
					match_id: matchId,
					title,
					slug: `${slugify(title)}-${dayKey(new Date(m.kickoff_at))}`,
					analysis: `Our tip for ${matchLabel(m)}: ${c.tip}.`,
					author_id: auth.user.id
				});
				if (error) throw error;
			}
			toast.success(publish ? "Published live" : "Saved as draft");
			setEdits((e) => {
				const n = { ...e };
				delete n[matchId];
				return n;
			});
			qc.invalidateQueries({ queryKey: ["board", "preds"] });
			qc.invalidateQueries({ queryKey: ["admin", "predictions"] });
		} catch (e) {
			toast.error(e?.message ?? "Could not save");
		} finally {
			setBusy(null);
		}
	};
	const settle = async (matchId, h, a) => {
		if (h === "" || a === "") return toast.error("Enter both scores");
		setBusy(matchId);
		try {
			const r = await saveResult({ data: {
				matchId,
				home: Number(h),
				away: Number(a)
			} });
			toast.success(r?.settled ? `Result saved — ${r.settled} tip(s) settled` : "Result saved");
			qc.invalidateQueries({ queryKey: ["board"] });
			qc.invalidateQueries({ queryKey: ["admin", "predictions"] });
			qc.invalidateQueries({ queryKey: ["admin", "matches"] });
		} catch (e) {
			toast.error(e?.message ?? "Could not save result");
		} finally {
			setBusy(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl font-black",
				children: "Fixture board"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin/predictions",
				className: "border border-border px-4 py-2 text-sm font-semibold hover:bg-muted",
				children: "All predictions"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-center gap-3 border border-border bg-muted/30 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: days.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setDay(d),
						className: `px-3 py-1 text-xs font-semibold uppercase tracking-wider ${day === d ? "bg-[var(--ink)] text-white" : "border border-border"}`,
						children: i === 2 ? "Today" : (/* @__PURE__ */ new Date(`${d}T12:00:00`)).toLocaleDateString("en-GB", {
							weekday: "short",
							day: "numeric",
							month: "short"
						})
					}, d))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: comp,
					onChange: (e) => setComp(e.target.value),
					className: "h-9 border border-input bg-background px-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "All competitions"
					}), competitions.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: c,
						children: c
					}, c))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "ml-auto text-xs text-muted-foreground",
					children: [rows.length, " fixtures"]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto border border-border bg-background",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[900px] text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "border-b border-border bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3 text-left",
							children: "Time"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3 text-left",
							children: "Competition"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3 text-left",
							children: "Fixture"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3 text-left",
							children: "Tip"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3 text-left",
							children: "Conf."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3 text-left",
							children: "Odds"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3 text-left",
							children: "State"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3 text-left",
							children: "Result"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "p-3" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
					fixtures.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 9,
						className: "p-6 text-center text-muted-foreground",
						children: "Loading fixtures…"
					}) }),
					!fixtures.isLoading && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 9,
						className: "p-6 text-center text-muted-foreground",
						children: "No fixtures for this day. Track leagues and run a sync in Leagues & sync."
					}) }),
					rows.map((m) => {
						const c = cellFor(m.id);
						const existing = predByMatch.get(m.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border last:border-b-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "whitespace-nowrap p-3 text-muted-foreground",
									children: new Date(m.kickoff_at).toLocaleTimeString("en-GB", {
										hour: "2-digit",
										minute: "2-digit"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-xs text-muted-foreground",
									children: m.competitions?.name ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 font-medium",
									children: matchLabel(m)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: c.tip,
										onChange: (e) => patch(m.id, { tip: e.target.value }),
										className: "h-9 w-44 border border-input bg-background px-2 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "Select tip…"
										}), TIP_OPTIONS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: t,
											children: t
										}, t))]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: c.confidence,
										onChange: (e) => patch(m.id, { confidence: Number(e.target.value) }),
										className: "h-9 border border-input bg-background px-2 text-xs",
										children: [
											1,
											2,
											3,
											4,
											5
										].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: n,
											children: n
										}, n))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: c.odds,
										onChange: (e) => patch(m.id, { odds: e.target.value }),
										placeholder: "1.85",
										className: "h-9 w-20 border border-input bg-background px-2 text-xs"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-xs font-semibold uppercase",
									children: existing ? existing.result && existing.result !== "pending" ? existing.result : existing.is_published ? "Live" : "Draft" : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultCell, {
										home: m.home_score ?? null,
										away: m.away_score ?? null,
										disabled: busy === m.id,
										onSettle: (h, a) => settle(m.id, h, a)
									}, `${m.id}-${m.home_score}-${m.away_score}`)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "whitespace-nowrap p-3 text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										disabled: busy === m.id,
										onClick: () => save(m.id, false),
										children: "Save"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										disabled: busy === m.id,
										onClick: () => save(m.id, true),
										className: "ml-2 bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90",
										children: busy === m.id ? "…" : "Publish"
									})]
								})
							]
						}, m.id);
					})
				] })]
			})
		})
	] });
}
function ResultCell({ home, away, disabled, onSettle }) {
	const [h, setH] = (0, import_react.useState)(home != null ? String(home) : "");
	const [a, setA] = (0, import_react.useState)(away != null ? String(away) : "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: h,
				onChange: (e) => setH(e.target.value),
				inputMode: "numeric",
				className: "h-9 w-10 border border-input bg-background px-1 text-center text-xs"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground",
				children: "–"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: a,
				onChange: (e) => setA(e.target.value),
				inputMode: "numeric",
				className: "h-9 w-10 border border-input bg-background px-1 text-center text-xs"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				disabled,
				onClick: () => onSettle(h, a),
				children: "Settle"
			})
		]
	});
}
//#endregion
export { FixtureBoard as component };
