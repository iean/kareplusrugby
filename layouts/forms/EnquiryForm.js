"use client";

import { useRef, useState } from "react";
import Field from "@components/ui/Field";
import Button from "@components/ui/Button";
import { validators, validateAll } from "@lib/formValidation";
import { SuccessPanel, ErrorPanel, ErrorSummary } from "./FormStatus";

/**
 * Enquiry form, used in four configurations: home-care enquiry, professional
 * referral, care-home staffing request, and general contact.
 *
 * NOTE ON DELIVERY: posts to /api/enquiry, which is a STUB. It validates and
 * logs but does not yet email or store anything. See OVERNIGHT_REPORT.md -
 * an email service and a destination address are needed from the client.
 */

const VARIANTS = {
  care: {
    heading: "Enquire about care at home",
    intro:
      "Tell us a little about the situation and we will call you back to talk it through. There is no obligation and no cost for an initial conversation.",
    successTitle: "Thank you — your enquiry has been sent",
    successBody:
      "A care coordinator will get back to you, usually within one working day. If your situation is urgent, please call us instead.",
    subjectLabel: "Who is the care for?",
    subjectOptions: [
      "Myself",
      "My parent",
      "My partner or spouse",
      "Another relative or friend",
      "A client (I am a professional)",
    ],
    detailLabel: "What kind of support are you looking for?",
    detailHint:
      "For example: help getting up and dressed in the mornings, company during the day, or overnight support.",
  },
  referral: {
    heading: "Make a professional referral",
    intro:
      "For social workers, discharge teams, GPs and other professionals referring someone for care.",
    successTitle: "Referral received",
    successBody:
      "Our team will review the referral and contact you to confirm next steps. If this is a hospital discharge with a deadline, please call us so we can prioritise it.",
    subjectLabel: "Type of referral",
    subjectOptions: [
      "Hospital discharge",
      "Social services package",
      "Reablement",
      "Continuing healthcare",
      "Other",
    ],
    detailLabel: "Referral details",
    detailHint:
      "Please include the level of need and any timescales. Do not include clinical records or NHS numbers in this form.",
  },
  staffing: {
    heading: "Request staff for your home",
    intro:
      "Tell us what you need covered and we will come back to you with availability.",
    successTitle: "Request received",
    successBody:
      "Our staffing team will confirm availability with you shortly. For shifts starting within 24 hours, please call us so we can act on it immediately.",
    subjectLabel: "What roles do you need?",
    subjectOptions: [
      "Registered nurse (RGN)",
      "Registered mental health nurse (RMN)",
      "Senior carer",
      "Care assistant",
      "A mix of roles",
    ],
    detailLabel: "Shifts required",
    detailHint:
      "For example: 3 night shifts a week for 4 weeks, starting Monday. Include your home's location.",
  },
  general: {
    heading: "Send us a message",
    intro: "For anything else — we will point you to the right person.",
    successTitle: "Message sent",
    successBody: "Thanks for getting in touch. We will reply as soon as we can.",
    subjectLabel: "What is your enquiry about?",
    subjectOptions: [
      "Care at home",
      "Care home staffing",
      "Supported living",
      "Working for us",
      "Something else",
    ],
    detailLabel: "Your message",
    detailHint: null,
  },
};

const EnquiryForm = ({ variant = "general", id = "enquiry" }) => {
  const cfg = VARIANTS[variant];
  // Two EnquiryForms can be mounted at once (the contact page tabs), so field
  // ids must be namespaced. Duplicate ids break label/for associations and
  // aria-describedby, and are an accessibility failure in their own right.
  const fid = (name) => `${id}-${name}`;
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    subject: cfg.subjectOptions[0],
    organisation: "",
    message: "",
    consent: false,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [state, setState] = useState("idle"); // idle | submitting | success | error
  const [serverError, setServerError] = useState("");
  const summaryRef = useRef(null);

  const needsOrg = variant === "staffing" || variant === "referral";

  const schema = {
    name: [validators.required("Your name")],
    email: [validators.required("Email address"), validators.email],
    phone: [validators.required("Phone number"), validators.phone],
    message: [
      validators.required(cfg.detailLabel),
      validators.minLength(10, cfg.detailLabel),
    ],
    ...(needsOrg
      ? { organisation: [validators.required("Organisation")] }
      : {}),
    consent: [
      validators.checked(
        "You must agree to us contacting you about this enquiry"
      ),
    ],
  };

  const set = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setValues((v) => ({ ...v, [field]: value }));
    // Re-validate a field only once it has been blurred, so errors do not
    // appear while someone is still typing their first character.
    if (touched[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: validateAll({ ...values, [field]: value }, schema)[field] || null,
      }));
    }
  };

  const blur = (field) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateAll(values, schema)[field] || null }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validateAll(values, schema);
    setErrors(found);
    setTouched(
      Object.keys(schema).reduce((a, k) => ({ ...a, [k]: true }), {})
    );

    if (Object.values(found).some(Boolean)) {
      // Move focus to the summary so the problem is announced immediately.
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setState("submitting");
    setServerError("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, enquiryType: variant }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      setState("success");
    } catch (err) {
      setServerError(err.message);
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <SuccessPanel title={cfg.successTitle}>
        <p>{cfg.successBody}</p>
      </SuccessPanel>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6" id={id}>
      <div>
        <h2 className="text-2xl font-bold text-primary-950">{cfg.heading}</h2>
        <p className="mt-2 leading-relaxed text-textMuted">{cfg.intro}</p>
      </div>

      <ErrorSummary errors={errors} refEl={summaryRef} idFor={fid} />
      {state === "error" && <ErrorPanel>{serverError}</ErrorPanel>}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={fid("name")}
          label="Your name"
          required
          autoComplete="name"
          value={values.name}
          onChange={set("name")}
          onBlur={blur("name")}
          error={errors.name}
        />
        <Field
          id={fid("phone")}
          label="Phone number"
          type="tel"
          required
          autoComplete="tel"
          value={values.phone}
          onChange={set("phone")}
          onBlur={blur("phone")}
          error={errors.phone}
        />
      </div>

      <Field
        id={fid("email")}
        label="Email address"
        type="email"
        required
        autoComplete="email"
        value={values.email}
        onChange={set("email")}
        onBlur={blur("email")}
        error={errors.email}
      />

      {needsOrg && (
        <Field
          id={fid("organisation")}
          label={variant === "staffing" ? "Care home / organisation" : "Your organisation"}
          required
          autoComplete="organization"
          value={values.organisation}
          onChange={set("organisation")}
          onBlur={blur("organisation")}
          error={errors.organisation}
        />
      )}

      <Field
        id={fid("subject")}
        as="select"
        label={cfg.subjectLabel}
        value={values.subject}
        onChange={set("subject")}
      >
        {cfg.subjectOptions.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </Field>

      <Field
        id={fid("message")}
        as="textarea"
        label={cfg.detailLabel}
        hint={cfg.detailHint}
        required
        rows={6}
        value={values.message}
        onChange={set("message")}
        onBlur={blur("message")}
        error={errors.message}
      />

      <div>
        <div className="flex items-start gap-3">
          <input
            id={fid("consent")}
            name="consent"
            type="checkbox"
            checked={values.consent}
            onChange={set("consent")}
            onBlur={blur("consent")}
            aria-invalid={errors.consent ? "true" : undefined}
            aria-describedby={errors.consent ? fid("consent-error") : undefined}
            className="mt-1 h-5 w-5 shrink-0 rounded border-borderStrong text-primary-700 focus:ring-2 focus:ring-primary-600"
          />
          <label htmlFor={fid("consent")} className="text-[15px] leading-relaxed text-text">
            I agree to Kare Plus Rugby contacting me about this enquiry.
            <span aria-hidden="true" className="ml-0.5 text-danger">*</span>
            <span className="sr-only"> (required)</span>
          </label>
        </div>
        {errors.consent && (
          <p id={fid("consent-error")} role="alert" className="mt-1.5 text-sm font-medium text-danger">
            ⚠ {errors.consent}
          </p>
        )}
        <p className="mt-3 text-sm text-textMuted">
          We use your details only to respond to this enquiry. Read our{" "}
          <a href="/privacy-policy" className="font-medium text-primary-700 underline underline-offset-4">
            privacy policy
          </a>
          . Please do not include medical records or other sensitive detail in
          this form.
        </p>
      </div>

      <Button type="submit" size="lg" disabled={state === "submitting"}>
        {state === "submitting" ? "Sending…" : "Send enquiry"}
      </Button>
    </form>
  );
};

export default EnquiryForm;
