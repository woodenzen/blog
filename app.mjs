// @ts-check
import { defineConfig, createNotesQuery } from "./.app/app-config.js";

export default defineConfig({
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
        // For a list of available icons, see https://feathericons.com/
        url: "https://github.com/woodenzen",
        label: "GitHub",
        icon: "github",
      },
      {
        url: "https://kestrelcreek.com",
        label: "My Other Blog",
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
            }),
          },
        ],
      },
    ],
  },
  tags: {
    map: {
      "dynamic-content": "dynamic content",
    },
  },
  editThisNote: {
    url: "thearchive://match/{{file}}",
  },
});
