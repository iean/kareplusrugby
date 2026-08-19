import Link from "next/link";

/**
 * The single button primitive.
 *
 * Renders <Link> when given href, <a> for external/tel/mailto, otherwise
 * <button>. Every variant carries a visible focus ring - keyboard users were
 * previously getting no focus indication at all on the custom-styled CTAs.
 */

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-btn font-semibold " +
  "transition-colors duration-200 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-white " +
  "disabled:opacity-60 disabled:cursor-not-allowed";

const VARIANTS = {
  primary: "bg-primary-700 text-white hover:bg-primary-800 active:bg-primary-900",
  secondary:
    "bg-white text-primary-700 border border-primary-200 hover:bg-primary-50 hover:border-primary-400",
  outline:
    "bg-transparent text-primary-700 border border-primary-700 hover:bg-primary-50",
  ghost: "bg-transparent text-primary-700 hover:bg-primary-50",
  // For use on navy/deep sections where a white-on-blue button would vanish.
  onDark:
    "bg-white text-primary-800 hover:bg-primary-50 focus-visible:ring-offset-primary-900",
  onDarkOutline:
    "bg-transparent text-white border border-white/70 hover:bg-white/10 focus-visible:ring-offset-primary-900",
};

// Min height 44px on md+ to satisfy touch-target guidance.
const SIZES = {
  sm: "text-sm px-4 py-2.5 min-h-[40px]",
  md: "text-base px-6 py-3 min-h-[48px]",
  lg: "text-base md:text-lg px-8 py-4 min-h-[52px]",
};

const Button = ({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  external = false,
  type = "button",
  ...rest
}) => {
  const cls = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if (href) {
    const isExternal =
      external || /^(https?:|mailto:|tel:)/.test(href);
    if (isExternal) {
      return (
        <a
          href={href}
          className={cls}
          {...(/^https?:/.test(href)
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          {...rest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  );
};

export default Button;
