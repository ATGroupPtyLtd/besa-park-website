"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

export function EnquiryForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="form-success" role="status">
        <CheckCircle2 aria-hidden="true" />
        <p className="eyebrow">Interest registered</p>
        <h2>Thanks — you&apos;re on the list.</h2>
        <button className="button button-dark" onClick={() => setSent(false)}>Send another enquiry</button>
      </div>
    );
  }

  return (
    <form className="enquiry-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
      <div className="field-pair">
        <label>Full name<Input required name="name" placeholder="Your name" /></label>
        <label>Company<Input name="company" placeholder="Business name (optional)" /></label>
      </div>
      <div className="field-pair">
        <label>Email<Input required type="email" name="email" placeholder="you@company.com.au" /></label>
        <label>Phone<Input required type="tel" name="phone" placeholder="Your best contact number" /></label>
      </div>
      <label>
        I&apos;m interested in
        <NativeSelect required name="interest" defaultValue="" className="form-select">
          <NativeSelectOption value="" disabled>Select an opportunity</NativeSelectOption>
          <NativeSelectOption value="buy">Buying a warehouse</NativeSelectOption>
          <NativeSelectOption value="lease">Leasing a warehouse</NativeSelectOption>
          <NativeSelectOption value="operate">Operating a business at BESA Park</NativeSelectOption>
          <NativeSelectOption value="hospitality">Hospitality or lifestyle opportunity</NativeSelectOption>
          <NativeSelectOption value="invest">Investment opportunity</NativeSelectOption>
          <NativeSelectOption value="other">Something else</NativeSelectOption>
        </NativeSelect>
      </label>
      <label>Tell us what you have in mind<Textarea required name="message" placeholder="The space, timing or opportunity you're looking for…" /></label>
      <div className="form-bottom">
        <button className="button button-primary" type="submit">Register interest <ArrowRight aria-hidden="true" /></button>
      </div>
    </form>
  );
}
