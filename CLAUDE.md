# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Car Showcase is a mock web app which uses APIs to get car data and images of the recieved cars.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
```

No test or lint scripts are configured.

## Architecture

Next.js 16 app with React 19, TypeScript, and Tailwind CSS 4. Uses the App Router with a single main page.

### Important rule to stick to
The project's code abides by react coding standards and patterns. Any new code should abide to the same patterns present in the existing code.

**Data flow:**
1. [app/page.tsx](app/page.tsx) (Server Component) reads search params and calls `fetchCars()` from [utils/index.ts](utils/index.ts)
2. `fetchCars()` queries the NHTSA VPic API (no key required) for vehicle models by manufacturer/year
3. Results render as `CarCard` components; car images come from imagin.studio CDN
4. Filters (manufacturer, year, fuel, model, limit) persist via URL search params

**Key files:**
- [utils/index.ts](utils/index.ts) — `fetchCars()`, `calculateCarRent()`, `generateCarImageUrl()`, `updateSearchParams()`
- [types/index.ts](types/index.ts) — `CarProps`, `FilterProps`, `CarCardProps`, `CustomFilterProps`, etc.
- [constants/index.ts](constants/index.ts) — Manufacturer list, year range (2015–2023), fuel types

**Pagination:** `ShowMore` component increments the `limit` URL param; default is 10.

**Rental price:** `calculateCarRent(city_mpg, year)` — base $50/day minus $0.80 per year of age.

**Images:** `generateCarImageUrl(car, angle?)` builds imagin.studio CDN URLs. The CARSXE API integration is present in utils but currently commented out (see recent commits).
A different image API is going to be used later in the project as the main provider of car images.
Importantly - the calls for the API should be optimized for avoiding wasting api tockens, as those are limited, as much as possible.

**Components:** Mix of Server and Client components. Client components are marked with `"use client"` at the top.

## Environment Variables

`.env.local` (required for optional API integrations):
```
CARSXE_API_KEY=...
RAPID_API_KEY=...
```

The NHTSA API and imagin.studio image CDN work without keys.

## Next.js Configuration

[next.config.ts](next.config.ts) enables the React Compiler and allows remote images from `cdn.imagin.studio`.

Path alias `@/*` maps to the project root (e.g., `@/components/...`, `@/utils/...`).
