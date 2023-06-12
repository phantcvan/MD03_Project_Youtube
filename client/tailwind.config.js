/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      "yt-black": "#0F0F0F",
      "yt-red": "#FF0300",
      "yt-white": "#F1F1F1",
      "yt-light-black": "#272727",
      "yt-light": "#181818",
      "yt-light-1": "#212121",
      "yt-light-2": "#282828",
      "yt-gray": "gray",
      "overlay-40": "rgba(0,0,0,0.4)",
    },
    extend: {
      gridTemplateColumns: {
        yt: "repeat(auto-fit, minmax(320px,1fr))",
        ch: "repeat(auto-fit, minmax(200px,1fr))",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
