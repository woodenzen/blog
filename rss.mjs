import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Support both standalone and Eleventy module usage
const isEleventyMode = process.argv.includes('eleventy');

// Parse frontmatter from markdown files
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { metadata: {}, content: content };
  }
  
  const frontmatterText = match[1];
  const metadata = {};
  
  // Parse YAML-like frontmatter
  const lines = frontmatterText.split('\n');
  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
      metadata[key.trim()] = value;
    }
  }
  
  const bodyContent = content.replace(frontmatterRegex, '').trim();
  return { metadata, content: bodyContent };
}

// Get first 200 characters as description
function getDescription(content) {
  const text = content.replace(/[#*_\[\]]/g, '').trim();
  return text.substring(0, 200) + (text.length > 200 ? '...' : '');
}

// Parse date string to ISO format
function parseDate(dateStr) {
  if (!dateStr) return new Date().toISOString();
  
  // Handle format like "12-04-2024 08:25 PM"
  const dateRegex = /(\d{1,2})-(\d{1,2})-(\d{4})\s+(\d{1,2}):(\d{2})\s+(AM|PM)/;
  const match = dateStr.match(dateRegex);
  
  if (match) {
    const [, month, day, year, hour, minute, ampm] = match;
    let h = parseInt(hour);
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    
    const date = new Date(year, parseInt(month) - 1, parseInt(day), h, parseInt(minute));
    return date.toISOString();
  }
  
  // Try to parse as regular date
  const date = new Date(dateStr);
  return isNaN(date) ? new Date().toISOString() : date.toISOString();
}

// Convert markdown filename to URL slug
function fileToSlug(filename) {
  return filename
    .replace(/\.md$/, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

// Generate RSS feed
function generateRssFeed() {
  const blogDir = __dirname;
  const files = fs.readdirSync(blogDir).filter(file => 
    file.endsWith('.md') && file !== 'index.md'
  );
  
  const items = [];
  
  for (const file of files) {
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { metadata, content: bodyContent } = parseFrontmatter(content);
    
    const title = metadata.title || file.replace(/\.md$/, '');
    const description = getDescription(bodyContent);
    const date = parseDate(metadata.cdate || metadata.date);
    const slug = fileToSlug(file);
    
    items.push({
      title,
      description,
      date,
      link: `https://willsimpson.netlify.app/n/${slug}`,
      guid: `https://willsimpson.netlify.app/n/${slug}`,
    });
  }
  
  // Sort by date descending
  items.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Build RSS XML
  const rssItems = items
    .map(item => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.guid}</guid>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>`)
    .join('\n');
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Will Simpson's Notes</title>
    <link>https://willsimpson.netlify.app</link>
    <description>A simple, lightweight, and flexible note-taking template for Eleventy.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://willsimpson.netlify.app/feed.xml" rel="self" type="application/rss+xml" xmlns:atom="http://www.w3.org/2005/Atom" />
${rssItems}
  </channel>
</rss>`;
  
  return rss;
}

// Escape special XML characters
function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Generate and write RSS feed
const rssFeed = generateRssFeed();
fs.writeFileSync(path.join(__dirname, 'feed.xml'), rssFeed);
console.log('✓ RSS feed generated at feed.xml');
