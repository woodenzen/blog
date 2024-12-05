// @ts-check
import { defineConfig, createNotesQuery } from "./.app/app-config.js";

export default defineConfig({
  title: "Will Simpson's Notes",
  description:
    "A simple, lightweight, and flexible note-taking template for Eleventy.",
  customProperties: {
    properties: [
      {
        path: "props",
        options: {
          date: {
            locale: "en-US",
          },
        },
      },
    ],
  },
  sidebar: {
    links: [
      {
        url: "https://github.com/woodenzen",
        label: "GitHub",
        icon: "github",
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
});
