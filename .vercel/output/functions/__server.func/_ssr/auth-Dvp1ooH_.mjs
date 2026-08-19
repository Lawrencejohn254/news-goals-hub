import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CZsxps-O.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Header, t as Footer } from "./Footer-CdYgFB21.mjs";
import { n as Input, r as Label } from "./router-C9TCD_gT.mjs";
import { t as Button } from "./button-BLZ6ednA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-Dvp1ooH_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const navigate = useNavigate();
	const [step, setStep] = (0, import_react.useState)("email");
	const [email, setEmail] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [pendingMessage, setPendingMessage] = (0, import_react.useState)(null);
	const [resendCooldown, setResendCooldown] = (0, import_react.useState)(0);
	const cooldownTimer = (0, import_react.useRef)();
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
		}, 1e3);
	};
	const sendCode = async (e) => {
		e.preventDefault();
		setLoading(true);
		setPendingMessage(null);
		try {
			const { error } = await supabase.auth.signInWithOtp({
				email,
				options: {
					shouldCreateUser: true,
					data: name ? { display_name: name } : void 0
				}
			});
			if (error) throw error;
			toast.success("Code sent — check your email");
			setStep("code");
			startCooldown();
		} catch (err) {
			toast.error(err.message);
		} finally {
			setLoading(false);
		}
	};
	const verifyCode = async (e) => {
		e.preventDefault();
		setLoading(true);
		setPendingMessage(null);
		try {
			const { error } = await supabase.auth.verifyOtp({
				email,
				token: code,
				type: "email"
			});
			if (error) {
				if (/pending admin approval|request was declined/i.test(error.message)) {
					setPendingMessage(error.message);
					return;
				}
				throw error;
			}
			toast.success("Signed in");
			navigate({ to: "/admin" });
		} catch (err) {
			toast.error(err.message);
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "container-page flex items-center justify-center py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md border border-border bg-card p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-1 w-10 bg-[var(--brand)]" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-3 font-serif text-3xl font-black",
									children: step === "email" ? "Sign in" : "Enter your code"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: step === "email" ? "No password needed — we'll email you a 8-digit code. New here? This creates your account too." : `We sent a code to ${email}.`
								})
							]
						}),
						pendingMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 border border-[var(--brand)] bg-[var(--brand)]/10 p-4 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-[var(--ink)]",
								children: "Account not yet active"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-muted-foreground",
								children: pendingMessage
							})]
						}),
						step === "email" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: sendCode,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "name",
										children: "Display name (optional)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "name",
										value: name,
										onChange: (e) => setName(e.target.value),
										placeholder: "Jane Doe"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: "Only used if this is a new account."
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "email",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									type: "email",
									required: true,
									value: email,
									onChange: (e) => setEmail(e.target.value),
									autoComplete: "email"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: loading,
									className: "w-full bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90",
									children: loading ? "Sending…" : "Send code"
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: verifyCode,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "code",
									children: "8-digit code"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "code",
									inputMode: "numeric",
									pattern: "[0-9]*",
									maxLength: 8,
									required: true,
									value: code,
									onChange: (e) => setCode(e.target.value.replace(/\D/g, "")),
									autoComplete: "one-time-code",
									autoFocus: true,
									className: "text-center text-2xl tracking-[0.5em]",
									placeholder: "········"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: loading || code.length !== 8,
									className: "w-full bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90",
									children: loading ? "Verifying…" : "Verify & continue"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											setStep("email");
											setPendingMessage(null);
										},
										className: "hover:text-foreground",
										children: "← Use a different email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: resendCooldown > 0,
										onClick: (e) => sendCode(e),
										className: "hover:text-foreground disabled:opacity-50",
										children: resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 text-center text-xs text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "hover:underline",
								children: "← Back to home"
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { AuthPage as component };
