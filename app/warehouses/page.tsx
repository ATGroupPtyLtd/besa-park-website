import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Boxes, BriefcaseBusiness, ChartNoAxesCombined, PackageCheck, Store, Wrench } from "lucide-react";

import { FinalCta } from "@/components/final-cta";
import { InnerHero } from "@/components/inner-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Warehouses", description: "Explore Stage One warehouse opportunities at BESA Park in Traralgon." };

const units = [
  { unit: "01", size: "500m²" },
  { unit: "02", size: "400m²" },
  { unit: "03", size: "350m²" },
  { unit: "04", size: "400m²" },
  { unit: "05", size: "500m²" },
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
          copy="Five flexible industrial units for businesses and investors who want more than four walls — they want the right position."
          image="/besa-assets/stage-one-facade.png"
          imageAlt="Architectural concept for the Stage One BESA Park warehouses"
          label="Indicative architectural concept"
        >
          <Link className="button button-primary" href="#units">View the units <ArrowRight aria-hidden="true" /></Link>
          <Link className="button button-ghost-light" href="/enquire">Request details</Link>
        </InnerHero>

        <section className="stat-ribbon" aria-label="Warehouse highlights">
          <div><strong>5</strong><span>Stage One units</span></div>
          <div><strong>350–500m²</strong><span>Current concept sizes</span></div>
          <div><strong>Sale</strong><span>Owner-occupier or investor</span></div>
          <div><strong>Lease</strong><span>Flexible business pathway</span></div>
        </section>

        <section className="units-section section-pad" id="units">
          <div className="split-heading">
            <div><p className="eyebrow">The first release</p><h2>Pick your position.</h2></div>
            <p>Stage One is intentionally small: only five units in the first release. Register early to discuss size, timing and fit before decisions are locked in.</p>
          </div>
          <div className="unit-grid">
            {units.map((item) => (
              <article className="unit-card" key={item.unit}>
                <span>Unit {item.unit}</span>
                <strong>{item.size}</strong>
                <p>Approximate concept area</p>
                <Link href="/enquire">Register interest <ArrowRight aria-hidden="true" /></Link>
              </article>
            ))}
          </div>
          <div className="plan-gallery" aria-label="Indicative Stage One plans and elevations">
            <img src="/besa-assets/development-plan.png" alt="Indicative BESA Park development layout" />
            <img src="/besa-assets/elevations.png" alt="Indicative warehouse elevations" />
            <img src="/besa-assets/floor-plan.png" alt="Indicative five-unit warehouse floor plan" />
          </div>
          <p className="fine-print">Areas and configuration are indicative and subject to final design, approvals and documentation.</p>
        </section>

        <section className="feature-band section-pad">
          <div className="feature-band-copy">
            <p className="eyebrow eyebrow-light">The commercial edge</p>
            <h2>Industrial space with a built-in reason to visit.</h2>
            <p>AREA 365 is already active. RPM Entertainment and future hospitality are planned to add even more movement. That mix can help give BESA Park stronger awareness than a standard warehouse address.</p>
          </div>
          <div className="check-list">
            {[
              "Flexible layouts for a range of commercial uses",
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

        <FinalCta title="Want first choice of the five?" copy="Tell us what your business needs and we’ll start the right conversation early." secondaryHref="/precinct" secondaryLabel="Explore the precinct" />
      </main>
      <SiteFooter />
    </>
  );
}
