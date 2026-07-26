import type { Metadata } from "next";
import { Baloo_2, Inter } from "next/font/google";
import { OutletProvider } from "@/lib/outlet-context";
import "./globals.css";

const baloo2 = Baloo_2({
  subsets: ["latin"],
  variable: "--font-baloo",
  weight: ["600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Purchase Requests — Anemone",
  description: "Form pemesanan stock cabang ke Head Office Anemone Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${baloo2.variable} ${inter.variable} font-sans antialiased bg-neutral-50 text-neutral-900`}>
        <OutletProvider>{children}</OutletProvider>
      </body>
    </html>
  );
}
