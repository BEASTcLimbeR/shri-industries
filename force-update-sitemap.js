// Force Update Sitemap - Vercel Deployment Trigger
// This file will force Vercel to redeploy with the updated sitemap

console.log('Sitemap Update Trigger - ' + new Date().toISOString());

// The corrected sitemap content
const correctedSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>https://www.amlamachines.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- About Us Page -->
  <url>
    <loc>https://www.amlamachines.com/about</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Contact Us Page -->
  <url>
    <loc>https://www.amlamachines.com/contact</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Products Page -->
  <url>
    <loc>https://www.amlamachines.com/products</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Individual Product Pages -->
  <url>
    <loc>https://www.amlamachines.com/products/jackfruit-cutting-machine</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>https://www.amlamachines.com/products/automatic-chakli-machine</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>https://www.amlamachines.com/products/amla-shredding-machine</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>https://www.amlamachines.com/products/areca-nut-dehusking-machine</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>https://www.amlamachines.com/products/commercial-mini-chakli-machine</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>https://www.amlamachines.com/products/jackfruit-chips-cutting-machine</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

// Export the corrected sitemap
module.exports = {
  correctedSitemap,
  timestamp: new Date().toISOString(),
  message: 'This file triggers a Vercel deployment with the corrected sitemap'
};
