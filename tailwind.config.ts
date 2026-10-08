import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#070A12",
        card: "#0F1626",
        "card-hover": "#17233B",
        border: "rgba(255, 255, 255, 0.1)",
        flame: {
          500: "#FF3366",
          600: "#E60039",
          400: "#FF6B00",
          glow: "rgba(255, 51, 102, 0.25)"
        },
        nutrition: {
          50: "#ecfdf5",
          500: "#10b981",
          600: "#059669",
          400: "#34d399",
          glow: "rgba(16, 185, 129, 0.2)"
        },
        workout: {
          50: "#ecfeff",
          500: "#00E5FF",
          600: "#0891b2",
          400: "#38BDF8",
          glow: "rgba(0, 229, 255, 0.2)"
        },
        accent: {
          amber: "#F59E0B",
          crimson: "#FF3366",
          purple: "#A855F7",
          gold: "#EAB308"
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "beast-gradient": "linear-gradient(135deg, #FF3366 0%, #FF6B00 50%, #F59E0B 100%)",
        "cyber-gradient": "linear-gradient(135deg, #00E5FF 0%, #3B82F6 50%, #A855F7 100%)",
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'flame-pulse': 'flameGlow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        flameGlow: {
          '0%': { boxShadow: '0 0 15px rgba(255, 51, 102, 0.3)' },
          '100%': { boxShadow: '0 0 35px rgba(255, 107, 0, 0.6)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
