/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream:      '#F8FAFC',
        mutedsage:  '#E2E8F0',
        deepblue:   '#1E3A8A',
        deepblue2:  '#0F172A',
        sage:       '#16A34A',
        sagedark:   '#15803D',
        sagedeep:   '#2563EB',
        pcream:     '#FFFFFF',
      },
      fontFamily: {
        display: ['"Inter"', '"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        sans:    ['"Inter"', '"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
