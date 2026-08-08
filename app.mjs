import { defineConfig, createNotesQuery } from "./.app/app-config.js";

export default defineConfig({
  theme: {
    color: "brown",
  },
  title: "Will Simpson's Notes",
  description:
    "A simple, lightweight, and flexible note-taking template for Eleventy.",
  lang: "en",  
  customProperties: {
    properties: [
      {
        name: "cdate",
        label: "Lovely Written",
      },
    ],
  },
  sidebar: {
    links: [
      {
        url: "https://willsimpson.netlify.app/n/now",
        label: "My Now Page",
        icon: "clock",
      },
      {
        url: "https://github.com/woodenzen",
        label: "GitHub",
        icon: "github",
      },
      {
        url: "https://www.kestrelcreek.com/wooden-zen",
        label: "My Older Blog",
        icon: "disc",
      },
      {
        url: "https://woodenzen.github.io/JAMM425-Magazine-Feature-Writing/",
        label: "JAMM425 Magazine Feature Writing",
        icon: "disc",
      },
    ],
    sections: [
      { 
        label: "Notes",
        groups: [
          {
            query: createNotesQuery({
              pattern: "^/[^/]+$",
              sortByDate: true, // Enable sorting by date
            }),
          },
        ],
      },
    ],
  },
  editThisNote: {
    url: "thearchive://match/{{file}}",
  },
});