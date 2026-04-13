export default function Header() {
  return (
    <header className="bg-gray-900 text-white px-6 py-4 flex items-center gap-3 shadow-md">
      <span className="text-3xl">♟</span>
      <div>
        <h1 className="text-xl font-bold leading-tight">Chess Puzzle Trainer</h1>
        <p className="text-gray-400 text-xs">Powered by Lichess</p>
      </div>
    </header>
  )
}
