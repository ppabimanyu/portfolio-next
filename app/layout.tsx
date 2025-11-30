import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { profileData } from "@/lib/data";
import { env } from "@/env";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${profileData.name} | Portfolio`,
  description: "Personal Portfolio",
  keywords: [
    profileData.name,
    "Putra",
    "Prassiesa",
    "Abimanyu",
    "Personal",
    "Portfolio",
    "Personal Portfolio",
    "Fullstack",
    "Developer",
  ],
  authors: [{ name: profileData.name }],
  openGraph: {
    title: `${profileData.name} | Portfolio`,
    description: "Personal Portfolio",
    type: "website",
    locale: "id_ID",
    siteName: env.SITE_URL,
    emails: profileData.email,
    images: [
      {
        url: `${env.SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: env.SITE_URL,
      },
    ],
  },
  twitter: {
    title: `${profileData.name} | Portfolio`,
    description: "Personal Portfolio",
    card: "summary_large_image",
    site: env.SITE_URL,
    images: [
      {
        url: `${env.SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: env.SITE_URL,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-linear-to-bl from-primary/20 via-background to-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="mx-auto min-h-screen flex flex-col">
            <Navbar className="sticky top-0 z-50 bg-background/10 backdrop-blur" />
            <div className="max-w-7xl mx-auto py-4 space-y-4">{children}</div>
            <Footer className="mt-auto" />
          </div>
          {/* <SmoothCursor /> */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
