/**
 * Resolves a pasted image URL into something actually usable as an
 * <img src>. Right now this handles Google Drive share links specifically
 * — a Drive "share" link (drive.google.com/file/d/...) points at Drive's
 * HTML viewer page, not raw image bytes, so it can never work directly in
 * an <img> tag no matter how it's pasted. Everything else (your own
 * /media/... links, any other website's direct image URL) passes through
 * unchanged, since those already work as-is.
 *
 * Note: the Drive file must be shared as "Anyone with the link" (Viewer)
 * for the converted URL to actually load — a private/restricted file will
 * still fail regardless of URL format, since that's a permissions issue,
 * not a URL-format one.
 */
export function resolveImageUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;

  const driveFileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  const driveIdParamMatch = trimmed.match(/drive\.google\.com\/(?:open|uc)\?.*?[?&]id=([a-zA-Z0-9_-]+)/);
  const fileId = driveFileMatch?.[1] ?? driveIdParamMatch?.[1];

  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  return trimmed;
}