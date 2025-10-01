import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title:
    "Trimar Production | Event Organizer Corporate Event, Awarding, MICE & Brand Launching Jakarta",
  description:
    "Trimar Production adalah event organizer profesional di Jakarta. Spesialis corporate event, MICE, awarding night, brand launching, dan brand activation dengan konsep kreatif & eksekusi premium.",
  keywords:
    "event organizer, corporate event, MICE, awarding, brand activation, brand launching, EO perusahaan besar Jakarta, EO multinasional, EO gala dinner, EO seminar, EO product launch, EO conference, EO exhibition",
  authors: [{ name: "Trimar Production" }],
  openGraph: {
    title:
      "Trimar Production | EO Corporate Event, Awarding, MICE & Brand Launching Jakarta",
    description:
      "EO premium untuk perusahaan besar. Trimar Production menghadirkan corporate event, MICE, awarding night, brand launching, dan brand activation dengan kualitas terbaik.",
    url: "https://trimarproduction.com",
    siteName: "Trimar Production",
    images: [
      {
        url: "https://trimarproduction.com/preview.jpg",
        width: 1200,
        height: 630,
        alt: "Trimar Production Event Organizer Jakarta",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Trimar Production | Event Organizer Corporate Event, Awarding, MICE & Brand Launching Jakarta",
    description:
      "Trimar Production adalah EO premium di Jakarta untuk perusahaan besar, MICE, awarding, launching & activation.",
    images: ["https://trimarproduction.com/preview.jpg"],
  },
  icons: {
  icon: [
    { url: "/favicon.png", type: "image/png" },
  ],
  apple: "/favicon.png",
},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar />
        <main>{children}
                  <WhatsAppFloatingButton />

        </main>
        <Footer />
      </body>
    </html>
  );
}
