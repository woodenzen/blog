import fs from 'fs';
import path from 'path';

export const rssModule = {
  setup: (eleventyConfig) => {
    // Create a collection of all markdown files
    eleventyConfig.addCollection('allPosts', (collectionApi) => {
      return collectionApi
        .getFilteredByGlob('../*.md')
        .filter(item => item.fileSlug !== 'index')
        .sort((a, b) => new Date(b.data.cdate || b.date) - new Date(a.data.cdate || a.date));
    });

    // Add a filter to format dates for RSS
    eleventyConfig.addFilter('rssDate', (date) => {
      if (typeof date === 'string') {
        // Handle format like "12-04-2024 08:25 PM"
        const dateRegex = /(\d{1,2})-(\d{1,2})-(\d{4})\s+(\d{1,2}):(\d{2})\s+(AM|PM)/;
        const match = date.match(dateRegex);
        
        if (match) {
          const [, month, day, year, hour, minute, ampm] = match;
          let h = parseInt(hour);
          if (ampm === 'PM' && h !== 12) h += 12;
          if (ampm === 'AM' && h === 12) h = 0;
          
          const dateObj = new Date(year, parseInt(month) - 1, parseInt(day), h, parseInt(minute));
          return dateObj.toUTCString();
        }
      }
      
      const dateObj = new Date(date);
      return isNaN(dateObj) ? new Date().toUTCString() : dateObj.toUTCString();
    });

    // Add a filter to strip HTML and extract plain text
    eleventyConfig.addFilter('stripHtml', (content) => {
      if (!content) return '';
      
      // Remove HTML tags
      let text = content.replace(/<[^>]*>/g, '');
      
      // Decode HTML entities
      text = text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'");
      
      // Clean up whitespace
      text = text
        .replace(/\n\s*\n/g, '\n') // Remove multiple blank lines
        .replace(/\s+/g, ' ') // Collapse multiple spaces
        .trim();
      
      // Limit to 300 characters
      return text.length > 300 ? text.substring(0, 300) + '...' : text;
    });

    // Add a filter to escape XML
    eleventyConfig.addFilter('escapeXml', (str) => {
      if (!str) return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    });

    // Add a filter to convert filename to slug
    eleventyConfig.addFilter('fileToSlug', (filename) => {
      return filename
        .replace(/\.md$/, '')
        .replace(/\s+/g, '-')
        .toLowerCase();
    });
  }
};
