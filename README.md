# Chess Puzzle Trainer

Built because chess.com limits the number of daily puzzles you can solve without a subscription. A chess puzzle trainer for beginners built with React and Vite that fetches unlimited puzzles from the Lichess API.

## Features

- Unlimited puzzles powered by the Lichess public API
- Move validation with correct/incorrect feedback and move history
- Animated solution playback via the ⓘ button
- Legal move dots shown on piece click
- Theme filter (Fork, Pin, Mate in 2, Endgame, etc.)
- Retry current puzzle or skip to the next

## Tech Stack

- React + Vite
- Tailwind CSS
- chess.js
- react-chessboard

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Data Source

Puzzles are fetched from the [Lichess Puzzle API](https://lichess.org/api#tag/Puzzles) — no account or API key required.
