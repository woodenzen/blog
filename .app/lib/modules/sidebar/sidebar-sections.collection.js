import appData from "../../../_data/app.js";
import { notesModule } from "../notes/index.js";
import { dynamicContentModule } from "../dynamic-content/index.js";

export const sidebarSectionsCollection =
  (eleventyConfig) => (collectionApi) => {
    let counter = 0;
    const getId = () => counter++;

    const app = appData();
    const notes = notesModule.notesCollection(eleventyConfig)(collectionApi);

    const sections = app.sidebar.sections.flatMap((section) => {
      const groups = section.groups.flatMap((group) => {
        const runner = new dynamicContentModule.QueryRunner(notes, group.query);
        let filteredNotes = runner.run(notes); // Use 'let' instead of 'const'

        if (!filteredNotes.length) return [];

        // Sort filteredNotes by date in descending order
        filteredNotes = filteredNotes.sort((a, b) => new Date(b.date) - new Date(a.date));

        return [
          {
            id: getId(),
            label: group.label,
            expanded: group.expanded ?? true,
            tree: filteredNotes,
          },
        ];
      });

      if (!groups.length) return [];

      return [
        {
          id: getId(),
          label: section.label,
          groups,
        },
      ];
    });

    return sections;
  };