import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from "@tiptap/react";

type Parsed =
  | { type: "youtube"; embedUrl: string }
  | { type: "vimeo"; embedUrl: string }
  | { type: "direct" }
  | { type: "unknown" };

function parseVideoUrl(url: string): Parsed {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (yt) return { type: "youtube", embedUrl: `https://www.youtube.com/embed/${yt[1]}` };

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { type: "vimeo", embedUrl: `https://player.vimeo.com/video/${vimeo[1]}` };

  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)) return { type: "direct" };

  return { type: "unknown" };
}

function VideoView({ node }: NodeViewProps) {
  const src = node.attrs.src as string;
  const parsed = parseVideoUrl(src);

  return (
    <NodeViewWrapper className="my-6" data-drag-handle>
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
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-video-embed]",
        getAttrs: (el) => ({ src: (el as HTMLElement).getAttribute("data-src") }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const src = (HTMLAttributes.src as string) ?? "";
    const parsed = parseVideoUrl(src);
    const wrapperAttrs = mergeAttributes({ "data-video-embed": "", "data-src": src });

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