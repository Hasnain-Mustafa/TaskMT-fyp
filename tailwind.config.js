module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      display: ['Open Sans', 'sans-serif'],
      body: ['Open Sans', 'sans-serif'],
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
        // main: "#000000",
        Hover: "#1a1a1a",
        primary: '#5D0BF5',
         primaryHover: '#6d23f6',
          cyan: {
            100: "#3EE9E5",
            200: "#093F68",
            300: "#04192c",
            400: "#0fcac7",
            500: "#0d5f9e",
          },
          gray: "#777F98",
          white: "#FFFFFF",
          black: "#000000",
          midnight: "#080C20",
          transparent: "rgba(0, 0, 0, 0.85)",
          danger: {
            100: "#ff428a",
            200: "#44071e",
          },
          sky: "#3eb3e9",
          slate: "#94a3b8",
          pink: "hsl(322, 100%, 66%)",
          lightPink: "hsl(321, 100%, 78%)",
          lightRed: "hsl(0, 100%, 63%)",
          veryDarkCyan: "hsl(192, 100%, 9%)",
          veryPaleBlue: "hsl(207, 100%, 98%)",
        },
    
      borderWidth: {
        1: '1px',
      },
      borderColor: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
      width: {
        400: '400px',
        760: '760px',
        780: '780px',
        800: '800px',
        1000: '1000px',
        1200: '1200px',
        1400: '1400px',
      },
      height: {
        80: '80px',
      },
      minHeight: {
        590: '590px',
      },
      backgroundImage: {
        'hero-pattern':
          "url('https://i.ibb.co/MkvLDfb/Rectangle-4389.png')",
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
