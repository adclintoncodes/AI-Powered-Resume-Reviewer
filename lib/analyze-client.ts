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

export async function extractResume(file: File): Promise<ResumeSource> {
  if (USE_MOCK) {
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