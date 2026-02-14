const baseConfig = require('@builderly/config/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    // Responsive display classes for runtime-generated styles
    'hidden', 'block', 'flex', 'inline-flex', 'grid', 'inline', 'inline-block',
    'md:hidden', 'md:block', 'md:flex', 'md:inline-flex', 'md:grid', 'md:inline', 'md:inline-block',
    'lg:hidden', 'lg:block', 'lg:flex', 'lg:inline-flex', 'lg:grid', 'lg:inline', 'lg:inline-block',
    'sm:hidden', 'sm:block', 'sm:flex', 'sm:inline-flex', 'sm:grid', 'sm:inline', 'sm:inline-block',
    // Responsive flex direction
    'flex-row', 'flex-col', 'flex-row-reverse', 'flex-col-reverse',
    'md:flex-row', 'md:flex-col', 'md:flex-row-reverse', 'md:flex-col-reverse',
    'lg:flex-row', 'lg:flex-col', 'lg:flex-row-reverse', 'lg:flex-col-reverse',
    'sm:flex-row', 'sm:flex-col', 'sm:flex-row-reverse', 'sm:flex-col-reverse',
    // Responsive alignment
    'items-start', 'items-center', 'items-end', 'items-stretch', 'items-baseline',
    'md:items-start', 'md:items-center', 'md:items-end', 'md:items-stretch', 'md:items-baseline',
    'justify-start', 'justify-center', 'justify-end', 'justify-between', 'justify-around', 'justify-evenly',
    'md:justify-start', 'md:justify-center', 'md:justify-end', 'md:justify-between', 'md:justify-around', 'md:justify-evenly',
    // Responsive flex wrap
    'flex-wrap', 'flex-nowrap', 'flex-wrap-reverse',
    'md:flex-wrap', 'md:flex-nowrap', 'md:flex-wrap-reverse',
    // Responsive grid columns
    'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4', 'grid-cols-5', 'grid-cols-6',
    'md:grid-cols-1', 'md:grid-cols-2', 'md:grid-cols-3', 'md:grid-cols-4', 'md:grid-cols-5', 'md:grid-cols-6',
    'lg:grid-cols-1', 'lg:grid-cols-2', 'lg:grid-cols-3', 'lg:grid-cols-4', 'lg:grid-cols-5', 'lg:grid-cols-6',
    // Responsive gap
    'gap-0', 'gap-1', 'gap-2', 'gap-4', 'gap-6', 'gap-8', 'gap-12', 'gap-16', 'gap-24',
    'md:gap-0', 'md:gap-1', 'md:gap-2', 'md:gap-4', 'md:gap-6', 'md:gap-8', 'md:gap-12', 'md:gap-16', 'md:gap-24',
    // Responsive padding
    'p-0', 'p-1', 'p-2', 'p-4', 'p-6', 'p-8', 'p-12', 'p-16', 'p-24',
    'md:p-0', 'md:p-1', 'md:p-2', 'md:p-4', 'md:p-6', 'md:p-8', 'md:p-12', 'md:p-16', 'md:p-24',
    'px-0', 'px-1', 'px-2', 'px-4', 'px-6', 'px-8', 'px-12',
    'md:px-0', 'md:px-1', 'md:px-2', 'md:px-4', 'md:px-6', 'md:px-8', 'md:px-12',
    'py-0', 'py-1', 'py-2', 'py-4', 'py-6', 'py-8', 'py-12',
    'md:py-0', 'md:py-1', 'md:py-2', 'md:py-4', 'md:py-6', 'md:py-8', 'md:py-12',
    // Responsive text align
    'text-left', 'text-center', 'text-right',
    'md:text-left', 'md:text-center', 'md:text-right',
    // Responsive width/height
    'w-full', 'w-auto', 'w-screen', 'h-full', 'h-auto', 'h-screen',
    'md:w-full', 'md:w-auto', 'md:w-screen', 'md:h-full', 'md:h-auto', 'md:h-screen',
    // Responsive max-width
    'max-w-none', 'max-w-xs', 'max-w-sm', 'max-w-md', 'max-w-lg', 'max-w-xl', 'max-w-2xl', 'max-w-3xl', 'max-w-4xl', 'max-w-5xl', 'max-w-6xl', 'max-w-7xl', 'max-w-full', 'max-w-screen-sm', 'max-w-screen-md', 'max-w-screen-lg', 'max-w-screen-xl',
    'md:max-w-none', 'md:max-w-xs', 'md:max-w-sm', 'md:max-w-md', 'md:max-w-lg', 'md:max-w-xl', 'md:max-w-2xl', 'md:max-w-3xl', 'md:max-w-4xl', 'md:max-w-5xl', 'md:max-w-6xl', 'md:max-w-7xl', 'md:max-w-full',
  ],
};
