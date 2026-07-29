import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { readingTime } from "@/lib/format";
import { fetchCategories } from "@/lib/queries";
import { ArticleForm } from "./admin.articles.new";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/admin/articles/$id")({
  component: EditArticle,
});

function EditArticle() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const cats = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "scheduled" | "archived">("draft");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) toast.error(error.message);
        if (data) {
          setTitle(data.title);
          setSlug(data.slug);
          setExcerpt(data.excerpt ?? "");
          setContent(data.content ?? "");
          setFeaturedImage(data.featured_image ?? "");
          setCategoryId(data.category_id ?? "");
          setStatus(data.status);
          setIsFeatured(data.is_featured);
          setIsPinned(data.is_pinned);
        }
        setLoading(false);
      });
  }, [id]);

  const save = async (newStatus?: typeof status) => {
    const s = newStatus ?? status;
    const { error } = await supabase
      .from("articles")
      .update({
        title,
        slug,
        excerpt: excerpt || null,
        content,
        featured_image: featuredImage || null,
        category_id: categoryId || null,
        status: s,
        is_featured: isFeatured,
        is_pinned: isPinned,
        reading_time: readingTime(content),
        published_at:
          s === "published"
            ? new Date().toISOString()
            : s === "draft"
              ? null
              : undefined,
      })
      .eq("id", id);
    if (error) return toast.error(error.message);
    setStatus(s);
    toast.success("Saved");
  };

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-black">Edit article</h1>
        <div className="flex items-center gap-2">
          <Link
            to="/article/$slug"
            params={{ slug }}
            target="_blank"
            className="text-sm text-muted-foreground underline"
          >
            Preview
          </Link>
        </div>
      </div>

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

      <div className="mt-6 grid gap-4 border border-border bg-background p-6 md:grid-cols-2">
        <div className="flex items-center gap-3">
          <Switch id="feat" checked={isFeatured} onCheckedChange={setIsFeatured} />
          <Label htmlFor="feat">Featured (appears in Editor's Picks)</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="pin" checked={isPinned} onCheckedChange={setIsPinned} />
          <Label htmlFor="pin">Pinned to top of feed</Label>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => save()}>
          Save changes
        </Button>
        {status !== "published" ? (
          <Button
            onClick={() => save("published")}
            className="bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90"
          >
            Publish
          </Button>
        ) : (
          <Button variant="outline" onClick={() => save("draft")}>
            Unpublish
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => save("archived")}
          className="text-muted-foreground"
        >
          Archive
        </Button>
        <div className="ml-auto text-sm text-muted-foreground">
          Status: <span className="font-semibold uppercase">{status}</span>
        </div>
      </div>
    </div>
  );
}
