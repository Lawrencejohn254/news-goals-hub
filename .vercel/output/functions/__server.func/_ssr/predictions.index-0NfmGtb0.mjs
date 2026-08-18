import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { F as Calendar$1, M as ChevronLeft, N as ChevronDown, j as ChevronRight } from "../_libs/lucide-react.mjs";
import { n as Header, t as Footer } from "./Footer-CdYgFB21.mjs";
import { s as Route$23 } from "./router-C9TCD_gT.mjs";
import { o as fetchPredictionStats, s as fetchPredictions } from "./football-DKHVh4O4.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as buttonVariants, t as Button } from "./button-BLZ6ednA.mjs";
import { i as Trigger, n as Portal, r as Root2, t as Content2 } from "../_libs/@radix-ui/react-popover+[...].mjs";
import { t as AdSlot } from "./AdSlot-DT4WPkar.mjs";
import { n as getDefaultClassNames, t as DayPicker } from "../_libs/react-day-picker.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/predictions.index-0NfmGtb0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Calendar({ className, classNames, showOutsideDays = true, captionLayout = "label", buttonVariant = "ghost", formatters, components, ...props }) {
	const defaultClassNames = getDefaultClassNames();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayPicker, {
		showOutsideDays,
		className: cn("bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent", String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`, String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`, className),
		captionLayout,
		formatters: {
			formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
			...formatters
		},
		classNames: {
			root: cn("w-fit", defaultClassNames.root),
			months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
			month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
			nav: cn("absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1", defaultClassNames.nav),
			button_previous: cn(buttonVariants({ variant: buttonVariant }), "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50", defaultClassNames.button_previous),
			button_next: cn(buttonVariants({ variant: buttonVariant }), "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50", defaultClassNames.button_next),
			month_caption: cn("flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)", defaultClassNames.month_caption),
			dropdowns: cn("flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium", defaultClassNames.dropdowns),
			dropdown_root: cn("has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border", defaultClassNames.dropdown_root),
			dropdown: cn("bg-popover absolute inset-0 opacity-0", defaultClassNames.dropdown),
			caption_label: cn("select-none font-medium", captionLayout === "label" ? "text-sm" : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5", defaultClassNames.caption_label),
			table: "w-full border-collapse",
			weekdays: cn("flex", defaultClassNames.weekdays),
			weekday: cn("text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal", defaultClassNames.weekday),
			week: cn("mt-2 flex w-full", defaultClassNames.week),
			week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
			week_number: cn("text-muted-foreground select-none text-[0.8rem]", defaultClassNames.week_number),
			day: cn("group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md", defaultClassNames.day),
			range_start: cn("bg-accent rounded-l-md", defaultClassNames.range_start),
			range_middle: cn("rounded-none", defaultClassNames.range_middle),
			range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
			today: cn("bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none", defaultClassNames.today),
			outside: cn("text-muted-foreground aria-selected:text-muted-foreground", defaultClassNames.outside),
			disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
			hidden: cn("invisible", defaultClassNames.hidden),
			...classNames
		},
		components: {
			Root: ({ className, rootRef, ...props }) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-slot": "calendar",
					ref: rootRef,
					className: cn(className),
					...props
				});
			},
			Chevron: ({ className, orientation, ...props }) => {
				if (orientation === "left") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
					className: cn("size-4", className),
					...props
				});
				if (orientation === "right") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
					className: cn("size-4", className),
					...props
				});
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
					className: cn("size-4", className),
					...props
				});
			},
			DayButton: CalendarDayButton,
			WeekNumber: ({ children, ...props }) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					...props,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-(--cell-size) items-center justify-center text-center",
						children
					})
				});
			},
			...components
		},
		...props
	});
}
function CalendarDayButton({ className, day, modifiers, ...props }) {
	const defaultClassNames = getDefaultClassNames();
	const ref = import_react.useRef(null);
	import_react.useEffect(() => {
		if (modifiers.focused) ref.current?.focus();
	}, [modifiers.focused]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		ref,
		variant: "ghost",
		size: "icon",
		"data-day": day.date.toLocaleDateString(),
		"data-selected-single": modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle,
		"data-range-start": modifiers.range_start,
		"data-range-end": modifiers.range_end,
		"data-range-middle": modifiers.range_middle,
		className: cn("data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-(--cell-size) flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70", defaultClassNames.day, className),
		...props
	});
}
var Popover = Root2;
var PopoverTrigger = Trigger;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = Content2.displayName;
function dayKey(d) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function toDayKey(iso) {
	if (!iso) return "";
	return dayKey(new Date(iso));
}
function longDate(key) {
	return (/* @__PURE__ */ new Date(`${key}T12:00:00`)).toLocaleDateString("en-GB", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric"
	});
}
var DAYS = Array.from({ length: 5 }, (_, i) => {
	const d = /* @__PURE__ */ new Date();
	d.setDate(d.getDate() + i);
	return dayKey(d);
});
function Form({ value }) {
	const chars = (value ?? "").toUpperCase().replace(/[^WDL]/g, "").slice(-5).split("");
	if (!chars.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-[10px] text-muted-foreground",
		children: "—"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex gap-0.5",
		children: chars.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `flex h-4 w-4 items-center justify-center text-[9px] font-bold text-white ${c === "W" ? "bg-[#1b8a3f]" : c === "D" ? "bg-[#8a8a8a]" : "bg-[var(--brand)]"}`,
			children: c
		}, i))
	});
}
function ResultCell({ p }) {
	if (p.result === "won") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "bg-[#1b8a3f] px-2 py-0.5 text-[10px] font-bold uppercase text-white",
		children: "Won"
	});
	if (p.result === "lost") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "bg-[var(--brand)] px-2 py-0.5 text-[10px] font-bold uppercase text-white",
		children: "Lost"
	});
	if (p.result === "void") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "bg-muted px-2 py-0.5 text-[10px] font-bold uppercase",
		children: "Void"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-[10px] font-semibold uppercase text-muted-foreground",
		children: "Pending"
	});
}
function PredictionsIndex() {
	const loaderData = Route$23.useLoaderData();
	const [day, setDay] = (0, import_react.useState)(DAYS[0]);
	const tabs = DAYS.includes(day) ? DAYS : [day, ...DAYS];
	const preds = useQuery({
		queryKey: ["predictions", "all"],
		queryFn: () => fetchPredictions({ limit: 500 }),
		initialData: loaderData.predictions
	});
	const stats = useQuery({
		queryKey: ["prediction-stats"],
		queryFn: fetchPredictionStats,
		initialData: loaderData.stats
	});
	const visible = (preds.data ?? []).filter((p) => toDayKey(p.matches?.kickoff_at) === day);
	const groups = /* @__PURE__ */ new Map();
	for (const p of visible) {
		const key = p.matches?.competitions?.name ?? "Other fixtures";
		if (!groups.has(key)) groups.set(key, []);
		groups.get(key).push(p);
	}
	for (const list of groups.values()) list.sort((a, b) => (a.matches?.kickoff_at ?? "").localeCompare(b.matches?.kickoff_at ?? ""));
	const won = visible.filter((p) => p.result === "won").length;
	const lost = visible.filter((p) => p.result === "lost").length;
	const rate = won + lost ? Math.round(won / (won + lost) * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-border bg-[var(--ink)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container-page flex flex-wrap items-center gap-px py-0",
					children: [tabs.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setDay(d),
						className: `px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${day === d ? "bg-[var(--brand)] text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`,
						children: [
							d === DAYS[0] ? "Today" : d === DAYS[1] ? "Tomorrow" : (/* @__PURE__ */ new Date(`${d}T12:00:00`)).toLocaleDateString("en-GB", { weekday: "long" }),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "opacity-70",
								children: [
									"(",
									(/* @__PURE__ */ new Date(`${d}T12:00:00`)).toLocaleDateString("en-GB", {
										day: "numeric",
										month: "short"
									}),
									")"
								]
							})
						]
					}, d)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							className: "ml-auto gap-2 rounded-none px-4 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 hover:text-white",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar$1, { className: "h-4 w-4" }), "Pick a date"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
						className: "w-auto p-0",
						align: "end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
							mode: "single",
							selected: /* @__PURE__ */ new Date(`${day}T12:00:00`),
							onSelect: (d) => d && setDay(dayKey(d)),
							initialFocus: true,
							className: "pointer-events-auto p-3"
						})
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "container-page py-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "font-serif text-3xl font-black text-[var(--ink)] md:text-4xl",
						children: ["Football Tips — ", longDate(day)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-3xl text-sm text-muted-foreground",
						children: "Here are all of our free football betting tips for this matchday. Each row shows both teams' last five results, our predicted score, the recommended tip and the price. Click any fixture for the full match preview."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap items-center gap-4 border-y border-border py-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold uppercase tracking-widest",
								children: "Key"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Form, { value: "W" }), " Win"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Form, { value: "D" }), " Draw"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Form, { value: "L" }), " Loss"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-auto text-muted-foreground",
								children: [
									visible.length,
									" tips · ",
									won,
									"W–",
									lost,
									"L ·",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-[var(--brand)]",
										children: [rate, "% strike rate"]
									}),
									" today · all-time",
									" ",
									stats.data?.winRate ?? 0,
									"%"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdSlot, {
						placement: "home-top",
						className: "mt-6"
					}),
					preds.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 text-muted-foreground",
						children: "Loading tips…"
					}),
					!preds.isLoading && visible.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-8 border border-border bg-muted/30 p-6 text-muted-foreground",
						children: [
							"No tips published for ",
							longDate(day),
							" yet. Check back soon."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 space-y-10",
						children: [...groups.entries()].map(([comp, list]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "flex items-center gap-2 bg-[var(--ink)] px-3 py-2 font-serif text-lg font-bold uppercase tracking-wide text-white",
								children: [
									list[0]?.matches?.competitions?.logo_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: list[0].matches.competitions.logo_url,
										alt: "",
										className: "h-5 w-5 object-contain",
										loading: "lazy"
									}),
									comp,
									" Tips"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto border border-t-0 border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full min-w-[860px] border-collapse text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "bg-muted/60 text-[10px] uppercase tracking-widest text-muted-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "w-20 p-2 text-left",
												children: "Time"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2 text-right",
												children: "Home"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "w-28 p-2 text-center",
												children: "Prediction"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2 text-left",
												children: "Away"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "w-16 p-2 text-center",
												children: "Tip"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "w-16 p-2 text-center",
												children: "Odds"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "w-20 p-2 text-center",
												children: "Conf."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "w-20 p-2 text-center",
												children: "Result"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: list.map((p, idx) => {
										const m = p.matches;
										const score = p.predicted_home_score != null && p.predicted_away_score != null ? `${p.predicted_home_score}-${p.predicted_away_score}` : "—";
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: `border-t border-border ${idx % 2 ? "bg-muted/20" : "bg-background"}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "whitespace-nowrap p-2 text-xs text-muted-foreground",
													children: m?.kickoff_at ? new Date(m.kickoff_at).toLocaleTimeString("en-GB", {
														hour: "2-digit",
														minute: "2-digit"
													}) : "—"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2 text-right",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-end gap-2",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Form, { value: p.home_form }),
															m?.home_team?.slug ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
																to: "/teams/$slug",
																params: { slug: m.home_team.slug },
																className: "font-semibold hover:text-[var(--brand)] hover:underline",
																children: m.home_team.name
															}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-semibold",
																children: m?.home_team?.name ?? "?"
															}),
															m?.home_team?.crest_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
																src: m.home_team.crest_url,
																alt: "",
																className: "h-5 w-5",
																loading: "lazy"
															})
														]
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2 text-center",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
														to: "/predictions/$slug",
														params: { slug: p.slug },
														className: "font-serif text-base font-black text-[var(--brand)] hover:underline",
														children: score
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2",
														children: [
															m?.away_team?.crest_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
																src: m.away_team.crest_url,
																alt: "",
																className: "h-5 w-5",
																loading: "lazy"
															}),
															m?.away_team?.slug ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
																to: "/teams/$slug",
																params: { slug: m.away_team.slug },
																className: "font-semibold hover:text-[var(--brand)] hover:underline",
																children: m.away_team.name
															}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-semibold",
																children: m?.away_team?.name ?? "?"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Form, { value: p.away_form })
														]
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2 text-center text-xs font-bold uppercase",
													children: p.tip
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2 text-center",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "inline-block border border-border px-2 py-0.5 text-xs font-semibold",
														children: p.odds ?? "—"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "p-2 text-center text-xs",
													children: [p.confidence, "/5"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2 text-center",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultCell, { p })
												})
											]
										}, p.id);
									}) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border border-t-0 border-border bg-muted/30 px-3 py-2 text-right",
								children: list.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-3 inline-flex gap-2 text-[11px] font-bold uppercase tracking-wider",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/predictions/$slug",
										params: { slug: p.slug },
										className: "text-[var(--brand)] hover:underline",
										children: [p.matches?.home_team?.short_name ?? p.matches?.home_team?.name, " preview"]
									}), p.matches?.home_team?.slug && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/teams/$slug",
										params: { slug: p.matches.home_team.slug },
										className: "text-muted-foreground hover:text-[var(--brand)] hover:underline",
										children: "stats"
									})]
								}, p.id))
							})
						] }, comp))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdSlot, {
						placement: "sidebar",
						className: "mt-10"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 border-l-4 border-[var(--brand)] bg-muted/40 p-4 text-xs text-muted-foreground",
						children: "18+. Predictions are opinion and analysis, not financial advice. Please gamble responsibly."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { PredictionsIndex as component };
