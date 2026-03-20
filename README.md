# 제삿상 차리기 — Jesa Table Setting Game

A browser-based Korean cultural learning game where players practice arranging a traditional *jesa* (제사) ancestral offering table. Drag and drop food items from the ready queue onto their correct ritual positions, then make the offering and receive feedback from your ancestors.

See it here: <a href="https://tiffany.lee-russo.com/projects/JesaTable/" target="_blank">https://tiffany.lee-russo.com/projects/JesaTable/</a>

## Features

- 26 food and ritual items across 5 rows following traditional jesa table rules
- Drag and drop on desktop (HTML5 native) and mobile (touch events)
- Plates arrive from the kitchen gradually — pay attention to Mom's tips
- Ancestor feedback on completion: perfect, acceptable, or... try again
- Responsive layout that scales from mobile to wide desktop

## Tech Stack

- Vue 3 + Vite
- Pinia for state management
- Vanilla TypeScript
- No drag-and-drop library — native HTML5 drag events + custom touch handlers

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The project is configured to deploy under `/projects/JesaTable/`. To change this, update `base` in `vite.config.ts`.

## Project Structure

```
src/
├── assets/images/food/   # Food and ritual item images (.png)
├── components/
│   ├── Plate.vue          # Individual draggable food plate
│   └── AncestorOverlay.vue # Result screen with ancestor feedback
├── composables/
│   └── useTouchDrag.js    # Mobile touch drag handler
├── data/
│   ├── foodItems.js       # Item definitions, slot mappings, table layout
│   └── ancestorFeedback.js # Feedback strings by score tier
├── stores/
│   └── game.js            # Pinia store — game state and actions
└── App.vue
```
