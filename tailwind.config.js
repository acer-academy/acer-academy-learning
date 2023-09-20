// tailwind.config.js
import forms from '@tailwindcss/forms';

module.exports = {
  content: [
    './apps/admin-frontend/src/**/*.{html,js,ts,jsx,tsx}',
    './apps/student-frontend/src/**/*.{html,js,ts,jsx,tsx}',
    './apps/teacher-frontend/src/**/*.{html,js,ts,jsx,tsx}',
    './libs/common-ui/src/**/*.{html,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        adminGreen: {
          DEFAULT: '#95C17B',
          50: '#EDF4E8',
          100: '#E3EFDC',
          200: '#CFE3C4',
          300: '#BCD8AC',
          400: '#A8CC93',
          500: '#95C17B',
          600: '#76AF55',
          700: '#5C8B41',
          800: '#43652F',
          900: '#293E1D',
          950: '#1D2B14',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
  // ...
};
