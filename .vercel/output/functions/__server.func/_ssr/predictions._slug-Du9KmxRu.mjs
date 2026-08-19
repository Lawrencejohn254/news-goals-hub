import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CZsxps-O.mjs";
import { c as logPageView } from "./site-D9u_L-Ue.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { H as notFound, _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as Header, t as Footer } from "./Footer-CdYgFB21.mjs";
import { o as Route$22 } from "./router-C9TCD_gT.mjs";
import { a as fetchPredictionBySlug, s as fetchPredictions } from "./football-DKHVh4O4.mjs";
import { t as AdSlot } from "./AdSlot-DT4WPkar.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/predictions._slug-Du9KmxRu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MatchLine({ m, className = "" }) {
	if (!m) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex items-center gap-3 text-sm ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamBadge, {
				name: m.home_team?.name,
				crest: m.home_team?.crest_url
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-bold text-muted-foreground",
				children: m.status === "finished" && m.home_score != null ? `${m.home_score}–${m.away_score}` : "v"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamBadge, {
				name: m.away_team?.name,
				crest: m.away_team?.crest_url,
				reverse: true
			})
		]
	});
}
function TeamBadge({ name, crest, reverse }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `flex items-center gap-2 ${reverse ? "flex-row-reverse" : ""}`,
		children: [crest ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: crest,
			alt: "",
			className: "h-5 w-5 object-contain"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-5 w-5 rounded-full bg-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-semibold",
			children: name ?? "TBD"
		})]
	});
}
function ConfidenceMeter({ value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex items-center gap-1",
		"aria-label": `Confidence ${value} of 5`,
		children: [
			1,
			2,
			3,
			4,
			5
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2 w-4 ${i <= value ? "bg-[var(--brand)]" : "bg-muted"}` }, i))
	});
}
function ResultBadge({ result }) {
	const styles = {
		won: "bg-green-100 text-green-800",
		lost: "bg-red-100 text-red-800",
		void: "bg-muted text-muted-foreground",
		pending: "bg-yellow-100 text-yellow-800"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${styles[result] ?? styles.pending}`,
		children: result
	});
}
function PredictionCard({ p }) {
	const kickoff = p.matches?.kickoff_at;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/predictions/$slug",
		params: { slug: p.slug },
		className: "group flex flex-col border border-border bg-background p-5 transition-colors hover:border-[var(--brand)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.matches?.competitions?.name ?? "Football" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultBadge, { result: p.result })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchLine, {
				m: p.matches,
				className: "mb-3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-serif text-xl font-bold leading-snug group-hover:text-[var(--brand)]",
				children: p.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-end justify-between border-t border-border pt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] uppercase tracking-widest text-muted-foreground",
					children: "Our tip"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-bold text-[var(--brand)]",
					children: p.tip
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] uppercase tracking-widest text-muted-foreground",
						children: "Confidence"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfidenceMeter, { value: p.confidence })]
				})]
			}),
			kickoff && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-muted-foreground",
				children: [
					"Kickoff",
					" ",
					new Date(kickoff).toLocaleString("en-GB", {
						weekday: "short",
						day: "numeric",
						month: "short",
						hour: "2-digit",
						minute: "2-digit"
					})
				]
			})
		]
	});
}
function PredictionPage() {
	const { slug } = Route$22.useParams();
	const { prediction: loaderPrediction } = Route$22.useLoaderData();
	const q = useQuery({
		queryKey: ["prediction", slug],
		queryFn: () => fetchPredictionBySlug(slug),
		initialData: loaderPrediction
	});
	const more = useQuery({
		queryKey: ["predictions"],
		queryFn: () => fetchPredictions({ limit: 6 })
	});
	(0, import_react.useEffect)(() => {
		const p = q.data;
		if (!p) return;
		supabase.from("predictions").update({ view_count: (p.view_count ?? 0) + 1 }).eq("id", p.id).then(() => {});
		logPageView(`/predictions/${p.slug}`, { predictionId: p.id });
	}, [q.data?.id]);
	if (q.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "container-page py-10 text-muted-foreground",
			children: "Loading…"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
	] });
	if (!q.data) throw notFound();
	const p = q.data;
	const m = p.matches;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "container-page py-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "mx-auto max-w-3xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/predictions",
									children: "Predictions"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: m?.competitions?.name ?? "Football"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultBadge, { result: p.result })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-4 font-serif text-4xl font-black leading-tight text-[var(--ink)] md:text-5xl",
							children: p.title
						}),
						m && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 border border-border bg-muted/30 p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchLine, {
								m,
								className: "text-lg"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: [
									new Date(m.kickoff_at).toLocaleString("en-GB", {
										weekday: "long",
										day: "numeric",
										month: "long",
										hour: "2-digit",
										minute: "2-digit"
									}),
									m.venue ? ` · ${m.venue}` : "",
									m.status === "finished" && m.home_score != null ? ` · Final: ${m.home_score}–${m.away_score}` : ""
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 grid gap-4 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TipBox, {
									label: "Our tip",
									value: p.tip,
									accent: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TipBox, {
									label: "Correct score",
									value: p.predicted_home_score != null && p.predicted_away_score != null ? `${p.predicted_home_score}–${p.predicted_away_score}` : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TipBox, {
									label: "Odds",
									value: p.odds ? String(p.odds) : "—"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-center gap-3 border-y border-border py-4 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold uppercase tracking-widest",
									children: "Confidence"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfidenceMeter, { value: p.confidence }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [p.confidence, "/5"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-auto",
									children: [p.view_count?.toLocaleString() ?? 0, " views"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
							className: "article-prose mt-8",
							dangerouslySetInnerHTML: { __html: p.analysis }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdSlot, {
							placement: "article-inline",
							className: "my-8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 grid gap-6 md:grid-cols-2",
							children: [
								p.home_form && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
									title: `${m?.home_team?.name ?? "Home"} form`,
									body: p.home_form
								}),
								p.away_form && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
									title: `${m?.away_team?.name ?? "Away"} form`,
									body: p.away_form
								}),
								p.head_to_head && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
									title: "Head to head",
									body: p.head_to_head
								}),
								p.key_stats && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
									title: "Key stats",
									body: p.key_stats
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-10 border-l-4 border-[var(--brand)] bg-muted/40 p-4 text-xs text-muted-foreground",
							children: "18+. This prediction is editorial opinion, not financial advice. Please gamble responsibly."
						})
					]
				}), (more.data ?? []).filter((x) => x.id !== p.id).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mx-auto mt-16 max-w-5xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-6 border-b-2 border-[var(--ink)] pb-2 font-serif text-2xl font-bold uppercase tracking-wider",
						children: "More predictions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-6 md:grid-cols-3",
						children: (more.data ?? []).filter((x) => x.id !== p.id).slice(0, 3).map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PredictionCard, { p: x }, x.id))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
function TipBox({ label, value, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `border border-border p-4 ${accent ? "bg-[var(--ink)] text-white" : "bg-background"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] font-semibold uppercase tracking-[0.2em] opacity-70",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-serif text-xl font-black",
			children: value
		})]
	});
}
function Panel({ title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border border-border bg-background p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mb-2 font-serif text-lg font-bold uppercase tracking-wide",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground",
			children: body
		})]
	});
}
//#endregion
export { PredictionPage as component };
