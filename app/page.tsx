import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Dumbbell,
  MapPin,
  Sparkles,
  Users,
  Warehouse,
} from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const pillars = [
  {
    icon: Warehouse,
    number: "01",
    title: "Work",
    copy: "Premium warehouse opportunities shaped for businesses ready to move, grow and be seen.",
  },
  {
    icon: Dumbbell,
    number: "02",
    title: "Play",
    copy: "AREA 365 is active now, with RPM Entertainment planned as the precinct's next major drawcard.",
  },
  {
    icon: Users,
    number: "03",
    title: "Connect",
    copy: "A future mix of business, hospitality and visitor activity designed to keep the precinct moving.",
  },
];

const stages = [
  { stage: "Stage 01", title: "5 premium warehouse units", note: "Now selling / leasing" },
  { stage: "Stage 02", title: "RPM Entertainment Complex", note: "Future destination" },
  { stage: "Stage 03", title: "10 additional industrial units", note: "Future expansion" },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero-shell">
          <div className="hero-copy">
            <p className="eyebrow eyebrow-light">Traralgon, Victoria · Emerging precinct</p>
            <h1>
              Work.<br />
              Play.<br />
              <span>Connect.</span>
            </h1>
            <p className="hero-lead">
              Premium industrial space beside fitness, entertainment and future hospitality — built to become a destination, not another industrial estate.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/warehouses">
                Explore warehouses <ArrowRight aria-hidden="true" />
              </Link>
              <Link className="button button-ghost-light" href="/enquire">
                Register interest
              </Link>
            </div>
            <div className="hero-facts" aria-label="BESA Park highlights">
              <div><strong>5</strong><span>Stage One units</span></div>
              <div><strong>250–500m²</strong><span>Approximate sizes</span></div>
              <div><strong>3 stages</strong><span>One bigger vision</span></div>
            </div>
          </div>
          <div className="hero-visual" aria-label="Architectural vision for BESA Park">
            <img className="reference-crop crop-home-hero" src="/besa-assets/warehouse-row.png" alt="Architectural concept showing the Stage One warehouse row at BESA Park" />
            <div className="hero-visual-shade" />
            <div className="hero-status">
              <span className="status-dot" />
              Stage One opportunities open
            </div>
            <div className="hero-mark" aria-hidden="true">B</div>
          </div>
        </section>

        <section className="intro section-pad" id="precinct">
          <div className="section-kicker">The BESA Park difference</div>
          <div className="intro-grid">
            <h2>More than an industrial park.<br /><span>A destination.</span></h2>
            <div>
              <p className="large-copy">
                Traditional industrial developments give businesses a building. BESA Park is designed to give them an address people already have a reason to visit.
              </p>
              <Link className="text-link" href="/precinct">Explore the precinct <ArrowRight aria-hidden="true" /></Link>
            </div>
          </div>
          <div className="pillar-grid">
            {pillars.map(({ icon: Icon, number, title, copy }) => (
              <article className="pillar-card" key={title}>
                <div className="pillar-top"><Icon aria-hidden="true" /><span>{number}</span></div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="warehouse-feature section-pad">
          <div className="warehouse-copy">
            <p className="eyebrow">Stage One · Now selling / leasing</p>
            <h2>Five premium warehouses.<br /><span>One strategic position.</span></h2>
            <p>
              Flexible 250–500m² spaces for trade, warehousing, showrooms, distribution, owner-occupiers and investors — positioned beside an evolving destination precinct.
            </p>
            <div className="metric-row">
              <div><strong>5</strong><span>units</span></div>
              <div><strong>250–500</strong><span>square metres</span></div>
              <div><strong>Sale</strong><span>or lease</span></div>
            </div>
            <Link className="button button-dark" href="/warehouses">View Stage One <ArrowRight aria-hidden="true" /></Link>
          </div>
          <div className="warehouse-visual">
            <img className="reference-crop crop-warehouse-hero" src="/besa-assets/warehouse-detail.png" alt="Detailed concept view of BESA Park warehouse units" />
            <div className="unit-tag">Flexible industrial space</div>
          </div>
        </section>

        <section className="pulse-section section-pad">
          <div className="pulse-heading">
            <div><p className="eyebrow eyebrow-light">Built around activity</p><h2>The precinct has a pulse.</h2></div>
            <p>Business does not have to stop when the workday ends.</p>
          </div>
          <div className="pulse-grid">
            <article className="pulse-card pulse-live">
              <div className="pulse-icon"><Dumbbell aria-hidden="true" /></div>
              <div><span>Open now</span><h3>AREA 365</h3><p>Premium fitness generating daily visitation and an active base for the precinct.</p></div>
            </article>
            <article className="pulse-card">
              <div className="pulse-icon"><Sparkles aria-hidden="true" /></div>
              <div><span>Stage Two</span><h3>RPM Entertainment</h3><p>Future go-karts, arcade entertainment, group experiences, events and functions.</p></div>
            </article>
            <article className="pulse-card">
              <div className="pulse-icon"><Building2 aria-hidden="true" /></div>
              <div><span>Future opportunity</span><h3>Hospitality & lifestyle</h3><p>Potential for food, beverage, services and complementary operators.</p></div>
            </article>
          </div>
        </section>

        <section className="roadmap section-pad">
          <div className="roadmap-head">
            <div><p className="eyebrow">The development roadmap</p><h2>A precinct designed to evolve.</h2></div>
            <p>BESA Park begins with serious commercial opportunity and grows through entertainment, activity and further industrial development.</p>
          </div>
          <div className="stage-line">
            {stages.map((item, index) => (
              <article className="stage-item" key={item.stage}>
                <div className="stage-node"><span>{String(index + 1).padStart(2, "0")}</span></div>
                <p>{item.stage}</p>
                <h3>{item.title}</h3>
                <span>{item.note}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="location-tease section-pad">
          <div>
            <p className="eyebrow eyebrow-light">Positioned for growth</p>
            <h2>Traralgon.<br />Connected to opportunity.</h2>
            <p>A high-exposure regional position designed for accessibility, activity and long-term commercial appeal.</p>
            <Link className="button button-primary" href="/location"><MapPin aria-hidden="true" /> Explore location</Link>
          </div>
          <div className="location-orbit" aria-hidden="true"><span>BESA</span><i /><b>TRARALGON</b></div>
        </section>

        <section className="final-cta">
          <div>
            <p className="eyebrow eyebrow-light">Stage One opportunities are open</p>
            <h2>Establish your business early.</h2>
            <p>Join BESA Park from the beginning and become part of a precinct with a much bigger story.</p>
          </div>
          <div className="final-actions">
            <Link className="button button-primary" href="/enquire">Register interest <ArrowRight aria-hidden="true" /></Link>
            <Link className="button button-ghost-light" href="/vision">See the future vision</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
