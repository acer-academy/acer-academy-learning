const defaultTheme = require('tailwindcss/defaultTheme');
// tailwind.config.js
import forms from '@tailwindcss/forms'

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
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
  // ...
};
