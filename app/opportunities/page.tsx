import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";

import { FinalCta } from "@/components/final-cta";
import { InnerHero } from "@/components/inner-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WarehousePlanGallery } from "@/components/warehouse-plan-gallery";

export const metadata: Metadata = {
  title: "Opportunities",
  description: "Explore the three remaining Stage One opportunities at BESA Park in Traralgon.",
};

const configurations = [
  { name: "Compact", total: "298.72m²", breakdown: "250m² ground + 48.72m² mezzanine", note: "An efficient business footprint" },
  { name: "Extended", total: "406m²", breakdown: "350m² ground + 56m² mezzanine", note: "More room to operate and grow" },
  { name: "Flagship", total: "548.72m²", breakdown: "500m² ground + 48.72m² mezzanine", note: "The largest planned configuration" },
];

export default function OpportunitiesPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <InnerHero
          eyebrow="Limited Stage One release"
          title={<>Only three<br /><span>opportunities remain.</span></>}
          copy="Two of the original five have already been secured. Explore the planned configurations, then contact us to confirm current availability."
          image="/besa-assets/stage-one-facade.png"
          imageAlt="Architectural concept for the Stage One BESA Park business spaces"
          label="Indicative architectural concept"
        >
          <Link className="button button-primary" href="#configurations">Explore configurations <ArrowRight aria-hidden="true" /></Link>
          <Link className="button button-ghost-light" href="/enquire">Register interest</Link>
        </InnerHero>

        <section className="stat-ribbon" aria-label="Stage One availability">
          <div><strong>3</strong><span>remaining</span></div>
          <div><strong>2</strong><span>already secured</span></div>
          <div><strong>5</strong><span>original release</span></div>
          <div><strong>Traralgon</strong><span>Stirloch Circuit</span></div>
        </section>

        <section className="units-section section-pad" id="configurations">
          <div className="split-heading">
            <div><p className="eyebrow">The first release</p><h2>Find your fit.</h2></div>
            <p>Three planned configurations balance ground-floor workspace with upper-level office space. Exact availability is confirmed directly when you enquire.</p>
          </div>
          <div className="unit-grid opportunity-grid">
            {configurations.map((item) => (
              <article className="unit-card" key={item.name}>
                <span>{item.name} configuration</span>
                <strong>{item.total}</strong>
                <p>{item.breakdown}<br />{item.note}</p>
                <Link href="/enquire">Check availability <ArrowRight aria-hidden="true" /></Link>
              </article>
            ))}
          </div>
          <WarehousePlanGallery />
          <p className="fine-print">Areas are taken from the architectural town-planning set dated 17 June 2026. Plans remain indicative and subject to final design, approvals and documentation.</p>
        </section>

        <section className="feature-band section-pad">
          <div className="feature-band-copy">
            <p className="eyebrow eyebrow-light">A distinctive business address</p>
            <h2>Designed to belong to something bigger.</h2>
            <p>BESA Park combines considered business spaces with an active fitness anchor and a wider entertainment and hospitality vision.</p>
          </div>
          <div className="check-list">
            {[
              "Ground-floor workspace, office and amenity areas",
              "Upper-level mezzanine office space",
              "Professional new-build presentation",
              "Position within an evolving destination precinct",
            ].map((item) => <div key={item}><BadgeCheck aria-hidden="true" /><span>{item}</span></div>)}
          </div>
        </section>

        <FinalCta
          eyebrow="Two secured. Three remain."
          title="Make your move while the choice is yours."
          copy="Tell us the space, timing and intended use you need. We’ll confirm current availability and start the right conversation."
          secondaryHref="/"
          secondaryLabel="Explore the precinct"
        />
      </main>
      <SiteFooter />
    </>
  );
}
