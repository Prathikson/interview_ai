import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Mantis — AI Interview Practice",
  description: "AI-powered mock interview platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${barlow.variable} ${barlowCondensed.variable} antialiased`}>
        {children}
        <Toaster
          toastOptions={{
            style: {
              fontFamily: '"Barlow", sans-serif',
              borderRadius: 12,
              border: '1.5px solid rgba(26,26,26,0.1)',
              background: '#ffffff',
              color: '#1a1a1a',
              boxShadow: '0 4px 24px rgba(26,26,26,0.1)',
            },
          }}
        />
      </body>
    </html>
  );
}