// @ts-check

/**
 * @typedef {import('./app-config.schema').AppConfig} AppConfig
 * @typedef {import('./app-config.schema').NotesQuery} NotesQuery
 * @typedef {import("./lib/modules/dynamic-content/query-runner").QueryDef} QueryDef
 */

/**
 * @param {AppConfig} config
 * @returns {AppConfig}
 */
export function defineConfig(config) {
  return applyDefaults(config);
}

/**
 * Creates a query definition for notes.
 * @param {NotesQuery} query
 * @returns {QueryDef}
 */

export function createNotesQuery(query = {}) {
  const { sortByDate, ...restQuery } = query;
  return {
    sort: sortByDate ? { date: -1 } : ["data.sort", "title"],
    tree: restQuery.tree ? restQuery.tree : false,
    filter: [
      ["filePathStem", "isNotEqual", "/index"],
      ...(restQuery.pattern ? [["filePathStem", "matches", restQuery.pattern]] : []),
      ...(restQuery.tags ? [["tags", "includesAllOf", restQuery.tags]] : []),
    ],
  };
}

/**
 * Merges the custom config with the default config.
 * @param {AppConfig} custom
 * @returns {AppConfig}
 */
function applyDefaults(custom) {
  return {
    title: "Notes",
    description: "Notes app",
    lang: "en",
    ...custom,

    theme: {
      color: "sky",
      ...custom.theme,
    },

    customProperties: {
      properties: [],
      ...custom.customProperties,
    },
    sidebar: {
      links: [],
      sections: [
        {
          label: "Notes",
          groups: [
            {
              query: {
                sort: ["data.sort", "title"],
                filter: [["filePathStem", "isNotEqual", "/index"]],
              },
            },
          ],
        },
      ],
      ...custom.sidebar,
    },
    panel: {
      tableOfContents: true,
      customProperties: true,
      tags: true,
      incomingLinks: true,
      outgoingLinks: true,
      externalLinks: true,
      ...custom.panel,
    },
    wikilinks: {
      autoLabel: "ref",
      anchorLabel: "none",
      ...custom.wikilinks,
    },
    tags: {
      map: {},
      ...custom.tags,
    },
    notes: {
      pathPrefix: "/n",
      ...custom.notes,
    },
  };
}
