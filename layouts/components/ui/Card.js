import Link from "next/link";

/**
 * Card primitive. Subtle 1px border + soft shadow rather than the heavy
 * drop-shadows used previously.
 *
 * When `href` is set the whole card becomes one link. That keeps a single tab
 * stop per card instead of several, which is far less tedious with a keyboard
 * or screen reader.
 */
const Card = ({
  href,
  as: As = "div",
  className = "",
  interactive = false,
  children,
  ...rest
}) => {
  const base =
    "rounded-card border border-border bg-body shadow-card " +
    (href || interactive
      ? "transition-[box-shadow,transform,border-color] duration-200 " +
        "hover:shadow-cardHover hover:border-primary-200 hover:-translate-y-0.5 " +
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      : "");

  if (href) {
    return (
      <Link
        href={href}
        className={`${base} block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 ${className}`}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  return (
    <As className={`${base} ${className}`} {...rest}>
      {children}
    </As>
  );
};

export default Card;
