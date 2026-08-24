import LegalPage from "@components/ui/LegalPage";
import site from "@config/site.json";

/**
 * Adult safeguarding contacts for every area Kare Plus Rugby covers.
 *
 * Every number below was re-verified on 22 August 2026 against the council's
 * own website, not from memory. Do not edit these from memory - a wrong number
 * here means someone reporting abuse reaches nobody. The `source` URL on each
 * row is where the number came from; re-check there before changing anything.
 *
 * Northamptonshire is two unitary councils, so both are listed - sending
 * someone to the wrong one costs time that a safeguarding report cannot spare.
 *
 * 2026-08-22 correction: North Northamptonshire was previously shown as
 * "Same number" out of hours. It is not. 0300 126 3000 is staffed Monday to
 * Friday, 9am to 5pm, and the council runs a separate out-of-hours duty team on
 * 01604 637206. Anyone ringing the daytime number at night would have reached
 * nobody.
 *
 * Note on that number: northnorthants.gov.uk publishes 01604 637206 on its
 * "contact adult social care" page, which is what is used here. An older
 * number, 01604 626938, still circulates on third-party sites. If the council
 * ever changes it, the source URL below is the one to trust.
 */
const LOCAL_AUTHORITIES = [
  {
    area: "Warwickshire (includes Rugby)",
    phone: "01926 412080",
    outOfHours: "01926 886922",
    source: "https://www.warwickshire.gov.uk/social-care-health/adult-abuse-concerns",
  },
  {
    area: "Coventry",
    phone: "024 7683 3003",
    outOfHours: "024 7683 2222",
    source: "https://www.coventry.gov.uk/safeguarding-adults-1",
  },
  {
    // Leicester CITY and Leicestershire COUNTY are separate authorities with
    // separate teams. Sending someone to the wrong one costs time a
    // safeguarding report cannot spare, so they are listed separately and
    // labelled, never merged.
    area: "Leicester (city)",
    phone: "0116 454 1004",
    outOfHours: null,
    hoursNote: "24 hours",
    source: "https://www.leicester.gov.uk/about-council/report-concerns-about-child-or-adult",
  },
  {
    area: "Leicestershire (county)",
    phone: "0116 305 0004",
    outOfHours: "0116 305 0888",
    source: "https://www.leicestershire.gov.uk/leisure-and-community/community-safety/report-abuse-of-an-adult",
  },
  {
    area: "West Northamptonshire",
    phone: "0300 126 7000",
    // The council directs out-of-hours callers to the same number.
    outOfHours: null,
    source: "https://www.westnorthants.gov.uk/adult-social-care-and-wellbeing/reporting-concern-about-adult",
  },
  {
    area: "North Northamptonshire",
    phone: "0300 126 3000",
    outOfHours: "01604 637206",
    source: "https://www.northnorthants.gov.uk/arranging-care/report-safeguarding-concern-about-adult",
  },
];

export const metadata = {
  title: "Safeguarding",
  description:
    "How Kare Plus Rugby protects the people it supports from abuse and neglect, and how to raise a safeguarding concern.",
  alternates: { canonical: "/safeguarding" },
};

const SafeguardingPage = () => {
  const b = site.business;
  return (
    <LegalPage
      title="Safeguarding"
      breadcrumb="Safeguarding"
      intro="Protecting the people we support from abuse and neglect is the most important thing we do."
      lastUpdated="20 August 2026"
    >
      {/* Urgent box first - anyone arriving here in a crisis needs this immediately */}
      <div className="not-prose mb-10 rounded-card border-2 border-danger bg-dangerBg p-6">
        <h2 className="text-xl font-bold text-danger">
          If someone is at immediate risk
        </h2>
        <p className="mt-2 text-[17px] leading-relaxed text-text">
          Call <strong>999</strong> straight away. Do not wait to contact us
          first.
        </p>
        <p className="mt-3 leading-relaxed text-text">
          To report a concern to us directly, call{" "}
          <a href={b.phone_href} className="font-semibold text-primary-700 underline underline-offset-4">
            {b.phone}
          </a>{" "}
          or email{" "}
          <strong className="font-semibold">{b.safeguarding_email}</strong>.
        </p>
      </div>

      <h2>Our commitment</h2>
      <p>
        Everyone we support has the right to live free from abuse, neglect and
        harm. Kare Plus Rugby is committed to protecting the safety,
        dignity and wellbeing of every person in our care, and to acting
        promptly whenever a concern is raised.
      </p>
      <p>
        Safeguarding is everyone&apos;s responsibility. Every member of our
        staff has a duty to report any concern about abuse or neglect, whether
        it relates to something they have seen, been told about, or suspect.
      </p>

      <h2>What we mean by abuse</h2>
      <p>
        Abuse can take many forms, and it is not always obvious. It includes:
      </p>
      <ul>
        <li><strong>Physical abuse</strong> — hitting, restraining, or misusing medication.</li>
        <li><strong>Neglect</strong> — failing to provide food, warmth, medication or personal care.</li>
        <li><strong>Emotional or psychological abuse</strong> — threats, humiliation, intimidation or isolation.</li>
        <li><strong>Financial abuse</strong> — theft, fraud, or pressure around money, property or wills.</li>
        <li><strong>Sexual abuse</strong> — any sexual act without informed consent.</li>
        <li><strong>Discriminatory abuse</strong> — harassment or unequal treatment based on a protected characteristic.</li>
        <li><strong>Organisational abuse</strong> — poor practice built into how a service is run.</li>
        <li><strong>Self-neglect</strong> — where someone is unable or unwilling to care for their own health or surroundings.</li>
      </ul>

      <h2>How we prevent harm</h2>
      <ul>
        <li><strong>Safer recruitment.</strong> Enhanced DBS checks, verified identity and right to work, and employment references before anyone works with the people we support.</li>
        <li><strong>Training.</strong> Safeguarding training during induction and refreshed regularly, so staff can recognise and report concerns.</li>
        <li><strong>Supervision.</strong> Regular supervision and spot checks, with a named coordinator responsible for each package of care.</li>
        <li><strong>Clear reporting routes.</strong> Staff know who to tell, and are expected to report concerns rather than investigate them themselves.</li>
        <li><strong>A culture of speaking up.</strong> Nobody is penalised for raising a concern in good faith, including under our whistleblowing arrangements.</li>
      </ul>

      <h2>How to raise a concern</h2>
      <p>
        You do not need to be certain, and you do not need proof. If something
        does not feel right, tell us. We would far rather look into a concern
        that turns out to be nothing than miss one that mattered.
      </p>
      <ol>
        <li>Contact us by phone or email using the details above.</li>
        <li>Tell us what you have seen or been told, and when. Write down anything you remember.</li>
        <li>Our safeguarding lead will acknowledge the concern and decide, with you where possible, what happens next.</li>
        <li>Where the threshold is met, we will refer to the local authority safeguarding team and notify the Care Quality Commission as required.</li>
      </ol>
      <p>
        You can also report a concern directly to the local authority
        safeguarding team, or to the Care Quality Commission, without telling us
        first. You have every right to do that.
      </p>

      <h2>Mental capacity and consent</h2>
      <p>
        We work in line with the Mental Capacity Act 2005. We assume someone has
        capacity to make their own decisions unless it is established otherwise,
        we support people to make their own decisions wherever possible, and any
        decision made on someone&apos;s behalf must be in their best interests
        and the least restrictive option available.
      </p>

      <h2>Contacts</h2>
      <p>
        If someone is in immediate danger, call <strong>999</strong> first.
        Anyone can raise a safeguarding concern directly with a local authority
        — you do not need to go through us, and you do not need our permission.
      </p>
      <p>
        <strong>Kare Plus Rugby:</strong> {site.business.phone} during office
        hours, or our on-call line {site.business.opening_hours.on_call.toLowerCase()}.
        <br />
        <strong>Care Quality Commission:</strong> 03000 616161
        <br />
        <strong>Police:</strong> 999 in an emergency, otherwise 101
      </p>

      <h3>Local authority adult safeguarding teams</h3>
      <p>
        Report to the council for the area where the person lives. Office-hours
        number first, out-of-hours emergency duty team second where the council
        runs a separate one. Every number was checked against the council&apos;s
        own website on 24 August 2026 — the area name links to it, so you can
        always confirm before you call.
      </p>
      <p>
        <strong>These numbers can change.</strong> If anything here does not
        connect, please check the council&apos;s own website rather than giving
        up — the area name in the table links straight to it. Leicester city and
        Leicestershire county are separate authorities with separate teams.
      </p>
      <table className="not-prose w-full border-collapse text-base">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="py-2 pr-4 font-semibold text-primary-950">Area</th>
            <th className="py-2 pr-4 font-semibold text-primary-950">Office hours</th>
            <th className="py-2 font-semibold text-primary-950">Out of hours</th>
          </tr>
        </thead>
        <tbody>
          {LOCAL_AUTHORITIES.map((la) => (
            <tr key={la.area} className="border-b border-border align-top">
              <td className="py-2.5 pr-4 font-medium text-text">
                {/* Linked to the council's own reporting page, so a number that
                    changes here can always be checked at source. */}
                <a
                  href={la.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  {la.area}
                  <span className="sr-only"> — report a concern on the council website (opens in a new tab)</span>
                </a>
              </td>
              <td className="py-2.5 pr-4 text-textMuted">
                <a href={`tel:${la.phone.replace(/\s/g, "")}`}>{la.phone}</a>
              </td>
              <td className="py-2.5 text-textMuted">
                {la.outOfHours ? (
                  <a href={`tel:${la.outOfHours.replace(/\s/g, "")}`}>{la.outOfHours}</a>
                ) : (
                  la.hoursNote || "Same number"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Related policies</h2>
      <p>
        This page summarises our approach. Our full safeguarding policy,
        whistleblowing policy and complaints procedure are available on request.
      </p>
    </LegalPage>
  );
};

export default SafeguardingPage;
