/**
 * Hands out stories without ever handing out the same one twice: every slot on
 * a page takes from one picker, so a story used in one slot can't show up in
 * another. Fill slots in priority order (top of the page first).
 *
 * `take` returns up to `n` unused stories from `pool`; with `preferImage`, ones
 * that have a picture come first.
 */
export function createPicker() {
  const used = new Set<string>();
  return function take<T extends { id: string; featured_image: string | null }>(
    pool: T[],
    n: number,
    preferImage = false,
  ): T[] {
    const out: T[] = [];
    const grab = (accept: (a: T) => boolean) => {
      for (const a of pool) {
        if (out.length >= n) return;
        if (used.has(a.id) || !accept(a)) continue;
        used.add(a.id);
        out.push(a);
      }
    };
    if (preferImage) grab((a) => !!a.featured_image);
    grab(() => true);
    return out;
  };
}
