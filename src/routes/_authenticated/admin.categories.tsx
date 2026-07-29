import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { slugify } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/admin/categories")({
  component: CategoriesAdmin,
});

function CategoriesAdmin() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  const [name, setName] = useState("");
  const [color, setColor] = useState("#dc2626");

  const add = async () => {
    if (!name.trim()) return;
    const { error } = await supabase.from("categories").insert({
      name: name.trim(),
      slug: slugify(name),
      color,
      sort_order: (q.data?.length ?? 0) + 1,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Category added");
      setName("");
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
    }
  };

  const toggle = async (id: string, value: boolean) => {
    const { error } = await supabase
      .from("categories")
      .update({ is_enabled: value })
      .eq("id", id);
    if (error) toast.error(error.message);
    else qc.invalidateQueries({ queryKey: ["admin", "categories"] });
  };

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-black">Categories</h1>

      <div className="mb-6 grid gap-3 border border-border bg-background p-4 md:grid-cols-[1fr_auto_auto]">
        <div>
          <Label htmlFor="name">New category name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-16 p-1"
          />
        </div>
        <div className="flex items-end">
          <Button onClick={add} className="bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90">
            Add
          </Button>
        </div>
      </div>

      <div className="border border-border bg-background">
        {(q.data ?? []).map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between border-b border-border p-4 last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <span
                className="inline-block h-5 w-5 rounded"
                style={{ backgroundColor: c.color }}
              />
              <span className="font-semibold">{c.name}</span>
              <span className="text-xs text-muted-foreground">/{c.slug}</span>
              {!c.is_enabled && (
                <span className="rounded bg-muted px-2 py-0.5 text-xs">Disabled</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => toggle(c.id, !c.is_enabled)}>
                {c.is_enabled ? "Disable" : "Enable"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => remove(c.id)}
                className="text-destructive hover:text-destructive"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
