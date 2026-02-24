# Personal Website — RPG Portfolio

An interactive, pixel-art personal portfolio built as a single-page RPG experience.

## Overview

This project presents Zakhir McKinnon’s portfolio in two modes:

- **RPG Mode**: Explore a game-like map with themed zones (ML, game engine, databases, DevOps, architecture, and problem-solving).
- **Normal CV Mode**: A traditional resume-style layout for quick scanning by recruiters and hiring teams.

The entire site is implemented in a single file: `index.html`.

## Features

- Pixel-art world with keyboard movement and interactive stations
- Zone-based technical showcases:
  - ML demos (linear regression, polynomial train/test, K-NN, K-Means)
  - Game engine showcase
  - Database and SQL concepts
  - DevOps/systems scenarios
  - Architecture trade-offs
  - Problem-solving/incident simulation
- Achievement system for exploration progress
- Modal interfaces and overlays for each zone
- Mobile-friendly fallback to Normal CV mode

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Canvas API

## Getting Started

No build step is required.

1. Clone the repository.
2. Open `index.html` directly in a browser.

For best results, use a modern Chromium-based browser, Firefox, or Safari.

## Project Structure

```text
.
├── index.html   # Entire app (markup, styles, scripts)
└── README.md
```

## Customization

Common updates are all made in `index.html`:

- Profile/SEO metadata near the top of the file
- Normal CV content in the `#normal-mode` section
- RPG map layout, zones, dialogs, and achievements in the main script block

## Notes

- This repository intentionally uses a single-file architecture for portability and easy sharing.
- External fonts are loaded via Google Fonts.

## License

No license file is currently included.
