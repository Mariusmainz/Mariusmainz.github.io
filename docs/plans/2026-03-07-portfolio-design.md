# Portfolio Website Design
**Date:** 2026-03-07
**Project:** Mariusmainz.github.io

## Overview

A single-page portfolio + CV website for Marius Mainz Elkjær, MSc Electrical Engineering student specializing in IC design. Static content, dynamic interactions, dark minimal aesthetic. Hosted on GitHub Pages.

## Architecture

- **Framework:** Next.js 14 with `output: 'export'` (fully static)
- **Deployment:** GitHub Actions → GitHub Pages
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Content:** All copy lives in `data/` TypeScript config files — no CMS, no backend
- **Assets:** `Resources/CV_english_mme.pdf` and `Resources/photo_mme.jpg` served as static files

## Visual Design

- **Background:** Near-black (`#0a0a0a`)
- **Accent:** Electric cyan (`#00d4ff` range)
- **Body font:** Inter or Geist (clean sans-serif)
- **Monospace font:** JetBrains Mono (skill tags, section labels, title)
- **Hero texture:** Subtle animated background (slow particles or gradient pulse)
- **Layout:** Generous whitespace between sections, no hard dividers

## Sections

### 1. Hero
- Full viewport height
- Name (large), title in monospace, one-liner tagline
- Two CTAs: "View Projects" (smooth scroll) and "Download CV" (PDF link)
- Animated background element

### 2. About
- Two-column layout: photo (left) + professional overview + personal facts (right)
- Fade-in on scroll

### 3. Experience
- Vertical timeline
- Each entry click-expands for more detail
- Scroll-triggered entrance animations

### 4. Projects
- Card grid layout
- Each card: title, short description, tech tags
- Click opens slide-in drawer with full project detail (description, tools, outcomes)

### 5. Skills
- Grouped by category: Embedded Systems, Software, Tools
- Displayed as styled tag chips (no progress bars)

### 6. Contact
- Email, LinkedIn, phone
- No contact form

## Navigation

- Sticky top nav
- Active section highlighted on scroll (IntersectionObserver)
- Hamburger menu on mobile

## Content Source

All project and personal content populated from `data/portfolio.ts`. Placeholder content based on CV; detailed descriptions to be filled in later by the author.
