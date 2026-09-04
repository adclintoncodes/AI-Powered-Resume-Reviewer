'use client'

import { useEffect, useState } from 'react'

const STAGES = [
  'Reading your resume…',
  'Parsing the job description…',
  'Matching skills and keywords…',
  'Scoring each dimension…',
  'Writing your improvements…',
]

export function Analyzing() {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      // Clamp at the last stage — never loop back, that reads as "stuck".
      setStage((s) => Math.min(s + 1, STAGES.length - 1))
    }, 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col items-center gap-6 py-16">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-border" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent" />
      </div>

      <div className="text-center">
        <p aria-live="polite" className="text-sm font-medium text-fg">
          {STAGES[stage]}
        </p>
        <p className="mt-1.5 text-xs text-fg-subtle">
          This usually takes 10–20 seconds.
        </p>
      </div>

      <div className="flex gap-1.5">
        {STAGES.map((_, i) => (
          <div
            key={i}
            className={`h-1 w-8 rounded-full transition-colors duration-500 ${
              i <= stage ? 'bg-accent' : 'bg-surface-2'
            }`}
          />
        ))}
      </div>
    </div>
  )
}