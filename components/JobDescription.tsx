'use client'

import { useState } from 'react'
import type { ResumeSource } from '@/lib/types'

const MIN_CHARS = 150

export function JobDescription({
  resume,
  onAnalyze,
  onBack,
}: {
  resume: ResumeSource
  onAnalyze: (jobDescription: string) => void
  onBack: () => void
}) {
  const [text, setText] = useState('')

  // Derived during render — deliberately NOT stored in state.
  const trimmed = text.trim()
  const chars = trimmed.length
  const words = trimmed ? trimmed.split(/\s+/).length : 0
  const ready = chars >= MIN_CHARS

  const resumeLabel = resume.kind === 'file' ? resume.filename : 'Pasted resume text'

  return (
    <div className="space-y-4">
      {/* What we're comparing against */}
      <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface-2 px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-fg-subtle">Resume</p>
          <p className="truncate text-sm text-fg">{resumeLabel}</p>
          <p className="mt-0.5 text-xs text-fg-subtle">
            {resume.text.length.toLocaleString()} characters read
          </p>
        </div>
        <button
          onClick={onBack}
          className="shrink-0 text-sm text-accent hover:text-accent-soft"
        >
          Change
        </button>
      </div>

      <div>
        <label htmlFor="jd" className="text-sm font-medium text-fg">
          Paste the job description
        </label>
        <p className="mt-1 text-xs text-fg-subtle">
          The full posting works best — responsibilities, requirements, and
          qualifications. The more complete it is, the more specific your feedback.
        </p>
        <textarea
          id="jd"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={14}
          placeholder="Paste the job posting here…"
          className="mt-3 w-full resize-y rounded-xl border border-border bg-surface-2 p-4 text-sm leading-relaxed text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-fg-subtle">
          {ready ? (
            <>
              {words.toLocaleString()} words · {chars.toLocaleString()} characters
            </>
          ) : chars === 0 ? (
            <>Minimum {MIN_CHARS} characters</>
          ) : (
            <>{MIN_CHARS - chars} more characters needed</>
          )}
        </p>

        <button
          disabled={!ready}
          onClick={() => onAnalyze(trimmed)}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-40"
        >
          Analyze my resume
        </button>
      </div>
    </div>
  )
}