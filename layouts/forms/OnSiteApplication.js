"use client";

import { useRef, useState } from "react";
import Field from "@components/ui/Field";
import Button from "@components/ui/Button";
import site from "@config/site.json";
import cfg from "@config/application-form.json";
import { Honeypot, PrivacyNote } from "./FormExtras";
import { SuccessPanel, ErrorPanel } from "./FormStatus";

/**
 * The application form, on our own site.
 *
 * WHY THIS EXISTS. The old flow sent applicants to two Google Forms, one of
 * which forced a Google sign-in. This form lives on kareplusrugby.co.uk — one
 * page, no sign-in, works on a phone — and posts straight into the
 * "Pre-employment/ screening questions" Google Form, so responses still land in
 * the Google sheet the office already reads. No Vercel, no SMTP, no database.
 *
 * HOW THE SUBMIT WORKS. We POST the answers to the Google Form's /formResponse
 * endpoint (config/application-form.json → action) with each answer keyed by
 * its Google entry ID. The request is sent with `mode: "no-cors"`, because
 * Google does not return CORS headers: the submission is recorded, but the
 * browser cannot read the response. That is fine — we validate everything
 * ourselves first, and Google accepts a well-formed POST (verified 2026-09-10,
 * HTTP 200 to a signed-out request). Because we cannot read Google's reply, we
 * cannot detect a Google-side rejection; the mitigation is that our required
 * fields match the form's required fields exactly, so there is nothing for
 * Google to reject.
 *
 * IF THE FORM'S QUESTIONS CHANGE in Google (renamed or reordered), the entry
 * IDs can change and submissions would silently stop landing. The mapping is
 * isolated in config/application-form.json with a note to that effect.
 */

const F = cfg.fields;
const O = cfg.options;

const REQUIRED = {
  name: "Please tell us your name.",
  phone: "Please give us a phone number so we can call you back.",
  email: "Please give us a valid email address.",
  area: "Please tell us where you live.",
  experience: "Please choose one.",
  rightToWork: "Please tell us about your right to work in the UK.",
  drive: "Please choose one.",
  car: "Please choose one.",
  dbs: "Please choose one.",
  dbsUpdate: "Please choose one.",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const OnSiteApplication = () => {
  const [v, setV] = useState({
    name: "", phone: "", email: "", area: "", experience: "",
    rightToWork: "", drive: "", car: "", dbs: "", dbsUpdate: "", gender: "",
  });
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const topRef = useRef(null);

  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));

  const validate = () => {
    const errs = {};
    for (const [k, msg] of Object.entries(REQUIRED)) {
      if (!String(v[k]).trim()) errs[k] = msg;
    }
    if (v.email && !EMAIL_RE.test(v.email)) errs.email = "Please check your email address.";
    // DBS-on-update only makes sense once "Do you have DBS" is answered; leave
    // it required either way — "N/A" is a valid answer for people without one.
    return errs;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (website) { setStatus("done"); return; } // bot: pretend success, send nothing
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setStatus("sending");

    const body = new URLSearchParams();
    if (cfg.collectsEmail) body.append("emailAddress", v.email);
    for (const [key, entry] of Object.entries(F)) {
      const val = v[key];
      if (entry && String(val).trim()) body.append(entry, val);
    }

    try {
      await fetch(cfg.action, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      // no-cors gives an opaque response; a resolved fetch means the POST left
      // the browser. Send them to the thank-you page like the other forms.
      window.location.assign("/thank-you");
    } catch {
      setStatus("error");
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (status === "done") {
    return (
      <SuccessPanel title="Thank you — your application is in">
        We have your details and we will be in touch. If you would rather talk
        now, call {site.business.phone}.
      </SuccessPanel>
    );
  }

  const YesNo = ({ k, label, options = O.yesNo }) => (
    <Field as="select" id={k} label={label} required error={errors[k]}
      value={v[k]} onChange={set(k)}>
      <option value="">Please choose…</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </Field>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6" ref={topRef}>
      <PrivacyNote>
        We use what you send only to consider your application and contact you
        about it. Your answers are recorded securely and handled in line with
        our privacy policy.
      </PrivacyNote>

      {status === "error" && (
        <ErrorPanel>
          Sorry — something went wrong sending your application. Please try again,
          or call us on {site.business.phone} and we will take your details over
          the phone.
        </ErrorPanel>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Full name" required error={errors.name}
          autoComplete="name" value={v.name} onChange={set("name")} />
        <Field id="phone" label="Phone number" type="tel" required error={errors.phone}
          autoComplete="tel" value={v.phone} onChange={set("phone")} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="email" label="Email" type="email" required error={errors.email}
          autoComplete="email" value={v.email} onChange={set("email")} />
        <Field id="area" label="Which town or area do you live in?" required
          error={errors.area} hint="So we can match you to work near you."
          value={v.area} onChange={set("area")} />
      </div>

      <Field as="select" id="experience" label="How long have you worked in care in the UK?"
        required error={errors.experience} value={v.experience} onChange={set("experience")}>
        <option value="">Please choose…</option>
        {O.experience.map((o) => <option key={o} value={o}>{o}</option>)}
      </Field>

      <Field id="rightToWork" label="Your right to work in the UK"
        required error={errors.rightToWork}
        hint="For example: British or Irish citizen, settled/pre-settled status, or your visa type."
        value={v.rightToWork} onChange={set("rightToWork")} />

      <div className="grid gap-5 sm:grid-cols-2">
        <YesNo k="drive" label="Do you drive?" />
        <YesNo k="car" label="Do you have access to your own car?" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <YesNo k="dbs" label="Do you have an enhanced DBS?" />
        <YesNo k="dbsUpdate" label="Is your DBS on the Update Service?" options={O.dbsUpdate} />
      </div>

      {/* Optional and clearly so — never required. Kept because the Google form
          has the field, but no applicant is forced to answer it. */}
      <Field as="select" id="gender" label="Gender (optional)"
        hint="You do not have to answer this."
        value={v.gender} onChange={set("gender")}>
        <option value="">Prefer not to say</option>
        {O.gender.map((o) => <option key={o} value={o}>{o}</option>)}
      </Field>

      <Honeypot value={website} onChange={(e) => setWebsite(e.target.value)} />

      <div className="space-y-3">
        <Button type="submit" size="lg" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send my application"}
        </Button>
        <p className="text-base text-textMuted">
          Prefer to talk first? Call{" "}
          <a href={site.business.phone_href}
            className="font-semibold text-primary-700 underline underline-offset-4">
            {site.business.phone}
          </a>.
        </p>
      </div>
    </form>
  );
};

export default OnSiteApplication;
