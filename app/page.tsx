import Link from "next/link";
import { ArrowRight, Building2, Dumbbell, Sparkles } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const pillars = [
  {
    icon: Building2,
    number: "01",
    title: "Work",
    copy: "Architecturally designed business spaces within a precinct built to be seen and visited.",
  },
  {
    icon: Dumbbell,
    number: "02",
    title: "Play",
    copy: "AREA 365 is already active, bringing consistent energy and daily visitation to the site.",
  },
  {
    icon: Sparkles,
    number: "03",
    title: "Connect",
    copy: "Entertainment, hospitality and complementary operators will shape a genuine destination.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero-shell">
          <div className="hero-copy">
            <p className="eyebrow eyebrow-light">Traralgon, Victoria · A connected destination</p>
            <h1>A place to<br />work. play.<br /><span>connect.</span></h1>
            <p className="hero-lead">
              BESA Park brings distinctive business spaces together with fitness, entertainment and future hospitality in one evolving precinct.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/opportunities">
                View opportunities <ArrowRight aria-hidden="true" />
              </Link>
              <Link className="button button-ghost-light" href="/enquire">Register interest</Link>
            </div>
            <div className="hero-facts" aria-label="BESA Park availability">
              <div><strong>3</strong><span>opportunities remain</span></div>
              <div><strong>2</strong><span>already secured</span></div>
              <div><strong>1</strong><span>finite first release</span></div>
            </div>
          </div>
          <div className="hero-visual" aria-label="Architectural vision for BESA Park">
            <img className="reference-crop crop-home-hero" src="/besa-assets/warehouse-row.png" alt="Architectural concept showing the Stage One business spaces at BESA Park" />
            <div className="hero-visual-shade" />
            <div className="hero-status"><span className="status-dot" />Only three remain</div>
            <div className="hero-mark" aria-hidden="true">B</div>
          </div>
        </section>

        <section className="intro section-pad" id="precinct">
          <div className="section-kicker">The BESA Park idea</div>
          <div className="intro-grid">
            <h2>One address.<br /><span>More reasons to be there.</span></h2>
            <p className="large-copy">
              This is not a row of isolated buildings. It is a considered precinct where business, movement and experience strengthen one another.
            </p>
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
            <p className="eyebrow">Limited Stage One release</p>
            <h2>Five released.<br /><span>Only three remain.</span></h2>
            <p>
              Two opportunities have already been secured. The remaining spaces offer an early position in a destination precinct that is only beginning its story.
            </p>
            <div className="metric-row">
              <div><strong>3</strong><span>remaining</span></div>
              <div><strong>2</strong><span>secured</span></div>
              <div><strong>Now</strong><span>registering interest</span></div>
            </div>
            <Link className="button button-dark" href="/opportunities">Explore the release <ArrowRight aria-hidden="true" /></Link>
          </div>
          <div className="warehouse-visual">
            <img className="reference-crop crop-warehouse-hero" src="/besa-assets/warehouse-detail.png" alt="Detailed concept view of the Stage One BESA Park spaces" />
            <div className="unit-tag">Stage One · Three opportunities remain</div>
          </div>
        </section>

        <section className="pulse-section section-pad" id="vision">
          <div className="pulse-heading">
            <div><p className="eyebrow eyebrow-light">Built around activity</p><h2>More reasons to return.</h2></div>
            <p>A connected mix creates movement, visibility and lasting identity.</p>
          </div>
          <div className="pulse-grid">
            <article className="pulse-card pulse-live">
              <div className="pulse-icon"><Dumbbell aria-hidden="true" /></div>
              <div><span>Open now</span><h3>AREA 365</h3><p>Premium fitness generating daily energy and repeat visitation.</p></div>
            </article>
            <article className="pulse-card">
              <div className="pulse-icon"><Sparkles aria-hidden="true" /></div>
              <div><span>Planned</span><h3>RPM Entertainment</h3><p>A future regional drawcard for groups, events and shared experiences.</p></div>
            </article>
            <article className="pulse-card">
              <div className="pulse-icon"><Building2 aria-hidden="true" /></div>
              <div><span>Future mix</span><h3>Complementary operators</h3><p>Hospitality, services and businesses that add to the destination.</p></div>
            </article>
          </div>
        </section>

        <section className="final-cta" id="location">
          <div>
            <p className="eyebrow eyebrow-light">Stirloch Circuit · Traralgon</p>
            <h2>Three remain. Start the conversation.</h2>
            <p>Availability is limited and this first release will not be repeated. Register now to discuss the opportunity that best fits your plans.</p>
          </div>
          <div className="final-actions">
            <Link className="button button-primary" href="/enquire">Register interest <ArrowRight aria-hidden="true" /></Link>
            <Link className="button button-ghost-light" href="/opportunities">View opportunities</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
