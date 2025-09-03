/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://yashsuthar.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/api/*', '/admin/*', '/_next/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yashsuthar.com'}/sitemap.xml`,
    ],
  },
  changefreq: 'weekly',
  priority: 1.0,
  sitemapSize: 5000,
  autoLastmod: true,
  transform: async (config, path) => {
    // Custom priority and change frequency for different pages
    const customConfig = {
      loc: path,
      changefreq: 'weekly',
      priority: 1.0,
      lastmod: new Date().toISOString(),
    };

    // Homepage gets highest priority
    if (path === '/') {
      customConfig.priority = 1.0;
      customConfig.changefreq = 'daily';
    }

    return customConfig;
  },
};
