// ======================================================
// File: styles/responsive.ts
// English AI Coach
// Responsive Design System
// Version 1.0
// ======================================================

/**
 * Breakpoints
 *
 * Tailwind Default
 */

export const BREAKPOINT = {

  xs: "480px",

  sm: "640px",

  md: "768px",

  lg: "1024px",

  xl: "1280px",

  "2xl": "1536px",

} as const;

/**
 * Container Width
 */

export const CONTAINER = {

  mobile: "max-w-full",

  tablet: "max-w-3xl",

  laptop: "max-w-5xl",

  desktop: "max-w-7xl",

} as const;

/**
 * Horizontal Padding
 */

export const PAGE_PADDING = {

  mobile: "px-4",

  tablet: "px-6",

  laptop: "px-8",

  desktop: "px-10",

} as const;

/**
 * Vertical Padding
 */

export const SECTION_PADDING = {

  mobile: "py-6",

  tablet: "py-8",

  laptop: "py-10",

  desktop: "py-12",

} as const;
/**
 * Typography
 */

export const TEXT = {

  hero: {

    mobile: "text-3xl",

    tablet: "text-4xl",

    desktop: "text-5xl",

  },

  title: {

    mobile: "text-2xl",

    tablet: "text-3xl",

    desktop: "text-4xl",

  },

  subtitle: {

    mobile: "text-lg",

    tablet: "text-xl",

    desktop: "text-2xl",

  },

  body: {

    mobile: "text-sm",

    tablet: "text-base",

    desktop: "text-lg",

  },

  caption: {

    mobile: "text-xs",

    tablet: "text-sm",

    desktop: "text-sm",

  },

} as const;

/**
 * Grid System
 */

export const GRID = {

  cards: {

    mobile: "grid-cols-1",

    tablet: "sm:grid-cols-2",

    desktop: "lg:grid-cols-3",

  },

  dashboard: {

    mobile: "grid-cols-1",

    tablet: "md:grid-cols-2",

    desktop: "xl:grid-cols-4",

  },

} as const;

/**
 * Gap
 */

export const GAP = {

  mobile: "gap-4",

  tablet: "gap-6",

  desktop: "gap-8",

} as const;
/**
 * Card Style
 */

export const CARD = {

  radius: {

    mobile: "rounded-xl",

    desktop: "rounded-2xl",

  },

  padding: {

    mobile: "p-4",

    tablet: "p-6",

    desktop: "p-8",

  },

  shadow: {

    normal: "shadow-sm",

    hover: "hover:shadow-lg",

  },

} as const;

/**
 * Button Size
 */

export const BUTTON = {

  primary: {

    mobile: "px-4 py-2 text-sm",

    tablet: "px-5 py-3 text-base",

    desktop: "px-6 py-3 text-lg",

  },

  icon: {

    mobile: "h-10 w-10",

    tablet: "h-12 w-12",

    desktop: "h-14 w-14",

  },

} as const;

/**
 * Form Layout
 */

export const FORM = {

  input: {

    mobile: "h-11 text-base",

    tablet: "h-12 text-base",

    desktop: "h-14 text-lg",

  },

  textarea: {

    mobile: "min-h-[120px]",

    tablet: "min-h-[160px]",

    desktop: "min-h-[200px]",

  },

} as const;

/**
 * Mobile Safe Area
 *
 * Avoid bottom navigation overlap
 */

export const SAFE_AREA = {

  bottom: "pb-safe",

  top: "pt-safe",

} as const;
/**
 * Width Rules
 */

export const WIDTH = {

  full: "w-full",

  content: "max-w-5xl mx-auto",

  reading: "max-w-3xl mx-auto",

  dialog: "max-w-xl",

} as const;

/**
 * Z-index
 */

export const Z_INDEX = {

  navbar: "z-50",

  modal: "z-[100]",

  toast: "z-[200]",

  loading: "z-[300]",

} as const;

/**
 * Animation
 */

export const ANIMATION = {

  card:

    "transition-all duration-300",

  button:

    "transition duration-200",

  hover:

    "hover:scale-[1.02]",

  fade:

    "animate-in fade-in",

} as const;

/**
 * Responsive Helper
 */

export function responsiveClass(

  mobile: string,

  tablet?: string,

  desktop?: string

): string {

  return [

    mobile,

    tablet,

    desktop,

  ]

    .filter(Boolean)

    .join(" ");

}

/**
 * Design Version
 */

export const DESIGN_SYSTEM = {

  version: "1.0",

  framework: "TailwindCSS",

  responsive: true,

  mobileFirst: true,

} as const;