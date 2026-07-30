import { Link } from "@tanstack/react-router";
import { NewsletterForm } from "@/components/site/NewsletterForm";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-[var(--ink)] text-white/80">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-6 w-1.5 bg-[var(--brand)]" />
            <span className="font-serif text-2xl font-black text-white">The Dispatch</span>
          </div>
          <p className="mt-4 max-w-xs text-sm">
            Independent reporting on the stories shaping our world — politics, business, sport, and beyond.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-white">Sections</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/category/politics">Politics</Link></li>
            <li><Link to="/category/business">Business</Link></li>
            <li><Link to="/category/technology">Technology</Link></li>
            <li><Link to="/category/sports">Sports</Link></li>
            <li><Link to="/predictions">Football Predictions</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-white">More</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/category/entertainment">Entertainment</Link></li>
            <li><Link to="/category/international">International</Link></li>
            <li><Link to="/category/local-news">Local News</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-white">Newsletter</h4>
          <p className="mb-3 text-sm">Get the daily brief in your inbox.</p>
          <NewsletterForm source="footer" />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-4 text-xs text-white/60 md:flex-row">
          <span>© {new Date().getFullYear()} The Dispatch. All rights reserved.</span>
          <span>Built with editorial integrity.</span>
        </div>
      </div>
    </footer>
  );
}
