import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";
import { Bold, Italic, List, ListOrdered, Quote, Heading2, Heading3, Link as LinkIcon, Image as ImageIcon, Undo, Redo } from "lucide-react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder = "Start writing…" }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener" } }),
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

  if (!editor) return <div className="border border-border p-4 text-muted-foreground">Loading editor…</div>;

  const btn = "p-2 hover:bg-muted rounded";
  const active = "bg-[var(--ink)] text-white hover:bg-[var(--ink)]";

  return (
    <div className="border border-border bg-background">
      <div className="flex flex-wrap items-center gap-1 border-b border-border p-2">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`${btn} ${editor.isActive("bold") ? active : ""}`}><Bold size={16}/></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`${btn} ${editor.isActive("italic") ? active : ""}`}><Italic size={16}/></button>
        <span className="mx-1 h-5 w-px bg-border" />
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${btn} ${editor.isActive("heading", { level: 2 }) ? active : ""}`}><Heading2 size={16}/></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`${btn} ${editor.isActive("heading", { level: 3 }) ? active : ""}`}><Heading3 size={16}/></button>
        <span className="mx-1 h-5 w-px bg-border" />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${btn} ${editor.isActive("bulletList") ? active : ""}`}><List size={16}/></button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${btn} ${editor.isActive("orderedList") ? active : ""}`}><ListOrdered size={16}/></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`${btn} ${editor.isActive("blockquote") ? active : ""}`}><Quote size={16}/></button>
        <span className="mx-1 h-5 w-px bg-border" />
        <button
          type="button"
          onClick={() => {
            const url = prompt("Link URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          className={btn}
        >
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
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
