module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      display: ["Open Sans", "sans-serif"],
      body: ["Open Sans", "sans-serif"],
    },
    extend: {
      fontSize: {
        14: "14px",
      },
      backgroundColor: {
        "main-bg": "#FAFBFB",
        "main-dark-bg": "#20232A",
        "secondary-dark-bg": "#33373E",
        "light-gray": "#F7F7F7",
        "half-transparent": "rgba(0, 0, 0, 0.5)",
      },
      backgroundImage: {
        "hero-pattern-mobile":
          "url('../public/assets/illustration-hero-mobile.png')",
        "bg-hero-squiggle": "url('../public/assets/bg-hero-squiggle.svg')",
        "illustration-hero-right":
          "url('../public/assets/illustration-hero-right.svg')",
        "illustration-hero-left":
          "url('../public/assets/illustration-hero-left.svg')",
        "bg-footer-squiggle": "url('../public/assets/bg-footer-squiggle.svg')",
        "bg-rainy": "url('../public/assets/rains.svg')",
      },

      colors: {
        primary: "#5D0BF5",
        primaryHover: "#6d23f6",
        main: "#000000",
        Hover: "#1a1a1a",
        midnight: "#080C20",
      },

      borderWidth: {
        1: "1px",
      },
      borderColor: {
        color: "rgba(0, 0, 0, 0.1)",
      },
      width: {
        400: "400px",
        760: "760px",
        780: "780px",
        800: "800px",
        1000: "1000px",
        1200: "1200px",
        1400: "1400px",
      },
      height: {
        80: "80px",
      },
      minHeight: {
        590: "590px",
      },
    },
  },
  plugins: [],
};
// module.exports = {
//   content: ['./src/**/*.{js,jsx,ts,tsx}'],
//   darkMode: 'class',
//   theme: {
//     fontFamily: {
//       display: ['Open Sans', 'sans-serif'],
//       body: ['Open Sans', 'sans-serif'],
//     },
//     extend: {
//       fontSize: {
//         14: '14px',
//       },
//       backgroundColor: {
//         'main-bg': '#FAFBFB',
//         'main-dark-bg': '#20232A',
//         'secondary-dark-bg': '#33373E',
//         'light-gray': '#F7F7F7',
//         'half-transparent': 'rgba(0, 0, 0, 0.5)',
//       },
//       colors: {
//         primary: '#5D0BF5',
//         primaryHover: '#6d23f6',
//       },
//       borderWidth: {
//         1: '1px',
//       },
//       borderColor: {
//         color: 'rgba(0, 0, 0, 0.1)',
//       },
//       width: {
//         400: '400px',
//         760: '760px',
//         780: '780px',
//         800: '800px',
//         1000: '1000px',
//         1200: '1200px',
//         1400: '1400px',
//       },
//       height: {
//         80: '80px',
//       },
//       minHeight: {
//         590: '590px',
//       },
//       backgroundImage: {
//         'hero-pattern':
//           "url('https://i.ibb.co/MkvLDfb/Rectangle-4389.png')",
//       },
//     },
//   },
//   plugins: [],
// };
