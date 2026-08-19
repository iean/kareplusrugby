/**
 * Section + Container primitives.
 *
 * Every page section should go through these so vertical rhythm and gutters
 * stay identical site-wide. Before this, spacing was set ad-hoc per component
 * which is why sections used to sit at inconsistent heights.
 */

const TONES = {
  white: "bg-body",
  surface: "bg-surface",
  tint: "bg-primary-50",
  navy: "bg-primary-900 text-white",
  deep: "bg-primary-950 text-white",
};

const SIZES = {
  sm: "py-12 md:py-16",
  md: "py-16 md:py-20",
  lg: "py-20 md:py-28",
};

export const Container = ({ className = "", children, width = "default" }) => {
  const widths = {
    default: "max-w-[1200px]",
    narrow: "max-w-[880px]",
    prose: "max-w-prose",
  };
  return (
    <div className={`mx-auto w-full px-5 sm:px-6 lg:px-8 ${widths[width]} ${className}`}>
      {children}
    </div>
  );
};

const Section = ({
  tone = "white",
  size = "md",
  className = "",
  containerWidth = "default",
  containerClassName = "",
  children,
  ...rest
}) => (
  <section className={`${TONES[tone]} ${SIZES[size]} ${className}`} {...rest}>
    <Container width={containerWidth} className={containerClassName}>
      {children}
    </Container>
  </section>
);

export default Section;
