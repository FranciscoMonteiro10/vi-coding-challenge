# Monster Overview — VI Coding Challenge

A product overview page built with Lit Web Components, TypeScript, and Vite. Monsters are fetched from the [PokeAPI](https://pokeapi.co/) and displayed in a filterable, responsive grid.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

## Getting Started

Install dependencies:

```bash
npm install
```

## Running the App

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Storybook

Run Storybook to explore and interact with components in isolation:

```bash
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006) in your browser.

Stories cover all component states: loading, error, empty, and with data — using mock data, no API calls required.

## Running Tests

Interaction tests are integrated with Storybook via Vitest and run in a headless Chromium browser:

```bash
npx vitest
```

## Building for Production

```bash
npm run build
```

Output is generated in the `dist/` folder.

## Project Structure

```
src/
  components/
    monster-card.ts       # Presentational card component
    monster-overview.ts   # Container component (fetch, filter, grid)
  stories/
    monster-card.stories.ts       # Storybook stories for MonsterCard
    monster-overview.stories.ts   # Storybook stories for MonsterOverview
  constants.ts    # Pokémon type color map
  index.css       # Global styles
```

## Tech Stack

- **[Lit](https://lit.dev/)** — Web Components framework
- **[TypeScript](https://www.typescriptlang.org/)** — Static typing
- **[Vite](https://vitejs.dev/)** — Build tool
- **[Storybook](https://storybook.js.org/)** — Component development & documentation
- **[Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/)** — Interaction testing in a real browser
