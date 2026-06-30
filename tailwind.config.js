
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: { 700: "#314182ff", 600: "#4A5FBA" },
        orange:   { 600: "#FE5900", 700: "#E04E00" },
        neutral: { 50: "#F2F4FF", 100: "#cbcfdaff", 700: "#344054" },
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,.06), 0 1px 3px rgba(16,24,40,.10)",
      },
    },
  },
  plugins: [],
};
