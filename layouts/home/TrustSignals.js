import Section from "@components/ui/Section";
import SectionHeading from "@components/ui/SectionHeading";
import Reveal from "@components/ui/Reveal";
import {
  FaIdBadge,
  FaGraduationCap,
  FaClipboardCheck,
  FaClock,
  FaUserShield,
  FaComments,
} from "react-icons/fa";

/**
 * Trust signals.
 *
 * Every statement here is deliberately generic and describes process, not
 * outcomes. No headcounts, no CQC ratings, no DBS percentages, no years in
 * business - none of that could be verified during this work, and inventing it
 * on a healthcare site would be both dishonest and a regulatory risk.
 *
 * If the business wants harder proof points (ratings, numbers, accreditations)
 * they need to come from the client with evidence. See OVERNIGHT_REPORT.md.
 */
const SIGNALS = [
  {
    icon: FaIdBadge,
    title: "Safely recruited",
    body: "Every member of staff goes through our safer-recruitment process, including enhanced background checks, right-to-work verification and references, before they work with anyone.",
  },
  {
    icon: FaGraduationCap,
    title: "Trained and supported",
    body: "Carers complete an induction aligned to the Care Certificate and continue with refresher training, supervision and support from a named coordinator.",
  },
  {
    icon: FaClipboardCheck,
    title: "Care planned with you",
    body: "Support starts with an assessment in your own home and a written care plan agreed with you and, if you wish, your family. It is reviewed as your needs change.",
  },
  {
    icon: FaClock,
    title: "Reliable cover",
    body: "We plan rotas for continuity so you see familiar faces, and we operate an on-call line outside office hours for urgent changes.",
  },
  {
    icon: FaUserShield,
    title: "Safeguarding first",
    body: "All staff are trained to recognise and report abuse or neglect. Concerns are escalated to the safeguarding lead and, where required, to the local authority.",
  },
  {
    icon: FaComments,
    title: "Easy to raise concerns",
    body: "We would always rather hear about a problem early. Our complaints procedure is published, and you can raise something without affecting the care you receive.",
  },
];

const TrustSignals = () => (
  <Section tone="white" size="lg">
    <SectionHeading
      eyebrow="Why families and care homes choose us"
      title="Care you can actually check"
      subtitle="Trust in care should rest on process you can see, not slogans. Here is how we work."
      className="mb-12"
    />

    <ul className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
      {SIGNALS.map((s, i) => {
        const Icon = s.icon;
        return (
          <li key={s.title}>
            <Reveal delay={(i % 3) * 80}>
              <div className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700"
                >
                  <Icon />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-primary-950">{s.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-textMuted">{s.body}</p>
                </div>
              </div>
            </Reveal>
          </li>
        );
      })}
    </ul>
  </Section>
);

export default TrustSignals;
