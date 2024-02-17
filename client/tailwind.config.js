/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '375px', // Extra Small (e.g., iPhone 5/SE)
        sm: '425px', // Small (e.g., iPhone 6/7/8)
        md: '768px', // Medium (e.g., iPad)
        lg: '1024px', // Large (e.g., Small laptop screens)
        xl: '1280px', // Extra Large (e.g., Large laptop screens)
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#5D0BF5',
        primaryHover: '#6d23f6',
      },
    },
  },
  plugins: [],
};
