import type { ReactNode } from "react";

type InnerHeroProps = {
  eyebrow: string;
  title: ReactNode;
  copy: string;
  image: string;
  imageAlt: string;
  label: string;
  isPlan?: boolean;
  children?: ReactNode;
};

export function InnerHero({ eyebrow, title, copy, image, imageAlt, label, isPlan = false, children }: InnerHeroProps) {
  return (
    <section className="inner-hero">
      <div className="inner-hero-copy">
        <p className="eyebrow eyebrow-light">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{copy}</p>
        {children ? <div className="inner-hero-actions">{children}</div> : null}
      </div>
      <div className={`inner-hero-visual${isPlan ? " inner-hero-plan" : ""}`}>
        <img src={image} alt={imageAlt} />
        <div className="inner-hero-shade" />
        <span>{label}</span>
      </div>
    </section>
  );
}
