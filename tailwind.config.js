/** @type {import('tailwindcss').Config} */
import typographyPlugin from "@tailwindcss/typography";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        github: "#2088FF",
        gitlab: "#FC6D26",
        circleci: "#343434",
        jenkins: "#D33833",
        kubernetes: "#326CE5",
        docker: "#2496ED",
        terraform: "#7B42BC",
        ansible: "#EE0000",
      },
      screens: {
        xs: "480px",
        // sm, md, lg, xl are default
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "#333",
            a: {
              color: "#0070f3",
              "&:hover": {
                color: "#0051a2",
              },
            },
          },
        },
      },
      animation: {
        gradient: "gradient 8s linear infinite",
        fadeIn: "fadeIn 0.3s ease-in-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-in": "slideIn 0.4s ease-out",
      },
      keyframes: {
        gradient: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    typographyPlugin,
    function ({ addUtilities }) {
      const newUtilities = {
        ".touch-callout-none": {
          "-webkit-touch-callout": "none",
        },
        ".active\\:scale-97:active": {
          transform: "scale(0.97)",
        },
        ".active\\:scale-95:active": {
          transform: "scale(0.95)",
        },
        ".backface-hidden": {
          "backface-visibility": "hidden",
        },
        ".text-gradient-blue-purple": {
          "background-clip": "text",
          "-webkit-background-clip": "text",
          color: "transparent",
          "background-image": "linear-gradient(to right, #0ea5e9, #a855f7)",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
