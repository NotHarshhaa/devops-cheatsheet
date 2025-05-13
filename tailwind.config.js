/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
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
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'fadeIn': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 