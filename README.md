# Ahlam Wani — React.js Portfolio

A responsive React.js portfolio built with Vite. Includes an experience explorer, project filters and detail dialogs, a DevOps learning path, responsive navigation, scroll animations, and an accessible motion control.

## Run locally

Use Node.js 22.12 or later. With nvm, run `nvm use` first.

```bash
npm ci
npm run dev
```

Open `http://localhost:4173`. To create and preview a production build:

```bash
npm run build
npm run preview
```

The finished static website is generated in `dist/`. Dependencies are pinned in `package-lock.json`; `node_modules/` and generated files are excluded from source control.

## Project structure

```text
src/
  App.jsx                 Shared experience, filter, and dialog state
  main.jsx                React entry point
  hooks.js                Motion preferences, scroll state, scroll reveals
  components/             Reusable portfolio sections and project artwork
  data/portfolio.js       Experience, projects, project cards, learning path
  styles/                 Responsive layout and animations
public/                   Favicon, robots directives, response headers
index.html                Page metadata and React root
netlify.toml              Netlify build configuration
```

Edit `src/data/portfolio.js` to update project and experience details. Section components hold the introduction, career timeline, toolkit, about text, and contact links. The contact address is `waniahlam625@gmail.com`.

The site uses React state and event handlers for its interactive controls. It has no backend, account credentials, API keys, or required environment variables. Project illustrations are authored SVGs. Google Fonts supplies DM Sans and Manrope, with local fallback fonts if the font service is unavailable.

## Deploy to Netlify

Import the repository and use:

- Build command: `npm run build`
- Publish directory: `dist`
- Node.js: `22` (already set in `netlify.toml`)

For a manual deployment, run `npm ci` and `npm run build`, then upload the **contents of `dist/`**. Uploading the React source ZIP directly to a static drag-and-drop deployment will not build the application.

Keep the repository private and configure hosting access controls before deploying outside the existing private host. The `noindex` directives discourage indexing; hosting access controls determine who can view the site.

## Content

Portfolio details preserve the supplied professional background and subsequent corrections. NIIT is a client engagement through VAYUZ, not a separate employer. The LMS project includes the confirmed React.js web counterparts and admin panels: reusable components, TanStack Query, REST API integrations, courses, quizzes, SCORM, StackQuotient assessments and proctoring, real-time tracking, meeting/event scheduling, notifications, and bookmarks.

Features are described at the engagement level, without assigning each feature to a specific mobile app. Four Google Play links are identified as mobile counterparts. The illustrations are conceptual, not product screenshots. No unsupported performance metrics or certifications are included. DevOps knowledge and future learning goals are labeled separately from application development experience.

## Accessibility and interactions

- Keyboard-operable experience tabs with arrow, Home, and End keys.
- Project filters with result counts and native modal dialogs with Escape support and focus restoration.
- Seven learning-path steps; the position indicator describes the selected step, not completion.
- Mobile menu with Escape handling, semantic headings, skip link, and visible focus states.
- Persistent motion preference and support for system reduced-motion settings.
- Email-copy feedback with a readable fallback if clipboard access is unavailable.
