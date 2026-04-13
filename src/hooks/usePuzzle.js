import { useState, useCallback } from 'react'

const PUZZLE_URL = 'https://lichess.org/api/puzzle/next'
const MAX_RETRIES = 10
const RETRY_DELAY_MS = 800

/**
 * Fetches and stores raw puzzle data from the Lichess API.
 * Accepts an optional selectedTheme (Lichess API value) and retries
 * up to MAX_RETRIES times until a matching puzzle is found.
 *
 * puzzle shape: { game: { pgn }, puzzle: { id, initialPly, solution, themes, rating } }
 */
export function usePuzzle(selectedTheme) {
  const [puzzle, setPuzzle] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchPuzzle = useCallback(async () => {
    setLoading(true)
    setError(null)

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        if (attempt > 0) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS))
        }
        const res = await fetch(PUZZLE_URL)
        if (!res.ok) throw new Error(`Lichess API error: ${res.status}`)
        const data = await res.json()

        if (!selectedTheme || data.puzzle.themes.includes(selectedTheme)) {
          setPuzzle(data)
          setLoading(false)
          return
        }
      } catch (err) {
        setError(err.message)
        setLoading(false)
        return
      }
    }

    setError(`No "${selectedTheme}" puzzle found in ${MAX_RETRIES} attempts. Try again.`)
    setLoading(false)
  }, [selectedTheme])

  return { puzzle, loading, error, fetchPuzzle }
}
