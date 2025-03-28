import React from "react";

import { Navbar } from "../Navbar";
import { ThemeProvider } from "../theme-provider";

export const metadata = {
  title: "FitTrack - Personalized Workout Plans",
  description: "Create custom workout plans, choose from expert routines, and track your progress all in one place.",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className="font-inter"> {/* ✅ Fixed */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}