/**
 * Shared client-side validation.
 *
 * Deliberately permissive on names and phone numbers: over-strict validation
 * on a care site locks out real people (double-barrelled names, apostrophes,
 * spaces in phone numbers, international formats). The job here is to catch
 * obvious mistakes, not to police formatting.
 *
 * Server-side validation still has to exist independently - see the API route
 * stubs. Client validation is a convenience, never a security control.
 */

export const UK_PHONE = /^(?:(?:\+|00)44|0)\s?\d(?:[\s-]?\d){8,10}$/;
// Intentionally simple: the only reliable email test is sending one.
export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const validators = {
  required: (label) => (v) =>
    !v || (typeof v === "string" && !v.trim()) ? `${label} is required` : null,

  email: (v) =>
    !v || EMAIL.test(v.trim()) ? null : "Enter an email address in the format name@example.com",

  phone: (v) =>
    !v || UK_PHONE.test(v.trim().replace(/\(|\)/g, ""))
      ? null
      : "Enter a UK phone number, for example 01788 422422 or 07700 900000",

  minLength: (n, label) => (v) =>
    !v || v.trim().length >= n
      ? null
      : `${label} must be at least ${n} characters`,

  checked: (msg) => (v) => (v ? null : msg),
};

/** Run a field's validator list, returning the first error found. */
export function validateField(value, rules = []) {
  for (const rule of rules) {
    const err = rule(value);
    if (err) return err;
  }
  return null;
}

/** Validate a whole values object against a schema of {field: [rules]}. */
export function validateAll(values, schema) {
  const errors = {};
  for (const [field, rules] of Object.entries(schema)) {
    const err = validateField(values[field], rules);
    if (err) errors[field] = err;
  }
  return errors;
}

/* ---- CV upload constraints ---- */

export const CV_MAX_BYTES = 5 * 1024 * 1024; // 5 MB
export const CV_ACCEPT = ".pdf,.doc,.docx,.rtf,.odt";
const CV_EXTENSIONS = ["pdf", "doc", "docx", "rtf", "odt"];

export function validateCv(file) {
  if (!file) return null; // optional
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!CV_EXTENSIONS.includes(ext)) {
    return `Upload a ${CV_EXTENSIONS.join(", ")} file. "${file.name}" is not a supported format.`;
  }
  if (file.size > CV_MAX_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    return `Your file is ${mb} MB. The maximum size is 5 MB.`;
  }
  return null;
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
