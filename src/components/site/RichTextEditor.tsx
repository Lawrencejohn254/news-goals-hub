import { EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { DragHandle } from "@tiptap/extension-drag-handle-react";
import { useEffect } from "react";
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
} from "lucide-react";
import { ResizableImage } from "@/components/admin/ResizableImage";

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

// Cycled through by the A− / A+ buttons rather than a free-form input —
// simpler UI, and keeps sizes consistent across an article.
const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 40];
const DEFAULT_SIZE = 16;

export function RichTextEditor({ value, onChange, placeholder = "Start writing…" }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ResizableImage.configure({ inline: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyleKit.configure({
        // Only turning on what was actually asked for — TextStyleKit also
        // bundles color/backgroundColor/lineHeight, left off here to keep
        // the toolbar lean.
        fontFamily: { types: ["textStyle"] },
        fontSize: { types: ["textStyle"] },
        color: false,
        backgroundColor: false,
        lineHeight: false,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "tiptap article-prose",
        "data-placeholder": placeholder,
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
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

  const promptForLink = () => {
    const url = prompt("Link URL");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="relative border border-border bg-background">
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
            const url = prompt("Image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
          className={btn}
        >
          <ImageIcon size={16} />
        </button>
        <span className="mx-1 h-5 w-px bg-border" />
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btn}><Undo size={16}/></button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btn}><Redo size={16}/></button>
        <span className="ml-auto hidden text-[11px] text-muted-foreground sm:block">
          Drag the handle to move blocks · hover an image to align/resize it
        </span>
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