// Dynamic Sitemap Generator
// This utility helps generate and update sitemaps automatically

export const generateSitemap = (pages = []) => {
  const baseUrl = 'https://www.amlamachines.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Default pages
  const defaultPages = [
    {
      url: '/',
      priority: '1.0',
      changefreq: 'weekly',
      lastmod: currentDate
    },
    {
      url: '/about',
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: currentDate
    },
    {
      url: '/contact',
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: currentDate
    },
    {
      url: '/products',
      priority: '0.9',
      changefreq: 'weekly',
      lastmod: currentDate
    }
  ];

  // Product pages
  const productPages = [
    '/products/jackfruit-cutting-machine',
    '/products/automatic-chakli-machine',
    '/products/amla-shredding-machine',
    '/products/areca-nut-dehusking-machine',
    '/products/commercial-mini-chakli-machine',
    '/products/jackfruit-chips-cutting-machine'
  ].map(url => ({
    url,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: currentDate
  }));

  // Combine all pages
  const allPages = [...defaultPages, ...productPages, ...pages];

  // Generate XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  allPages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
    xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  return xml;
};

// Generate RSS Feed
export const generateRSSFeed = (posts = []) => {
  const baseUrl = 'https://www.amlamachines.com';
  const currentDate = new Date().toUTCString();
  
  // Default posts
  const defaultPosts = [
    {
      title: 'New Jackfruit Cutting Machine Model Released',
      link: '/products/jackfruit-cutting-machine',
      description: 'Introducing our latest jackfruit cutting machine with improved efficiency and safety features.',
      pubDate: currentDate
    },
    {
      title: 'Automatic Chakli Machine - Enhanced Performance',
      link: '/products/automatic-chakli-machine',
      description: 'Our automatic chakli machine now features advanced automation and higher production capacity.',
      pubDate: currentDate
    }
  ];

  const allPosts = [...defaultPosts, ...posts];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n';
  xml += '  <channel>\n';
  xml += '    <title>Shri Industries - Food Processing Machinery</title>\n';
  xml += `    <link>${baseUrl}</link>\n`;
  xml += '    <description>Latest updates and news from Shri Industries - Leading manufacturer of food processing machinery since 1996.</description>\n';
  xml += '    <language>en-us</language>\n';
  xml += `    <lastBuildDate>${currentDate}</lastBuildDate>\n`;
  xml += `    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />\n`;
  
  allPosts.forEach(post => {
    xml += '    <item>\n';
    xml += `      <title>${post.title}</title>\n`;
    xml += `      <link>${baseUrl}${post.link}</link>\n`;
    xml += `      <description>${post.description}</description>\n`;
    xml += `      <pubDate>${post.pubDate}</pubDate>\n`;
    xml += `      <guid>${baseUrl}${post.link}</guid>\n`;
    xml += '    </item>\n';
  });
  
  xml += '  </channel>\n';
  xml += '</rss>';
  
  return xml;
};

// Update sitemap with new content
export const updateSitemap = (newPages = []) => {
  const sitemap = generateSitemap(newPages);
  
  // In a real application, you would save this to a file
  // For now, we'll return the XML content
  return sitemap;
};

// Validate sitemap
export const validateSitemap = (sitemap) => {
  const errors = [];
  
  // Check for required elements
  if (!sitemap.includes('<urlset')) {
    errors.push('Missing urlset element');
  }
  
  if (!sitemap.includes('<loc>')) {
    errors.push('Missing location elements');
  }
  
  // Check for valid URLs
  const urlMatches = sitemap.match(/<loc>(.*?)<\/loc>/g);
  if (urlMatches) {
    urlMatches.forEach(match => {
      const url = match.replace(/<\/?loc>/g, '');
      try {
        new URL(url);
      } catch {
        errors.push(`Invalid URL: ${url}`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
