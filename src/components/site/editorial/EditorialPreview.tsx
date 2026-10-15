import { CategorySection } from "./CategorySection";
import { DUMMY_MANY as m, DUMMY_STORIES as s } from "./dummy";
import { TopSection } from "./TopSection";

/**
 * Temporary showcase of the editorial layouts with dummy data, for visual
 * review during the build. Not mounted anywhere yet; removed once the real
 * homepage is wired up.
 */
export function EditorialPreview() {
  const rule = <hr className="my-10 border-[var(--ed-line)]" />;
  return (
    <div className="editorial">
      <div className="container-page py-8">
        <TopSection
          hero={s[0]}
          heroThumbs={[m[0], m[1], m[2]]}
          blocks={[
            { type: "lead", story: m[3] },
            { type: "pair", stories: [m[4], m[5]], variant: "headline" },
            { type: "pair", stories: [m[6], m[7]], variant: "thumb" },
            { type: "text", story: m[8] },
            { type: "lead", story: m[9] },
            { type: "media", story: m[10] },
          ]}
          video={s[2]}
          live={[m[11], m[12], m[13]]}
          latest={[m[14], m[15], m[0], m[1]]}
          brandBook={[s[5], { ...s[5], id: "dummy-6b", sponsor_name: "Example Fund" }]}
        />

        {rule}
        <CategorySection
          category={{ name: "Africa", slug: "africa" }}
          stories={m.slice(0, 5)}
          layout="africa"
        />

        {rule}
        <CategorySection
          category={{ name: "Politics", slug: "politics" }}
          stories={m.slice(0, 9)}
          layout="politics"
        />

        {rule}
        <CategorySection
          category={{ name: "Counties", slug: "counties" }}
          stories={m}
          layout="counties"
          subLinks={[
            { label: "Nairobi Metro", slug: "nairobi" },
            { label: "Coast", slug: "coast" },
            { label: "Mountain", slug: "mountain" },
            { label: "Rift Valley", slug: "rift-valley" },
          ]}
        />

        {rule}
        <CategorySection
          category={{ name: "Opinion", slug: "opinion" }}
          stories={m.slice(0, 5)}
          layout="opinion"
          subLinks={[
            { label: "Editorials", slug: "editorials" },
            { label: "Columnists", slug: "columnists" },
          ]}
        />

        {rule}
        <CategorySection
          category={{ name: "Sport", slug: "sport" }}
          stories={m.slice(0, 4)}
          layout="standard"
        />
      </div>
    </div>
  );
}
