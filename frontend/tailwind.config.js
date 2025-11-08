/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors (Figma Design System)
        primary: {
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#2196F3',
          600: '#1E88E5',
          700: '#1976D2',
          800: '#1565C0',
          900: '#0D47A1',
        },
        // Neutral Colors
        neutral: {
          0: '#FFFFFF',
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        // Semantic Colors
        success: {
          50: '#E8F5E8',
          100: '#C8E6C9',
          500: '#4CAF50',
          600: '#43A047',
        },
        warning: {
          50: '#FFF3E0',
          100: '#FFE0B2',
          500: '#FF9800',
          600: '#FB8C00',
        },
        error: {
          50: '#FFEBEE',
          100: '#FFCDD2',
          500: '#F44336',
          600: '#E53935',
        },
        info: {
          50: '#E1F5FE',
          100: '#B3E5FC',
          500: '#03A9F4',
          600: '#039BE5',
        },
        // Status Colors
        status: {
          planning: '#9E9E9E',
          progress: '#2196F3',
          risk: '#FF9800',
          completed: '#4CAF50',
          overdue: '#F44336',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        // Heading Sizes (Figma Design System)
        'h1': ['36px', { lineHeight: '44px', fontWeight: '700' }],
        'h2': ['30px', { lineHeight: '38px', fontWeight: '700' }],
        'h3': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'h4': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'h5': ['18px', { lineHeight: '26px', fontWeight: '600' }],
        'h6': ['16px', { lineHeight: '24px', fontWeight: '600' }],

        // Body Sizes
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-base': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],

        // Caption Sizes
        'caption': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'overline': ['10px', { lineHeight: '12px', fontWeight: '500', letterSpacing: '0.05em' }],

        // Button Sizes
        'button-lg': ['16px', { lineHeight: '24px', fontWeight: '500' }],
        'button-md': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'button-sm': ['12px', { lineHeight: '16px', fontWeight: '500' }],

        // Code Size
        'code': ['14px', { lineHeight: '20px', fontFamily: 'Monaco, Consolas, monospace' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      boxShadow: {
        'sm': '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
        'base': '0px 1px 3px 0px rgba(0, 0, 0, 0.1)',
        'md': '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}