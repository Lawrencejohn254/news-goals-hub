import Image from "@tiptap/extension-image";
import { NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from "@tiptap/react";
import { useRef } from "react";

function ImageView({ node, updateAttributes, selected }: NodeViewProps) {
  const ref = useRef<HTMLImageElement | null>(null);
  const align = (node.attrs.align as string) || "center";
  const ratio = (node.attrs.ratio as string) || "auto";
  const cropStyle =
    ratio !== "auto"
      ? {
          aspectRatio: ratio.replace(":", " / "),
          objectFit: "cover" as const,
          objectPosition: `${node.attrs.posX ?? 50}% ${node.attrs.posY ?? 50}%`,
        }
      : {};

  const startReposition = (e: React.MouseEvent) => {
    if (ratio === "auto") return;
    e.preventDefault();
    e.stopPropagation();
    const img = ref.current;
    if (!img) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = Number(node.attrs.posX ?? 50);
    const startPosY = Number(node.attrs.posY ?? 50);
    const move = (ev: MouseEvent) => {
      const dx = ((ev.clientX - startX) / img.offsetWidth) * 100;
      const dy = ((ev.clientY - startY) / img.offsetHeight) * 100;
      updateAttributes({
        posX: Math.round(Math.min(100, Math.max(0, startPosX - dx))),
        posY: Math.round(Math.min(100, Math.max(0, startPosY - dy))),
      });
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

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
          style={{
            width: node.attrs.width ? `${node.attrs.width}px` : undefined,
            ...cropStyle,
          }}
          onMouseDown={startReposition}
          className={`max-w-full ${ratio !== "auto" ? "cursor-move" : ""} ${selected ? "outline outline-2 outline-[var(--brand)]" : ""}`}
          draggable={false}
        />
        {/* Align controls: dim by default so they don't clutter the article
            while writing, but never fully invisible — the old version relied
            on a `group-hover` class with no `group` ancestor to trigger it,
            so it only worked by accident via a fragile fallback selector. */}
        <div className="absolute left-1 top-1 flex flex-wrap gap-1 opacity-40 transition-opacity group-hover:opacity-100">
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
          <select
            value={ratio}
            onMouseDown={(e) => e.stopPropagation()}
            onChange={(e) => updateAttributes({ ratio: e.target.value, posX: 50, posY: 50 })}
            className="rounded bg-[var(--ink)]/80 px-1 py-0.5 text-[10px] text-white"
            title="Crop shape. Drag the photo to choose which part shows."
          >
            <option value="auto">Crop: none</option>
            <option value="16:9">16:9</option>
            <option value="4:3">4:3</option>
            <option value="1:1">Square</option>
            <option value="3:4">Portrait</option>
          </select>
          {[25, 50, 75, 100].map((p) => (
            <button
              key={p}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                const box = ref.current?.closest<HTMLElement>("[data-node-view-wrapper]");
                const full = box?.offsetWidth ?? 600;
                updateAttributes({ width: Math.round((full * p) / 100) });
              }}
              className="rounded bg-[var(--ink)]/80 px-2 py-0.5 text-[10px] text-white"
            >
              {p}%
            </button>
          ))}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              updateAttributes({ width: null, ratio: "auto", posX: 50, posY: 50 });
            }}
            className="rounded bg-[var(--ink)]/80 px-2 py-0.5 text-[10px] text-white"
          >
            Reset
          </button>
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
      ratio: {
        default: "auto",
        parseHTML: (el) => (el as HTMLElement).getAttribute("data-ratio") || "auto",
        renderHTML: (attrs) =>
          attrs.ratio && attrs.ratio !== "auto"
            ? {
                "data-ratio": attrs.ratio,
                style: `aspect-ratio:${String(attrs.ratio).replace(":", " / ")};object-fit:cover;object-position:${attrs.posX ?? 50}% ${attrs.posY ?? 50}%`,
              }
            : {},
      },
      posX: {
        default: 50,
        parseHTML: (el) => Number((el as HTMLElement).getAttribute("data-pos-x") ?? 50),
        renderHTML: (attrs) => ({ "data-pos-x": attrs.posX }),
      },
      posY: {
        default: 50,
        parseHTML: (el) => Number((el as HTMLElement).getAttribute("data-pos-y") ?? 50),
        renderHTML: (attrs) => ({ "data-pos-y": attrs.posY }),
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