/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './apps/demo/src/**/*.{html,ts}',
    './packages/common/**/*.{html,ts}',
    './packages/**/demo/**/*.{html,ts}',
  ],
  theme: {
    fontFamily: {
      ...fontFamily,
      sans: ['Roboto', 'Helvetica Neue', 'sans-serif', ...fontFamily.sans],
    },
    colors: {
      primary: {
        50: 'var(--primary-50)',
        100: 'var(--primary-100)',
        200: 'var(--primary-200)',
        300: 'var(--primary-300)',
        400: 'var(--primary-400)',
        500: 'var(--primary-500)',
        600: 'var(--primary-600)',
        700: 'var(--primary-700)',
        800: 'var(--primary-800)',
        900: 'var(--primary-900)',
        A100: 'var(--primary-A100)',
        A200: 'var(--primary-A200)',
        A400: 'var(--primary-A400)',
        A700: 'var(--primary-A700)',
      },
      primaryContrast: {
        50: 'var(--primary-contrast-50)',
        100: 'var(--primary-contrast-100)',
        200: 'var(--primary-contrast-200)',
        300: 'var(--primary-contrast-300)',
        400: 'var(--primary-contrast-400)',
        500: 'var(--primary-contrast-500)',
        600: 'var(--primary-contrast-600)',
        700: 'var(--primary-contrast-700)',
        800: 'var(--primary-contrast-800)',
        900: 'var(--primary-contrast-900)',
        A100: 'var(--primary-contrast-A100)',
        A200: 'var(--primary-contrast-A200)',
        A400: 'var(--primary-contrast-A400)',
        A700: 'var(--primary-contrast-A700)',
      },
      accent: {
        50: 'var(--accent-50)',
        100: 'var(--accent-100)',
        200: 'var(--accent-200)',
        300: 'var(--accent-300)',
        400: 'var(--accent-400)',
        500: 'var(--accent-500)',
        600: 'var(--accent-600)',
        700: 'var(--accent-700)',
        800: 'var(--accent-800)',
        900: 'var(--accent-900)',
        A100: 'var(--accent-A100)',
        A200: 'var(--accent-A200)',
        A400: 'var(--accent-A400)',
        A700: 'var(--accent-A700)',
      },
      accentContrast: {
        50: 'var(--accent-contrast-50)',
        100: 'var(--accent-contrast-100)',
        200: 'var(--accent-contrast-200)',
        300: 'var(--accent-contrast-300)',
        400: 'var(--accent-contrast-400)',
        500: 'var(--accent-contrast-500)',
        600: 'var(--accent-contrast-600)',
        700: 'var(--accent-contrast-700)',
        800: 'var(--accent-contrast-800)',
        900: 'var(--accent-contrast-900)',
        A100: 'var(--accent-contrast-A100)',
        A200: 'var(--accent-contrast-A200)',
        A400: 'var(--accent-contrast-A400)',
        A700: 'var(--accent-contrast-A700)',
      },
      warn: {
        50: 'var(--warn-50)',
        100: 'var(--warn-100)',
        200: 'var(--warn-200)',
        300: 'var(--warn-300)',
        400: 'var(--warn-400)',
        500: 'var(--warn-500)',
        600: 'var(--warn-600)',
        700: 'var(--warn-700)',
        800: 'var(--warn-800)',
        900: 'var(--warn-900)',
        A100: 'var(--warn-A100)',
        A200: 'var(--warn-A200)',
        A400: 'var(--warn-A400)',
        A700: 'var(--warn-A700)',
      },
      warnContrast: {
        50: 'var(--warn-contrast-50)',
        100: 'var(--warn-contrast-100)',
        200: 'var(--warn-contrast-200)',
        300: 'var(--warn-contrast-300)',
        400: 'var(--warn-contrast-400)',
        500: 'var(--warn-contrast-500)',
        600: 'var(--warn-contrast-600)',
        700: 'var(--warn-contrast-700)',
        800: 'var(--warn-contrast-800)',
        900: 'var(--warn-contrast-900)',
        A100: 'var(--warn-contrast-A100)',
        A200: 'var(--warn-contrast-A200)',
        A400: 'var(--warn-contrast-A400)',
        A700: 'var(--warn-contrast-A700)',
      },
    },
  },
  plugins: [],
};
