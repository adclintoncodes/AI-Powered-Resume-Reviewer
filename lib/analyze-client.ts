import type { AnalysisReport, ResumeSource } from './types'
import { MOCK_REPORT } from './mock'

/**
 * One flag per endpoint, so the backend can go live a piece at a time.
 * /api/extract is real (B2). /api/analyze doesn't exist yet (B5).
 */
const MOCK_EXTRACT = false
const MOCK_ANALYZE = true

export async function requestAnalysis(
  resume: ResumeSource,
  jobDescription: string,
): Promise<AnalysisReport> {
  if (MOCK_ANALYZE) {
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

export async function extractResume(file: File): Promise<ResumeSource> {
  if (MOCK_EXTRACT) {
    await new Promise((resolve) => setTimeout(resolve, 900))
    return {
      kind: 'file',
      filename: file.name,
      text: `[mock extracted text from ${file.name}]`,
    }
  }

  const form = new FormData()
  form.append('file', file)

  // Note: no Content-Type header. The browser must set it itself so it can
  // include the multipart boundary. Setting it manually breaks the upload.
  const res = await fetch('/api/extract', { method: 'POST', body: form })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Could not read that file (${res.status})`)
  }

  const { text } = await res.json()
  return { kind: 'file', filename: file.name, text }
}