/**
 * The published pay figures, derived from config/site.json.
 *
 * WHY THE SPLIT IS ALWAYS SHOWN. £14.24 is not an hourly wage. It is £12.71 of
 * wage plus £1.53 of rolled-up holiday pay — money the worker would otherwise
 * receive when they take leave, brought forward and paid with each wage. To
 * advertise £14.24 as "the hourly rate" would overstate what a carer earns for
 * the hour, which is the practice the care sector is criticised for. So every
 * place on the site that shows pay shows both numbers and says which is which.
 *
 * All four legal conditions for rolled-up holiday pay were confirmed by Alif on
 * 2026-08-24 — see the _comment on business.pay in config/site.json. It is
 * lawful only for irregular-hours and part-year workers.
 *
 * Change the numbers in config/site.json, never here.
 */
import site from "../config/site.json";

const p = site.business.pay;

export const PAY = {
  basic: p.basic_hourly,
  uplift: p.holiday_uplift_percent,
  total: p.total_hourly,

  /** "£12.71" */
  basicLabel: `£${p.basic_hourly.toFixed(2)}`,
  /** "£14.24" */
  totalLabel: `£${p.total_hourly.toFixed(2)}`,
  /** "12.07%" */
  upliftLabel: `${p.holiday_uplift_percent}%`,

  /** One honest sentence. Used wherever a short form is needed. */
  short: `£${p.basic_hourly.toFixed(2)} an hour, plus ${p.holiday_uplift_percent}% holiday pay — £${p.total_hourly.toFixed(2)} for every hour you work.`,

  /**
   * Forward-looking note for the public pages. The basic rate is the National
   * Living Wage, which the government raises each April, so the figure above is
   * current rather than fixed forever. Saying so is both honest and useful to a
   * candidate — and it means the published number is not read as a permanent
   * promise. Kept here so every page that mentions it stays consistent.
   */
  reviewNote: `This is our current rate. The basic hourly rate is the National Living Wage and is reviewed at least every April, in line with the legal minimum, so it rises over time rather than staying fixed.`,
};

/**
 * Guard against the two numbers drifting apart in config/site.json. A published
 * total that does not equal basic + uplift would be a misleading pay advert, so
 * fail the build rather than ship it.
 */
const derived = Math.round(p.basic_hourly * (1 + p.holiday_uplift_percent / 100) * 100) / 100;
if (Math.abs(derived - p.total_hourly) > 0.01) {
  throw new Error(
    `config/site.json business.pay is inconsistent: ${p.basic_hourly} + ${p.holiday_uplift_percent}% = ${derived}, but total_hourly says ${p.total_hourly}.`,
  );
}

export default PAY;
