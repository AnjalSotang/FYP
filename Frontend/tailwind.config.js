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
		  input: "#1e293b", // Dark blue for input fields
		  ring: "#B4FF39", // Brighter neon green for better contrast
		  background: "#0B1120", // Darker navy for more depth
		  foreground: "#F8FAFC", // Lighter for better contrast
		  primary: {
			DEFAULT: "#B4FF39", // More vibrant neon green
			foreground: "#0F172A",
		  },
		  secondary: {
			DEFAULT: "#475569", // Grayish blue for secondary elements
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
			DEFAULT: "#16223A", // Darker blue for depth
			foreground: "#F8FAFC",
		  },
		  navy: {
			"800": "#1a2c4d",
			"900": "#0a1629",
		  },
		  lime: {
			"300": "#c6e05f",
			"400": "#b8d44a",
		  },
		  chart: {
			"1": "hsl(var(--chart-1))",
			"2": "hsl(var(--chart-2))",
			"3": "hsl(var(--chart-3))",
			"4": "hsl(var(--chart-4))",
			"5": "hsl(var(--chart-5))",
		  },
		},
		borderRadius: {
		  lg: "var(--radius)",
		  md: "calc(var(--radius) - 2px)",
		  sm: "calc(var(--radius) - 4px)",
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
		},
		animation: {
		  "accordion-down": "accordion-down 0.2s ease-out",
		  "accordion-up": "accordion-up 0.2s ease-out",
		},
	  },
	},
	plugins: [require("tailwindcss-animate")],
  };
  