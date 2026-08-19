import Button from "@components/ui/Button";
import { Container } from "@components/ui/Section";
import site from "@config/site.json";
import { FaPhoneAlt } from "react-icons/fa";

/**
 * Closing call to action. Reusable across pages via the `variant` prop so the
 * bottom of every page ends with a clear next step rather than the footer.
 */
const CtaBand = ({
  title = "Not sure where to start?",
  body = "Tell us a little about the situation and we will point you in the right direction — no obligation, no pressure.",
  primary = { label: "Make an enquiry", href: "/contact" },
  secondary = { label: "Browse FAQs", href: "/faq" },
}) => (
  <section className="bg-primary-900 text-white">
    <Container className="py-14 md:py-16">
      <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-white/85">{body}</p>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <Button href={primary.href} variant="onDark" size="lg">
            {primary.label}
          </Button>
          {secondary && (
            <Button href={secondary.href} variant="onDarkOutline" size="lg">
              {secondary.label}
            </Button>
          )}
        </div>
      </div>

      <p className="mt-8 border-t border-white/20 pt-6 text-white/80">
        Or call us on{" "}
        <a
          href={site.business.phone_href}
          className="inline-flex items-center gap-2 font-semibold text-white underline underline-offset-4 hover:no-underline"
        >
          <FaPhoneAlt aria-hidden="true" className="text-xs" />
          {site.business.phone}
        </a>
      </p>
    </Container>
  </section>
);

export default CtaBand;
