import { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
  type?: 'website' | 'article' | 'profile';
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  ogImage = '/og-image.jpg',
  canonical,
  noIndex = false,
  type = 'website',
}: SEOProps = {}): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yashsuthar.com';
  const defaultTitle =
    'Yash Suthar | Full Stack Developer & Software Engineer Portfolio';
  const defaultDescription =
    'Portfolio of Yash Suthar, Full Stack Developer specializing in Next.js, React, TypeScript, Node.js, and modern web technologies. Explore interactive projects, technical skills, and professional experience.';

  const finalTitle = title
    ? `${title} | Yash Suthar - Full Stack Developer`
    : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = [
    'Yash Suthar',
    'Full Stack Developer',
    'Software Engineer',
    'Next.js Developer',
    'React Developer',
    'TypeScript',
    'Node.js',
    'JavaScript',
    'Web Development',
    'Portfolio',
    ...keywords,
  ];

  return {
    title: finalTitle,
    description: finalDescription,
    keywords: finalKeywords,
    robots: noIndex ? 'noindex,nofollow' : 'index,follow',
    openGraph: {
      type,
      locale: 'en_US',
      url: canonical || '/',
      siteName: 'Yash Suthar Portfolio',
      title: finalTitle,
      description: finalDescription,
      images: [
        {
          url: ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: finalTitle,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: [ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`],
      creator: '@yashsuthar00',
      site: '@yashsuthar00',
    },
    alternates: {
      canonical: canonical || '/',
    },
  };
}

export const defaultSEOKeywords = [
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
  'Portfolio',
  'Computer Science',
  'Software Development',
  'Programming',
  'Open Source',
  'Tech Projects',
  'Modern Web Technologies',
  'Responsive Design',
  'UI/UX Development',
  'API Development',
  'Database Design',
  'Cloud Computing',
  'DevOps',
  'Agile Development',
];
