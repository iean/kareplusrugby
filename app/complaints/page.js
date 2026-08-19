import LegalPage from "@components/ui/LegalPage";
import site from "@config/site.json";

export const metadata = {
  title: "Complaints Procedure",
  description:
    "How to make a complaint about Kare Plus Rugby, what happens when you do, and who to contact if you are not satisfied with our response.",
  alternates: { canonical: "/complaints" },
};

const ComplaintsPage = () => {
  const b = site.business;
  return (
    <LegalPage
      title="Complaints procedure"
      breadcrumb="Complaints"
      intro="If something has gone wrong, we want to hear about it. Telling us is how things get fixed."
      lastUpdated="[TODO: DATE]"
    >
      <div className="not-prose mb-10 rounded-card border border-primary-200 bg-primary-50 p-6">
        <h2 className="text-xl font-bold text-primary-950">
          Complaining will never affect your care
        </h2>
        <p className="mt-2 leading-relaxed text-text">
          Nobody is treated differently for raising a concern. If you are
          worried that speaking up might cause problems, please tell us that
          too — it is something we need to know.
        </p>
      </div>

      <h2>Who can complain</h2>
      <p>
        Anyone can raise a complaint: the person receiving care, a relative or
        friend, an advocate, or a professional acting on someone&apos;s behalf.
        If you are complaining for someone else, we may need their consent
        before we can share details of their care with you.
      </p>

      <h2>How to complain</h2>
      <p>You can raise a complaint in whatever way is easiest for you:</p>
      <ul>
        <li>
          <strong>By phone:</strong>{" "}
          <a href={b.phone_href}>{b.phone}</a>
        </li>
        <li>
          <strong>By email:</strong> {b.email}
        </li>
        <li>
          <strong>In writing:</strong> {b.address.street}, {b.address.locality},{" "}
          {b.address.postcode}
        </li>
        <li>
          <strong>In person:</strong> to any member of staff, or by asking to
          speak to a manager
        </li>
      </ul>
      <p>
        It helps if you can tell us what happened, when it happened, who was
        involved, and what you would like us to do about it — but do not worry
        if you cannot provide all of that.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>
          <strong>We acknowledge it.</strong> We will confirm we have received
          your complaint and tell you who is handling it.
          <br />
          <em>[TODO: CONFIRM ACKNOWLEDGEMENT TIMESCALE — commonly 3 working days]</em>
        </li>
        <li>
          <strong>We look into it.</strong> A manager not directly involved will
          review what happened, speak to the people concerned and look at any
          records.
        </li>
        <li>
          <strong>We respond.</strong> You will get a written response setting
          out what we found, what we are doing about it, and what happens if you
          are still unhappy.
          <br />
          <em>[TODO: CONFIRM RESPONSE TIMESCALE — commonly 20 or 28 working days]</em>
        </li>
        <li>
          <strong>We learn from it.</strong> Complaints are reviewed so the same
          thing does not happen to someone else.
        </li>
      </ol>

      <h2>If you are not satisfied with our response</h2>
      <p>
        If we have not put things right, you can take your complaint further —
        and you can do this at any point, not only after our process has
        finished.
      </p>
      <h3>Local Government &amp; Social Care Ombudsman</h3>
      <p>
        For care you arrange and pay for privately, or care arranged by your
        local council, the Ombudsman investigates complaints independently and
        free of charge.
        <br />
        Telephone: 0300 061 0614 —{" "}
        <a href="https://www.lgo.org.uk" target="_blank" rel="noopener noreferrer">
          www.lgo.org.uk
        </a>
      </p>
      <h3>Care Quality Commission</h3>
      <p>
        The CQC does not investigate individual complaints, but it wants to know
        about concerns regarding the quality or safety of a regulated service,
        and it uses that information in its monitoring.
        <br />
        Telephone: 03000 616161 —{" "}
        <a href="https://www.cqc.org.uk" target="_blank" rel="noopener noreferrer">
          www.cqc.org.uk
        </a>
      </p>
      <h3>Your local council</h3>
      <p>
        If your care is funded or arranged by your local authority, its adult
        social care team also has a complaints process.
        <br />
        <em>[TODO: INSERT CONTACT DETAILS FOR EACH LOCAL AUTHORITY AREA COVERED]</em>
      </p>

      <h2>Safeguarding concerns</h2>
      <p>
        If your concern is about someone&apos;s safety rather than the quality
        of a service, please see our{" "}
        <a href="/safeguarding">safeguarding page</a>. If someone is in
        immediate danger, call <strong>999</strong>.
      </p>

      <h2>Records</h2>
      <p>
        We keep a record of every complaint, what we found and what we changed.
        These records are handled in line with our{" "}
        <a href="/privacy-policy">privacy policy</a>.
        <br />
        <em>[TODO: CONFIRM HOW LONG COMPLAINT RECORDS ARE RETAINED]</em>
      </p>
    </LegalPage>
  );
};

export default ComplaintsPage;
