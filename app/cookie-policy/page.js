import LegalPage from "@components/ui/LegalPage";
import site from "@config/site.json";

export const metadata = {
  title: "Cookie Policy",
  description:
    "How Kare Plus Rugby uses cookies and similar technologies on this website, and how to control them.",
  alternates: { canonical: "/cookie-policy" },
};

const CookiePolicyPage = () => {
  const b = site.business;
  return (
    <LegalPage
      title="Cookie policy"
      breadcrumb="Cookie Policy"
      intro="What cookies this website uses, what they do, and how to control them."
      lastUpdated="[TODO: DATE]"
    >
      {/* An honest statement of the current position, which is unusual and worth saying */}
      <div className="not-prose mb-10 rounded-card border border-primary-200 bg-primary-50 p-6">
        <h2 className="text-xl font-bold text-primary-950">
          The current position
        </h2>
        <p className="mt-2 leading-relaxed text-text">
          At the time of writing, this website sets{" "}
          <strong>no analytics, advertising or tracking cookies</strong>. There
          is no cookie banner because, as things stand, there is nothing to
          consent to. If analytics or marketing tags are added later, this
          policy and a consent banner must be added at the same time.
        </p>
      </div>

      <h2>What cookies are</h2>
      <p>
        Cookies are small text files a website stores on your device. They are
        used to make sites work, to remember preferences, and — on many sites —
        to track behaviour across pages and visits.
      </p>

      <h2>Cookies this site uses</h2>
      <h3>Strictly necessary</h3>
      <p>
        These are needed for the site to function and do not require your
        consent under the Privacy and Electronic Communications Regulations.
      </p>
      <ul>
        <li>
          <strong>Authentication for the staff admin area.</strong> If a member
          of our team signs in to the private admin section, their browser sends
          credentials for that session. This applies only to staff, never to
          visitors.
        </li>
      </ul>
      <h3>Analytics and marketing</h3>
      <p>
        <strong>None currently in use.</strong> The site includes a Google Tag
        Manager integration, but it is not configured with a container ID and so
        loads nothing.
      </p>
      <p className="not-prose rounded-card border-2 border-dashed border-amber-500 bg-amber-50 p-4 font-semibold text-amber-900">
        [TODO: IF GOOGLE TAG MANAGER, GOOGLE ANALYTICS, META PIXEL OR ANY OTHER
        TRACKING IS SWITCHED ON, A CONSENT BANNER IS LEGALLY REQUIRED BEFORE
        THOSE COOKIES ARE SET, AND THE TABLE BELOW MUST LIST EACH COOKIE, ITS
        PURPOSE AND ITS LIFESPAN.]
      </p>

      <h2>Third-party content</h2>
      <p>
        Some pages embed content from other services, which may set their own
        cookies when the content loads:
      </p>
      <ul>
        <li>
          <strong>Google Fonts</strong> — fonts are self-hosted through the
          site&apos;s build rather than requested from Google at page load, so
          no request is made to Google when you visit.
        </li>
        <li>
          <strong>Embedded video</strong> — where a video is embedded, the
          provider may set cookies once you press play.
          <em> [TODO: CONFIRM WHETHER ANY VIDEO EMBEDS REMAIN ON THE SITE]</em>
        </li>
      </ul>

      <h2>How to control cookies</h2>
      <p>
        You can block or delete cookies through your browser settings. Every
        major browser lets you do this, and the help pages for Chrome, Safari,
        Firefox and Edge explain how. Blocking strictly necessary cookies may
        stop parts of the site working.
      </p>
      <p>
        You can also set a &quot;Do Not Track&quot; preference in most browsers.
        This site does not track you, so there is nothing for it to change.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we start using new cookies, we will update this page and, where
        required, ask for your consent before setting them.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy can go to {b.email}, or write to us at{" "}
        {b.address.street}, {b.address.locality}, {b.address.postcode}.
      </p>
      <p>
        See also our <a href="/privacy-policy">privacy policy</a>, which explains
        how we handle personal data more generally.
      </p>
    </LegalPage>
  );
};

export default CookiePolicyPage;
