import { Analytics } from '@vercel/analytics/next';
import '@xterm/xterm/css/xterm.css';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// SEO-optimized metadata following 2025 best practices
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://yashsuthar.com'
  ),
  title: {
    default: 'Yash Suthar | Full Stack Developer & Software Engineer Portfolio',
    template: '%s | Yash Suthar - Full Stack Developer',
  },
  description:
    'Portfolio of Yash Suthar, Full Stack Developer specializing in Next.js, React, TypeScript, Node.js, AWS, Docker, Linux, Machine Learning, Agentic AI, Automation, Automation Tools, and modern web technologies. Explore interactive projects, technical skills, and professional experience.',
  keywords: [
    'Yash Suthar',
    'Full Stack Developer',
    'Software Engineer',
    'Next.js Developer',
    'React Developer',
    'TypeScript',
    'Node.js',
    'JavaScript',
    'Web Development',
    'Frontend Developer',
    'Backend Developer',
    'AWS',
    'Docker',
    'Linux',
    'Express.js',
    'MongoDB',
    'PostgreSQL',
    'API Development',
    'Cloud Computing',
    'Containerization',
    'Machine Learning',
    'Agentic AI',
    'AI Development',
    'Artificial Intelligence',
    'Data Science',
    'Automation',
    'Automation Tools',
    'Portfolio',
    'Computer Science',
    'Software Development',
    'Programming',
    'Open Source',
    'Tech Projects',
    'Modern Web Technologies',
    'Responsive Design',
    'UI/UX Development',
  ],
  authors: [{ name: 'Yash Suthar', url: 'https://yashsuthar.com' }],
  creator: 'Yash Suthar',
  publisher: 'Yash Suthar',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Yash Suthar Portfolio',
    title: 'Yash Suthar | Full Stack Developer & Software Engineer Portfolio',
    description:
      'Portfolio of Yash Suthar, Full Stack Developer specializing in Next.js, React, TypeScript, Node.js, AWS, Docker, Linux, Machine Learning, Agentic AI, Automation, Automation Tools, and modern web technologies.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Yash Suthar - Full Stack Developer Portfolio',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yash Suthar | Full Stack Developer & Software Engineer Portfolio',
    description:
      'Portfolio of Yash Suthar, Full Stack Developer specializing in Next.js, React, TypeScript, Node.js, AWS, Docker, Linux, Machine Learning, Agentic AI, Automation, Automation Tools, and modern web technologies.',
    images: ['/og-image.jpg'],
    creator: '@yashsuthar00',
    site: '@yashsuthar00',
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: {
      url: '/favicon/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png',
    },
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon/safari-pinned-tab.svg',
        color: '#171717',
      },
    ],
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: '/',
  },
  category: 'technology',
  classification: 'Portfolio Website',
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: {
      'msvalidate.01': process.env.BING_SITE_VERIFICATION || '',
    },
  },
};

// Viewport configuration for mobile optimization
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Suppress hydration warnings
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    const originalError = console.error;
    // eslint-disable-next-line no-console
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes(
          'Hydration failed because the initial UI does not match what was rendered on the server'
        )
      ) {
        // Ignore this specific hydration error
        return;
      }
      originalError(...args);
    };
  }

  // JSON-LD Structured Data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Yash Suthar',
    jobTitle: 'Full Stack Developer',
    description:
      'Full Stack Developer specializing in Next.js, React, TypeScript, Node.js, and modern web technologies',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yashsuthar.com',
    image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yashsuthar.com'}/profile.jpg`,
    sameAs: [
      'https://github.com/yashsuthar00',
      'https://linkedin.com/in/yashsuthar',
      'https://twitter.com/yashsuthar00',
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance Developer',
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Computer Science Engineering',
    },
    knowsAbout: [
      'JavaScript',
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'Full Stack Development',
      'Web Development',
      'Software Engineering',
      'Frontend Development',
      'Backend Development',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
  };

  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Yash Suthar Portfolio',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yashsuthar.com',
    description: 'Portfolio website of Yash Suthar, Full Stack Developer',
    author: {
      '@type': 'Person',
      name: 'Yash Suthar',
    },
    inLanguage: 'en-US',
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: {
      '@type': 'Person',
      name: 'Yash Suthar',
    },
  };

  return (
    <html lang='en' suppressHydrationWarning className='h-dvh h-full'>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />

        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                  });
                `,
              }}
            />
          </>
        )}

        {/* Preconnect to external domains for performance */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link rel='preconnect' href='https://www.google-analytics.com' />
        <link rel='preconnect' href='https://www.googletagmanager.com' />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-dvh h-full overflow-hidden antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
