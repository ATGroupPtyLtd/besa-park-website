import Link from "next/link";
import { ArrowRight } from "lucide-react";

type FinalCtaProps = {
  eyebrow?: string;
  title: string;
  copy: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function FinalCta({
  eyebrow = "The next move starts here",
  title,
  copy,
  secondaryHref,
  secondaryLabel,
}: FinalCtaProps) {
  return (
    <section className="final-cta">
      <div>
        <p className="eyebrow eyebrow-light">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{copy}</p>
      </div>
      <div className="final-actions">
        <Link className="button button-primary" href="/enquire">Register interest <ArrowRight aria-hidden="true" /></Link>
        {secondaryHref && secondaryLabel ? <Link className="button button-ghost-light" href={secondaryHref}>{secondaryLabel}</Link> : null}
      </div>
    </section>
  );
}
