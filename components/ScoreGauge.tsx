'use client'

import { useEffect, useState } from 'react'
import type { Verdict } from '@/lib/types'
import { VERDICT_CLASS, VERDICT_LABEL } from '@/lib/score-display'

export function ScoreGauge({ score, verdict }: { score: number; verdict: Verdict }) {
  const RADIUS = 54
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS

  // Start at 0 and animate up on mount, so the arc sweeps into place.
  const [shown, setShown] = useState(0)
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(score))
    return () => cancelAnimationFrame(id)
  }, [score])

  const offset = CIRCUMFERENCE * (1 - shown / 100)

  return (
    <div className="flex items-center gap-6">
      <div className="relative h-32 w-32 shrink-0">
        <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
          <circle
            cx="64" cy="64" r={RADIUS}
            fill="none" strokeWidth="9"
            className="stroke-surface-2"
          />
          <circle
            cx="64" cy="64" r={RADIUS}
            fill="none" strokeWidth="9" strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            className={`${VERDICT_CLASS[verdict].stroke} transition-[stroke-dashoffset] duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-semibold ${VERDICT_CLASS[verdict].text}`}>
            {score}
          </span>
          <span className="text-xs text-fg-subtle">out of 100</span>
        </div>
      </div>

      <div>
        <p className={`text-lg font-semibold ${VERDICT_CLASS[verdict].text}`}>
          {VERDICT_LABEL[verdict]}
        </p>
        <p className="mt-1 text-sm text-fg-muted">
          Weighted across five dimensions
        </p>
      </div>
    </div>
  )
}