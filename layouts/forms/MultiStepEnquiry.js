"use client";

import { useRef, useState } from "react";
import Field from "@components/ui/Field";
import Button from "@components/ui/Button";
import { validators, validateAll } from "@lib/formValidation";
import { SuccessPanel, ErrorPanel, ErrorSummary } from "./FormStatus";
import site from "@config/site.json";
import { Check, ChevronLeft, ChevronRight, Send } from "lucide-react";

/**
 * Three-step enquiry form.
 *
 * Why steps rather than one long form: arranging care is often done by someone
 * stressed, on a phone, possibly elderly. A 9-field wall reads as work. Three
 * short screens with visible progress converts better and feels calmer.
 *
 * Accessibility decisions:
 *  - Steps are NOT tabs. The heading updates and receives focus on change, so
 *    screen-reader users are told where they are instead of silently landing
 *    mid-form.
 *  - Progress is a real <ol> with aria-current, plus an aria-live announcement.
 *  - Each step validates only its own fields; you can never be blocked by an
 *    error on a screen you cannot see.
 *  - The final step summarises the answers before sending, so nobody submits
 *    something they cannot re-read.
 *
 * Posts to /api/enquiry, which emails kp.rugby@kareplus.co.uk.
 */

const STEPS = [
  { id: "about", title: "Who is the care for?" },
  { id: "needs", title: "What support is needed?" },
  { id: "contact", title: "How can we reach you?" },
];

const WHO = [
  "Myself",
  "My parent",
  "My partner or spouse",
  "Another relative or friend",
  "A client (I am a professional)",
];

const WHEN = [
  "As soon as possible",
  "Within the next few weeks",
  "Within a few months",
  "Just researching for now",
];

const MultiStepEnquiry = ({ id = "enquiry" }) => {
  const fid = (n) => `${id}-${n}`;
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({
    who: WHO[0],
    when: WHEN[0],
    message: "",
    name: "",
    phone: "",
    email: "",
    consent: false,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [state, setState] = useState("idle");
  const [serverError, setServerError] = useState("");
  const headingRef = useRef(null);
  const summaryRef = useRef(null);

  // Only the fields on that screen — you can never be blocked by an unseen error.
  const SCHEMAS = [
    {},
    {
      message: [
        validators.required("A short description"),
        validators.minLength(10, "A short description"),
      ],
    },
    {
      name: [validators.required("Your name")],
      phone: [validators.required("Phone number"), validators.phone],
      email: [validators.required("Email address"), validators.email],
      consent: [
        validators.checked("You must agree to us contacting you about this enquiry"),
      ],
    },
  ];

  const set = (f) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setValues((s) => ({ ...s, [f]: v }));
    if (touched[f]) {
      setErrors((p) => ({
        ...p,
        [f]: validateAll({ ...values, [f]: v }, SCHEMAS[step])[f] || null,
      }));
    }
  };

  const blur = (f) => () => {
    setTouched((t) => ({ ...t, [f]: true }));
    setErrors((p) => ({ ...p, [f]: validateAll(values, SCHEMAS[step])[f] || null }));
  };

  const focusHeading = () =>
    requestAnimationFrame(() => headingRef.current?.focus());

  const next = () => {
    const found = validateAll(values, SCHEMAS[step]);
    setErrors(found);
    setTouched((t) => ({
      ...t,
      ...Object.keys(SCHEMAS[step]).reduce((a, k) => ({ ...a, [k]: true }), {}),
    }));
    if (Object.values(found).some(Boolean)) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    focusHeading();
  };

  const back = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
    focusHeading();
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validateAll(values, SCHEMAS[2]);
    setErrors(found);
    setTouched((t) => ({
      ...t,
      ...Object.keys(SCHEMAS[2]).reduce((a, k) => ({ ...a, [k]: true }), {}),
    }));
    if (Object.values(found).some(Boolean)) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setState("submitting");
    setServerError("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          subject: `${values.who} — ${values.when}`,
          message: values.message,
          consent: values.consent,
          enquiryType: "care",
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || `Request failed (${res.status})`);
      }
      setState("success");
    } catch (err) {
      setServerError(err.message);
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <SuccessPanel title="Thank you — your enquiry has been sent">
        <p>
          A care coordinator will get back to you, usually within one working
          day. If the situation is urgent, please call us on{" "}
          <a href={site.business.phone_href} className="font-semibold text-primary-700 underline underline-offset-4">
            {site.business.phone}
          </a>
          .
        </p>
      </SuccessPanel>
    );
  }

  const isLast = step === STEPS.length - 1;

  return (
    <form
      onSubmit={isLast ? submit : (e) => { e.preventDefault(); next(); }}
      noValidate
      id={id}
      className="rounded-card border border-border bg-white p-6 shadow-card md:p-8"
    >
      {/* Progress */}
      <ol className="mb-8 flex items-center gap-2" aria-label="Progress">
        {STEPS.map((s, i) => (
          <li key={s.id} className="flex flex-1 items-center gap-2">
            <span
              aria-current={i === step ? "step" : undefined}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                i < step
                  ? "bg-success text-white"
                  : i === step
                    ? "bg-primary-700 text-white"
                    : "bg-primary-100 text-primary-700"
              }`}
            >
              {i < step ? <Check aria-hidden="true" className="h-4 w-4" /> : i + 1}
              <span className="sr-only">
                Step {i + 1}
                {i < step ? " (completed)" : i === step ? " (current)" : ""}
              </span>
            </span>
            {i < STEPS.length - 1 && (
              <span
                aria-hidden="true"
                className={`h-0.5 flex-1 rounded ${i < step ? "bg-success" : "bg-primary-100"}`}
              />
            )}
          </li>
        ))}
      </ol>

      <p aria-live="polite" className="sr-only">
        Step {step + 1} of {STEPS.length}: {STEPS[step].title}
      </p>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-bold text-primary-950 focus:outline-none"
      >
        {STEPS[step].title}
      </h2>
      <p className="mt-1.5 text-textMuted">
        Step {step + 1} of {STEPS.length}
      </p>

      <div className="mt-6 space-y-5">
        <ErrorSummary errors={errors} refEl={summaryRef} idFor={fid} />
        {state === "error" && <ErrorPanel>{serverError}</ErrorPanel>}

        {step === 0 && (
          <>
            <Field
              id={fid("who")} as="select" label="Who needs support?"
              value={values.who} onChange={set("who")}
            >
              {WHO.map((o) => <option key={o} value={o}>{o}</option>)}
            </Field>
            <Field
              id={fid("when")} as="select" label="When would you like support to start?"
              value={values.when} onChange={set("when")}
            >
              {WHEN.map((o) => <option key={o} value={o}>{o}</option>)}
            </Field>
            <p className="rounded-card bg-primary-50 p-4 text-[15px] leading-relaxed text-text">
              There is no obligation at this stage, and no charge for an initial
              conversation or a home assessment.
            </p>
          </>
        )}

        {step === 1 && (
          <Field
            id={fid("message")} as="textarea" rows={7} required
            label="Tell us a little about what would help"
            hint="For example: help getting up and dressed in the mornings, company during the day, or overnight support. Don't worry about getting it exactly right."
            value={values.message} onChange={set("message")}
            onBlur={blur("message")} error={errors.message}
          />
        )}

        {step === 2 && (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id={fid("name")} label="Your name" required autoComplete="name"
                value={values.name} onChange={set("name")}
                onBlur={blur("name")} error={errors.name}
              />
              <Field
                id={fid("phone")} label="Phone number" type="tel" required autoComplete="tel"
                value={values.phone} onChange={set("phone")}
                onBlur={blur("phone")} error={errors.phone}
              />
            </div>
            <Field
              id={fid("email")} label="Email address" type="email" required autoComplete="email"
              value={values.email} onChange={set("email")}
              onBlur={blur("email")} error={errors.email}
            />

            {/* Review before sending */}
            <div className="rounded-card border border-border bg-surface p-4">
              <h3 className="text-sm font-bold uppercase tracking-wide text-textMuted">
                Your answers
              </h3>
              <dl className="mt-3 space-y-2 text-[15px]">
                <div className="flex gap-2">
                  <dt className="font-semibold text-text">Care for:</dt>
                  <dd className="text-textMuted">{values.who}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold text-text">Timescale:</dt>
                  <dd className="text-textMuted">{values.when}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-text">What would help:</dt>
                  <dd className="mt-1 whitespace-pre-line text-textMuted">
                    {values.message || "—"}
                  </dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={() => { setStep(1); focusHeading(); }}
                className="mt-3 text-sm font-semibold text-primary-700 underline underline-offset-4"
              >
                Change my answers
              </button>
            </div>

            <div>
              <div className="flex items-start gap-3">
                <input
                  id={fid("consent")} name="consent" type="checkbox"
                  checked={values.consent} onChange={set("consent")} onBlur={blur("consent")}
                  aria-invalid={errors.consent ? "true" : undefined}
                  aria-describedby={errors.consent ? fid("consent-error") : undefined}
                  className="mt-1 h-5 w-5 shrink-0 rounded border-borderStrong text-primary-700 focus:ring-2 focus:ring-primary-600"
                />
                <label htmlFor={fid("consent")} className="text-[15px] leading-relaxed text-text">
                  I agree to {site.business.trading_name} contacting me about this enquiry.
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
                . Please do not include medical records here.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
        {step > 0 ? (
          <Button type="button" variant="ghost" onClick={back}>
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
            Back
          </Button>
        ) : (
          <span />
        )}

        <Button type="submit" size="lg" disabled={state === "submitting"}>
          {isLast ? (
            state === "submitting" ? "Sending…" : <>Send enquiry <Send aria-hidden="true" className="h-4 w-4" /></>
          ) : (
            <>Continue <ChevronRight aria-hidden="true" className="h-5 w-5" /></>
          )}
        </Button>
      </div>
    </form>
  );
};

export default MultiStepEnquiry;
