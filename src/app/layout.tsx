import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AES Encryption Tool - Secure Text Encryption & Decryption Online",
  description: "Free online AES encryption tool with Apple-style design. Encrypt and decrypt text securely using AES-256-CBC algorithm. Compatible with C# implementations and perfect for developers.",
  keywords: [
    "AES encryption",
    "text encryption",
    "decrypt online",
    "AES-256",
    "secure encryption",
    "crypto tool",
    "encryption tool",
    "C# compatible",
    "PBKDF2",
    "online security",
    "free encryption"
  ],
  authors: [{ name: "AES Encryption Tool" }],
  creator: "AES Encryption Tool",
  publisher: "AES Encryption Tool",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aes-encryption-app.vercel.app",
    title: "AES Encryption Tool - Secure Text Encryption & Decryption",
    description: "Free online AES encryption tool with Apple-style design. Encrypt and decrypt text securely using AES-256-CBC algorithm.",
    siteName: "AES Encryption Tool",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AES Encryption Tool - Secure Text Encryption",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AES Encryption Tool - Secure Text Encryption & Decryption",
    description: "Free online AES encryption tool with Apple-style design. Encrypt and decrypt text securely using AES-256-CBC algorithm.",
    images: ["/og-image.png"],
    creator: "@aesencryption",
  },
  verification: {
    google: "your-google-site-verification",
  },
  alternates: {
    canonical: "https://aes-encryption-app.vercel.app",
  },
  category: "Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-16.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
