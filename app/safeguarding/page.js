import LegalPage from "@components/ui/LegalPage";
import site from "@config/site.json";

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
      lastUpdated="[TODO: DATE]"
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
        <strong>Safeguarding lead:</strong> [TODO: INSERT NAME AND JOB TITLE OF
        THE DESIGNATED SAFEGUARDING LEAD]
        <br />
        <strong>Local authority safeguarding team:</strong> [TODO: INSERT THE
        ADULT SAFEGUARDING CONTACT FOR EACH LOCAL AUTHORITY AREA COVERED,
        INCLUDING OUT-OF-HOURS NUMBERS]
        <br />
        <strong>Care Quality Commission:</strong> 03000 616161
        <br />
        <strong>Police:</strong> 999 in an emergency, otherwise 101
      </p>

      <h2>Related policies</h2>
      <p>
        This page summarises our approach. Our full safeguarding policy,
        whistleblowing policy and complaints procedure are available on request.
      </p>
      <p className="not-prose rounded-card border-2 border-dashed border-amber-500 bg-amber-50 p-4 font-semibold text-amber-900">
        [TODO: CONFIRM THIS PAGE MATCHES THE ORGANISATION&apos;S ACTUAL
        SAFEGUARDING POLICY, AND THAT THE POLICY ITSELF HAS BEEN REVIEWED
        AGAINST CQC REQUIREMENTS AND LOCAL SAFEGUARDING BOARD PROCEDURES.]
      </p>
    </LegalPage>
  );
};

export default SafeguardingPage;
