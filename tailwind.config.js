module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        cdark: "#2b2d42",
        cyellow: "#fadc00",
        cgreen: "#53af32",
        cblue: "#28b3e8",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
