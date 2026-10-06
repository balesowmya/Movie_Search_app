# Movie Search App

A responsive movie discovery app built with React and Vite. Search live movie data from TMDB, then sort and filter the results.

## Features

- Movie title search through the TMDB REST API
- Responsive movie cards with poster fallbacks, release year, rating, and overview
- Server-side pagination with a compact page selector
- Rating filter and release date or rating sorting
- Loading, empty, and friendly API error states
- Keyboard accessible search, controls, and visible focus states

## Technologies

- React
- Vite
- JavaScript
- CSS
- TMDB API

## Setup

Install dependencies:

```sh
npm install
```

Create a `.env` file in the project root and add your TMDB API key:

```env
VITE_TMDB_API_KEY=your_api_key_here
```

You can use `.env.example` as a template. Restart the dev server after changing environment variables.

Run locally:

```sh
npm run dev
```

The key is supplied through a Vite environment variable and is not hard-coded in the source. Vite client variables are included in the browser bundle, so this does not make the TMDB key secret. Do not commit your `.env` file.

## Build

```sh
npm run build
npm run preview
```

## Deploy to Netlify

1. Push this project to a Git repository and import it in Netlify.
2. Set the build command to `npm run build` and the publish directory to `dist`.
3. In **Site configuration → Environment variables**, add `VITE_TMDB_API_KEY` with your TMDB API key.
4. Trigger a new deploy after adding or changing the variable.

For Vercel, use `npm run build` as the build command, `dist` as the output directory, and add the same environment variable in the project settings.
