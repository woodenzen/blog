# Will Simpson's Notes

A simple Eleventy notes blog written as Markdown files from The Archive and published through Netlify.

## How This Repo Is Organized

- Write notes as `.md` files in the repo root.
- Keep the Eleventy app code in `.app/`.
- Use `app.mjs` for site settings such as title, sidebar links, theme, and note queries.
- Use `app.styles.scss` for small visual tweaks.
- Netlify watches the whole repository, runs the Eleventy build from `.app/`, and publishes `.app/dist/`.

## Local Development

Install dependencies once:

```sh
cd .app
npm install
```

Start the local preview server:

```sh
npm start
```

Eleventy will print the local URL. Leave that process running while you write or edit notes.

## Writing Notes

Create Markdown files in the repo root. A typical note can stay very small:

```md
---
title: My Note Title
cdate: 2026-04-27
tags:
  - writing
---

The note starts here.
```

The site uses the Markdown filename for the note URL. For example, `My Note Title.md` becomes `/n/my-note-title/`.

## Drafts

Add `draft: true` to a note's frontmatter to keep it out of published pages, navigation, search data, and RSS:

```md
---
title: Private Thought
draft: true
---
```

Remove the draft line, or set it to `false`, when the note is ready to publish.

## Publishing

The expected publishing flow is:

```sh
git status
git add .
git commit -m "Add new notes"
git push
```

Netlify watches the GitHub repository and runs the build defined in `netlify.toml`.

The Netlify base directory should stay as the repository root. Markdown notes live at the root, so setting the base directory to `.app` can make Netlify skip builds when only notes change. The `base = "."` setting in `netlify.toml` pins this explicitly.

For a production build check before pushing:

```sh
cd .app
npm run build
```
