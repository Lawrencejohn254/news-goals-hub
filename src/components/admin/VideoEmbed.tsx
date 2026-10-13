import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from "@tiptap/react";

type Parsed =
  | { type: "youtube"; embedUrl: string }
  | { type: "vimeo"; embedUrl: string }
  | { type: "direct" }
  | { type: "unknown" };

function parseVideoUrl(url: string): Parsed {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (yt) return { type: "youtube", embedUrl: `https://www.youtube-nocookie.com/embed/${yt[1]}` };

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { type: "vimeo", embedUrl: `https://player.vimeo.com/video/${vimeo[1]}` };

  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)) return { type: "direct" };

  return { type: "unknown" };
}

function VideoView({ node, updateAttributes }: NodeViewProps) {
  const src = node.attrs.src as string;
  const parsed = parseVideoUrl(src);

  return (
    <NodeViewWrapper
      className="group relative mx-auto my-6"
      style={{ maxWidth: `${node.attrs.width ?? 100}%` }}
      data-drag-handle
    >
      <div className="absolute left-1 top-1 z-10 flex gap-1 opacity-40 transition-opacity group-hover:opacity-100">
        {[50, 75, 100].map((p) => (
          <button
            key={p}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              updateAttributes({ width: p });
            }}
            className={`rounded bg-[var(--ink)]/80 px-2 py-0.5 text-[10px] text-white ${(node.attrs.width ?? 100) === p ? "bg-[var(--brand)]" : ""}`}
          >
            {p}%
          </button>
        ))}
      </div>
      {parsed.type === "youtube" || parsed.type === "vimeo" ? (
        <div className="video-embed-frame">
          <iframe
            src={parsed.embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded video"
          />
        </div>
      ) : parsed.type === "direct" ? (
        <video src={src} controls className="w-full rounded" />
      ) : (
        <div className="border border-dashed border-border p-4 text-sm text-muted-foreground">
          Unsupported video link:{" "}
          <a href={src} target="_blank" rel="noopener noreferrer" className="underline">
            {src}
          </a>
        </div>
      )}
    </NodeViewWrapper>
  );
}

// Renders to plain HTML with a data-src attribute so the exact same markup
// works both live in the editor (via the React node view above) and on the
// published page (via dangerouslySetInnerHTML, which can't run React) — see
// the matching .video-embed-frame CSS in styles.css for the published side.
export const VideoEmbed = Node.create({
  name: "videoEmbed",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      width: { default: 100 },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-video-embed]",
        getAttrs: (el) => ({
          src: (el as HTMLElement).getAttribute("data-src"),
          width: Number((el as HTMLElement).getAttribute("data-width")) || 100,
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const src = (HTMLAttributes.src as string) ?? "";
    const parsed = parseVideoUrl(src);
    const width = Number(HTMLAttributes.width) || 100;
    const wrapperAttrs = mergeAttributes({
      "data-video-embed": "",
      "data-src": src,
      "data-width": String(width),
      style: `max-width:${width}%;margin-left:auto;margin-right:auto`,
    });

    if (parsed.type === "youtube" || parsed.type === "vimeo") {
      return [
        "div",
        wrapperAttrs,
        [
          "div",
          { class: "video-embed-frame" },
          ["iframe", { src: parsed.embedUrl, allowfullscreen: "true", frameborder: "0", title: "Embedded video" }],
        ],
      ];
    }
    if (parsed.type === "direct") {
      return ["div", wrapperAttrs, ["video", { src, controls: "true" }]];
    }
    return ["div", wrapperAttrs, ["p", {}, `Video: ${src}`]];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoView);
  },
});