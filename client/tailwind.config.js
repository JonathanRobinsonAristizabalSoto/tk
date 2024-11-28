/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js}',
    './index.html',
  ],
  theme: {
    extend: {
      colors: {
        color1: '#ffffff',       // Blanco
        color2: '#cccccc',       // Gris claro
        color3: '#696969',       // Gris
        color4: '#413f4c',       // Gris oscuro
        color5: '#00ab00',       // Verde
        color6: '#ff893a',       // Naranja
      },
      screens: {
        'xs': '320px',    // Móvil más pequeño
        'sm': '640px',    // Móvil
        'md': '768px',    // Tablet
        'lg': '1024px',   // Laptop
        'xl': '1280px',   // Desktop
        'tv': '1920px',   // TV
      },
      fontFamily: {
        lato: ['Lato', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      fontWeight: {
        'thin': 100,
        'extralight': 200,
        'light': 300,
        'normal': 400,
        'medium': 500,
        'semibold': 600,
        'bold': 700,
        'extrabold': 800,
        'black': 900,
      },
      fontSize: {
        'xs': '0.75rem', // 12px
        'sm': '0.875rem', // 14px
        'base': '1rem', // 16px
        'lg': '1.125rem', // 18px
        'xl': '1.25rem', // 20px
        '2xl': '1.375rem', // 22px
        '3xl': '1.5rem', // 24px
        '4xl': '1.75rem', // 28px
        '5xl': '2rem', // 32px
        '6xl': '2.25rem', // 36px
        '7xl': '2.5rem', // 40px
        '8xl': '3rem', // 48px
        '9xl': '3.75rem', // 60px
      },
    },
  },
  plugins: [],
}