import Image from "@tiptap/extension-image";
import { NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from "@tiptap/react";
import { useRef } from "react";

function ImageView({ node, updateAttributes, selected }: NodeViewProps) {
  const ref = useRef<HTMLImageElement | null>(null);
  const align = (node.attrs.align as string) || "center";

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const img = ref.current;
    if (!img) return;
    const startX = e.clientX;
    const startWidth = img.offsetWidth;
    const move = (ev: MouseEvent) => {
      const next = Math.max(80, startWidth + (ev.clientX - startX));
      updateAttributes({ width: Math.round(next) });
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const justify =
    align === "left" ? "justify-start" : align === "right" ? "justify-end" : "justify-center";

  return (
    <NodeViewWrapper className={`group my-4 flex ${justify}`} data-drag-handle>
      <div className="relative inline-block">
        <img
          ref={ref}
          src={node.attrs.src}
          alt={node.attrs.alt ?? ""}
          title={node.attrs.title ?? undefined}
          style={{ width: node.attrs.width ? `${node.attrs.width}px` : undefined }}
          className={`max-w-full ${selected ? "outline outline-2 outline-[var(--brand)]" : ""}`}
          draggable={false}
        />
        {/* Align controls: dim by default so they don't clutter the article
            while writing, but never fully invisible — the old version relied
            on a `group-hover` class with no `group` ancestor to trigger it,
            so it only worked by accident via a fragile fallback selector. */}
        <div className="absolute left-1 top-1 flex gap-1 opacity-40 transition-opacity group-hover:opacity-100">
          {(["left", "center", "right"] as const).map((a) => (
            <button
              key={a}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                updateAttributes({ align: a });
              }}
              className={`rounded bg-[var(--ink)]/80 px-2 py-0.5 text-[10px] uppercase text-white ${align === a ? "bg-[var(--brand)]" : ""}`}
            >
              {a}
            </button>
          ))}
        </div>
        {/* Resize handle: bigger and always at least partly visible, so it's
            actually discoverable instead of a hidden secret in the corner. */}
        <span
          onMouseDown={startResize}
          className="absolute -bottom-1.5 -right-1.5 h-5 w-5 cursor-nwse-resize rounded-sm border-2 border-background bg-[var(--brand)] opacity-60 transition-opacity group-hover:opacity-100"
          title="Drag to resize"
        />
      </div>
    </NodeViewWrapper>
  );
}

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (el) => {
          const w = (el as HTMLElement).getAttribute("width");
          return w ? parseInt(w, 10) : null;
        },
        renderHTML: (attrs) =>
          attrs.width ? { width: attrs.width, style: `width:${attrs.width}px` } : {},
      },
      align: {
        default: "center",
        parseHTML: (el) => (el as HTMLElement).getAttribute("data-align") || "center",
        renderHTML: (attrs) => ({ "data-align": attrs.align }),
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },
});