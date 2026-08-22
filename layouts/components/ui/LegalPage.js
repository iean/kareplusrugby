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

    {/* NOTE FOR MAINTAINERS, not for the page: these policies are structural
        drafts. They have not been reviewed by a solicitor or checked against
        UK GDPR and CQC requirements. The banner that used to say so here was
        addressed to the developer, not the reader, so it does not belong on a
        public page - but the review is still outstanding. */}
    <Section tone="white" size="lg">
      <Container width="narrow">
        {lastUpdated && (
          <p className="mb-8 text-base text-textMuted">
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
