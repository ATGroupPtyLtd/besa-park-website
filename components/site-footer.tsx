import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand"><div className="footer-wordmark">BESA PARK</div><p>Work. Play. Connect.</p><span>A connected business, fitness and entertainment precinct in Traralgon.</span></div>
        <div><h3>Navigate</h3><Link href="/">The Precinct</Link><Link href="/opportunities">Opportunities</Link><Link href="/enquire">Enquire</Link></div>
        <div className="footer-location"><h3>Find your place</h3><p><MapPin aria-hidden="true" /> Stirloch Circuit, Traralgon</p><Link href="/enquire">Register interest <ArrowUpRight /></Link></div>
      </div>
      <div className="footer-bottom"><span>© 2026 BESA Park.</span><span>A place to work, play and connect.</span></div>
    </footer>
  );
}
