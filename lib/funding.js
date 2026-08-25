/**
 * Care funding figures for the /paying-for-care page.
 *
 * EVERY NUMBER HERE WAS CHECKED AGAINST GOV.UK ON 2026-08-25. Sources are on
 * each entry. These are national rules for ENGLAND and they are not our
 * figures - we do not decide any of them, the council and the DWP do.
 *
 * ⚠️ REVIEW EVERY APRIL. The capital limits have been frozen for years but the
 * Minimum Income Guarantee and Attendance Allowance rise most years. A care
 * website quoting last year's benefit rate is worse than one quoting none,
 * because people plan around it. If you cannot re-check them, delete the page
 * rather than let it go stale.
 *
 * NOTHING HERE IS ADVICE ABOUT OUR PRICES. It explains how public funding
 * works, which is what people actually search for and what nobody in our
 * market explains properly.
 */

export const CHECKED_ON = "25 August 2026";
export const REVIEW_BY = "April 2027";
export const TAX_YEAR = "2026/27";

export const FUNDING = {
  // Care and Support (Charging and Assessment of Resources) Regulations 2014,
  // as uprated by the 2026-27 local authority circular.
  upperCapitalLimit: "£23,250",
  lowerCapitalLimit: "£14,250",
  tariffIncome: "£1 a week for every £250",

  // Minimum Income Guarantee - the amount you must be left with after paying
  // for care AT HOME. Different from the care home Personal Expenses Allowance.
  migPensionAge: "£241.45",
  migUnderPensionAge: "£120.40",

  // Attendance Allowance. NOT means-tested - the single most under-claimed
  // thing we see.
  attendanceLower: "£76.70",
  attendanceHigher: "£114.60",
};

/** Where each figure came from, shown on the page so people can check us. */
export const SOURCES = [
  {
    label: "Capital limits and Minimum Income Guarantee",
    href: "https://www.gov.uk/government/publications/social-care-charging-for-local-authorities-2026-to-2027/social-care-charging-for-care-and-support-2026-to-2027-local-authority-circular",
    note: "Social care charging for care and support 2026 to 2027, GOV.UK",
  },
  {
    label: "Attendance Allowance rates",
    href: "https://www.gov.uk/attendance-allowance/what-youll-get",
    note: "Attendance Allowance, GOV.UK",
  },
  {
    label: "Your right to a free needs assessment",
    href: "https://www.gov.uk/apply-needs-assessment-social-services",
    note: "Get a social care needs assessment, GOV.UK",
  },
  {
    label: "NHS Continuing Healthcare",
    href: "https://www.nhs.uk/conditions/social-care-and-support-guide/money-work-and-benefits/nhs-continuing-healthcare/",
    note: "NHS Continuing Healthcare, NHS",
  },
  {
    label: "Carer's Allowance",
    href: "https://www.gov.uk/carers-allowance",
    note: "Carer's Allowance, GOV.UK",
  },
];
