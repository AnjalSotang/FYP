/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
	  "./index.html",
	  "./src/**/*.{js,ts,jsx,tsx}",
	  "./pages/**/*.{js,jsx,mdx}",
	  "./components/**/*.{js,jsx,mdx}",
	  "./app/**/*.{js,jsx,mdx}",
	  "*.{js,jsx,mdx}",
	],
	theme: {
	  extend: {
		fontFamily: {
		  sans: ["Poppins", "sans-serif"],
		},
		
		colors: {
		  border: "#1E293B", // Dark blue to match the theme
		  input: "#1a2c50", // Updated to match the form input background
		  ring: "#4a90e2", // Updated to match the focus ring color
		  background: "#0b1129", // Updated to match the gradient start color
		  foreground: "#F8FAFC", // Lighter for better contrast
		  primary: {
			DEFAULT: "#b4e61d", // Updated to match the button gradient start
			hover: "#a4d519", // Updated to match the button gradient end
			foreground: "#112240", // Updated to match the button text color
		  },
		  secondary: {
			DEFAULT: "#4a90e2", // Updated to match the link color
			hover: "#3b7ac9", // Updated to match the link hover color
			active: "#2a78b7", // Updated to match the link active color
			foreground: "#F1F5F9", // Light gray text
		  },
		  destructive: {
			DEFAULT: "#EF4444", // Red for errors/warnings
			foreground: "#FEE2E2",
		  },
		  muted: {
			DEFAULT: "#64748B",
			foreground: "#CBD5E1",
		  },
		  accent: {
			DEFAULT: "#3B82F6", // Bright blue matching sign-up button
			foreground: "#F0FDFA",
		  },
		  popover: {
			DEFAULT: "#1E293B", // Deep blue popovers
			foreground: "#F8FAFC",
		  },
		  card: {
			DEFAULT: "#112240", // Updated to match the card background
			foreground: "#F8FAFC",
		  },
		  navy: {
			"800": "#1a2c50", // Updated to match the form input background
			"900": "#0b1129", // Updated to match the gradient start color
		  },
		  lime: {
			"300": "#b4e61d", // Updated to match the primary button gradient start
			"400": "#a4d519", // Updated to match the primary button gradient end
		  },
		  chart: {
			"1": "hsl(var(--chart-1))",
			"2": "hsl(var(--chart-2))",
			"3": "hsl(var(--chart-3))",
			"4": "hsl(var(--chart-4))",
			"5": "hsl(var(--chart-5))",
		  },
		  text: {
			primary: "#ffffff",
			secondary: "#gray-400",
			placeholder: "#gray-400",
		  },
		},
		borderRadius: {
		  lg: "var(--radius)",
		  md: "calc(var(--radius) - 2px)",
		  sm: "calc(var(--radius) - 4px)",
		  xl: "1rem",
		},
		keyframes: {
		  "accordion-down": {
			from: { height: "0" },
			to: { height: "var(--radix-accordion-content-height)" },
		  },
		  "accordion-up": {
			from: { height: "var(--radix-accordion-content-height)" },
			to: { height: "0" },
		  },
		  "fade-in-error": {
			"0%": { opacity: "0" },
			"100%": { opacity: "1" },
		  },
		},
		animation: {
		  "accordion-down": "accordion-down 0.2s ease-out",
		  "accordion-up": "accordion-up 0.2s ease-out",
		  "fade-in-error": "fade-in-error 0.3s ease-in-out",
		},
		boxShadow: {
		  'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
		  'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
		  'button-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
		},
		scale: {
		  '95': '0.95',
		  '105': '1.05',
		},
		transitionProperty: {
		  'default': 'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
		},
		transitionDuration: {
		  '300': '300ms',
		},
		fontSize: {
		  // Based on the provided UI
		  'logo': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700' }], // for the FitTrack logo
		  'heading': {
			sm: ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }], // mobile heading
			lg: ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700' }],   // desktop heading
		  },
		  'subheading': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '400' }], // gray text under heading
		  'button': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '600' }], // button text
		  'link': ['1rem', { lineHeight: '1.5rem', fontWeight: '600' }], // for links like "Sign up now!"
		  'input': ['1rem', { lineHeight: '1.5rem' }], // form input text size
		},
		spacing: {
		  // Based on the spacing in the provided UI
		  'form-padding': '2.5rem', // py-10
		  'form-padding-x': '2.5rem', // px-10
		  'heading-bottom': '1.5rem', // mb-6
		  'subheading-bottom': '2rem', // mb-8
		  'form-element-gap': '1.5rem', // space-y-6
		  'form-footer-gap': '2.5rem', // mt-10
		  'input-padding': '1rem', // p-4
		  'button-padding': '0.75rem', // py-3
		},
		backgroundImage: {
		  'gradient-auth': 'linear-gradient(to bottom right, #0b1129, #1a2c50)',
		  'gradient-button': 'linear-gradient(to right, #b4e61d, #a4d519)',
		},
		fontWeight: {
		  'normal': '400',
		  'semibold': '600',
		  'bold': '700',
		},
	  },
	},
	plugins: [
	  require("tailwindcss-animate"),
	],
  };