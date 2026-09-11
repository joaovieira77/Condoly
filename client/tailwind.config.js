/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F3EFE6',
        'paper-dim': '#EAE3D2',
        ink: '#1F2A3C',
        'ink-soft': '#5C6478',
        brass: '#B8863B',
        'brass-soft': '#E8D9B8',
        clay: '#A64B3F',
        'clay-soft': '#F0D9D3',
        forest: '#3F6355',
        'forest-soft': '#D9E4DA',
        line: '#D8D0BE',
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '3px',
        DEFAULT: '4px',
      },
    },
  },
  plugins: [],
};
