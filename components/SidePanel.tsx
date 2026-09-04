'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function SlidersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
    </svg>
  )
}

export function SidePanel() {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>('light')

  // Read back whatever the pre-paint script already applied.
  useEffect(() => {
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
  }, [])

  // Escape closes the panel.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function applyTheme(next: Theme) {
    setTheme(next)
    document.documentElement.classList.toggle('dark', next === 'dark')
    try {
      localStorage.setItem('theme', next)
    } catch {
      // Private browsing can throw on write — the theme still applies for this session.
    }
  }

  return (
    <>
      {/* Edge tab — labelled, so it reads as a drawer rather than a stray arrow */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? 'Close settings panel' : 'Open settings panel'}
        className={`group fixed top-1/2 z-50 flex -translate-y-1/2 flex-col items-center gap-2.5 rounded-r-xl border border-l-0 border-border bg-surface-1 py-4 pl-2 pr-2.5 text-fg-muted shadow-lg transition-all duration-300 hover:bg-surface-2 hover:text-accent ${
          open ? 'left-72' : 'left-0'
        }`}
      >
        <span className="text-accent">
          <SlidersIcon />
        </span>

        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] [writing-mode:vertical-rl] rotate-180">
          Settings
        </span>

        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
             strokeLinecap="round" strokeLinejoin="round"
             className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Click-away backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
        />
      )}

      {/* The panel itself */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 border-r border-border bg-surface-1 shadow-2xl transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6 p-6">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-fg">
              Settings
            </h2>
            <p className="mt-0.5 text-xs text-fg-subtle">
              Preferences are saved on this device.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-fg-subtle">Appearance</p>
            <div className="flex gap-1 rounded-lg bg-surface-2 p-1">
              {([
                { value: 'light', label: 'Light', icon: <SunIcon /> },
                { value: 'dark', label: 'Dark', icon: <MoonIcon /> },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => applyTheme(opt.value)}
                  aria-pressed={theme === opt.value}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm transition ${
                    theme === opt.value
                      ? 'bg-accent text-white'
                      : 'text-fg-muted hover:text-fg'
                  }`}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}