import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yash Suthar - Software Developer Portfolio",
  description:
    "Portfolio of Yash Suthar - Software Developer specializing in web development, algorithms, and modern technologies. Explore my projects, skills, and experience through an interactive terminal interface and 3D card.",
  keywords:
    "Yash Suthar, Software Developer, Portfolio, Web Development, React, Next.js, TypeScript, JavaScript, Algorithms, Frontend, Backend, Terminal, 3D Card, Interactive",
  authors: [{ name: "Yash Suthar", url: "https://yashsuthar.com" }],
  creator: "Yash Suthar",
  publisher: "Yash Suthar",
  metadataBase: new URL("https://yashsuthar.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Yash Suthar - Software Developer Portfolio",
    description:
      "Portfolio of Yash Suthar - Software Developer specializing in web development, algorithms, and modern technologies. Explore my projects, skills, and experience through an interactive terminal interface and 3D card.",
    url: "https://yashsuthar.com",
    siteName: "Yash Suthar Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Yash Suthar - Software Developer Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yash Suthar - Software Developer Portfolio",
    description:
      "Portfolio of Yash Suthar - Software Developer specializing in web development, algorithms, and modern technologies. Explore my projects, skills, and experience through an interactive terminal interface and 3D card.",
    creator: "@yashsuthar",
    images: ["/og-image.jpg"],
  },
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
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: {
      url: "/favicon/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
  },
  manifest: "/site.webmanifest",
};

// Add a separate viewport export
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2196f3" },
    { media: "(prefers-color-scheme: dark)", color: "#141415" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Suppress specific hydration warnings in development
  if (process.env.NODE_ENV === "development") {
    // This runs only on the client side
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      const originalError = console.error;
      // eslint-disable-next-line no-console
      console.error = (...args) => {
        if (
          typeof args[0] === "string" &&
          args[0].includes(
            "Hydration failed because the initial UI does not match what was rendered on the server"
          )
        ) {
          // Ignore this specific hydration error
          return;
        }
        originalError(...args);
      };
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
