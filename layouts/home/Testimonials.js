import Section from "@components/ui/Section";
import SectionHeading from "@components/ui/SectionHeading";
import { Container } from "@components/ui/Section";
import TestimonialCarousel from "@components/ui/TestimonialCarousel";

/**
 * Testimonials section.
 *
 * This list is empty on purpose, and the whole section renders nothing while it
 * stays empty. It previously held three invented quotes behind a warning label.
 *
 * Publishing invented testimonials is not a style problem, it is unlawful:
 * fake consumer reviews are banned outright by the Digital Markets,
 * Competition and Consumers Act 2024, and on a care site it would also breach
 * CQC expectations on truthful marketing and the CAP Code.
 *
 * To turn the section on, add entries in this shape:
 *
 *   { id: 1, quote: "…", name: "J. Smith", context: "Family member" }
 *
 * Each one needs to be a real quote from a real person who has given written
 * consent to it being published, with their name or initials as they agreed.
 * The carousel below is finished and will pick them up as soon as they exist.
 */
const TESTIMONIALS = [];

const Testimonials = () => {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <Section tone="white" size="lg">
      <SectionHeading
        eyebrow="In their words"
        title="What people say about us"
        subtitle="Feedback from the families we support, the homes we staff, and the carers who work with us."
        className="mb-12"
      />

      <Container width="narrow" className="px-0">
        <TestimonialCarousel items={TESTIMONIALS} />
      </Container>
    </Section>
  );
};

export default Testimonials;
