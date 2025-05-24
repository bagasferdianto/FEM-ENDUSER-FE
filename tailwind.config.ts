import type { Config } from "tailwindcss"

const cssVar = (name: string) => `var(--${name})`

export default {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          "blue-pfl": cssVar("pfl-blue"),
          primary: cssVar("primary"),
          destructive: cssVar("destructive"),
          muted: cssVar("muted"),
          "muted-foreground": cssVar("muted-foreground"),
          background: cssVar("background"),
          popover: cssVar("popover"),
          "popover-foreground": cssVar("popover-foreground"),
          sidebar: cssVar("sidebar"),
          "sidebar-foreground": cssVar("sidebar-foreground"),
          "sidebar-primary": cssVar("sidebar-primary"),
          "sidebar-primary-foreground": cssVar("sidebar-primary-foreground"),
          "sidebar-accent": cssVar("sidebar-accent"),
          "sidebar-accent-foreground": cssVar("sidebar-accent-foreground"),
          "sidebar-border": cssVar("sidebar-border"),
          "sidebar-ring": cssVar("sidebar-ring"),
        }
      }
  },
  plugins: [
  ],
} satisfies Config