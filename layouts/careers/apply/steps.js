/**
 * Step definitions for the application wizard.
 *
 * Order and wording follow RECRUITMENT-SPEC.md sections 1-9. Kept in one place
 * so the progress indicator, the review page and the server-side validation
 * all read from the same list and cannot drift apart.
 */
export const STEPS = [
  { id: "about",       title: "About you",           short: "About you" },
  { id: "role",        title: "The role",            short: "Role" },
  { id: "eligibility", title: "Eligibility",         short: "Eligibility" },
  { id: "availability",title: "Availability",        short: "Availability" },
  { id: "history",     title: "Employment history",  short: "History" },
  { id: "quals",       title: "Qualifications",      short: "Quals" },
  { id: "references",  title: "References",          short: "References" },
  { id: "declarations",title: "Declarations",        short: "Declarations" },
  { id: "review",      title: "Check your answers",  short: "Review" },
];

export const HOURS = [
  "Under 16 hours",
  "16 to 24 hours",
  "25 to 34 hours",
  "35+ hours",
  "Flexible",
];

export const CONTRACT = ["Full time", "Part time", "Bank / ad-hoc", "Flexible"];

export const NOTICE = [
  "I work a fixed weekly pattern",
  "A week at a time",
  "Two weeks at a time",
  "A month at a time",
  "It varies",
];

export const YES_NO = ["Yes", "No"];
export const RTW = ["Yes", "No", "I would prefer to discuss this"];
export const DBS_HELD = ["Yes", "No", "I have applied for one"];
export const DBS_UPDATE = ["Yes", "No", "Not sure"];
