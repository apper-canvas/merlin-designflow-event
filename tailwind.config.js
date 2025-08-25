/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['DM Serif Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#2C3E50',
        secondary: '#8B7355',
        accent: '#E67E22',
        surface: '#FAFAFA',
        success: '#27AE60',
        warning: '#F39C12',
        error: '#E74C3C',
        info: '#3498DB',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
        'gradient-accent': 'linear-gradient(135deg, #E67E22 0%, #F39C12 100%)',
        'gradient-success': 'linear-gradient(135deg, #27AE60 0%, #2ECC71 100%)',
      },
      boxShadow: {
        'premium': '0 4px 20px rgba(44, 62, 80, 0.1)',
        'accent': '0 4px 20px rgba(230, 126, 34, 0.3)',
      }
    },
  },
  plugins: [],
}