import { useState, useEffect } from 'react'
import { usePuzzle } from './hooks/usePuzzle'
import { useChessPuzzle } from './hooks/useChessPuzzle'
import Header from './components/Header'
import PuzzleBoard from './components/PuzzleBoard'
import PuzzleInfo from './components/PuzzleInfo'
import Controls from './components/Controls'
import ThemeFilter from './components/ThemeFilter'

export default function App() {
  const [selectedTheme, setSelectedTheme] = useState(null)
  const { puzzle, loading, error, fetchPuzzle } = usePuzzle(selectedTheme)
  const { fen, orientation, status, moveHistory, onPieceDrop, resetPuzzle, playSolution } = useChessPuzzle(puzzle)

  // Load first puzzle on mount
  useEffect(() => {
    fetchPuzzle()
  }, [fetchPuzzle])

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4">
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm rounded-lg px-4 py-3">
            Failed to load puzzle: {error}
          </div>
        )}

        {loading && !puzzle && (
          <div className="text-center text-gray-400 py-12">Loading puzzle…</div>
        )}

        {puzzle && (
          <div className="flex gap-6 items-start">
            {/* Board */}
            <div className="w-[480px] flex-shrink-0">
              <PuzzleBoard
                fen={fen}
                orientation={orientation}
                onPieceDrop={onPieceDrop}
                status={status}
              />
            </div>

            {/* Right panel */}
            <div className="flex gap-3 items-start">
              {/* Info + controls */}
              <div className="w-60 flex flex-col gap-3">
                <PuzzleInfo puzzle={puzzle} status={status} orientation={orientation} moveHistory={moveHistory} />
                <Controls
                  onNextPuzzle={fetchPuzzle}
                  onRetry={resetPuzzle}
                  onShowSolution={playSolution}
                  status={status}
                  loading={loading}
                />
              </div>

              {/* Theme filter — separate column to the right */}
              <div className="w-44">
                <ThemeFilter selectedTheme={selectedTheme} onSelect={setSelectedTheme} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
