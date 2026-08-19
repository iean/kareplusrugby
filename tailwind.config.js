const theme = require("./config/theme.json");

let font_base = Number(theme.fonts.font_size.base.replace("px", ""));
let font_scale = Number(theme.fonts.font_size.scale);

let h6 = font_base / font_base;
let h5 = h6 * font_scale;
let h4 = h5 * font_scale;
let h3 = h4 * font_scale;
let h2 = h3 * font_scale;
let h1 = h2 * font_scale;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    screens: {
      sm: theme.layout.breakpoints.sm || "540px",
      md: theme.layout.breakpoints.md || "768px",
      lg: theme.layout.breakpoints.lg || "1024px",
      xl: theme.layout.breakpoints.xl || "1280px",
      "2xl": theme.layout.breakpoints["2xl"] || "1536px",
    },
    container: {
      center: true,
      padding: theme.layout.container.padding || "1.5rem",
    },
    extend: {
      colors: {
        // ---- Brand: blue scale anchored on the logo navy (#000048) ----
        // `primary` is the main brand blue. The 50-950 ramp is available as
        // primary-50 ... primary-950 for backgrounds, borders and hovers.
        primary: {
          50: theme.colors.blue["50"],
          100: theme.colors.blue["100"],
          200: theme.colors.blue["200"],
          300: theme.colors.blue["300"],
          400: theme.colors.blue["400"],
          500: theme.colors.blue["500"],
          600: theme.colors.blue["600"],
          700: theme.colors.blue["700"],
          800: theme.colors.blue["800"],
          900: theme.colors.blue["900"],
          950: theme.colors.blue["950"],
          DEFAULT: theme.colors.default.theme_color.secondary,
        },
        // Accent = the AA-safe darkened green. The raw brand green is only
        // 1.95:1 on white, so it is exposed separately as brandGreen and must
        // only be used for large decorative fills, never for text.
        accent: theme.colors.default.theme_color.primary,
        brandGreen: theme.colors.green.brand,
        greenTint: theme.colors.green["50"],
        greenTint100: theme.colors.green["100"],
        greenDark: theme.colors.green.dark,
        brandText: theme.colors.neutral.text,

        // ---- Surfaces ----
        background: theme.colors.default.theme_color.theme_light,
        surface: theme.colors.neutral.surface,
        surfaceAlt: theme.colors.neutral.surface_alt,
        body: theme.colors.default.theme_color.body,

        // ---- Text ----
        text: theme.colors.neutral.text,
        textMuted: theme.colors.neutral.text_muted,

        // ---- Lines ----
        border: theme.colors.neutral.border,
        borderStrong: theme.colors.neutral.border_strong,

        // ---- Form/UI states ----
        success: theme.colors.state.success,
        successBg: theme.colors.state.success_bg,
        warning: theme.colors.state.warning,
        warningBg: theme.colors.state.warning_bg,
        danger: theme.colors.state.danger,
        dangerBg: theme.colors.state.danger_bg,

        // Legacy aliases kept so pre-existing markup keeps compiling.
        light: theme.colors.neutral.text_muted,
        dark: theme.colors.default.text_color.dark,
      },
      fontSize: {
        base: font_base + "px",
        h1: h1 + "rem",
        "h1-sm": h1 * 0.8 + "rem",
        h2: h2 + "rem",
        "h2-sm": h2 * 0.8 + "rem",
        h3: h3 + "rem",
        "h3-sm": h3 * 0.8 + "rem",
        h4: h4 + "rem",
        h5: h5 + "rem",
        h6: h6 + "rem",
      },
      fontFamily: {
        // Inter throughout. Decorative serifs were hurting legibility for an
        // older audience, so `primary` now points at Inter too; the alias is
        // kept so existing `font-primary` classes still resolve.
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-inter)", "system-ui", "sans-serif"],
        primary: ["var(--font-inter)", "system-ui", "sans-serif"],
        secondary: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        header: "0 1px 3px rgba(6, 36, 99, 0.08)",
        // Soft, low-contrast elevation - subtle rather than heavy.
        card: "0 1px 2px rgba(6, 36, 99, 0.04), 0 4px 12px rgba(6, 36, 99, 0.06)",
        cardHover:
          "0 2px 4px rgba(6, 36, 99, 0.06), 0 12px 28px rgba(6, 36, 99, 0.10)",
        focus: "0 0 0 3px rgba(29, 91, 192, 0.35)",
      },
      spacing: {
        section: "5rem",
        sectionLg: "7rem",
      },
      borderRadius: {
        card: "12px",
        btn: "10px",
      },
      maxWidth: {
        prose: "68ch",
      },
      keyframes: {
        fadeLeftSlow: {
          "0%": { opacity: "0", transform: "translateX(-40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        fadeLeftSlow: "fadeLeftSlow 1.2s ease-out forwards",
        fadeUp: "fadeUp 0.6s ease-out",
      },
      backgroundImage: {
        // Recoloured from the old purple/orange gradients to the blue scale.
        "soft-care-gradient": `linear-gradient(135deg, ${theme.colors.blue["900"]} 0%, ${theme.colors.blue["700"]} 55%, ${theme.colors.blue["500"]} 100%)`,
        "brand-text-gradient": `linear-gradient(to right, ${theme.colors.blue["800"]}, ${theme.colors.blue["600"]})`,
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/forms"),
    require("tailwind-bootstrap-grid")({ generateContainer: false }),
  ],
};
