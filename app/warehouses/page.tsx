import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Boxes, BriefcaseBusiness, ChartNoAxesCombined, PackageCheck, Store, Wrench } from "lucide-react";

import { FinalCta } from "@/components/final-cta";
import { InnerHero } from "@/components/inner-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WarehousePlanGallery } from "@/components/warehouse-plan-gallery";

export const metadata: Metadata = { title: "Warehouses", description: "Explore five Stage One warehouse opportunities at BESA Park in Traralgon East." };

const units = [
  { unit: "01", total: "406m²", breakdown: "350m² ground + 56m² mezzanine", position: "End unit" },
  { unit: "02", total: "298.72m²", breakdown: "250m² ground + 48.72m² mezzanine", position: "Internal unit" },
  { unit: "03", total: "298.72m²", breakdown: "250m² ground + 48.72m² mezzanine", position: "Internal unit" },
  { unit: "04", total: "298.72m²", breakdown: "250m² ground + 48.72m² mezzanine", position: "Internal unit" },
  { unit: "05", total: "548.72m²", breakdown: "500m² ground + 48.72m² mezzanine", position: "End unit" },
];

const uses = [
  [Wrench, "Trade base", "A professional home for crews, vehicles and equipment."],
  [Boxes, "Warehousing", "Flexible space for storage, stock and growing operations."],
  [Store, "Showroom", "A customer-facing space in a precinct people will visit."],
  [PackageCheck, "Distribution", "A practical regional base for dispatch and fulfilment."],
  [BriefcaseBusiness, "Owner-occupier", "Own the premises your business grows into."],
  [ChartNoAxesCombined, "Investment", "Secure an early position in an evolving precinct."],
];

export default function WarehousesPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <InnerHero
          eyebrow="Stage One · For sale or lease"
          title={<>Premium warehouses.<br /><span>Built for what&apos;s next.</span></>}
          copy="Five planned industrial units with ground-floor warehouse space, office and amenity areas, plus upper-level mezzanine offices."
          image="/besa-assets/stage-one-facade.png"
          imageAlt="Architectural concept for the Stage One BESA Park warehouses"
          label="Indicative architectural concept"
        >
          <Link className="button button-primary" href="#units">View the units <ArrowRight aria-hidden="true" /></Link>
          <Link className="button button-ghost-light" href="/enquire">Request details</Link>
        </InnerHero>

        <section className="stat-ribbon" aria-label="Warehouse highlights">
          <div><strong>5</strong><span>Stage One units</span></div>
          <div><strong>298.72–548.72m²</strong><span>Total floor areas</span></div>
          <div><strong>250–500m²</strong><span>Ground-floor areas</span></div>
          <div><strong>48.72–56m²</strong><span>Mezzanine areas</span></div>
        </section>

        <section className="units-section section-pad" id="units">
          <div className="split-heading">
            <div><p className="eyebrow">The first release</p><h2>Pick your position.</h2></div>
            <p>Stage One offers two larger end units and three efficient internal units. Compare the confirmed concept areas below, then register to discuss availability, timing and fit.</p>
          </div>
          <div className="unit-grid">
            {units.map((item) => (
              <article className="unit-card" key={item.unit}>
                <span>Unit {item.unit}</span>
                <strong>{item.total}</strong>
                <p>{item.breakdown}<br />{item.position} · total floor area</p>
                <Link href="/enquire">Register interest <ArrowRight aria-hidden="true" /></Link>
              </article>
            ))}
          </div>
          <WarehousePlanGallery />
          <p className="fine-print">Areas are taken from the architectural town-planning set dated 17 June 2026. Layouts remain indicative and subject to final design, approvals and documentation.</p>
        </section>

        <section className="feature-band section-pad">
          <div className="feature-band-copy">
            <p className="eyebrow eyebrow-light">The commercial edge</p>
            <h2>Industrial space with a built-in reason to visit.</h2>
            <p>AREA 365 is already active. RPM Entertainment and future hospitality are planned to add even more movement. That mix can help give BESA Park stronger awareness than a standard warehouse address.</p>
          </div>
          <div className="check-list">
            {[
              "Ground-floor warehouse, office and amenity areas",
              "Upper-level mezzanine office space",
              "Professional new-build presentation",
              "Positioned inside an emerging destination precinct",
              "Early opportunity to shape your place in the park",
              "Potential exposure to fitness, entertainment and hospitality visitors",
            ].map((item) => <div key={item}><BadgeCheck aria-hidden="true" /><span>{item}</span></div>)}
          </div>
        </section>

        <section className="use-section section-pad">
          <div className="section-centre"><p className="eyebrow">Made to work hard</p><h2>Who could thrive here?</h2></div>
          <div className="use-grid">
            {uses.map(([Icon, title, copy]) => {
              const UseIcon = Icon;
              return <article key={String(title)}><UseIcon aria-hidden="true" /><h3>{String(title)}</h3><p>{String(copy)}</p></article>;
            })}
          </div>
        </section>

        <FinalCta title="Which unit fits your business?" copy="Tell us the space, timing and intended use you need and we’ll start the right conversation early." secondaryHref="/precinct" secondaryLabel="Explore the precinct" />
      </main>
      <SiteFooter />
    </>
  );
}
