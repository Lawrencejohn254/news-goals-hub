import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { slugify, readingTime } from "@/lib/format";
import { RichTextEditor } from "@/components/site/RichTextEditor";
import { resolveImageUrl } from "@/lib/image-url";
import { uploadMedia, mediaUrl } from "@/lib/site";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/admin/articles/new")({
  component: NewArticle,
});

function NewArticle() {
  const navigate = useNavigate();
  const cats = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [imageCredit, setImageCredit] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async (status: "draft" | "published") => {
    if (!title.trim()) return toast.error("Title required");
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return toast.error("Not signed in");
    setSaving(true);
    const finalSlug = slug.trim() || slugify(title);
    const { data, error } = await supabase
      .from("articles")
      .insert({
        title: title.trim(),
        slug: finalSlug,
        excerpt: excerpt.trim() || null,
        content,
        featured_image: featuredImage.trim() || null,
        image_credit: imageCredit.trim() || null,
        category_id: categoryId || null,
        author_id: userData.user.id,
        status,
        published_at: status === "published" ? new Date().toISOString() : null,
        reading_time: readingTime(content),
      })
      .select("id")
      .single();
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(status === "published" ? "Published!" : "Draft saved");
    navigate({ to: "/admin/articles/$id", params: { id: data.id } });
  };

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-black">New article</h1>
      <ArticleForm
        {...{
          title,
          setTitle,
          slug,
          setSlug,
          excerpt,
          setExcerpt,
          content,
          setContent,
          featuredImage,
          setFeaturedImage,
          imageCredit,
          setImageCredit,
          categoryId,
          setCategoryId,
          categories: cats.data ?? [],
        }}
      />
      <div className="mt-6 flex gap-3">
        <Button variant="outline" onClick={() => save("draft")} disabled={saving}>
          Save draft
        </Button>
        <Button
          onClick={() => save("published")}
          disabled={saving}
          className="bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90"
        >
          Publish
        </Button>
      </div>
    </div>
  );
}

export function ArticleForm(props: {
  title: string;
  setTitle: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  excerpt: string;
  setExcerpt: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  featuredImage: string;
  setFeaturedImage: (v: string) => void;
  imageCredit: string;
  setImageCredit: (v: string) => void;
  categoryId: string;
  setCategoryId: (v: string) => void;
  categories: { id: string; name: string }[];
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const uploadFeatured = async (file: File) => {
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (file.size > 8 * 1024 * 1024) return toast.error("Image is over 8 MB — please use a smaller one");
    setUploading(true);
    try {
      const item = await uploadMedia(file);
      props.setFeaturedImage(mediaUrl(item.path));
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4 border border-border bg-background p-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={props.title}
          onChange={(e) => {
            props.setTitle(e.target.value);
            if (!props.slug) props.setSlug(slugify(e.target.value));
          }}
          className="text-xl font-semibold"
          placeholder="Headline"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={props.slug}
            onChange={(e) => props.setSlug(slugify(e.target.value))}
            placeholder="url-slug"
          />
        </div>
        <div>
          <Label htmlFor="cat">Category</Label>
          <select
            id="cat"
            value={props.categoryId}
            onChange={(e) => props.setCategoryId(e.target.value)}
            className="h-10 w-full border border-input bg-background px-3 text-sm"
          >
            <option value="">Uncategorized</option>
            {props.categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={props.excerpt}
          onChange={(e) => props.setExcerpt(e.target.value)}
          rows={2}
          placeholder="Short summary shown in feed cards"
        />
      </div>
      <div>
        <Label htmlFor="img">Featured image URL</Label>
        <div className="flex gap-2">
          <Input
            id="img"
            value={props.featuredImage}
            onChange={(e) => props.setFeaturedImage(e.target.value)}
            onBlur={(e) => props.setFeaturedImage(resolveImageUrl(e.target.value))}
            placeholder="https://… or upload a file →"
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void uploadFeatured(f);
            }}
          />
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="shrink-0"
          >
            {uploading ? "Uploading…" : "Upload image"}
          </Button>
        </div>
        {props.featuredImage && (
          <img
            src={props.featuredImage}
            alt=""
            className="mt-2 max-h-40 rounded border border-border object-cover"
          />
        )}
      </div>
      <div>
        <Label htmlFor="credit">Image credit</Label>
        <Input
          id="credit"
          value={props.imageCredit}
          onChange={(e) => props.setImageCredit(e.target.value)}
          placeholder="e.g. Photo: KNA, or Image: Courtesy of State House"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Shown under the main image. Credit the owner of the photo, or write "The Africa Daily Dispatch" if it is yours.
        </p>
      </div>
      <div>
        <Label>Content</Label>
        <RichTextEditor value={props.content} onChange={props.setContent} />
      </div>
    </div>
  );
}