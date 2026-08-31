import type { Metadata } from "next";
import { Building2, MessageSquareText, TimerReset } from "lucide-react";

import { EnquiryForm } from "@/components/enquiry-form";
import { InnerHero } from "@/components/inner-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = { title: "Enquire", description: "Register your interest in BESA Park warehouse, operator and investment opportunities." };

const faqs = [
  ["Can I buy or lease a warehouse?", "Stage One is being presented for sale or lease. Register your preference and requirements so the right pathway can be discussed."],
  ["What sizes are planned?", "The current plans show five units ranging from 298.72m² to 548.72m² in total floor area, including mezzanine space. Ground-floor areas range from 250m² to 500m²."],
  ["Is BESA Park already open?", "AREA 365 is already operating at the precinct. The warehouses, RPM Entertainment and further stages are part of the development vision."],
  ["Can I enquire about hospitality or another business idea?", "Yes. BESA Park is interested in complementary operators who could strengthen the wider work, play and connect vision."],
  ["What happens after I register?", "The project team can share the relevant information and discuss your intended use, timing and preferred opportunity."],
];

export default function EnquirePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <InnerHero
          eyebrow="Stage One interest now open"
          title={<>Your next move<br /><span>starts here.</span></>}
          copy="Warehouse buyer, future tenant, operator or investor — tell us what you need and where you see the opportunity."
          image="/besa-assets/warehouse-interior.png"
          imageAlt="BESA Park warehouse concept"
          label="Traralgon · Victoria"
        />

        <section className="enquire-section section-pad">
          <div className="enquire-intro"><p className="eyebrow">Register your interest</p><h2>Let&apos;s talk about the right fit.</h2><p>Give us enough detail to understand what you are looking for. No polished pitch required.</p><div className="enquire-points"><div><Building2 aria-hidden="true" /><span><strong>Warehouse</strong>Buy, lease or invest</span></div><div><MessageSquareText aria-hidden="true" /><span><strong>Operator</strong>Bring a business idea</span></div><div><TimerReset aria-hidden="true" /><span><strong>Early mover</strong>Get into the conversation now</span></div></div></div>
          <EnquiryForm />
        </section>

        <section className="faq-section section-pad">
          <div><p className="eyebrow">Straight answers</p><h2>Before you enquire.</h2><p>The project is still moving through its development journey, so some details will evolve. Here is what we can say clearly now.</p></div>
          <Accordion className="faq-list" type="single" collapsible defaultValue="item-0">
            {faqs.map(([question, answer], index) => <AccordionItem value={`item-${index}`} key={question}><AccordionTrigger>{question}</AccordionTrigger><AccordionContent>{answer}</AccordionContent></AccordionItem>)}
          </Accordion>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
