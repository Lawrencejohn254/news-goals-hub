import { Facebook, Instagram, MessageCircle } from "lucide-react";

// lucide-react has no dedicated X/Twitter icon (it was renamed/removed
// upstream after the Twitter->X rebrand); a small inline mark keeps the
// bundle from needing a second icon package for just one glyph.
function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.24 2H21l-6.5 7.43L22 22h-6.34l-4.96-6.49L4.98 22H2.2l6.96-7.95L2 2h6.5l4.48 5.93L18.24 2Zm-1.11 18h1.86L7.02 3.9H5.02L17.13 20Z" />
    </svg>
  );
}

/** "Share this article" — opens each platform's real share intent with the
 *  specific article's URL/title, works with no login or app SDK needed. */
export function ShareRow({ url, title }: { url: string; title: string }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const links = [
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <Facebook size={16} />,
    },
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <XIcon size={16} />,
    },
    {
      label: "Share on WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: <MessageCircle size={16} />,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Share
      </span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={l.label}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground hover:border-[var(--brand)] hover:text-[var(--brand)]"
        >
          {l.icon}
        </a>
      ))}
    </div>
  );
}

/** "Follow us" — the publication's own social accounts, sourced from
 *  site_settings (managed in Admin → Settings). Only renders icons for
 *  accounts that are actually filled in. */
export function FollowRow({
  facebookUrl,
  instagramUrl,
  twitterUrl,
  whatsappUrl,
}: {
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  twitterUrl?: string | null;
  whatsappUrl?: string | null;
}) {
  const links = [
    facebookUrl && { label: "Follow on Facebook", href: facebookUrl, icon: <Facebook size={16} /> },
    twitterUrl && { label: "Follow on X", href: twitterUrl, icon: <XIcon size={16} /> },
    instagramUrl && { label: "Follow on Instagram", href: instagramUrl, icon: <Instagram size={16} /> },
    whatsappUrl && { label: "Chat on WhatsApp", href: whatsappUrl, icon: <MessageCircle size={16} /> },
  ].filter(Boolean) as { label: string; href: string; icon: React.ReactNode }[];

  if (links.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Follow us
      </span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={l.label}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground hover:border-[var(--brand)] hover:text-[var(--brand)]"
        >
          {l.icon}
        </a>
      ))}
    </div>
  );
}