import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Eye, MapPinned, Route, TrendingUp } from "lucide-react";

import { FinalCta } from "@/components/final-cta";
import { InnerHero } from "@/components/inner-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Location", description: "BESA Park is positioned in Traralgon, Victoria — an important Gippsland commercial centre." };

export default function LocationPage() {
  const reasons = [
    [Route, "Accessible", "A practical Traralgon base for customers, teams, suppliers and the wider region."],
    [Eye, "Visible", "A precinct identity designed to help businesses stand apart from a typical industrial address."],
    [Compass, "Regional", "Positioned to serve Traralgon, the Latrobe Valley and broader Gippsland markets."],
    [TrendingUp, "Growing", "Future stages are designed to add more businesses, destinations and reasons to visit."],
  ];
  return (
    <>
      <SiteHeader />
      <main>
        <InnerHero
          eyebrow="16 Stirloch Circuit · Traralgon East"
          title={<>Positioned<br /><span>for growth.</span></>}
          copy="A regional commercial position with direct vehicle access from Stirloch Circuit and shared access and parking planned around Stage One."
          image="/besa-assets/stage-one-site-plan.png"
          imageAlt="Simplified Stage One site plan for BESA Park on Stirloch Circuit"
          label="Simplified marketing plan · Not to scale"
          isPlan
        >
          <Link className="button button-primary" href="#advantage">See the advantage <ArrowRight aria-hidden="true" /></Link>
          <Link className="button button-ghost-light" href="/enquire">Request location details</Link>
        </InnerHero>

        <section className="location-intro section-pad" id="advantage">
          <div className="location-stamp"><MapPinned aria-hidden="true" /><span>Latrobe Valley</span><strong>TRARALGON</strong><small>Victoria · Australia</small></div>
          <div><p className="eyebrow">The regional advantage</p><h2>A serious base for business — with more to come.</h2><p>Traralgon is a major service and commercial centre for the Latrobe Valley. BESA Park’s mixed-use vision gives its location an extra edge: it is being designed as somewhere people choose to visit, not simply pass through.</p></div>
        </section>

        <section className="reason-grid section-pad">
          {reasons.map(([Icon, title, copy], index) => { const ReasonIcon = Icon; return <article key={String(title)}><span>0{index + 1}</span><ReasonIcon aria-hidden="true" /><h3>{String(title)}</h3><p>{String(copy)}</p></article>; })}
        </section>

        <section className="reach-section section-pad">
          <div><p className="eyebrow eyebrow-light">A wider catchment</p><h2>Built for local loyalty.<br />Positioned for regional reach.</h2><p>The opportunity is bigger than one suburb. BESA Park is intended to attract businesses, workers, families and groups from across the surrounding region.</p></div>
          <div className="reach-rings" aria-hidden="true"><span>BESA</span><i>TRARALGON</i><b>GIPPSLAND</b></div>
        </section>

        <FinalCta title="Put your business on the map." copy="Register your interest to receive the detailed location and Stage One information." secondaryHref="/warehouses" secondaryLabel="View warehouses" />
      </main>
      <SiteFooter />
    </>
  );
}
