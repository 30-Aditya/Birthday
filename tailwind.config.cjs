module.exports = {
  darkMode: false,
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,vue}'
  ],
  theme: {
    extend: {
      colors: {
        'lux-pink': '#ff69b4',
        'lux-pink-soft': '#ffc0cb',
        'lux-rose': '#fff0f7',
        'lux-blush': '#ffe4ec'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Playfair Display', 'serif']
      },
      backgroundImage: {
        'soft-pink': 'linear-gradient(180deg,#fff0f7 0%, #ffe4ec 100%)'
      },
      boxShadow: {
        'glow-md': '0 12px 40px rgba(255,105,180,0.12), inset 0 1px 0 rgba(255,255,255,0.6)'
      }
    }
  },
  plugins: []
}
