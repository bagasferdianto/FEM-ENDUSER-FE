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
          primary: cssVar("primary"),
          destructive: cssVar("destructive"),
          background: cssVar("background")
        }
      }
  },
  plugins: [
  ],
} satisfies Config