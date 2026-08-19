import { B as Decoration, E as isFirefox, G as PluginKey, K as Selection, Q as NodeRange, U as NodeSelection, V as DecorationSet, W as Plugin, q as SelectionRange, r as Extension } from "./core+[...].mjs";
import { r as computePosition } from "../@floating-ui/dom+[...].mjs";
import { i as ySyncPluginKey, n as absolutePositionToRelativePosition, r as relativePositionToAbsolutePosition, t as isChangeOrigin } from "./extension-collaboration+[...].mjs";
//#region node_modules/@tiptap/extension-node-range/dist/index.js
function getNodeRangeDecorations(ranges) {
	if (!ranges.length) return DecorationSet.empty;
	const decorations = [];
	const doc = ranges[0].$from.node(0);
	ranges.forEach((range) => {
		const pos = range.$from.pos;
		const node = range.$from.nodeAfter;
		if (!node) return;
		decorations.push(Decoration.node(pos, pos + node.nodeSize, { class: "ProseMirror-selectednoderange" }));
	});
	return DecorationSet.create(doc, decorations);
}
function getNodeContentBounds(nodeStart, nodeSize, node) {
	const contentOffset = node.isText || node.isAtom ? 0 : 1;
	return {
		start: nodeStart + contentOffset,
		end: nodeStart + nodeSize - contentOffset
	};
}
function getSelectionRanges($from, $to, depth, options = {}) {
	const ranges = [];
	const doc = $from.node(0);
	const { extendOnBoundaryOverlap = true } = options;
	if (typeof depth === "number" && depth >= 0) {} else if ($from.sameParent($to)) depth = Math.max(0, $from.sharedDepth($to.pos) - 1);
	else depth = $from.sharedDepth($to.pos);
	const nodeRange = new NodeRange($from, $to, depth);
	const offset = nodeRange.depth === 0 ? 0 : doc.resolve(nodeRange.start).posAtIndex(0);
	nodeRange.parent.forEach((node, pos) => {
		const from = offset + pos;
		const to = from + node.nodeSize;
		const contentBounds = getNodeContentBounds(from, node.nodeSize, node);
		const overlapsNodeContent = extendOnBoundaryOverlap ? $to.pos >= contentBounds.start && $from.pos <= contentBounds.end : $to.pos > contentBounds.start && $from.pos < contentBounds.end;
		if (from < nodeRange.start || from >= nodeRange.end) return;
		if (!overlapsNodeContent) return;
		const selectionRange = new SelectionRange(doc.resolve(from), doc.resolve(to));
		ranges.push(selectionRange);
	});
	return ranges;
}
var NodeRangeBookmark = class _NodeRangeBookmark {
	constructor(anchor, head, depth) {
		this.anchor = anchor;
		this.head = head;
		this.depth = depth != null ? depth : 0;
	}
	map(mapping) {
		return new _NodeRangeBookmark(mapping.map(this.anchor), mapping.map(this.head), this.depth);
	}
	resolve(doc) {
		return new NodeRangeSelection(doc.resolve(this.anchor), doc.resolve(this.head), this.depth);
	}
};
var NodeRangeSelection = class _NodeRangeSelection extends Selection {
	constructor($anchor, $head, depth, bias = 1) {
		const { doc } = $anchor;
		const isCursor = $anchor === $head;
		const isCursorAtEnd = $anchor.pos === doc.content.size && $head.pos === doc.content.size;
		const $correctedHead = isCursor && !isCursorAtEnd ? doc.resolve($head.pos + (bias > 0 ? 1 : -1)) : $head;
		const $correctedAnchor = isCursor && isCursorAtEnd ? doc.resolve($anchor.pos - (bias > 0 ? 1 : -1)) : $anchor;
		const ranges = getSelectionRanges($correctedAnchor.min($correctedHead), $correctedAnchor.max($correctedHead), depth);
		const $rangeFrom = $correctedHead.pos >= $anchor.pos ? ranges[0].$from : ranges[ranges.length - 1].$to;
		const $rangeTo = $correctedHead.pos >= $anchor.pos ? ranges[ranges.length - 1].$to : ranges[0].$from;
		super($rangeFrom, $rangeTo, ranges);
		this.depth = depth;
	}
	get $to() {
		return this.ranges[this.ranges.length - 1].$to;
	}
	eq(other) {
		return other instanceof _NodeRangeSelection && other.$from.pos === this.$from.pos && other.$to.pos === this.$to.pos;
	}
	map(doc, mapping) {
		const $anchor = doc.resolve(mapping.map(this.anchor));
		const $head = doc.resolve(mapping.map(this.head));
		return new _NodeRangeSelection($anchor, $head, this.depth);
	}
	toJSON() {
		return {
			type: "nodeRange",
			anchor: this.anchor,
			head: this.head,
			depth: this.depth
		};
	}
	get isForwards() {
		return this.head >= this.anchor;
	}
	get isBackwards() {
		return !this.isForwards;
	}
	extendBackwards() {
		const { doc } = this.$from;
		if (this.isForwards && this.ranges.length > 1) {
			const ranges = this.ranges.slice(0, -1);
			const $from2 = ranges[0].$from;
			const $to = ranges[ranges.length - 1].$to;
			return new _NodeRangeSelection($from2, $to, this.depth);
		}
		const firstRange = this.ranges[0];
		const $from = doc.resolve(Math.max(0, firstRange.$from.pos - 1));
		return new _NodeRangeSelection(this.$anchor, $from, this.depth);
	}
	extendForwards() {
		const { doc } = this.$from;
		if (this.isBackwards && this.ranges.length > 1) {
			const ranges = this.ranges.slice(1);
			const $from = ranges[0].$from;
			const $to2 = ranges[ranges.length - 1].$to;
			return new _NodeRangeSelection($to2, $from, this.depth);
		}
		const lastRange = this.ranges[this.ranges.length - 1];
		const $to = doc.resolve(Math.min(doc.content.size, lastRange.$to.pos + 1));
		return new _NodeRangeSelection(this.$anchor, $to, this.depth);
	}
	static fromJSON(doc, json) {
		return new _NodeRangeSelection(doc.resolve(json.anchor), doc.resolve(json.head), json.depth);
	}
	static create(doc, anchor, head, depth, bias = 1) {
		return new this(doc.resolve(anchor), doc.resolve(head), depth, bias);
	}
	getBookmark() {
		return new NodeRangeBookmark(this.anchor, this.head, this.depth);
	}
};
NodeRangeSelection.prototype.visible = false;
try {
	Selection.jsonID("nodeRange", NodeRangeSelection);
} catch {}
function isNodeRangeSelection(value) {
	return value instanceof NodeRangeSelection;
}
Extension.create({
	name: "nodeRange",
	addOptions() {
		return {
			depth: void 0,
			key: "Mod"
		};
	},
	addKeyboardShortcuts() {
		return {
			"Shift-ArrowUp": ({ editor }) => {
				const { depth } = this.options;
				const { view, state } = editor;
				const { doc, selection, tr } = state;
				const { anchor, head } = selection;
				if (!isNodeRangeSelection(selection)) {
					const nodeRangeSelection2 = NodeRangeSelection.create(doc, anchor, head, depth, -1);
					tr.setSelection(nodeRangeSelection2);
					view.dispatch(tr);
					return true;
				}
				const nodeRangeSelection = selection.extendBackwards();
				tr.setSelection(nodeRangeSelection);
				view.dispatch(tr);
				return true;
			},
			"Shift-ArrowDown": ({ editor }) => {
				const { depth } = this.options;
				const { view, state } = editor;
				const { doc, selection, tr } = state;
				const { anchor, head } = selection;
				if (!isNodeRangeSelection(selection)) {
					const nodeRangeSelection2 = NodeRangeSelection.create(doc, anchor, head, depth);
					tr.setSelection(nodeRangeSelection2);
					view.dispatch(tr);
					return true;
				}
				const nodeRangeSelection = selection.extendForwards();
				tr.setSelection(nodeRangeSelection);
				view.dispatch(tr);
				return true;
			},
			"Mod-a": ({ editor }) => {
				const { depth } = this.options;
				const { view, state } = editor;
				const { doc, tr } = state;
				const nodeRangeSelection = NodeRangeSelection.create(doc, 0, doc.content.size, depth);
				tr.setSelection(nodeRangeSelection);
				view.dispatch(tr);
				return true;
			}
		};
	},
	onSelectionUpdate() {
		const { selection } = this.editor.state;
		if (isNodeRangeSelection(selection)) this.editor.view.dom.classList.add("ProseMirror-noderangeselection");
	},
	addProseMirrorPlugins() {
		let hideTextSelection = false;
		let activeMouseSelection = false;
		return [new Plugin({
			key: new PluginKey("nodeRange"),
			props: {
				attributes: () => {
					if (hideTextSelection) return { class: "ProseMirror-noderangeselection" };
					return { class: "" };
				},
				handleDOMEvents: { mousedown: (view, event) => {
					const { key } = this.options;
					const isMac = /Mac/.test(navigator.platform);
					const isShift = !!event.shiftKey;
					const isControl = !!event.ctrlKey;
					const isAlt = !!event.altKey;
					const isMeta = !!event.metaKey;
					if (key === null || key === void 0 || key === "Shift" && isShift || key === "Control" && isControl || key === "Alt" && isAlt || key === "Meta" && isMeta || key === "Mod" && (isMac ? isMeta : isControl)) activeMouseSelection = true;
					if (!activeMouseSelection) return false;
					document.addEventListener("mouseup", () => {
						activeMouseSelection = false;
						const { state } = view;
						const { doc, selection, tr } = state;
						const { $anchor, $head } = selection;
						if ($anchor.sameParent($head)) return;
						const nodeRangeSelection = NodeRangeSelection.create(doc, $anchor.pos, $head.pos, this.options.depth);
						tr.setSelection(nodeRangeSelection);
						view.dispatch(tr);
					}, { once: true });
					return false;
				} },
				decorations: (state) => {
					const { selection } = state;
					const isNodeRange = isNodeRangeSelection(selection);
					hideTextSelection = false;
					if (!activeMouseSelection) {
						if (!isNodeRange) return null;
						hideTextSelection = true;
						return getNodeRangeDecorations(selection.ranges);
					}
					const { $from, $to } = selection;
					if (!isNodeRange && $from.sameParent($to)) return null;
					const nodeRanges = getSelectionRanges($from, $to, this.options.depth);
					if (!nodeRanges.length) return null;
					hideTextSelection = true;
					return getNodeRangeDecorations(nodeRanges);
				}
			}
		})];
	}
});
//#endregion
//#region node_modules/@tiptap/extension-drag-handle/dist/index.js
function getCSSText(element, properties) {
	const style = getComputedStyle(element);
	if (properties) return properties.map((property) => property.trim()).filter((property) => property.length > 0).map((property) => `${property}:${style.getPropertyValue(property)};`).join("");
	let value = "";
	for (let i = 0; i < style.length; i += 1) value += `${style[i]}:${style.getPropertyValue(style[i])};`;
	return value;
}
function cloneElement(node, properties) {
	const clonedNode = node.cloneNode(true);
	const sourceElements = [node, ...Array.from(node.getElementsByTagName("*"))];
	const targetElements = [clonedNode, ...Array.from(clonedNode.getElementsByTagName("*"))];
	sourceElements.forEach((sourceElement, index) => {
		targetElements[index].style.cssText = getCSSText(sourceElement, properties);
	});
	return clonedNode;
}
var defaultRules = [
	{
		id: "listItemFirstChild",
		evaluate: ({ parent, isFirst }) => {
			if (!isFirst) return 0;
			if (parent && ["listItem", "taskItem"].includes(parent.type.name)) return 1e3;
			return 0;
		}
	},
	{
		id: "listWrapperDeprioritize",
		evaluate: ({ node }) => {
			const listItemTypes = ["listItem", "taskItem"];
			const firstChild = node.firstChild;
			if (firstChild && listItemTypes.includes(firstChild.type.name)) return 1e3;
			return 0;
		}
	},
	{
		id: "tableStructure",
		evaluate: ({ node, parent }) => {
			if ([
				"tableRow",
				"tableCell",
				"tableHeader"
			].includes(node.type.name)) return 1e3;
			if (parent && parent.type.name === "tableHeader") return 1e3;
			return 0;
		}
	},
	{
		id: "inlineContent",
		evaluate: ({ node }) => {
			if (node.isInline || node.isText) return 1e3;
			return 0;
		}
	}
];
var DEFAULT_EDGE_CONFIG = {
	edges: ["left", "top"],
	threshold: 12,
	strength: 500
};
function normalizeEdgeDetection(input) {
	if (input === void 0 || input === "left") return { ...DEFAULT_EDGE_CONFIG };
	if (input === "right") return {
		edges: ["right", "top"],
		threshold: 12,
		strength: 500
	};
	if (input === "both") return {
		edges: [
			"left",
			"right",
			"top"
		],
		threshold: 12,
		strength: 500
	};
	if (input === "none") return {
		edges: [],
		threshold: 0,
		strength: 0
	};
	return {
		...DEFAULT_EDGE_CONFIG,
		...input
	};
}
function isNearEdge(coords, element, config) {
	if (config.edges.length === 0) return false;
	const rect = element.getBoundingClientRect();
	const { threshold, edges } = config;
	return edges.some((edge) => {
		if (edge === "left") return coords.x - rect.left < threshold;
		if (edge === "right") return rect.right - coords.x < threshold;
		if (edge === "top") return coords.y - rect.top < threshold;
		if (edge === "bottom") return rect.bottom - coords.y < threshold;
		return false;
	});
}
function calculateEdgeDeduction(coords, element, config, depth) {
	if (!element || config.edges.length === 0) return 0;
	if (isNearEdge(coords, element, config)) return config.strength * depth;
	return 0;
}
var BASE_SCORE = 1e3;
function calculateScore(context, rules, edgeConfig, coords) {
	let score = BASE_SCORE;
	let excluded = false;
	rules.every((rule) => {
		const deduction = rule.evaluate(context);
		score -= deduction;
		if (score <= 0) {
			excluded = true;
			return false;
		}
		return true;
	});
	if (excluded) return -1;
	const dom = context.view.nodeDOM(context.pos);
	score -= calculateEdgeDeduction(coords, dom, edgeConfig, context.depth);
	if (score <= 0) return -1;
	return score;
}
function hasAncestorOfType($pos, depth, allowedTypes) {
	return Array.from({ length: depth }, (_, i) => depth - 1 - i).some((d) => allowedTypes.includes($pos.node(d).type.name));
}
function findBestDragTarget(view, coords, options) {
	if (!Number.isFinite(coords.x) || !Number.isFinite(coords.y)) return null;
	const posInfo = view.posAtCoords({
		left: coords.x,
		top: coords.y
	});
	if (!posInfo) return null;
	const { doc } = view.state;
	const $pos = doc.resolve(posInfo.pos);
	const rules = [];
	if (options.defaultRules) rules.push(...defaultRules);
	rules.push(...options.rules);
	const candidates = Array.from({ length: $pos.depth }, (_, i) => $pos.depth - i).map((depth) => {
		const node = $pos.node(depth);
		const nodePos = $pos.before(depth);
		if (options.allowedContainers && depth > 0) {
			if (!hasAncestorOfType($pos, depth, options.allowedContainers)) return null;
		}
		const parent = depth > 0 ? $pos.node(depth - 1) : null;
		const index = depth > 0 ? $pos.index(depth - 1) : 0;
		const siblingCount = parent ? parent.childCount : 1;
		const score = calculateScore({
			node,
			pos: nodePos,
			depth,
			parent,
			index,
			isFirst: index === 0,
			isLast: index === siblingCount - 1,
			$pos,
			view
		}, rules, options.edgeDetection, coords);
		if (score < 0) return null;
		return {
			node,
			pos: nodePos,
			depth,
			score,
			dom: view.nodeDOM(nodePos)
		};
	}).filter((candidate) => candidate !== null);
	const nodeAfter = $pos.nodeAfter;
	if (nodeAfter && nodeAfter.isAtom && !nodeAfter.isInline) {
		const nodePos = posInfo.pos;
		const depth = $pos.depth + 1;
		const parent = $pos.parent;
		const index = $pos.index();
		const siblingCount = parent.childCount;
		let inAllowedContainer = true;
		if (options.allowedContainers) inAllowedContainer = hasAncestorOfType($pos, depth, options.allowedContainers);
		if (inAllowedContainer) {
			const score = calculateScore({
				node: nodeAfter,
				pos: nodePos,
				depth,
				parent,
				index,
				isFirst: index === 0,
				isLast: index === siblingCount - 1,
				$pos,
				view
			}, rules, options.edgeDetection, coords);
			if (score >= 0) {
				const dom = view.nodeDOM(nodePos);
				if (dom) candidates.push({
					node: nodeAfter,
					pos: nodePos,
					depth,
					score,
					dom
				});
			}
		}
	}
	if (candidates.length === 0) return null;
	candidates.sort((a, b) => {
		if (b.score !== a.score) return b.score - a.score;
		return b.depth - a.depth;
	});
	const winner = candidates[0];
	if (!winner.dom) return null;
	return {
		node: winner.node,
		pos: winner.pos,
		dom: winner.dom
	};
}
function findClosestTopLevelBlock(element, view) {
	var _a;
	let current = element;
	while ((current == null ? void 0 : current.parentElement) && current.parentElement !== view.dom) current = current.parentElement;
	if ((current == null ? void 0 : current.parentElement) !== view.dom) return;
	if (!((_a = current.pmViewDesc) == null ? void 0 : _a.node)) return;
	return current;
}
function isValidRect(rect) {
	return Number.isFinite(rect.top) && Number.isFinite(rect.bottom) && Number.isFinite(rect.left) && Number.isFinite(rect.right) && rect.width > 0 && rect.height > 0;
}
function edgeBlockRect(container, edge) {
	let current = edge === "first" ? container.firstElementChild : container.lastElementChild;
	while (current) {
		const rect = current.getBoundingClientRect();
		if (isValidRect(rect)) return rect;
		current = edge === "first" ? current.nextElementSibling : current.previousElementSibling;
	}
	return null;
}
function clampToContent(view, x, y, inset = 5) {
	if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
	const container = view.dom;
	const topRect = edgeBlockRect(container, "first");
	const botRect = edgeBlockRect(container, "last");
	if (!topRect || !botRect) return null;
	const clampedY = Math.min(Math.max(topRect.top + inset, y), botRect.bottom - inset);
	const epsilon = .5;
	const sameLeft = Math.abs(topRect.left - botRect.left) < epsilon;
	const sameRight = Math.abs(topRect.right - botRect.right) < epsilon;
	let rowRect = topRect;
	if (sameLeft && sameRight) rowRect = topRect;
	const clampedX = Math.min(Math.max(rowRect.left + inset, x), rowRect.right - inset);
	if (!Number.isFinite(clampedX) || !Number.isFinite(clampedY)) return null;
	return {
		x: clampedX,
		y: clampedY
	};
}
var findElementNextToCoords = (options) => {
	const { x, y, editor, nestedOptions } = options;
	const { view, state } = editor;
	const clamped = clampToContent(view, x, y, 5);
	if (!clamped) return {
		resultElement: null,
		resultNode: null,
		pos: null
	};
	const { x: clampedX, y: clampedY } = clamped;
	if (nestedOptions == null ? void 0 : nestedOptions.enabled) {
		const target = findBestDragTarget(view, {
			x: clampedX,
			y: clampedY
		}, nestedOptions);
		if (!target) return {
			resultElement: null,
			resultNode: null,
			pos: null
		};
		return {
			resultElement: target.dom,
			resultNode: target.node,
			pos: target.pos
		};
	}
	const elements = view.root.elementsFromPoint(clampedX, clampedY);
	let block;
	Array.prototype.some.call(elements, (el) => {
		if (!view.dom.contains(el)) return false;
		const candidate = findClosestTopLevelBlock(el, view);
		if (candidate) {
			block = candidate;
			return true;
		}
		return false;
	});
	if (!block) {
		const coords = view.posAtCoords({
			left: clampedX,
			top: clampedY
		});
		if (coords) {
			const $pos = state.doc.resolve(coords.pos);
			const depth = Math.min($pos.depth, 1);
			const blockPos = depth > 0 ? $pos.before(depth) : $pos.pos;
			const blockNode = state.doc.nodeAt(blockPos);
			if (blockNode) {
				const dom = view.nodeDOM(blockPos);
				return {
					resultElement: dom instanceof HTMLElement ? dom : null,
					resultNode: blockNode,
					pos: blockPos
				};
			}
		}
		return {
			resultElement: null,
			resultNode: null,
			pos: null
		};
	}
	let pos;
	try {
		pos = view.posAtDOM(block, 0);
	} catch {
		return {
			resultElement: null,
			resultNode: null,
			pos: null
		};
	}
	const node = state.doc.nodeAt(pos);
	if (!node) {
		const resolvedPos = state.doc.resolve(pos);
		const parent = resolvedPos.parent;
		return {
			resultElement: block,
			resultNode: parent,
			pos: resolvedPos.start()
		};
	}
	return {
		resultElement: block,
		resultNode: node,
		pos
	};
};
function getDraggedBlockElement(view, pos) {
	const nodeDom = view.nodeDOM(pos);
	if (nodeDom instanceof Element && nodeDom !== view.dom) return nodeDom;
	const { node, offset } = view.domAtPos(pos);
	const child = node.childNodes[offset];
	if (child instanceof Element) return child;
	if (node instanceof Element) return node;
	if (node.nodeType === Node.TEXT_NODE && node.parentElement) return node.parentElement;
	return null;
}
function getDraggedBlockDir(view, pos) {
	const draggedDom = getDraggedBlockElement(view, pos);
	return (draggedDom ? getComputedStyle(draggedDom).direction : getComputedStyle(view.dom).direction) || "ltr";
}
function removeNode(node) {
	var _a;
	(_a = node.parentNode) == null || _a.removeChild(node);
}
function getDragImageOffset(direction, wrapperWidth) {
	return direction === "rtl" ? wrapperWidth : 0;
}
function shouldResetMargin(dragImageProperties) {
	if (!dragImageProperties) return true;
	return !dragImageProperties.some((property) => {
		const p = property.trim().toLowerCase();
		return p === "margin" || p.startsWith("margin-");
	});
}
function getDragHandleRanges(event, editor, nestedOptions, dragContext) {
	const { doc } = editor.view.state;
	if ((nestedOptions == null ? void 0 : nestedOptions.enabled) && (dragContext == null ? void 0 : dragContext.node) && dragContext.pos >= 0) {
		const nodeStart = dragContext.pos;
		const nodeEnd = dragContext.pos + dragContext.node.nodeSize;
		return [{
			$from: doc.resolve(nodeStart),
			$to: doc.resolve(nodeEnd)
		}];
	}
	const result = findElementNextToCoords({
		editor,
		x: event.clientX,
		y: event.clientY,
		direction: "right",
		nestedOptions
	});
	if (!result.resultNode || result.pos === null) return [];
	const offset = result.resultNode.isText || result.resultNode.isAtom ? 0 : -1;
	return getSelectionRanges(doc.resolve(result.pos), doc.resolve(result.pos + result.resultNode.nodeSize + offset), 0, { extendOnBoundaryOverlap: false });
}
function dragHandler(event, editor, nestedOptions, dragContext, dragImageProperties) {
	const { view } = editor;
	if (!event.dataTransfer) return;
	const { empty, $from, $to } = view.state.selection;
	const dragHandleRanges = getDragHandleRanges(event, editor, nestedOptions, dragContext);
	const selectionRanges = getSelectionRanges($from, $to, 0, { extendOnBoundaryOverlap: false });
	const isDragHandleWithinSelection = selectionRanges.some((range) => {
		return dragHandleRanges.find((dragHandleRange) => {
			return dragHandleRange.$from === range.$from && dragHandleRange.$to === range.$to;
		});
	});
	const ranges = empty || !isDragHandleWithinSelection ? dragHandleRanges : selectionRanges;
	if (!ranges.length) return;
	const { tr } = view.state;
	const wrapper = document.createElement("div");
	const from = ranges[0].$from.pos;
	const to = ranges[ranges.length - 1].$to.pos;
	const direction = getDraggedBlockDir(view, from);
	wrapper.setAttribute("dir", direction);
	const isNestedDrag = (nestedOptions == null ? void 0 : nestedOptions.enabled) && (dragContext == null ? void 0 : dragContext.node);
	const isSingleBlock = ranges.length === 1;
	let slice;
	let selection;
	if (isNestedDrag && isSingleBlock) {
		slice = view.state.doc.slice(from, to);
		selection = NodeSelection.create(view.state.doc, from);
	} else {
		selection = NodeRangeSelection.create(view.state.doc, from, to);
		slice = selection.content();
	}
	const resetMargin = shouldResetMargin(dragImageProperties);
	ranges.forEach((range) => {
		const element = getDraggedBlockElement(view, range.$from.pos);
		if (!element) return;
		const clonedElement = cloneElement(element, dragImageProperties);
		if (resetMargin) clonedElement.style.margin = "0";
		wrapper.append(clonedElement);
	});
	wrapper.style.position = "absolute";
	wrapper.style.top = "-10000px";
	document.body.append(wrapper);
	event.dataTransfer.clearData();
	const dragImageX = getDragImageOffset(direction, wrapper.getBoundingClientRect().width);
	event.dataTransfer.setDragImage(wrapper, dragImageX, 0);
	let cleanedUp = false;
	const cleanupDragPreview = () => {
		if (cleanedUp) return;
		cleanedUp = true;
		removeNode(wrapper);
		document.removeEventListener("drop", cleanupDragPreview);
		document.removeEventListener("dragend", cleanupDragPreview);
	};
	const nodeSelection = selection instanceof NodeSelection ? selection : void 0;
	view.dragging = {
		slice,
		move: true,
		node: nodeSelection
	};
	tr.setSelection(selection);
	view.dispatch(tr);
	document.addEventListener("drop", cleanupDragPreview);
	document.addEventListener("dragend", cleanupDragPreview);
}
var getOuterNodePos = (doc, pos) => {
	const resolvedPos = doc.resolve(pos);
	const { depth } = resolvedPos;
	if (depth === 0) return pos;
	return resolvedPos.pos - resolvedPos.parentOffset - 1;
};
var getOuterNode = (doc, pos) => {
	const node = doc.nodeAt(pos);
	const resolvedPos = doc.resolve(pos);
	let { depth } = resolvedPos;
	let parent = node;
	while (depth > 0) {
		const currentNode = resolvedPos.node(depth);
		depth -= 1;
		if (depth === 0) parent = currentNode;
	}
	return parent;
};
function mapPendingRestoreAnchor(pendingRestore, tr, options) {
	if (!tr.docChanged) return pendingRestore;
	if (options.isChangeOrigin && pendingRestore.relativeAnchorPos != null) {
		const newPos = options.getAbsolutePos(pendingRestore.relativeAnchorPos);
		if (!Number.isFinite(newPos) || newPos <= 0) return null;
		return {
			...pendingRestore,
			anchorPos: newPos
		};
	}
	const mappedResult = tr.mapping.mapResult(pendingRestore.anchorPos, 1);
	if (mappedResult.deleted) return null;
	return {
		...pendingRestore,
		anchorPos: mappedResult.pos
	};
}
function sumNodeSizes(parent, from, to) {
	let size = 0;
	for (let i = from; i < to; i += 1) size += parent.child(i).nodeSize;
	return size;
}
function getActiveDragRange(selection) {
	var _a;
	if (!isNodeRangeSelection(selection)) return null;
	return {
		anchorPos: selection.from,
		nodeCount: selection.ranges.length,
		depth: (_a = selection.depth) != null ? _a : 0
	};
}
function getDroppedBlockRange(doc, anchorPos, nodeCount, depth) {
	const $pos = doc.resolve(anchorPos);
	const parent = $pos.node(depth);
	let index = $pos.index(depth);
	if (index >= parent.childCount) index = Math.max(0, parent.childCount - nodeCount);
	const count = Math.min(nodeCount, parent.childCount - index);
	if (count <= 0) return null;
	const blockStart = $pos.start(depth) + sumNodeSizes(parent, 0, index);
	return {
		anchor: blockStart,
		head: blockStart + sumNodeSizes(parent, index, index + count),
		count
	};
}
function createDroppedNodeRangeSelection(doc, anchorPos, nodeCount, depth) {
	try {
		const range = getDroppedBlockRange(doc, anchorPos, nodeCount, depth);
		if (!range) return null;
		const selection = NodeRangeSelection.create(doc, range.anchor, range.head, depth);
		return selection.ranges.length === nodeCount ? selection : null;
	} catch {
		return null;
	}
}
var getRelativePos = (state, absolutePos) => {
	const ystate = ySyncPluginKey.getState(state);
	if (!ystate) return null;
	return absolutePositionToRelativePosition(absolutePos, ystate.type, ystate.binding.mapping);
};
var getAbsolutePos = (state, relativePos) => {
	const ystate = ySyncPluginKey.getState(state);
	if (!ystate) return -1;
	return relativePositionToAbsolutePosition(ystate.doc, ystate.type, relativePos, ystate.binding.mapping) || 0;
};
var getOuterDomNode = (view, domNode) => {
	let tmpDomNode = domNode;
	while (tmpDomNode == null ? void 0 : tmpDomNode.parentNode) {
		if (tmpDomNode.parentNode === view.dom) break;
		tmpDomNode = tmpDomNode.parentNode;
	}
	return tmpDomNode;
};
var dragHandlePluginDefaultKey = new PluginKey("dragHandle");
var DragHandlePlugin = ({ pluginKey = dragHandlePluginDefaultKey, element, editor, computePositionConfig, getReferencedVirtualElement, onNodeChange, onElementDragStart, onElementDragEnd, nestedOptions, dragImageProperties }) => {
	const wrapper = document.createElement("div");
	let locked = false;
	let currentNode = null;
	let currentNodePos = -1;
	let currentNodeRelPos;
	let rafId = null;
	let pendingMouseCoords = null;
	let activeDragRange = null;
	let pendingRestore = null;
	function clearDragRangeState() {
		activeDragRange = null;
		pendingRestore = null;
	}
	function remapPendingRestore(tr, state) {
		if (!pendingRestore) return;
		pendingRestore = mapPendingRestoreAnchor(pendingRestore, tr, {
			isChangeOrigin: isChangeOrigin(tr),
			getAbsolutePos: (relativePos) => getAbsolutePos(state, relativePos)
		});
	}
	function buildRestoreTransaction(state) {
		if (!pendingRestore) return null;
		const nodeRangeSelection = createDroppedNodeRangeSelection(state.doc, pendingRestore.anchorPos, pendingRestore.nodeCount, pendingRestore.depth);
		if (!nodeRangeSelection) {
			pendingRestore = null;
			activeDragRange = null;
			return null;
		}
		clearDragRangeState();
		return state.tr.setSelection(nodeRangeSelection);
	}
	function hideHandle() {
		if (!element) return;
		element.style.visibility = "hidden";
		element.style.pointerEvents = "none";
	}
	function showHandle() {
		if (!element) return;
		if (!editor.isEditable) {
			hideHandle();
			return;
		}
		element.style.visibility = "";
		element.style.pointerEvents = "auto";
	}
	function repositionDragHandle(dom) {
		const virtualElement = (getReferencedVirtualElement == null ? void 0 : getReferencedVirtualElement()) || { getBoundingClientRect: () => dom.getBoundingClientRect() };
		computePosition(virtualElement, element, computePositionConfig).then((val) => {
			Object.assign(element.style, {
				position: val.strategy,
				left: `${val.x}px`,
				top: `${val.y}px`
			});
		});
	}
	function onDragStart(e) {
		onElementDragStart?.(e);
		dragHandler(e, editor, nestedOptions, {
			node: currentNode,
			pos: currentNodePos
		}, dragImageProperties);
		activeDragRange = getActiveDragRange(editor.state.selection);
		if (element) element.dataset.dragging = "true";
		setTimeout(() => {
			if (element) element.style.pointerEvents = "none";
		}, 0);
	}
	function onDragEnd(e) {
		onElementDragEnd?.(e);
		activeDragRange = null;
		hideHandle();
		if (element) {
			element.style.pointerEvents = "auto";
			element.dataset.dragging = "false";
		}
	}
	function onDrop(e) {
		if (!e.target || !editor.view.dom.contains(e.target)) return;
		if (isFirefox()) {
			const editorElement = editor.view.dom;
			requestAnimationFrame(() => {
				if (editorElement.isContentEditable) {
					editorElement.contentEditable = "false";
					editorElement.contentEditable = "true";
				}
			});
		}
		if (!activeDragRange || editor.view.state.selection.empty) return;
		const anchorPos = editor.state.selection.from;
		const relativeAnchorPos = getRelativePos(editor.state, anchorPos);
		pendingRestore = {
			...activeDragRange,
			anchorPos,
			relativeAnchorPos: relativeAnchorPos != null ? relativeAnchorPos : void 0
		};
		editor.view.dispatch(editor.state.tr.setMeta("addToHistory", false));
	}
	function cleanup() {
		element.removeEventListener("dragstart", onDragStart);
		element.removeEventListener("dragend", onDragEnd);
		document.removeEventListener("drop", onDrop);
		if (rafId) {
			cancelAnimationFrame(rafId);
			rafId = null;
			pendingMouseCoords = null;
		}
		clearDragRangeState();
	}
	wrapper.appendChild(element);
	return {
		unbind() {
			cleanup();
		},
		plugin: new Plugin({
			key: typeof pluginKey === "string" ? new PluginKey(pluginKey) : pluginKey,
			state: {
				init() {
					return { locked: false };
				},
				apply(tr, value, _oldState, state) {
					remapPendingRestore(tr, state);
					const isLocked = tr.getMeta("lockDragHandle");
					const hideDragHandle = tr.getMeta("hideDragHandle");
					if (isLocked !== void 0) locked = isLocked;
					if (hideDragHandle) {
						hideHandle();
						locked = false;
						currentNode = null;
						currentNodePos = -1;
						onNodeChange?.({
							editor,
							node: null,
							pos: -1
						});
						return value;
					}
					if (tr.docChanged && currentNodePos !== -1 && element) {
						if (isChangeOrigin(tr)) {
							const newPos = getAbsolutePos(state, currentNodeRelPos);
							if (newPos !== currentNodePos) currentNodePos = newPos;
						} else {
							const newPos = tr.mapping.map(currentNodePos);
							if (newPos !== currentNodePos) {
								currentNodePos = newPos;
								currentNodeRelPos = getRelativePos(state, currentNodePos);
							}
						}
					}
					return value;
				}
			},
			appendTransaction(_transactions, _oldState, newState) {
				return buildRestoreTransaction(newState);
			},
			view: (view) => {
				var _a;
				element.draggable = true;
				element.style.pointerEvents = "auto";
				element.dataset.dragging = "false";
				(_a = editor.view.dom.parentElement) == null || _a.appendChild(wrapper);
				wrapper.style.pointerEvents = "none";
				wrapper.style.position = "absolute";
				wrapper.style.top = "0";
				wrapper.style.left = "0";
				wrapper.style.zIndex = "10";
				element.addEventListener("dragstart", onDragStart);
				element.addEventListener("dragend", onDragEnd);
				document.addEventListener("drop", onDrop);
				return {
					update(_, oldState) {
						if (!element) return;
						if (!editor.isEditable) {
							hideHandle();
							return;
						}
						if (locked) element.draggable = false;
						else element.draggable = true;
						if (view.state.doc.eq(oldState.doc) || currentNodePos === -1) return;
						let domNode = view.nodeDOM(currentNodePos);
						domNode = getOuterDomNode(view, domNode);
						if (domNode === view.dom) return;
						if ((domNode == null ? void 0 : domNode.nodeType) !== 1) return;
						const domNodePos = view.posAtDOM(domNode, 0);
						const outerNode = getOuterNode(editor.state.doc, domNodePos);
						const outerNodePos = getOuterNodePos(editor.state.doc, domNodePos);
						currentNode = outerNode;
						currentNodePos = outerNodePos;
						currentNodeRelPos = getRelativePos(view.state, currentNodePos);
						onNodeChange?.({
							editor,
							node: currentNode,
							pos: currentNodePos
						});
						repositionDragHandle(domNode);
					},
					destroy() {
						cleanup();
						if (element) removeNode(wrapper);
					}
				};
			},
			props: { handleDOMEvents: {
				keydown(view) {
					if (!element || locked) return false;
					if (view.hasFocus()) {
						hideHandle();
						currentNode = null;
						currentNodePos = -1;
						onNodeChange?.({
							editor,
							node: null,
							pos: -1
						});
						return false;
					}
					return false;
				},
				mouseleave(_view, e) {
					if (locked) return false;
					if (e.target && !wrapper.contains(e.relatedTarget)) {
						hideHandle();
						currentNode = null;
						currentNodePos = -1;
						onNodeChange?.({
							editor,
							node: null,
							pos: -1
						});
					}
					return false;
				},
				mousemove(view, e) {
					if (!element || locked) return false;
					pendingMouseCoords = {
						x: e.clientX,
						y: e.clientY
					};
					if (rafId) return false;
					rafId = requestAnimationFrame(() => {
						rafId = null;
						if (!pendingMouseCoords) return;
						const { x, y } = pendingMouseCoords;
						pendingMouseCoords = null;
						const nodeData = findElementNextToCoords({
							x,
							y,
							direction: "right",
							editor,
							nestedOptions
						});
						if (!nodeData.resultElement) return;
						let domNode = nodeData.resultElement;
						let targetNode = nodeData.resultNode;
						let targetPos = nodeData.pos;
						if (!(nestedOptions == null ? void 0 : nestedOptions.enabled)) {
							domNode = getOuterDomNode(view, domNode);
							if (domNode === view.dom) return;
							if ((domNode == null ? void 0 : domNode.nodeType) !== 1) return;
							const domNodePos = view.posAtDOM(domNode, 0);
							targetNode = getOuterNode(editor.state.doc, domNodePos);
							targetPos = getOuterNodePos(editor.state.doc, domNodePos);
						}
						if (targetNode !== currentNode) {
							currentNode = targetNode;
							currentNodePos = targetPos != null ? targetPos : -1;
							currentNodeRelPos = getRelativePos(view.state, currentNodePos);
							onNodeChange?.({
								editor,
								node: currentNode,
								pos: currentNodePos
							});
							repositionDragHandle(domNode);
							showHandle();
						}
					});
					return false;
				}
			} }
		})
	};
};
function normalizeNestedOptions(input) {
	var _a, _b;
	if (input === false || input === void 0) return {
		enabled: false,
		rules: [],
		defaultRules: true,
		allowedContainers: void 0,
		edgeDetection: normalizeEdgeDetection("none")
	};
	if (input === true) return {
		enabled: true,
		rules: [],
		defaultRules: true,
		allowedContainers: void 0,
		edgeDetection: normalizeEdgeDetection("left")
	};
	return {
		enabled: true,
		rules: (_a = input.rules) != null ? _a : [],
		defaultRules: (_b = input.defaultRules) != null ? _b : true,
		allowedContainers: input.allowedContainers,
		edgeDetection: normalizeEdgeDetection(input.edgeDetection)
	};
}
var defaultComputePositionConfig = {
	placement: "left-start",
	strategy: "absolute"
};
Extension.create({
	name: "dragHandle",
	addOptions() {
		return {
			render() {
				const element = document.createElement("div");
				element.classList.add("drag-handle");
				return element;
			},
			computePositionConfig: {},
			locked: false,
			onNodeChange: () => {
				return null;
			},
			onElementDragStart: void 0,
			onElementDragEnd: void 0,
			nested: false,
			dragImageProperties: void 0
		};
	},
	addCommands() {
		return {
			lockDragHandle: () => ({ editor }) => {
				this.options.locked = true;
				return editor.commands.setMeta("lockDragHandle", this.options.locked);
			},
			unlockDragHandle: () => ({ editor }) => {
				this.options.locked = false;
				return editor.commands.setMeta("lockDragHandle", this.options.locked);
			},
			toggleDragHandle: () => ({ editor }) => {
				this.options.locked = !this.options.locked;
				return editor.commands.setMeta("lockDragHandle", this.options.locked);
			}
		};
	},
	addProseMirrorPlugins() {
		const element = this.options.render();
		const nestedOptions = normalizeNestedOptions(this.options.nested);
		return [DragHandlePlugin({
			computePositionConfig: {
				...defaultComputePositionConfig,
				...this.options.computePositionConfig
			},
			getReferencedVirtualElement: this.options.getReferencedVirtualElement,
			element,
			editor: this.editor,
			onNodeChange: this.options.onNodeChange,
			onElementDragStart: this.options.onElementDragStart,
			onElementDragEnd: this.options.onElementDragEnd,
			nestedOptions,
			dragImageProperties: this.options.dragImageProperties
		}).plugin];
	}
});
//#endregion
export { normalizeNestedOptions as i, defaultComputePositionConfig as n, dragHandlePluginDefaultKey as r, DragHandlePlugin as t };
