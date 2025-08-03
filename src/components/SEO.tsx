import Head from "next/head";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title = "Yash Suthar - Software Developer Portfolio",
  description = "Portfolio of Yash Suthar - Software Developer specializing in web development, algorithms, and modern technologies. Explore my projects, skills, and experience through an interactive terminal interface and 3D card.",
  keywords = "Yash Suthar, Software Developer, Portfolio, Web Development, React, Next.js, TypeScript, JavaScript, Algorithms, Frontend, Backend, Terminal, 3D Card, Interactive",
  ogImage = "/og-image.jpg",
  canonical = "https://yashsuthar.com",
  noindex = false,
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://yashsuthar.com/#person",
        name: "Yash Suthar",
        givenName: "Yash",
        familyName: "Suthar",
        jobTitle: "Software Developer",
        description:
          "Software Developer specializing in web development and modern technologies",
        url: "https://yashsuthar.com",
        sameAs: [
          "https://github.com/yashsuthar",
          "https://linkedin.com/in/yashsuthar",
          "https://leetcode.com/yashsuthar",
        ],
        knowsAbout: [
          "JavaScript",
          "TypeScript",
          "React",
          "Next.js",
          "Node.js",
          "Web Development",
          "Software Engineering",
        ],
        hasOccupation: {
          "@type": "Occupation",
          name: "Software Developer",
          occupationLocation: {
            "@type": "Country",
            name: "India",
          },
        },
      },
      {
        "@type": "Website",
        "@id": "https://yashsuthar.com/#website",
        url: "https://yashsuthar.com",
        name: "Yash Suthar Portfolio",
        description:
          "Interactive portfolio showcasing software development projects and skills",
        publisher: {
          "@id": "https://yashsuthar.com/#person",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: "https://yashsuthar.com/?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebPage",
        "@id": "https://yashsuthar.com/#webpage",
        url: "https://yashsuthar.com",
        name: title,
        description: description,
        isPartOf: {
          "@id": "https://yashsuthar.com/#website",
        },
        about: {
          "@id": "https://yashsuthar.com/#person",
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `https://yashsuthar.com${ogImage}`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://yashsuthar.com/#breadcrumbs",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://yashsuthar.com",
          },
        ],
      },
    ],
  };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Yash Suthar" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />

      {/* Robot Instructions */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {!noindex && <meta name="robots" content="index,follow" />}

      {/* OpenGraph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={`https://yashsuthar.com${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content="Yash Suthar - Software Developer Portfolio"
      />
      <meta property="og:site_name" content="Yash Suthar Portfolio" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`https://yashsuthar.com${ogImage}`} />
      <meta
        name="twitter:image:alt"
        content="Yash Suthar - Software Developer Portfolio"
      />
      <meta name="twitter:creator" content="@yashsuthar" />
      <meta name="twitter:site" content="@yashsuthar" />

      {/* Favicons and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon/favicon-16x16.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon/favicon-32x32.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicon/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="/favicon/android-chrome-192x192.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="512x512"
        href="/favicon/android-chrome-512x512.png"
      />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Theme and App Tags */}
      <meta name="theme-color" content="#2196f3" />
      <meta name="msapplication-TileColor" content="#141415" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <meta name="format-detection" content="telephone=no" />

      {/* Performance and Loading */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </Head>
  );
};

export default SEO;
