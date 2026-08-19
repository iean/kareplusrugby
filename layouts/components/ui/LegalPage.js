import PageHeader from "@components/ui/PageHeader";
import Section, { Container } from "@components/ui/Section";

/**
 * Shared shell for legal/policy pages.
 *
 * Every one of these carries a prominent solicitor-review banner. These pages
 * are legally operative documents for a regulated healthcare business, and the
 * drafts here are a structural starting point written by a developer - not
 * legal advice and not fit to publish unreviewed.
 */
const LegalPage = ({ title, intro, breadcrumb, lastUpdated, children }) => (
  <>
    <PageHeader
      eyebrow="Policies"
      title={title}
      intro={intro}
      breadcrumbs={[{ label: breadcrumb || title }]}
    />

    <Section tone="white" size="lg">
      <Container width="narrow">
        {/* Deliberately loud and impossible to miss */}
        <div
          role="note"
          className="mb-10 rounded-card border-2 border-amber-500 bg-amber-50 p-5"
        >
          <h2 className="text-lg font-bold text-amber-900">
            ⚠ [TODO: HAVE THIS POLICY REVIEWED BY A SOLICITOR BEFORE PUBLISHING]
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-amber-900">
            This is a structural draft written during a website rebuild. It is
            not legal advice and has not been checked against UK GDPR, the Care
            Quality Commission&apos;s requirements, or this business&apos;s
            actual practices. It must be reviewed by a qualified solicitor, and
            checked against what the company genuinely does, before it goes
            live. Sections marked [TODO] need real information from the
            business.
          </p>
        </div>

        {lastUpdated && (
          <p className="mb-8 text-sm text-textMuted">
            Last updated: <strong className="text-text">{lastUpdated}</strong>
          </p>
        )}

        {/* `prose` gives sensible legal-document typography; the overrides pull
            it onto our palette and keep the measure readable. */}
        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-primary-950 prose-h2:mt-10 prose-h2:text-2xl prose-h3:mt-8 prose-h3:text-xl prose-p:leading-relaxed prose-p:text-textMuted prose-a:text-primary-700 prose-a:underline prose-a:underline-offset-4 prose-strong:text-text prose-li:text-textMuted prose-li:leading-relaxed">
          {children}
        </div>
      </Container>
    </Section>
  </>
);

export default LegalPage;
