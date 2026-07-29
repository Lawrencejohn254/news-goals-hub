import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { slugify, readingTime } from "@/lib/format";
import { RichTextEditor } from "@/components/site/RichTextEditor";
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
  categoryId: string;
  setCategoryId: (v: string) => void;
  categories: { id: string; name: string }[];
}) {
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
        <Input
          id="img"
          value={props.featuredImage}
          onChange={(e) => props.setFeaturedImage(e.target.value)}
          placeholder="https://…"
        />
        {props.featuredImage && (
          <img
            src={props.featuredImage}
            alt=""
            className="mt-2 max-h-40 rounded border border-border object-cover"
          />
        )}
      </div>
      <div>
        <Label>Content</Label>
        <RichTextEditor value={props.content} onChange={props.setContent} />
      </div>
    </div>
  );
}
