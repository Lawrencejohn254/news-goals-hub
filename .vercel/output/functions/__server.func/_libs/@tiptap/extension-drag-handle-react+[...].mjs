import { i as __toESM } from "../../_runtime.mjs";
import { l as require_react_dom, u as require_react } from "../@floating-ui/react-dom+[...].mjs";
import { i as normalizeNestedOptions, n as defaultComputePositionConfig, r as dragHandlePluginDefaultKey, t as DragHandlePlugin } from "./extension-drag-handle+[...].mjs";
//#region node_modules/@tiptap/extension-drag-handle-react/dist/index.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom(), 1);
var DragHandle = (props) => {
	const { className = "drag-handle", children, editor, pluginKey = dragHandlePluginDefaultKey, onNodeChange, onElementDragStart, onElementDragEnd, getReferencedVirtualElement, computePositionConfig = defaultComputePositionConfig, nested = false } = props;
	const elementRef = (0, import_react.useRef)(null);
	if (elementRef.current === null && typeof document !== "undefined") elementRef.current = document.createElement("div");
	const callbacks = {
		onNodeChange,
		onElementDragStart,
		onElementDragEnd,
		getReferencedVirtualElement
	};
	const callbacksRef = (0, import_react.useRef)(callbacks);
	callbacksRef.current = callbacks;
	const nestedOptions = (0, import_react.useMemo)(() => normalizeNestedOptions(nested), [JSON.stringify(nested)]);
	(0, import_react.useEffect)(() => {
		const element2 = elementRef.current;
		if (!element2) return;
		element2.className = className;
	}, [className]);
	(0, import_react.useEffect)(() => {
		if (typeof document === "undefined") return;
		if (editor.isDestroyed) return;
		const element2 = elementRef.current;
		if (!element2) return;
		element2.style.visibility = "hidden";
		element2.style.position = "absolute";
		element2.dataset.dragging = "false";
		const { plugin, unbind } = DragHandlePlugin({
			editor,
			element: element2,
			pluginKey,
			computePositionConfig: {
				...defaultComputePositionConfig,
				...computePositionConfig
			},
			onElementDragStart: (event) => {
				var _a, _b;
				return (_b = (_a = callbacksRef.current).onElementDragStart) == null ? void 0 : _b.call(_a, event);
			},
			onElementDragEnd: (event) => {
				var _a, _b;
				return (_b = (_a = callbacksRef.current).onElementDragEnd) == null ? void 0 : _b.call(_a, event);
			},
			onNodeChange: (data) => {
				var _a, _b;
				return (_b = (_a = callbacksRef.current).onNodeChange) == null ? void 0 : _b.call(_a, data);
			},
			getReferencedVirtualElement: () => {
				var _a, _b, _c;
				return (_c = (_b = (_a = callbacksRef.current).getReferencedVirtualElement) == null ? void 0 : _b.call(_a)) != null ? _c : null;
			},
			nestedOptions
		});
		editor.registerPlugin(plugin);
		return () => {
			if (!editor.isDestroyed) editor.unregisterPlugin(pluginKey);
			unbind();
		};
	}, [
		editor,
		pluginKey,
		computePositionConfig,
		nestedOptions
	]);
	const element = elementRef.current;
	if (!element) return null;
	return (0, import_react_dom.createPortal)(children, element);
};
//#endregion
export { DragHandle as t };
