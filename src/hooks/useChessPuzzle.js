import { useState, useEffect, useCallback, useRef } from 'react'
import { Chess } from 'chess.js'

function uciToMove(uci) {
  return {
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    ...(uci.length === 5 ? { promotion: uci[4] } : {}),
  }
}

/**
 * Manages chess game state for a Lichess puzzle.
 *
 * Puzzle flow:
 *  1. Parse the game PGN and advance to initialPly half-moves.
 *  2. Auto-play solution[0] (the opponent's forcing move) after a short delay.
 *  3. User plays solution[1]; validate, then auto-play solution[2]; etc.
 *
 * Returns:
 *  fen            - current board position
 *  orientation    - 'white' | 'black' (the side the user is solving for)
 *  status         - 'idle' | 'playing' | 'correct' | 'wrong' | 'solved'
 *  onPieceDrop    - handler for react-chessboard's onPieceDrop prop
 */
export function useChessPuzzle(puzzleData) {
  const [fen, setFen] = useState('start')
  const [orientation, setOrientation] = useState('white')
  const [status, setStatus] = useState('idle')
  const [moveHistory, setMoveHistory] = useState([])
  const [resetKey, setResetKey] = useState(0)

  const chessRef = useRef(null)
  const solutionRef = useRef([])
  const solutionIndexRef = useRef(0) // index of the next USER move in solution[]
  const solutionPendingRef = useRef(false)

  useEffect(() => {
    if (!puzzleData) return

    const { game, puzzle } = puzzleData

    // chess.js v1 verbose moves include an `after` FEN.
    // initialPly is the index into verboseHistory of the last game move before
    // the puzzle starts — verboseHistory[initialPly].after is the puzzle position.
    const fullGame = new Chess()
    fullGame.loadPgn(game.pgn)
    const verboseHistory = fullGame.history({ verbose: true })

    const puzzleFen = verboseHistory[puzzle.initialPly]?.after
    if (!puzzleFen) {
      console.error('[useChessPuzzle] Could not read FEN at initialPly', puzzle.initialPly, 'history length', verboseHistory.length)
      return
    }

    const boardChess = new Chess(puzzleFen)

    chessRef.current = boardChess
    solutionRef.current = puzzle.solution
    solutionIndexRef.current = 0  // user always plays solution[0] first

    // Orientation: user plays as whoever is to move at the puzzle position
    setOrientation(boardChess.turn() === 'w' ? 'white' : 'black')
    setFen(puzzleFen)
    setMoveHistory([])

    const timers = []

    if (solutionPendingRef.current) {
      // Animate through every solution move in sequence.
      // solutionPendingRef is cleared inside the first timer so StrictMode's
      // cleanup+re-run cycle doesn't double-fire it.
      setStatus('solution')
      puzzle.solution.forEach((uci, i) => {
        const t = setTimeout(() => {
          if (i === 0) solutionPendingRef.current = false
          boardChess.move(uciToMove(uci))
          setFen(boardChess.fen())
          if (i === puzzle.solution.length - 1) setStatus('solved')
        }, (i + 1) * 700)
        timers.push(t)
      })
    } else {
      setStatus('playing')
    }

    return () => timers.forEach(clearTimeout)
  }, [puzzleData, resetKey])

  const onPieceDrop = useCallback((sourceSquare, targetSquare, piece) => {
    if (status !== 'playing') return false

    const chess = chessRef.current
    const solution = solutionRef.current
    const expectedUci = solution[solutionIndexRef.current]

    // Reject if the dragged piece doesn't belong to the side whose turn it is.
    // This catches any case where the chess instance is ahead of the display.
    if (piece[0] !== chess.turn()) return false

    const isPromotion =
      piece?.[1] === 'P' &&
      (targetSquare[1] === '8' || targetSquare[1] === '1')

    let result
    try {
      result = chess.move({
        from: sourceSquare,
        to: targetSquare,
        ...(isPromotion ? { promotion: 'q' } : {}),
      })
    } catch {
      return false // illegal move, snap piece back immediately
    }

    const playedUci = result.from + result.to + (result.promotion || '')

    if (playedUci !== expectedUci) {
      // Record wrong move, show briefly, then snap back
      setMoveHistory(h => [...h, { san: result.san, correct: false }])
      setFen(chess.fen())
      setStatus('wrong')
      setTimeout(() => {
        chess.undo()
        setFen(chess.fen())
        setStatus('playing')
      }, 600)
      return true // keep piece at dropped square until snap-back
    }

    // Correct move — user moves at even indices (0, 2, 4…), bot at odd (1, 3, 5…)
    setMoveHistory(h => [...h, { san: result.san, correct: true }])
    setFen(chess.fen())
    solutionIndexRef.current += 2

    const nextUserIndex = solutionIndexRef.current  // next user move
    const nextBotIndex  = nextUserIndex - 1         // bot move in between

    if (nextUserIndex >= solution.length) {
      setStatus('solved')
      return true
    }

    setStatus('correct')

    // Auto-play the bot's response then hand control back to the user
    if (nextBotIndex < solution.length) {
      setTimeout(() => {
        chess.move(uciToMove(solution[nextBotIndex]))
        setFen(chess.fen())
        setStatus('playing')
      }, 500)
    }

    return true
  }, [status])

  const resetPuzzle = useCallback(() => setResetKey(k => k + 1), [])

  const playSolution = useCallback(() => {
    solutionPendingRef.current = true
    setResetKey(k => k + 1)
  }, [])

  return { fen, orientation, status, moveHistory, onPieceDrop, resetPuzzle, playSolution }
}
