import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand"><div className="footer-wordmark">BESA PARK</div><p>Work. Play. Connect.</p><span>Traralgon's emerging industrial, business and entertainment precinct.</span></div>
        <div><h3>Explore</h3><Link href="/warehouses">Warehouses</Link><Link href="/precinct">The Precinct</Link><Link href="/vision">Future Vision</Link></div>
        <div><h3>Opportunity</h3><Link href="/location">Location</Link><Link href="/enquire">Register Interest</Link><Link href="/enquire">Request Information</Link></div>
        <div className="footer-location"><h3>Positioned in</h3><p><MapPin aria-hidden="true" /> Traralgon, Victoria</p><Link href="/enquire">Start a conversation <ArrowUpRight /></Link></div>
      </div>
      <div className="footer-bottom"><span>© 2026 BESA Park. Concept website.</span><span>A vision for work, play and connection.</span></div>
    </footer>
  );
}
