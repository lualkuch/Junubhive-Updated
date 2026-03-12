import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff1f0",
          100: "#ffe0db",
          200: "#ffc1b8",
          300: "#ff9585",
          400: "#ff5c47",
          500: "#ff3621",
          600: "#ed1c03",
          700: "#c81400",
          800: "#a51406",
          900: "#88170c",
          950: "#4a0703",
        },
        surface: {
          0: "#ffffff",
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e8e8e8",
          900: "#0a0a0a",
          950: "#050505",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      animation: {
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fadeIn 0.3s ease",
        "scale-in": "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "card-swipe-right": "swipeRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "card-swipe-left": "swipeLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        swipeRight: {
          "0%": { transform: "translateX(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateX(120%) rotate(20deg)", opacity: "0" },
        },
        swipeLeft: {
          "0%": { transform: "translateX(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateX(-120%) rotate(-20deg)", opacity: "0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "card": "0 4px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.08)",
        "brand": "0 8px 32px rgba(255, 54, 33, 0.3)",
        "glow": "0 0 40px rgba(255, 54, 33, 0.15)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
