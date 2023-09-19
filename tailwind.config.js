const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
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
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        bottom:
          '0 5px 6px -7px rgba(0, 0, 0, 0.6), 0 2px 4px -5px rgba(0, 0, 0, 0.06)',
      },
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
        adminBlue: {
          DEFAULT: '#70C0BF',
          50: '#EFF8F8',
          100: '#E1F2F2',
          200: '#C5E5E5',
          300: '#A9D9D8',
          400: '#8CCCCC',
          500: '#70C0BF',
          600: '#4CACAB',
          700: '#3B8584',
          800: '#2A5E5E',
          900: '#183737',
          950: '#102424',
        },
      },
      colors: {
        'admin-primary': {
          DEFAULT: '#A4CB9D',
          50: '#FFFFFF',
          100: '#FFFFFF',
          200: '#EEF5ED',
          300: '#D6E7D2',
          400: '#BDD9B8',
          500: '#A4CB9D',
          600: '#82B878',
          700: '#61A256',
          800: '#4B7D42',
          900: '#35592F',
          950: '#2A4625',
        },
        'admin-secondary': {
          DEFAULT: '#80CACB',
          50: '#FFFFFF',
          100: '#F4FAFA',
          200: '#D7EEEF',
          300: '#BAE2E3',
          400: '#9DD6D7',
          500: '#80CACB',
          600: '#58B9BB',
          700: '#409A9B',
          800: '#2F7373',
          900: '#1F4B4C',
          950: '#173738',
        },
        'text-primary': colors.gray[900],
        'icon-primary': colors.gray[700],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
  // ...
};
