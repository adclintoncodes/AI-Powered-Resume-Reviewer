'use client'

import { useState } from 'react'
import type { AnalysisReport, ResumeSource } from '@/lib/types'
import { requestAnalysis } from '@/lib/analyze-client'

type AppState =
  | { step: 'upload' }
  | { step: 'describe'; resume: ResumeSource }
  | { step: 'analyzing'; resume: ResumeSource; jobDescription: string }
  | { step: 'report'; resume: ResumeSource; jobDescription: string; report: AnalysisReport }
  | { step: 'error'; message: string; resume: ResumeSource; jobDescription: string }

export default function Home() {
  const [state, setState] = useState<AppState>({ step: 'upload' })

  function handleResumeReady(resume: ResumeSource) {
    setState({ step: 'describe', resume })
  }

  async function handleAnalyze(jobDescription: string) {
    if (state.step !== 'describe') return // narrows the union — state.resume is now safe
    const { resume } = state

    setState({ step: 'analyzing', resume, jobDescription })

    try {
      const report = await requestAnalysis(resume, jobDescription)
      setState({ step: 'report', resume, jobDescription, report })
    } catch (err) {
      setState({
        step: 'error',
        message: err instanceof Error ? err.message : 'Something went wrong.',
        resume,
        jobDescription,
      })
    }
  }

  function handleReset() {
    setState({ step: 'upload' })
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-6 py-16">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-fg">
          AI Resume Reviewer
        </h1>
        <p className="mt-2 text-sm text-fg-muted">
          Score your resume against a specific job description, and see exactly what to fix.
        </p>
      </header>

      {/* Temporary scaffolding — F4–F7 replace each block with a real component */}
      <section className="rounded-xl border border-border bg-surface-1 p-6">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
          step: {state.step}
        </p>

        {state.step === 'upload' && (
          <button
            onClick={() =>
              handleResumeReady({ kind: 'pasted', text: 'FAKE RESUME TEXT' })
            }
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-soft"
          >
            Simulate resume upload
          </button>
        )}

        {state.step === 'describe' && (
          <button
            onClick={() => handleAnalyze('FAKE JOB DESCRIPTION')}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-soft"
          >
            Simulate analyze
          </button>
        )}

        {state.step === 'analyzing' && (
          <p className="text-sm text-fg-muted">Analyzing…</p>
        )}

        {state.step === 'report' && (
          <div className="space-y-3">
            <p className="text-4xl font-semibold text-score-good">
              {state.report.overallScore}
              <span className="text-base text-fg-subtle">/100</span>
            </p>
            <p className="text-sm text-fg-muted">{state.report.summary}</p>
            <button onClick={handleReset} className="text-sm text-accent underline">
              Start over
            </button>
          </div>
        )}

        {state.step === 'error' && (
          <div className="space-y-3">
            <p className="text-sm text-score-weak">{state.message}</p>
            <button onClick={handleReset} className="text-sm text-accent underline">
              Start over
            </button>
          </div>
        )}
      </section>
    </main>
  )
}