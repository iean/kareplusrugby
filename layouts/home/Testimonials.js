import Section from "@components/ui/Section";
import SectionHeading from "@components/ui/SectionHeading";
import { Container } from "@components/ui/Section";
import TestimonialCarousel from "@components/ui/TestimonialCarousel";

/**
 * Testimonials section.
 *
 * IMPORTANT: the quotes below are NOT real and must not be published as-is.
 * Inventing testimonials from care clients would be dishonest, and on a
 * healthcare site it also risks breaching CQC expectations on truthful
 * marketing and the CAP Code rules on substantiation.
 *
 * The carousel component itself is finished and polished. Replace each quote
 * with a genuine one plus written consent from the person who gave it, swap
 * the amber placeholder styling in TestimonialCarousel for the normal card
 * styling, then remove the warning below.
 */
const PLACEHOLDERS = [
  {
    id: 1,
    quote:
      "[TODO: INSERT REAL TESTIMONIAL 1 — a family member of someone receiving care at home. Must be a genuine quote with written consent.]",
    name: "[TODO: NAME OR INITIALS]",
    context: "Family member of a domiciliary care client",
  },
  {
    id: 2,
    quote:
      "[TODO: INSERT REAL TESTIMONIAL 2 — a care home manager who books staff through Kare Plus Rugby.]",
    name: "[TODO: NAME OR INITIALS]",
    context: "Care home manager",
  },
  {
    id: 3,
    quote:
      "[TODO: INSERT REAL TESTIMONIAL 3 — a carer or nurse who works through Kare Plus Rugby.]",
    name: "[TODO: NAME OR INITIALS]",
    context: "Carer working with us",
  },
];

const Testimonials = () => (
  <Section tone="white" size="lg">
    <SectionHeading
      eyebrow="In their words"
      title="What people say about us"
      subtitle="Feedback from the families we support, the homes we staff, and the carers who work with us."
      className="mb-12"
    />

    <Container width="narrow" className="px-0">
      <TestimonialCarousel items={PLACEHOLDERS} />
    </Container>

    <p className="mx-auto mt-8 max-w-2xl rounded-card border border-amber-400 bg-amber-50 p-4 text-center text-sm font-semibold text-amber-900">
      ⚠ Developer note: all three quotes are placeholders. Replace them with
      real, consented testimonials or remove this section before launch.
    </p>
  </Section>
);

export default Testimonials;
