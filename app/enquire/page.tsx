import type { Metadata } from "next";
import { Building2, MessageSquareText, TimerReset } from "lucide-react";

import { EnquiryForm } from "@/components/enquiry-form";
import { InnerHero } from "@/components/inner-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Enquire",
  description: "Register your interest in one of three remaining Stage One opportunities at BESA Park.",
};

const faqs = [
  ["How many opportunities remain?", "Three of the original five Stage One opportunities remain. Exact availability is confirmed directly when you enquire."],
  ["Can I buy or lease?", "Stage One is being presented for sale or lease. Register your preference and requirements so the right pathway can be discussed."],
  ["What sizes are planned?", "The current configurations range from 298.72m² to 548.72m² in total floor area, including upper-level mezzanine office space."],
  ["What happens after I register?", "The project team can confirm current availability, share the relevant information and discuss your intended use, timing and preferred configuration."],
];

export default function EnquirePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <InnerHero
          eyebrow="Only three Stage One opportunities remain"
          title={<>Secure your place<br /><span>at BESA Park.</span></>}
          copy="Two of the original five opportunities have already been secured. Tell us what you need and start the conversation while three remain."
          image="/besa-assets/warehouse-interior.png"
          imageAlt="BESA Park business space concept"
          label="Traralgon · Victoria"
        />

        <section className="enquire-section section-pad">
          <div className="enquire-intro">
            <p className="eyebrow">Register your interest</p>
            <h2>Let&apos;s talk about the right fit.</h2>
            <p>Give us enough detail to understand what you are looking for. We&apos;ll confirm availability and take it from there.</p>
            <div className="enquire-points">
              <div><Building2 aria-hidden="true" /><span><strong>Remaining</strong>3 of the original 5</span></div>
              <div><MessageSquareText aria-hidden="true" /><span><strong>Opportunity</strong>Buy, lease or invest</span></div>
              <div><TimerReset aria-hidden="true" /><span><strong>Timing</strong>Availability is changing</span></div>
            </div>
          </div>
          <EnquiryForm />
        </section>

        <section className="faq-section section-pad">
          <div><p className="eyebrow">Straight answers</p><h2>Before you enquire.</h2><p>The essentials, kept simple.</p></div>
          <Accordion className="faq-list" type="single" collapsible defaultValue="item-0">
            {faqs.map(([question, answer], index) => <AccordionItem value={`item-${index}`} key={question}><AccordionTrigger>{question}</AccordionTrigger><AccordionContent>{answer}</AccordionContent></AccordionItem>)}
          </Accordion>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
