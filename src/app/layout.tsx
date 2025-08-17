import type { Metadata } from "next";

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

import { UserProvider } from "@/context/userContext";

import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});
export const metadata: Metadata = {
  title: "Sierrapay",
  description: "Your smart payment system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a74da" />
      </head>

      <ClerkProvider>
        <UserProvider>
          <body className={`${poppins.variable}`}>
            
            {children}</body>
        </UserProvider>
      </ClerkProvider>
    </html>
  );
}
