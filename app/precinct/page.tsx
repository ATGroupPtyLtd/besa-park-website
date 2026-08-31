import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock3, Coffee, Dumbbell, Footprints, Gamepad2, HeartPulse, Store, UsersRound, Warehouse } from "lucide-react";

import { FinalCta } from "@/components/final-cta";
import { InnerHero } from "@/components/inner-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "The Precinct", description: "Discover the work, fitness, entertainment and hospitality vision for BESA Park." };

export default function PrecinctPage() {
  const operatorTypes = ["Trade & industry", "Showrooms", "Specialty retail", "Food & beverage", "Health & fitness", "Entertainment", "Professional services", "Investors"];
  return (
    <>
      <SiteHeader />
      <main>
        <InnerHero
          eyebrow="A new kind of precinct"
          title={<>Built around<br /><span>activity.</span></>}
          copy="BESA Park brings work, fitness, entertainment and future hospitality together — creating more reasons to arrive, stay and return."
          image="/besa-assets/precinct-courtyard.png"
          imageAlt="BESA Park concept combining fitness, entertainment and hospitality"
          label="Work · Play · Connect"
        >
          <Link className="button button-primary" href="#destinations">See the mix <ArrowRight aria-hidden="true" /></Link>
          <Link className="button button-ghost-light" href="/enquire">Bring your business</Link>
        </InnerHero>

        <section className="destination-section section-pad" id="destinations">
          <div className="split-heading">
            <div><p className="eyebrow">The activity anchors</p><h2>A precinct with a pulse.</h2></div>
            <p>People may arrive to train, work, meet, eat or play. The real strength is what happens when those reasons overlap.</p>
          </div>
          <div className="destination-grid">
            <article className="destination-card destination-blue"><span>Open now</span><Dumbbell aria-hidden="true" /><h3>AREA 365</h3><p>The established fitness anchor bringing daily energy and repeat visits to the precinct.</p></article>
            <article className="destination-card"><span>Stage Two</span><Gamepad2 aria-hidden="true" /><h3>RPM Entertainment</h3><p>Planned go-karts, arcades, group experiences, events and functions for the wider region.</p></article>
            <article className="destination-card"><span>Future opportunity</span><Coffee aria-hidden="true" /><h3>Hospitality & lifestyle</h3><p>Space for the right food, beverage, services and lifestyle operators to complete the experience.</p></article>
          </div>
        </section>

        <section className="activity-model section-pad">
          <div><p className="eyebrow eyebrow-light">Why the mix matters</p><h2>Every use makes the others stronger.</h2></div>
          <div className="model-grid">
            <article><Footprints aria-hidden="true" /><h3>Daily movement</h3><p>Fitness and businesses create regular weekday activity.</p></article>
            <article><UsersRound aria-hidden="true" /><h3>New audiences</h3><p>Entertainment can bring families, groups and events into the park.</p></article>
            <article><Clock3 aria-hidden="true" /><h3>Longer energy</h3><p>Different uses keep the precinct relevant beyond standard work hours.</p></article>
            <article><HeartPulse aria-hidden="true" /><h3>Stronger identity</h3><p>A memorable destination is easier to talk about, find and return to.</p></article>
          </div>
        </section>

        <section className="operator-section section-pad">
          <div className="operator-visual"><img src="/besa-assets/precinct-wide.png" alt="Wide architectural concept of the BESA Park precinct" /><div className="operator-overlay"><Warehouse aria-hidden="true" /><div><span>One address</span><strong>Many reasons to visit</strong></div><Store aria-hidden="true" /></div></div>
          <div className="operator-copy"><p className="eyebrow">Find your place</p><h2>Who belongs at BESA Park?</h2><p>We are looking for businesses that add value to the precinct and benefit from being beside other active operators.</p><div className="tag-cloud">{operatorTypes.map((item) => <span key={item}>{item}</span>)}</div></div>
        </section>

        <FinalCta eyebrow="A better address for an ambitious business" title="Could your business add to the mix?" copy="Tell us your idea. The strongest precincts are shaped by the right operators joining early." secondaryHref="/vision" secondaryLabel="See the future vision" />
      </main>
      <SiteFooter />
    </>
  );
}
