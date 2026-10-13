import { EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { DragHandle } from "@tiptap/extension-drag-handle-react";
import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  GripVertical,
  Minus,
  Video,
  Upload,
  Table as TableIcon,
} from "lucide-react";
import { ResizableImage } from "@/components/admin/ResizableImage";
import { resolveImageUrl } from "@/lib/image-url";
import { VideoEmbed } from "@/components/admin/VideoEmbed";
import { uploadMedia, mediaUrl } from "@/lib/site";
import type { EditorView } from "@tiptap/pm/view";
import { TableKit } from "@tiptap/extension-table";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

// A short, curated list rather than every system font — matches the "not
// all of them, like Word" ask. "Default" clears the override and falls
// back to the article's normal serif body font.
const FONT_FAMILIES = [
  { label: "Default", value: "" },
  { label: "Serif (Georgia)", value: "Georgia, serif" },
  { label: "Serif (Times)", value: "'Times New Roman', serif" },
  { label: "Sans (Arial)", value: "Arial, sans-serif" },
  { label: "Sans (Verdana)", value: "Verdana, sans-serif" },
  { label: "Monospace", value: "'Courier New', monospace" },
];

// Uploads dropped or pasted image and video files to the media library,
// then inserts them at the drop position.
async function uploadAndInsert(view: EditorView, files: File[], startPos: number) {
  let pos = startPos;
  for (const file of files) {
    const isVideo = file.type.startsWith("video/");
    if (isVideo && file.size > 50 * 1024 * 1024) {
      alert(`${file.name} is over 50 MB. Upload it to YouTube and paste the link instead.`);
      continue;
    }
    try {
      const item = await uploadMedia(file);
      const type = isVideo ? view.state.schema.nodes.videoEmbed : view.state.schema.nodes.image;
      if (!type) continue;
      const node = type.create({ src: mediaUrl(item.path) });
      const at = Math.min(pos, view.state.doc.content.size);
      view.dispatch(view.state.tr.insert(at, node));
      pos = at + node.nodeSize;
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    }
  }
}

const isMediaFile = (f: File) => f.type.startsWith("image/") || f.type.startsWith("video/");

// Keeps pasted colors, but drops solid black text and white backgrounds
// (Word and web pages add these everywhere, and they fight dark mode).
function cleanPastedHtml(html: string) {
  return html
    .replace(
      /(^|[;"'\s])color:\s*(#000000|#000|black|windowtext|rgb\(\s*0\s*,\s*0\s*,\s*0\s*\))\s*;?/gi,
      "$1",
    )
    .replace(
      /background(-color)?:\s*(#ffffff|#fff|white|window|transparent|rgb\(\s*255\s*,\s*255\s*,\s*255\s*\))\s*;?/gi,
      "",
    );
}

// Cycled through by the A− / A+ buttons rather than a free-form input —
// simpler UI, and keeps sizes consistent across an article.
const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 40];
const DEFAULT_SIZE = 16;

export function RichTextEditor({ value, onChange, placeholder = "Start writing…" }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      ResizableImage.configure({ inline: false }),
      VideoEmbed,
      TableKit.configure({ table: { resizable: true } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyleKit.configure({
        // Only turning on what was actually asked for — TextStyleKit also
        // bundles color/backgroundColor/lineHeight, left off here to keep
        // the toolbar lean.
        fontFamily: { types: ["textStyle"] },
        fontSize: { types: ["textStyle"] },
        lineHeight: false,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "tiptap article-prose",
        "data-placeholder": placeholder,
      },
      transformPastedHTML(html) {
        return cleanPastedHtml(html);
      },
      handleDrop(view, event) {
        const files = Array.from(event.dataTransfer?.files ?? []).filter(isMediaFile);
        if (!files.length) return false;
        event.preventDefault();
        const pos =
          view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos ??
          view.state.selection.from;
        void uploadAndInsert(view, files, pos);
        return true;
      },
      handlePaste(view, event) {
        // Copies from Word, Excel and web pages include a picture of the
        // selection next to the real text. Let formatted text paste normally.
        if (event.clipboardData?.types.includes("text/html")) return false;
        const files = Array.from(event.clipboardData?.files ?? []).filter(isMediaFile);
        if (!files.length) return false;
        event.preventDefault();
        void uploadAndInsert(view, files, view.state.selection.from);
        return true;
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor)
    return <div className="border border-border p-4 text-muted-foreground">Loading editor…</div>;

  const btn = "p-2 hover:bg-muted rounded";
  const active = "bg-[var(--ink)] text-white hover:bg-[var(--ink)]";

  const currentSizePx = parseInt(editor.getAttributes("textStyle").fontSize ?? "", 10) || DEFAULT_SIZE;
  const nearestIndex = FONT_SIZES.reduce(
    (best, size, i) => (Math.abs(size - currentSizePx) < Math.abs(FONT_SIZES[best] - currentSizePx) ? i : best),
    0,
  );

  const bumpFontSize = (dir: 1 | -1) => {
    const nextIndex = Math.min(FONT_SIZES.length - 1, Math.max(0, nearestIndex + dir));
    editor.chain().focus().setFontSize(`${FONT_SIZES[nextIndex]}px`).run();
  };

  const tableActions: [string, () => void][] = [
    ["Row above", () => editor.chain().focus().addRowBefore().run()],
    ["Row below", () => editor.chain().focus().addRowAfter().run()],
    ["Column left", () => editor.chain().focus().addColumnBefore().run()],
    ["Column right", () => editor.chain().focus().addColumnAfter().run()],
    ["Delete row", () => editor.chain().focus().deleteRow().run()],
    ["Delete column", () => editor.chain().focus().deleteColumn().run()],
    ["Header row on/off", () => editor.chain().focus().toggleHeaderRow().run()],
    ["Merge cells", () => editor.chain().focus().mergeCells().run()],
    ["Split cell", () => editor.chain().focus().splitCell().run()],
    ["Delete table", () => editor.chain().focus().deleteTable().run()],
  ];

  const promptForLink = () => {
    const url = prompt("Link URL");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="relative border border-border bg-background">
      <div className="sticky top-0 z-30 bg-background shadow-sm">
      <div className="flex flex-wrap items-center gap-1 border-b border-border p-2">
        {/* Font family */}
        <select
          value={editor.getAttributes("textStyle").fontFamily ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            if (v) editor.chain().focus().setFontFamily(v).run();
            else editor.chain().focus().unsetFontFamily().run();
          }}
          className="rounded border border-border bg-background px-1.5 py-1 text-xs"
          title="Font family"
        >
          {FONT_FAMILIES.map((f) => (
            <option key={f.label} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        {/* Font size */}
        <div className="flex items-center gap-0.5 rounded border border-border px-1">
          <button
            type="button"
            onClick={() => bumpFontSize(-1)}
            className="px-1.5 py-1 text-xs font-bold hover:bg-muted"
            title="Decrease font size"
          >
            A−
          </button>
          <span className="w-7 text-center text-[10px] text-muted-foreground">
            {FONT_SIZES[nearestIndex]}
          </span>
          <button
            type="button"
            onClick={() => bumpFontSize(1)}
            className="px-1.5 py-1 text-xs font-bold hover:bg-muted"
            title="Increase font size"
          >
            A+
          </button>
        </div>

        <span className="mx-1 h-5 w-px bg-border" />
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`${btn} ${editor.isActive("bold") ? active : ""}`}><Bold size={16}/></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`${btn} ${editor.isActive("italic") ? active : ""}`}><Italic size={16}/></button>
        <span className="mx-1 h-5 w-px bg-border" />
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${btn} ${editor.isActive("heading", { level: 2 }) ? active : ""}`}><Heading2 size={16}/></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`${btn} ${editor.isActive("heading", { level: 3 }) ? active : ""}`}><Heading3 size={16}/></button>
        <span className="mx-1 h-5 w-px bg-border" />
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()} className={`${btn} ${editor.isActive({ textAlign: "left" }) ? active : ""}`}><AlignLeft size={16}/></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()} className={`${btn} ${editor.isActive({ textAlign: "center" }) ? active : ""}`}><AlignCenter size={16}/></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()} className={`${btn} ${editor.isActive({ textAlign: "right" }) ? active : ""}`}><AlignRight size={16}/></button>
        <span className="mx-1 h-5 w-px bg-border" />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${btn} ${editor.isActive("bulletList") ? active : ""}`}><List size={16}/></button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${btn} ${editor.isActive("orderedList") ? active : ""}`}><ListOrdered size={16}/></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`${btn} ${editor.isActive("blockquote") ? active : ""}`}><Quote size={16}/></button>
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btn}><Minus size={16}/></button>
        <span className="mx-1 h-5 w-px bg-border" />
        <button type="button" onClick={promptForLink} className={btn}>
          <LinkIcon size={16} />
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt("Image URL (also accepts Google Drive share links)");
            if (url) editor.chain().focus().setImage({ src: resolveImageUrl(url) }).run();
          }}
          className={btn}
        >
          <ImageIcon size={16} />
        </button>
        <button
          type="button"
          title="Embed a video link (YouTube, Vimeo or .mp4)"
          onClick={() => {
            const url = prompt("Video link (YouTube, Vimeo, or a direct .mp4 link)");
            if (url?.trim()) {
              editor
                .chain()
                .focus()
                .insertContent({ type: "videoEmbed", attrs: { src: url.trim() } })
                .run();
            }
          }}
          className={btn}
        >
          <Video size={16} />
        </button>
        <button
          type="button"
          title="Upload a video file (MP4 or WebM, up to 50 MB)"
          disabled={uploadingVideo}
          onClick={() => fileRef.current?.click()}
          className={btn}
        >
          <Upload size={16} />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="video/mp4,video/webm"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            if (file.size > 50 * 1024 * 1024) {
              alert("That video is over 50 MB. Upload it to YouTube and paste the link instead.");
              return;
            }
            setUploadingVideo(true);
            try {
              const item = await uploadMedia(file);
              editor
                .chain()
                .focus()
                .insertContent({ type: "videoEmbed", attrs: { src: mediaUrl(item.path) } })
                .run();
            } catch (err) {
              alert(err instanceof Error ? err.message : "Upload failed");
            } finally {
              setUploadingVideo(false);
            }
          }}
        />
        <button
          type="button"
          title="Insert a table"
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
          className={btn}
        >
          <TableIcon size={16} />
        </button>
        <span className="mx-1 h-5 w-px bg-border" />
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btn}><Undo size={16}/></button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btn}><Redo size={16}/></button>
        <span className="ml-auto hidden text-[11px] text-muted-foreground sm:block">
          Drag the handle to move blocks · hover an image to align/resize it
        </span>
      </div>

      {editor.isActive("table") && (
        <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 p-2 text-xs">
          <span className="mr-1 font-semibold">Table:</span>
          {tableActions.map(([label, run]) => (
            <button
              key={label}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                run();
              }}
              className="rounded border border-border bg-background px-2 py-1 hover:bg-muted"
            >
              {label}
            </button>
          ))}
        </div>
      )}

      </div>

      <DragHandle editor={editor}>
        <div className="flex cursor-grab items-center rounded bg-muted p-1 text-muted-foreground hover:bg-[var(--brand)] hover:text-white active:cursor-grabbing">
          <GripVertical size={14} />
        </div>
      </DragHandle>

      {/* Floating toolbar that appears when text is selected — the
          Word-style "highlight to format" popup. */}
      <BubbleMenu editor={editor}>
        <div className="flex items-center gap-0.5 rounded border border-border bg-background p-1 shadow-lg">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${btn} ${editor.isActive("bold") ? active : ""}`}
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${btn} ${editor.isActive("italic") ? active : ""}`}
          >
            <Italic size={14} />
          </button>
          <button
            type="button"
            onClick={promptForLink}
            className={`${btn} ${editor.isActive("link") ? active : ""}`}
          >
            <LinkIcon size={14} />
          </button>
        </div>
      </BubbleMenu>

      <EditorContent editor={editor} />
    </div>
  );
}