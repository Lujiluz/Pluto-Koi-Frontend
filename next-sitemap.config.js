module.exports = {
  siteUrl: 'https://plutokoi.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'Googlebot', allow: '/' },
    ],
    additionalSitemaps: [
      'https://plutokoi.com/sitemap.xml',
    ],
  },
};
