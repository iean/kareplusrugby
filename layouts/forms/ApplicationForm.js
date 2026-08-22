"use client";

import { useRef, useState } from "react";
import Field from "@components/ui/Field";
import Button from "@components/ui/Button";
import {
  validators,
  validateAll,
  validateCv,
  CV_ACCEPT,
  formatBytes,
} from "@lib/formValidation";
import { SuccessPanel, ErrorPanel, ErrorSummary } from "./FormStatus";
import { Honeypot, PrivacyNote } from "./FormExtras";

/**
 * Job application form for carers and nurses.
 *
 * DELIVERY: posts multipart/form-data to /api/apply, which emails the
 * application to params.contact_email with the CV as an attachment and stores
 * nothing. (An older comment here called that route a stub; it has not been
 * one for some time.) It returns 503 if EMAIL_USER / EMAIL_PASS are unset, and
 * this form surfaces that as a visible error rather than a false success.
 *
 * TODO: confirm which inbox job applications should reach. They currently go
 * to the single business address in config/config.json. config/site.json has a
 * `careers_email` key, but it is set to that same address, so it is not clear
 * whether a separate recruitment inbox is wanted.
 *
 * The CV field is optional on purpose: plenty of good care applicants do not
 * have a CV to hand on a phone, and making it mandatory loses them. They can
 * send it later.
 */

const ROLES = [
  "Care Assistant",
  "Senior Care Assistant",
  "Registered Nurse (RGN)",
  "Registered Mental Health Nurse (RMN)",
  "Support Worker (Supported Living)",
  "Live-in Carer",
  "Not sure — happy to be advised",
];

/**
 * Availability is a checkbox group, not a single choice: most carers are
 * available for more than one of these, and forcing one answer loses that.
 */
const AVAILABILITY = [
  ["weekdayMornings", "Weekday mornings"],
  ["weekdayEvenings", "Weekday evenings"],
  ["weekends", "Weekends"],
  ["nights", "Nights"],
  ["liveIn", "Live-in"],
];

const EXPERIENCE_LEVELS = [
  "None — I am new to care",
  "Under 1 year",
  "1–3 years",
  "3+ years",
];

/**
 * "Not sure" is a real answer here. Plenty of applicants hold an enhanced DBS
 * without knowing whether it is on the update service, and forcing a yes/no
 * would just produce wrong data.
 */
const DBS_OPTIONS = ["Yes", "No", "Not sure"];

const ApplicationForm = ({ id = "apply" }) => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    postcode: "",
    role: ROLES[0],
    experienceLevel: "",
    dbs: "",
    rightToWork: "",
    driver: "",
    experience: "",
    anythingElse: "",
    website: "", // honeypot - see FormExtras
    consent: false,
  });
  const [availability, setAvailability] = useState([]);
  const [cv, setCv] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [state, setState] = useState("idle");
  const [serverError, setServerError] = useState("");
  const summaryRef = useRef(null);
  const fileRef = useRef(null);

  const schema = {
    firstName: [validators.required("First name")],
    lastName: [validators.required("Last name")],
    email: [validators.required("Email address"), validators.email],
    phone: [validators.required("Phone number"), validators.phone],
    postcode: [validators.required("Postcode")],
    experienceLevel: [validators.required("Care experience")],
    rightToWork: [validators.required("Right to work in the UK")],
    experience: [
      validators.required("Experience"),
      validators.minLength(10, "Experience"),
    ],
    consent: [
      validators.checked(
        "You must agree to us storing your details to process your application"
      ),
    ],
  };

  const set = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setValues((v) => ({ ...v, [field]: value }));
    if (touched[field]) {
      setErrors((p) => ({
        ...p,
        [field]: validateAll({ ...values, [field]: value }, schema)[field] || null,
      }));
    }
  };

  const blur = (field) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((p) => ({ ...p, [field]: validateAll(values, schema)[field] || null }));
  };

  const onFile = (e) => {
    const file = e.target.files?.[0] || null;
    const err = validateCv(file);
    setErrors((p) => ({ ...p, cv: err }));
    setCv(err ? null : file);
    if (err && fileRef.current) fileRef.current.value = "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validateAll(values, schema);
    const cvErr = validateCv(cv);
    if (cvErr) found.cv = cvErr;
    setErrors(found);
    setTouched(Object.keys(schema).reduce((a, k) => ({ ...a, [k]: true }), {}));

    if (Object.values(found).some(Boolean)) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setState("submitting");
    setServerError("");
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => fd.append(k, String(v)));
      // Sent as one readable string so the email is legible without the
      // recipient having to decode five separate boolean fields.
      fd.append(
        "availability",
        availability.length
          ? AVAILABILITY.filter(([k]) => availability.includes(k))
              .map(([, label]) => label)
              .join(", ")
          : "Not specified",
      );
      if (cv) fd.append("cv", cv);

      const res = await fetch("/api/apply", { method: "POST", body: fd });
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
      <SuccessPanel title="Application received — thank you">
        <p>
          Thanks for applying to join Kare Plus Rugby. Someone from our
          recruitment team will be in touch to talk about the role and the next
          steps.
        </p>
        <p>
          If you did not attach a CV, don&apos;t worry — we will ask for one if
          we need it.
        </p>
      </SuccessPanel>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-6" id={id}>
      <PrivacyNote>
        We use what you send here to consider your application and to contact
        you about it. It is emailed to our recruitment team and is not stored
        on this website.
      </PrivacyNote>

      <Honeypot value={values.website} onChange={set("website")} />

      <ErrorSummary errors={errors} refEl={summaryRef} />
      {state === "error" && <ErrorPanel>{serverError}</ErrorPanel>}

      <fieldset className="space-y-5">
        <legend className="text-lg font-bold text-primary-950">
          About you
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="firstName" label="First name" required autoComplete="given-name"
            value={values.firstName} onChange={set("firstName")}
            onBlur={blur("firstName")} error={errors.firstName}
          />
          <Field
            id="lastName" label="Last name" required autoComplete="family-name"
            value={values.lastName} onChange={set("lastName")}
            onBlur={blur("lastName")} error={errors.lastName}
          />
          <Field
            id="email" label="Email address" type="email" required autoComplete="email"
            value={values.email} onChange={set("email")}
            onBlur={blur("email")} error={errors.email}
          />
          <Field
            id="phone" label="Phone number" type="tel" required autoComplete="tel"
            value={values.phone} onChange={set("phone")}
            onBlur={blur("phone")} error={errors.phone}
          />
        </div>
        <Field
          id="postcode" label="Postcode" required autoComplete="postal-code"
          hint="So we can match you to work near you."
          className="sm:max-w-xs"
          value={values.postcode} onChange={set("postcode")}
          onBlur={blur("postcode")} error={errors.postcode}
        />
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-lg font-bold text-primary-950">
          The role
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="role" as="select" label="Role you are interested in"
            value={values.role} onChange={set("role")}>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </Field>
          <Field
            id="experienceLevel" as="select" required
            label="How much care experience do you have?"
            value={values.experienceLevel} onChange={set("experienceLevel")}
            onBlur={blur("experienceLevel")} error={errors.experienceLevel}
          >
            <option value="">Please choose…</option>
            {EXPERIENCE_LEVELS.map((e) => <option key={e} value={e}>{e}</option>)}
          </Field>
        </div>

        <Field
          id="dbs" as="select"
          label="Do you have a current enhanced DBS on the update service?"
          hint="If you are not sure, say so — it does not count against you, and we can check for you."
          className="sm:max-w-md"
          value={values.dbs} onChange={set("dbs")}
        >
          <option value="">Please choose…</option>
          {DBS_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
        </Field>

        {/* Availability: a real fieldset with a legend, so screen readers
            announce what the group of checkboxes is for. */}
        <fieldset>
          <legend className="mb-1.5 block text-base font-semibold text-primary-950">
            When are you available to work?
          </legend>
          <p id="availability-hint" className="mb-3 text-base text-textMuted">
            Tick everything that could work for you. Nothing here is a
            commitment — it just helps us match you to shifts.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {AVAILABILITY.map(([key, label]) => (
              <div key={key} className="flex items-start gap-3">
                <input
                  id={`availability-${key}`}
                  name="availabilityOptions"
                  type="checkbox"
                  value={label}
                  checked={availability.includes(key)}
                  aria-describedby="availability-hint"
                  onChange={(e) =>
                    setAvailability((prev) =>
                      e.target.checked
                        ? [...prev, key]
                        : prev.filter((k) => k !== key),
                    )
                  }
                  className="mt-1 h-5 w-5 shrink-0 rounded border-borderStrong text-primary-700 focus:ring-2 focus:ring-primary-600"
                />
                <label
                  htmlFor={`availability-${key}`}
                  className="text-base leading-relaxed text-text"
                >
                  {label}
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        <Field
          id="experience" as="textarea" rows={6} required
          label="Tell us about your experience"
          hint="Any care experience you have, and what you enjoy about the work. If you are new to care, say so — we recruit people new to the sector too."
          value={values.experience} onChange={set("experience")}
          onBlur={blur("experience")} error={errors.experience}
        />

        {/* Yes/no as radios rather than a single checkbox. An unticked
            checkbox cannot distinguish "no" from "did not answer", which
            matters when the answer changes what we can offer someone. */}
        {[
          {
            name: "rightToWork",
            legend: "Do you have the right to work in the UK?",
            required: true,
          },
          {
            name: "driver",
            legend: "Do you have a driving licence and access to a car?",
            hint: "Not essential for every role, but it opens up more work.",
          },
        ].map((q) => (
          <fieldset key={q.name}>
            <legend className="mb-1.5 block text-base font-semibold text-primary-950">
              {q.legend}
              {q.required && (
                <>
                  <span aria-hidden="true" className="ml-0.5 text-danger">*</span>
                  <span className="sr-only"> (required)</span>
                </>
              )}
            </legend>
            {q.hint && (
              <p id={`${q.name}-hint`} className="mb-3 text-base text-textMuted">
                {q.hint}
              </p>
            )}
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {["Yes", "No"].map((opt) => (
                <div key={opt} className="flex items-center gap-3">
                  <input
                    id={`${q.name}-${opt}`}
                    name={q.name}
                    type="radio"
                    value={opt}
                    checked={values[q.name] === opt}
                    onChange={set(q.name)}
                    onBlur={q.required ? blur(q.name) : undefined}
                    aria-invalid={errors[q.name] ? "true" : undefined}
                    aria-describedby={
                      [q.hint ? `${q.name}-hint` : null,
                       errors[q.name] ? `${q.name}-error` : null]
                        .filter(Boolean).join(" ") || undefined
                    }
                    className="h-5 w-5 shrink-0 border-borderStrong text-primary-700 focus:ring-2 focus:ring-primary-600"
                  />
                  <label
                    htmlFor={`${q.name}-${opt}`}
                    className="text-base leading-relaxed text-text"
                  >
                    {opt}
                  </label>
                </div>
              ))}
            </div>
            {errors[q.name] && (
              <p id={`${q.name}-error`} role="alert" className="mt-1.5 text-base font-medium text-danger">
                <span aria-hidden="true">⚠ </span>{errors[q.name]}
              </p>
            )}
          </fieldset>
        ))}

        <Field
          id="anythingElse" as="textarea" rows={4}
          label="Anything else you would like us to know?"
          hint="Optional. Anything that would help us understand your situation — hours you cannot do, a gap in your CV, adjustments you need at interview."
          value={values.anythingElse} onChange={set("anythingElse")}
        />
      </fieldset>

      {/* CV upload */}
      <fieldset className="space-y-3">
        <legend className="text-lg font-bold text-primary-950">
          Your CV <span className="font-normal text-textMuted">(optional)</span>
        </legend>
        <label htmlFor="cv" className="mb-1.5 block text-base font-semibold text-primary-950">
          Upload a CV
        </label>
        <input
          ref={fileRef}
          id="cv"
          name="cv"
          type="file"
          accept={CV_ACCEPT}
          onChange={onFile}
          aria-describedby={errors.cv ? "cv-error cv-hint" : "cv-hint"}
          aria-invalid={errors.cv ? "true" : undefined}
          className="block w-full cursor-pointer rounded-btn border border-borderStrong bg-white text-base text-text file:mr-4 file:cursor-pointer file:border-0 file:bg-primary-50 file:px-5 file:py-3 file:text-base file:font-semibold file:text-primary-800 hover:file:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-600"
        />
        <p id="cv-hint" className="text-base text-textMuted">
          PDF, DOC, DOCX, RTF or ODT. Maximum 5 MB. You can also send it later
          if you don&apos;t have it to hand.
        </p>
        {cv && !errors.cv && (
          <p role="status" className="flex items-center gap-2 text-base font-medium text-success">
            <span aria-hidden="true">✓</span> {cv.name} ({formatBytes(cv.size)}) ready to send
          </p>
        )}
        {errors.cv && (
          <p id="cv-error" role="alert" className="text-base font-medium text-danger">
            ⚠ {errors.cv}
          </p>
        )}
      </fieldset>

      <div>
        <div className="flex items-start gap-3">
          <input
            id="consent" name="consent" type="checkbox"
            checked={values.consent} onChange={set("consent")} onBlur={blur("consent")}
            aria-invalid={errors.consent ? "true" : undefined}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            className="mt-1 h-5 w-5 shrink-0 rounded border-borderStrong text-primary-700 focus:ring-2 focus:ring-primary-600"
          />
          <label htmlFor="consent" className="text-base leading-relaxed text-text">
            I agree to Kare Plus Rugby storing the details I have given
            here so my application can be considered.
            <span aria-hidden="true" className="ml-0.5 text-danger">*</span>
            <span className="sr-only"> (required)</span>
          </label>
        </div>
        {errors.consent && (
          <p id="consent-error" role="alert" className="mt-1.5 text-base font-medium text-danger">
            ⚠ {errors.consent}
          </p>
        )}
        <p className="mt-3 text-base text-textMuted">
          All roles are subject to an enhanced DBS check and satisfactory
          references. Read our{" "}
          <a href="/privacy-policy" className="font-medium text-primary-700 underline underline-offset-4">
            privacy policy
          </a>{" "}
          to see how we handle applicant data.
        </p>
      </div>

      <Button type="submit" size="lg" disabled={state === "submitting"}>
        {state === "submitting" ? "Sending your application…" : "Submit application"}
      </Button>
    </form>
  );
};

export default ApplicationForm;
