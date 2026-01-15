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

    // Add a filter to extract text from markdown
    eleventyConfig.addFilter('stripMarkdown', (content) => {
      return content
        .replace(/[#*_\[\]`]/g, '')
        .trim()
        .substring(0, 200) + (content.length > 200 ? '...' : '');
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
