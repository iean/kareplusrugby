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

/**
 * Job application form for carers and nurses.
 *
 * NOTE ON DELIVERY: posts multipart/form-data to /api/apply, which is a STUB.
 * It validates the payload and returns success but does not store the CV or
 * email anyone - there is no file storage or email service configured. See
 * OVERNIGHT_REPORT.md for what needs connecting.
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

const AVAILABILITY = [
  "Full time",
  "Part time",
  "Bank / ad-hoc shifts",
  "Nights only",
  "Weekends only",
];

const ApplicationForm = ({ id = "apply" }) => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    postcode: "",
    role: ROLES[0],
    availability: AVAILABILITY[0],
    experience: "",
    rightToWork: false,
    driver: false,
    consent: false,
  });
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
    <form onSubmit={onSubmit} noValidate className="space-y-6" id={id}>
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
          <Field id="availability" as="select" label="Availability"
            value={values.availability} onChange={set("availability")}>
            {AVAILABILITY.map((a) => <option key={a} value={a}>{a}</option>)}
          </Field>
        </div>

        <Field
          id="experience" as="textarea" rows={6} required
          label="Tell us about your experience"
          hint="Any care experience you have, and what you enjoy about the work. If you are new to care, say so — we recruit people new to the sector too."
          value={values.experience} onChange={set("experience")}
          onBlur={blur("experience")} error={errors.experience}
        />

        <div className="space-y-3">
          {[
            ["rightToWork", "I have the right to work in the UK"],
            ["driver", "I have a driving licence and access to a car"],
          ].map(([field, label]) => (
            <div key={field} className="flex items-start gap-3">
              <input
                id={field} name={field} type="checkbox"
                checked={values[field]} onChange={set(field)}
                className="mt-1 h-5 w-5 shrink-0 rounded border-borderStrong text-primary-700 focus:ring-2 focus:ring-primary-600"
              />
              <label htmlFor={field} className="text-[15px] leading-relaxed text-text">
                {label}
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      {/* CV upload */}
      <fieldset className="space-y-3">
        <legend className="text-lg font-bold text-primary-950">
          Your CV <span className="font-normal text-textMuted">(optional)</span>
        </legend>
        <label htmlFor="cv" className="mb-1.5 block text-sm font-semibold text-primary-950">
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
          className="block w-full cursor-pointer rounded-btn border border-borderStrong bg-white text-base text-text file:mr-4 file:cursor-pointer file:border-0 file:bg-primary-50 file:px-5 file:py-3 file:text-[15px] file:font-semibold file:text-primary-800 hover:file:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-600"
        />
        <p id="cv-hint" className="text-sm text-textMuted">
          PDF, DOC, DOCX, RTF or ODT. Maximum 5 MB. You can also send it later
          if you don&apos;t have it to hand.
        </p>
        {cv && !errors.cv && (
          <p role="status" className="flex items-center gap-2 text-sm font-medium text-success">
            <span aria-hidden="true">✓</span> {cv.name} ({formatBytes(cv.size)}) ready to send
          </p>
        )}
        {errors.cv && (
          <p id="cv-error" role="alert" className="text-sm font-medium text-danger">
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
          <label htmlFor="consent" className="text-[15px] leading-relaxed text-text">
            I agree to Kare Plus Rugby storing the details I have given
            here so my application can be considered.
            <span aria-hidden="true" className="ml-0.5 text-danger">*</span>
            <span className="sr-only"> (required)</span>
          </label>
        </div>
        {errors.consent && (
          <p id="consent-error" role="alert" className="mt-1.5 text-sm font-medium text-danger">
            ⚠ {errors.consent}
          </p>
        )}
        <p className="mt-3 text-sm text-textMuted">
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
