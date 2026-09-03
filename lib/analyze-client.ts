import type { AnalysisReport, ResumeSource } from './types'
import { MOCK_REPORT } from './mock'

/** Flip to false once /api/analyze exists. */
const USE_MOCK = true

export async function requestAnalysis(
  resume: ResumeSource,
  jobDescription: string,
): Promise<AnalysisReport> {
  if (USE_MOCK) {
    // Deliberate delay: a loading state you can't see is a loading state you won't build.
    await new Promise((resolve) => setTimeout(resolve, 1800))
    return MOCK_REPORT
  }

  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeText: resume.text, jobDescription }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Analysis failed (${res.status})`)
  }

  return res.json()
}