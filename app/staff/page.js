import PageHeader from "@components/ui/PageHeader";
import Section, { Container } from "@components/ui/Section";
import SectionHeading from "@components/ui/SectionHeading";
import Card from "@components/ui/Card";
import site from "@config/site.json";
import { ExternalLink, FileText, Phone, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Staff Area",
  description:
    "Sign-in links and policy documents for Kare Plus Rugby staff. Rotas, payroll and training live in our existing systems.",
  alternates: { canonical: "/staff" },
  // Useful to staff, not to searchers. Keeping it out of the index also keeps
  // it out of the sitemap - see app/sitemap.js.
  robots: { index: false, follow: true },
};

/**
 * Staff signposting hub.
 *
 * This page deliberately does NOT implement rotas, timesheets or training.
 * Those already exist in OneTouch Health, the payroll subscription and
 * FlexiBee, and rebuilding any of them here would create a second source of
 * truth for something people's pay and compliance depend on.
 *
 * There is no login and nothing is stored. Every link points outward.
 *
 * Anything still carrying a [TODO: ...] value in config/site.json renders as
 * "not yet available" rather than as a link. Guessing a sign-in URL would send
 * staff somewhere wrong, and a broken download is worse than an honest gap.
 */
const isReal = (v) => typeof v === "string" && v && !v.includes("[TODO");

const SYSTEMS = ["rota", "payroll", "training"].map((k) => site.staff_systems[k]);

const StaffPage = () => (
  <>
    <PageHeader
      eyebrow="For our team"
      title="Staff area"
      intro="Quick links to the systems you already use, and the policies you may need to look up. There is nothing to sign into here — this page just points you to the right place."
      breadcrumbs={[{ label: "Staff" }]}
      secondary={{ label: `Call the office on ${site.business.phone}`, href: site.business.phone_href }}
    />

    <Section tone="white" size="lg">
      <SectionHeading
        eyebrow="Your systems"
        title="Rotas, pay and training"
        subtitle="These live in our existing systems, not on this website. Your sign-in details come from the office."
        className="mb-12"
      />

      <ul className="grid gap-6 md:grid-cols-3">
        {SYSTEMS.map((s) => (
          <li key={s.name}>
            <Card className="flex h-full flex-col p-6">
              <h3 className="text-xl font-bold text-primary-950">{s.name}</h3>
              <p className="mt-2 flex-grow text-base leading-relaxed text-textMuted">
                {s.purpose}
              </p>

              {isReal(s.url) ? (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 self-start rounded-btn bg-primary-700 px-6 py-3 font-semibold text-white transition hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
                >
                  Sign in
                  <ExternalLink aria-hidden="true" className="h-4 w-4" />
                  <span className="sr-only">
                    to {s.name} (opens in a new tab)
                  </span>
                </a>
              ) : (
                /* No link rather than a guessed one - see the note above. */
                <p className="mt-5 rounded-btn bg-surface px-4 py-3 text-base text-textMuted">
                  The sign-in link for {s.name} is not on this page yet. Please
                  ask the office and we will add it here.
                </p>
              )}
            </Card>
          </li>
        ))}
      </ul>
    </Section>

    <Section tone="surface" size="lg">
      <Container width="narrow">
        <SectionHeading
          eyebrow="Documents"
          title="Handbook and policies"
          subtitle="The documents you may need to look up. If something you need is not here, ask the office."
          align="left"
          className="mb-8"
        />

        <ul className="space-y-4">
          {site.staff_documents.items.map((doc) => {
            const available = isReal(doc.file);
            return (
              <li key={doc.title}>
                <div className="flex items-start gap-4 rounded-card border border-border bg-white p-5 shadow-card">
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                      available
                        ? "bg-primary-100 text-primary-700"
                        : "bg-surface text-textMuted"
                    }`}
                  >
                    <FileText className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-primary-950">
                      {doc.title}
                    </h3>
                    <p className="mt-1 text-base leading-relaxed text-textMuted">
                      {doc.description}
                    </p>
                    {available ? (
                      <a
                        href={doc.file}
                        className="mt-3 inline-flex min-h-[44px] items-center gap-2 font-semibold text-primary-700 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                      >
                        Download {doc.title}
                      </a>
                    ) : (
                      /* Status word, not colour alone, so this is not lost on a
                         colour-blind reader or in high-contrast mode. */
                      <p className="mt-3 text-base font-medium text-textMuted">
                        Not yet available — please ask the office for a copy.
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>

    {/* Safeguarding, last and unmissable */}
    <Section tone="white" size="md">
      <Container width="narrow">
        <div className="flex items-start gap-4 rounded-card border border-danger/30 bg-dangerBg p-6">
          <ShieldAlert aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-danger" />
          <div>
            <h2 className="text-lg font-bold text-primary-950">
              Worried about someone?
            </h2>
            <p className="mt-2 text-base leading-relaxed text-text">
              If you have a concern about abuse or neglect, report it straight
              away — to your coordinator, to the office, or to the local
              authority safeguarding team. You will never be penalised for
              raising a concern in good faith. If someone is in immediate
              danger, call <strong>999</strong>.
            </p>
            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-base">
              <a
                href={site.business.phone_href}
                className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-primary-700 underline underline-offset-4"
              >
                <Phone aria-hidden="true" className="h-4 w-4" />
                {site.business.phone}
              </a>
              <a
                href="/safeguarding"
                className="inline-flex min-h-[44px] items-center font-semibold text-primary-700 underline underline-offset-4"
              >
                Read the safeguarding page
              </a>
            </p>
          </div>
        </div>
      </Container>
    </Section>
  </>
);

export default StaffPage;
