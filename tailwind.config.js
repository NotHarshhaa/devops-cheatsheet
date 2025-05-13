/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'github': '#2088FF',
        'gitlab': '#FC6D26',
        'circleci': '#343434',
        'jenkins': '#D33833',
        'kubernetes': '#326CE5',
        'docker': '#2496ED',
        'terraform': '#7B42BC',
        'ansible': '#EE0000',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#333',
            a: {
              color: '#0070f3',
              '&:hover': {
                color: '#0051a2',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 