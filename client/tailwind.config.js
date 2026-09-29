/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          from: "#8b1d1d",
          via: "#7a3e2a",
          to: "#7a3e2a",
          solid: "#8b1d1d",
          maroon: "#8b1d1d",
          brown: "#7a3e2a",
          green: "#2d5a27",
          ring: "#c4a484",
        },
        hub: {
          bg: "#f7f5f2",
          paper: "#fdfcfb",
          ink: "#1a1a1a",
          muted: "#6b6b6b",
        },
      },
      boxShadow: {
        brand: "0 12px 32px -16px rgba(139, 29, 29, 0.35)",
      },
      fontFamily: {
        serif: ['"Playfair Display"', "serif"],
        sans: ['"Source Sans 3"', "sans-serif"],
      },
      fontSize: {
        h1: ["32px", { lineHeight: "40px", fontWeight: "700" }],
        h2: ["24px", { lineHeight: "32px", fontWeight: "600" }],
        h3: ["20px", { lineHeight: "28px", fontWeight: "600" }],
        base: ["16px", { lineHeight: "24px" }],
        caption: ["12px", { lineHeight: "18px" }],
      },
      borderRadius: {
        mdx: "10px",
        lgx: "16px",
        "2xlx": "24px",
      },
    },
  },
  plugins: [],
};
