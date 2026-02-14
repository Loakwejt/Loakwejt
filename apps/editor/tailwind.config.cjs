const baseConfig = require('@builderly/config/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    // Dynamic grid columns used by Canvas components (ProductList, Grid, etc.)
    { pattern: /^grid-cols-(1|2|3|4|5|6|7|8|9|10|11|12)$/ },
    { pattern: /^gap-(0|1|2|3|4|5|6|8|10|12)$/ },
    { pattern: /^col-span-(1|2|3|4|5|6|7|8|9|10|11|12)$/ },
  ],
};
