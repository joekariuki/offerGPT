import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "offerGPT",
  description: "Generate real estate offers using AI in seconds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${workSans.className} antialiased`}>
          <Navbar />
          <main className="w-full bg-white p-4">{children}</main>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
