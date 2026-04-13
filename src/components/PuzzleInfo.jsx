export default function PuzzleInfo({ puzzle, status, orientation, moveHistory }) {
  return (
    <div className="h-[480px] flex flex-col bg-gray-800 rounded-xl overflow-hidden text-white">

      {/* Static top section: rating + themes */}
      <div className="flex-shrink-0 p-4 space-y-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Rating</span>
          <span className="font-semibold">{puzzle.puzzle.rating}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">ID</span>
          <span className="font-semibold text-sm">{puzzle.puzzle.id}</span>
        </div>
        <div>
          <span className="text-gray-400 text-sm block mb-1">Themes</span>
          <div className="flex flex-wrap gap-1">
            {puzzle.puzzle.themes.map((theme) => (
              <span
                key={theme}
                className="bg-gray-700 text-gray-200 text-xs px-2 py-0.5 rounded-full capitalize"
              >
                {theme.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable move history */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">

        {/* To move header / solution indicator */}
        <div className="flex items-center gap-2 px-1 py-2 flex-shrink-0">
          {status === 'solution' ? (
            <span className="font-semibold text-sm text-indigo-400">Viewing solution…</span>
          ) : (
            <>
              <div
                className={`w-4 h-4 rounded-sm flex-shrink-0 ${
                  orientation === 'white'
                    ? 'bg-white'
                    : 'bg-gray-950 border border-gray-500'
                }`}
              />
              <span className="font-semibold text-sm">
                {orientation === 'white' ? 'White to move' : 'Black to move'}
              </span>
            </>
          )}
        </div>

        {/* Move entries */}
        {moveHistory.map((entry, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-gray-700 rounded-lg px-3 py-2"
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold ${
                entry.correct ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {entry.correct ? '✓' : '✗'}
            </div>
            <span
              className={`text-sm font-medium ${
                entry.correct ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {entry.san} {entry.correct ? 'is correct!' : 'is incorrect!'}
            </span>
          </div>
        ))}

        {/* Solved banner */}
        {status === 'solved' && (
          <div className="flex items-center gap-2 bg-green-600 rounded-lg px-3 py-3 mt-1">
            <span className="text-white font-semibold">✓ Solved</span>
          </div>
        )}
      </div>

    </div>
  )
}
