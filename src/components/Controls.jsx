export default function Controls({ onNextPuzzle, onRetry, onShowSolution, status, loading }) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onShowSolution}
        disabled={loading}
        title="Show solution"
        className="px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-base font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        ⓘ
      </button>
      <button
        onClick={onRetry}
        disabled={status === 'idle' || loading}
        className="flex-1 py-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Retry
      </button>
      <button
        onClick={onNextPuzzle}
        disabled={loading}
        className="flex-1 py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Loading…' : 'Next Puzzle'}
      </button>
    </div>
  )
}
