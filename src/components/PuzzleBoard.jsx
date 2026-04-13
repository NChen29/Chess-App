import { useState, useEffect } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'

export default function PuzzleBoard({ fen, orientation, onPieceDrop, status }) {
  const [optionSquares, setOptionSquares] = useState({})
  const [selectedSquare, setSelectedSquare] = useState(null)

  // Clear dots whenever the board position changes (move made, new puzzle, bot move)
  useEffect(() => {
    setOptionSquares({})
    setSelectedSquare(null)
  }, [fen])

  function onSquareClick(square) {
    const chess = new Chess(fen)
    const piece = chess.get(square)
    const userColor = orientation === 'white' ? 'w' : 'b'

    // Clicking the same piece again clears the dots
    if (square === selectedSquare) {
      setOptionSquares({})
      setSelectedSquare(null)
      return
    }

    // Only show dots for the user's own pieces
    if (!piece || piece.color !== userColor) {
      setOptionSquares({})
      setSelectedSquare(null)
      return
    }

    setSelectedSquare(square)

    const moves = chess.moves({ square, verbose: true })
    if (!moves.length) {
      setOptionSquares({})
      return
    }

    const squares = {}
    moves.forEach(move => {
      const isCapture = !!chess.get(move.to)
      squares[move.to] = {
        background: isCapture
          ? 'radial-gradient(circle, transparent 58%, rgba(0,0,0,0.2) 58%)'
          : 'radial-gradient(circle, rgba(0,0,0,0.2) 26%, transparent 26%)',
      }
    })
    setOptionSquares(squares)
  }

  const boardStyle =
    status === 'wrong'
      ? { border: '4px solid #ef4444', borderRadius: '4px' }
      : status === 'solved'
      ? { border: '4px solid #22c55e', borderRadius: '4px' }
      : { border: '4px solid transparent', borderRadius: '4px' }

  return (
    <div style={boardStyle} className="transition-all duration-200">
      <Chessboard
        position={fen}
        onPieceDrop={(src, tgt, piece) => {
          setOptionSquares({})
          return onPieceDrop(src, tgt, piece)
        }}
        onSquareClick={onSquareClick}
        customSquareStyles={optionSquares}
        boardOrientation={orientation}
        animationDuration={200}
        customBoardStyle={{ borderRadius: '2px' }}
      />
    </div>
  )
}
