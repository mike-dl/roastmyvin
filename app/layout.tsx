import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const intertSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Roast My VIN",
  description: "Next-generation truck roasting, powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${intertSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
