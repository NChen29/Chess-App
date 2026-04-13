# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A chess puzzle trainer for beginners that fetches unlimited puzzles from the Lichess API.

## Tech Stack

- **Vite** + **React** (JSX, not TypeScript)
- **Tailwind CSS** for all styling — never use inline styles or CSS modules
- **chess.js** for game logic (move validation, FEN/PGN parsing)
- **react-chessboard** for the board UI

## Commands

```bash
npm run dev       # Start dev server (localhost:5173)
npm run build     # Production build
npm run preview   # Preview production build
```

## Lichess Puzzle API

- Endpoint: `GET https://lichess.org/api/puzzle/next` (public, no auth required)
- Response shape: `{ game: { pgn }, puzzle: { id, initialPly, solution, themes, rating } }`

### Puzzle Flow

1. Load PGN into chess.js; get puzzle position via `verboseHistory[initialPly].after`
2. User plays `solution[0]` — validated against the solution array
3. Bot auto-plays `solution[1]`, user plays `solution[2]`, etc.
4. User moves at even indices (0, 2, 4…); bot auto-plays odd indices (1, 3, 5…)
5. Solution moves are UCI format — convert with `{ from, to, promotion }`

## Architecture

```
src/
  hooks/
    usePuzzle.js       # Fetches puzzle from Lichess, owns raw puzzle data
    useChessPuzzle.js  # All game logic: FEN, move validation, move history,
                       # resetPuzzle, playSolution
  components/
    Header.jsx         # App title bar
    PuzzleBoard.jsx    # react-chessboard wrapper
    PuzzleInfo.jsx     # Sidebar: rating, ID, themes, move history, solved banner
    Controls.jsx       # ⓘ (show solution), Retry, Next Puzzle buttons
  App.jsx              # Composes hooks and components
  index.css            # Tailwind directives only
```

## Theme Filter

- Theme list is hardcoded in `src/data/themes.js` as `{ label, value }` pairs (Lichess camelCase values)
- `usePuzzle(selectedTheme)` retries up to 10 times with 800ms between attempts until a matching puzzle is found
- `ThemeFilter` is a dropdown component rendered as a separate column to the right of the PuzzleInfo+Controls stack
- Changing the theme takes effect on the next "Next Puzzle" click, not immediately

## Key Conventions

- `useChessPuzzle` is the single source of truth for the Chess instance, FEN, status, and move history
- `status` values: `'idle' | 'playing' | 'correct' | 'wrong' | 'solution' | 'solved'`
- Wrong moves are shown briefly then snapped back; both correct and wrong moves are appended to `moveHistory`
- `playSolution` resets the board then animates all solution moves at 700ms intervals; board is locked during playback (`status === 'solution'`)
- Board orientation is set to whoever is to move at the puzzle position
