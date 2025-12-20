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
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: `${profileData.name} | Portfolio`,
    template: `%s | ${profileData.name}`,
  },
  description: `${profileData.name} - ${profileData.jobTitle}. ${profileData.bio}`,
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
    "Software Engineer",
    "Web Developer",
  ],
  authors: [{ name: profileData.name, url: env.NEXT_PUBLIC_SITE_URL }],
  creator: profileData.name,
  publisher: profileData.name,
  openGraph: {
    title: `${profileData.name} | Portfolio`,
    description: `${profileData.name} - ${profileData.jobTitle}. ${profileData.bio}`,
    type: "website",
    locale: "id_ID",
    url: env.NEXT_PUBLIC_SITE_URL,
    siteName: profileData.name,
    emails: profileData.email,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${profileData.name} Portfolio`,
      },
    ],
  },
  twitter: {
    title: `${profileData.name} | Portfolio`,
    description: `${profileData.name} - ${profileData.jobTitle}. ${profileData.bio}`,
    card: "summary_large_image",
    creator: "@ppabimanyu",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${profileData.name} Portfolio`,
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
  alternates: {
    canonical: env.NEXT_PUBLIC_SITE_URL,
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
            <div className="max-w-7xl mx-auto py-4 space-y-4 w-full p-2">
              {children}
            </div>
            <Footer className="mt-auto" />
          </div>
          {/* <SmoothCursor /> */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
