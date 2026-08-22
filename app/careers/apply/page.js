import PageHeader from "@components/ui/PageHeader";
import Section, { Container } from "@components/ui/Section";
import ApplicationWizard from "@layouts/careers/apply/ApplicationWizard";
import { getVacancies } from "@lib/vacancies";
import site from "@config/site.json";

export const metadata = {
  title: "Apply for a Care Job",
  description:
    "Apply to join Kare Plus Rugby as a care assistant, support worker or nurse in Coventry, Rugby, Leicester or Northampton. Save your progress and finish later.",
  alternates: { canonical: "/careers/apply" },
};

/**
 * The application form.
 *
 * A resume link arrives as /careers/apply?resume=<token>. The token is read
 * here and handed to the wizard, which exchanges it server-side for the saved
 * draft — the token itself is never used to render anything directly.
 */
const ApplyPage = ({ searchParams }) => {
  const vacancies = getVacancies();
  const resumeToken =
    typeof searchParams?.resume === "string" ? searchParams.resume : null;

  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Apply to join us"
        intro="This form takes about 15 minutes. Your progress is saved as you go, and you can email yourself a link to finish later."
        breadcrumbs={[{ label: "Careers", href: "/careers" }, { label: "Apply" }]}
        secondary={{ label: `Call ${site.business.phone}`, href: site.business.phone_href }}
      />

      <Section tone="white" size="lg">
        <Container width="narrow">
          <ApplicationWizard vacancies={vacancies} resumeToken={resumeToken} />
        </Container>
      </Section>
    </>
  );
};

export default ApplyPage;
