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
      <meta property="og:title" content="Get roasted on Roast My VIN!" />
      <meta property="og:url" content="https://roastmyvin.com" />
      <meta property="og:image" content="/share.png" />
      <body
        className={`${intertSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
