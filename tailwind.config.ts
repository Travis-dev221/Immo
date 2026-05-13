import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        expandWidth: {
          "0%": { width: "0" },
          "100%": { width: "100px" },
        },
      },
      animation: {
        fadeIn: "fadeIn 1.5s ease-out forwards",
        fadeInDelay: "fadeIn 1.5s ease-out 1s forwards",
        expandWidth: "expandWidth 1.5s ease-out 0.5s forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;
