import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Coffee, Flag, Gamepad2, Sparkles, UsersRound, Warehouse } from "lucide-react";

import { FinalCta } from "@/components/final-cta";
import { InnerHero } from "@/components/inner-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Future Vision", description: "See the three-stage vision for BESA Park in Traralgon." };

const roadmap = [
  { number: "01", state: "First release", title: "Premium warehouses", copy: "Five flexible industrial units create the commercial foundation.", icon: Warehouse },
  { number: "02", state: "Future destination", title: "RPM Entertainment", copy: "A planned regional drawcard built around play, groups and events.", icon: Gamepad2 },
  { number: "03", state: "Future expansion", title: "More industrial space", copy: "Ten additional units extend the business community and opportunity.", icon: Building2 },
];

export default function VisionPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <InnerHero
          eyebrow="The future vision"
          title={<>Start with space.<br /><span>Build a destination.</span></>}
          copy="BESA Park is planned to grow in deliberate stages — bringing together commercial opportunity, entertainment and community activity."
          image="/besa-assets/masterplan-aerial.png"
          imageAlt="Future masterplan vision for BESA Park"
          label="Indicative future vision"
        >
          <Link className="button button-primary" href="#roadmap">See the roadmap <ArrowRight aria-hidden="true" /></Link>
          <Link className="button button-ghost-light" href="/enquire">Join from the start</Link>
        </InnerHero>

        <section className="vision-intro section-pad"><Sparkles aria-hidden="true" /><p className="eyebrow">The big idea</p><h2>Build the place people talk about — then give businesses a position inside it.</h2><p>The warehouse opportunity matters now. The wider vision is what can make the address more valuable, more visible and more memorable over time.</p></section>

        <section className="vision-roadmap section-pad" id="roadmap">
          <div className="split-heading"><div><p className="eyebrow eyebrow-light">Three deliberate stages</p><h2>Momentum, built in.</h2></div><p>Each stage adds a new reason for the next one to succeed.</p></div>
          <div className="vision-stage-grid">
            {roadmap.map(({ number, state, title, copy, icon: Icon }) => <article key={number}><div><span>{number}</span><Icon aria-hidden="true" /></div><small>{state}</small><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </section>

        <section className="becoming-section section-pad">
          <div className="section-centre"><p className="eyebrow">What BESA Park is becoming</p><h2>Four parts. One stronger precinct.</h2></div>
          <div className="becoming-grid">
            <article><Warehouse aria-hidden="true" /><span>01</span><h3>Industrial & commercial</h3><p>Serious spaces for businesses to operate, display, store and grow.</p></article>
            <article><Gamepad2 aria-hidden="true" /><span>02</span><h3>Entertainment</h3><p>A major planned attraction for families, groups, events and functions.</p></article>
            <article><Coffee aria-hidden="true" /><span>03</span><h3>Food & beverage</h3><p>Future operators that extend visits and turn activity into an experience.</p></article>
            <article><UsersRound aria-hidden="true" /><span>04</span><h3>Community & lifestyle</h3><p>Fitness, services and shared spaces that build repeat local connection.</p></article>
          </div>
        </section>

        <section className="vision-quote"><Flag aria-hidden="true" /><blockquote>“Create the regional destination people want to visit — and the business address ambitious operators want to own.”</blockquote><span>The BESA Park ambition</span></section>

        <FinalCta eyebrow="The best position may be the early one" title="Be part of the story from Stage One." copy="Register now to discuss warehouse, operator or future precinct opportunities." secondaryHref="/precinct" secondaryLabel="Explore the precinct" />
      </main>
      <SiteFooter />
    </>
  );
}
