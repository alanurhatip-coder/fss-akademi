/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
        extend: {
                fontFamily: {
                        'playfair': ['"Playfair Display"', 'serif'],
                        'manrope': ['Manrope', 'sans-serif'],
                        'space': ['"Space Grotesk"', 'sans-serif'],
                },
                borderRadius: {
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)'
                },
                colors: {
                        background: 'hsl(var(--background))',
                        foreground: 'hsl(var(--foreground))',
                        card: {
                                DEFAULT: 'hsl(var(--card))',
                                foreground: 'hsl(var(--card-foreground))'
                        },
                        popover: {
                                DEFAULT: 'hsl(var(--popover))',
                                foreground: 'hsl(var(--popover-foreground))'
                        },
                        primary: {
                                DEFAULT: 'hsl(var(--primary))',
                                foreground: 'hsl(var(--primary-foreground))'
                        },
                        secondary: {
                                DEFAULT: 'hsl(var(--secondary))',
                                foreground: 'hsl(var(--secondary-foreground))'
                        },
                        muted: {
                                DEFAULT: 'hsl(var(--muted))',
                                foreground: 'hsl(var(--muted-foreground))'
                        },
                        accent: {
                                DEFAULT: 'hsl(var(--accent))',
                                foreground: 'hsl(var(--accent-foreground))'
                        },
                        destructive: {
                                DEFAULT: 'hsl(var(--destructive))',
                                foreground: 'hsl(var(--destructive-foreground))'
                        },
                        border: 'hsl(var(--border))',
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                        chart: {
                                '1': 'hsl(var(--chart-1))',
                                '2': 'hsl(var(--chart-2))',
                                '3': 'hsl(var(--chart-3))',
                                '4': 'hsl(var(--chart-4))',
                                '5': 'hsl(var(--chart-5))'
                        },
                        'academic': {
                                'navy': 'var(--theme-bg, #0f172a)',
                                'navy-light': 'var(--theme-bg-light, #1e293b)',
                                'gold': 'var(--theme-accent, #d4af37)',
                                'gold-dim': 'var(--theme-accent-hover, #bfa030)',
                        },
                        'student': {
                                'amber': '#f59e0b',
                                'amber-dark': '#d97706',
                                'cream': '#fff7ed',
                                'orange': '#ea580c',
                        }
                },
                keyframes: {
                        'accordion-down': {
                                from: {
                                        height: '0'
                                },
                                to: {
                                        height: 'var(--radix-accordion-content-height)'
                                }
                        },
                        'accordion-up': {
                                from: {
                                        height: 'var(--radix-accordion-content-height)'
                                },
                                to: {
                                        height: '0'
                                }
                        },
                        'float': {
                                '0%, 100%': { transform: 'translateY(0px)' },
                                '50%': { transform: 'translateY(-20px)' }
                        },
                        'glow-pulse': {
                                '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
                                '50%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.5)' }
                        },
                        'fade-in-up': {
                                '0%': { opacity: '0', transform: 'translateY(30px)' },
                                '100%': { opacity: '1', transform: 'translateY(0)' }
                        },
                        'slide-in-left': {
                                '0%': { opacity: '0', transform: 'translateX(-50px)' },
                                '100%': { opacity: '1', transform: 'translateX(0)' }
                        },
                        'slide-in-right': {
                                '0%': { opacity: '0', transform: 'translateX(50px)' },
                                '100%': { opacity: '1', transform: 'translateX(0)' }
                        },
                },
                animation: {
                        'accordion-down': 'accordion-down 0.3s ease-out',
                        'accordion-up': 'accordion-up 0.3s ease-out',
                        'float': 'float 6s ease-in-out infinite',
                        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
                        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
                        'slide-in-left': 'slide-in-left 0.8s ease-out forwards',
                        'slide-in-right': 'slide-in-right 0.8s ease-out forwards',
                }
        }
  },
  plugins: [require("tailwindcss-animate")],
};
