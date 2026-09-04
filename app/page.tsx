'use client'

import { useState } from 'react'
import type { AnalysisReport, ResumeSource } from '@/lib/types'
import { requestAnalysis } from '@/lib/analyze-client'
import { ResumeUpload } from '@/components/ResumeUpload'
import { JobDescription } from '@/components/JobDescription'
import { Analyzing } from '@/components/Analyzing'
import { Report } from '@/components/Report'

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
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-6 pb-28 pt-16">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-fg">
          AI Resume Reviewer
        </h1>
        <p className="mt-2 text-sm text-fg-muted">
          Score your resume against a specific job description, and see exactly what to fix.
        </p>
      </header>

      <section className="rounded-xl border border-border bg-surface-1 p-6">
        {state.step === 'upload' && <ResumeUpload onReady={handleResumeReady} />}

        {state.step === 'describe' && (
          <JobDescription
            resume={state.resume}
            onAnalyze={handleAnalyze}
            onBack={handleReset}
          />
        )}

        {state.step === 'analyzing' && <Analyzing />}

        {state.step === 'report' && (
          <Report report={state.report} onReset={handleReset} />
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