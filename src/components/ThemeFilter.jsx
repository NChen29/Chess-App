import { useState } from 'react'
import { THEMES } from '../data/themes'

export default function ThemeFilter({ selectedTheme, onSelect }) {
  const [open, setOpen] = useState(false)

  const activeLabel = selectedTheme
    ? THEMES.find(t => t.value === selectedTheme)?.label
    : null

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium transition-colors"
      >
        <span className={activeLabel ? 'text-indigo-400' : 'text-gray-300'}>
          {activeLabel ? `Theme: ${activeLabel}` : 'Filter by Theme'}
        </span>
        <span className={`text-gray-400 text-xs transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute top-full mt-1 w-full bg-gray-700 rounded-lg overflow-y-auto max-h-52 z-10 shadow-xl">
          <button
            onClick={() => { onSelect(null); setOpen(false) }}
            className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-gray-600 ${
              !selectedTheme ? 'text-indigo-400 font-semibold' : 'text-gray-200'
            }`}
          >
            All themes
          </button>
          {THEMES.map(theme => (
            <button
              key={theme.value}
              onClick={() => { onSelect(theme.value); setOpen(false) }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-gray-600 ${
                selectedTheme === theme.value ? 'text-indigo-400 font-semibold' : 'text-gray-200'
              }`}
            >
              {theme.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
