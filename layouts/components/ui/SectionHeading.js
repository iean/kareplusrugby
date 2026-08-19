/**
 * Consistent section heading block.
 *
 * `as` must be set deliberately so heading order stays valid on each page -
 * there should be exactly one <h1> per page, and section headings are usually
 * <h2>. Passing the wrong level is the easiest way to break screen-reader
 * navigation, so it is explicit rather than guessed.
 */
const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  as: As = "h2",
  align = "center",
  tone = "light",
  className = "",
}) => {
  const alignment =
    align === "center" ? "text-center mx-auto items-center" : "text-left items-start";
  const titleColor = tone === "dark" ? "text-white" : "text-primary-950";
  const subColor = tone === "dark" ? "text-primary-100" : "text-textMuted";
  const eyebrowColor = tone === "dark" ? "text-primary-200" : "text-primary-700";

  return (
    <div
      className={`flex flex-col ${alignment} ${align === "center" ? "max-w-3xl" : ""} ${className}`}
    >
      {eyebrow && (
        <p
          className={`mb-3 text-sm font-semibold uppercase tracking-wider ${eyebrowColor}`}
        >
          {eyebrow}
        </p>
      )}
      <As
        className={`text-3xl md:text-4xl font-bold leading-tight tracking-tight ${titleColor}`}
      >
        {title}
      </As>
      {subtitle && (
        <p className={`mt-4 text-lg leading-relaxed ${subColor}`}>{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeading;
