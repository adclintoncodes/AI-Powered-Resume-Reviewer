import mammoth from 'mammoth'
import { extractText, getDocumentProxy } from 'unpdf'

export const MAX_FILE_BYTES = 5 * 1024 * 1024 // 5MB
export const MAX_TEXT_CHARS = 40_000
export const MIN_TEXT_CHARS = 200

/**
 * Carries the HTTP status alongside the message, so the route handler can map
 * failures to status codes without string-matching error messages.
 */
export class ExtractionError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'ExtractionError'
  }
}

type FileKind = 'pdf' | 'docx'

function detectKind(file: File): FileKind | null {
  const name = file.name.toLowerCase()
  if (file.type === 'application/pdf' || name.endsWith('.pdf')) return 'pdf'
  if (
    file.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    name.endsWith('.docx')
  ) {
    return 'docx'
  }
  return null
}

/**
 * PDF and DOCX extraction both produce ragged whitespace — page breaks, column
 * artefacts, runs of spaces. Left alone, that noise costs tokens and makes the
 * model's job harder.
 */
export function normaliseText(raw: string): string {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '') // control chars
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

async function extractPdf(bytes: Uint8Array): Promise<string> {
  const pdf = await getDocumentProxy(bytes)
  // mergePages: true — without it, `text` is string[], one entry per page.
  const { text } = await extractText(pdf, { mergePages: true })
  return text
}

async function extractDocx(buffer: Buffer): Promise<string> {
  const { value } = await mammoth.extractRawText({ buffer })
  return value
}

/**
 * File in, clean text out. Throws ExtractionError with an HTTP status and a
 * message that is safe to show the user.
 */
export async function extractResumeText(file: File): Promise<string> {
  if (file.size === 0) {
    throw new ExtractionError('That file is empty.', 422)
  }
  if (file.size > MAX_FILE_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1)
    throw new ExtractionError(`That file is ${mb}MB — the limit is 5MB.`, 413)
  }

  const kind = detectKind(file)
  if (!kind) {
    throw new ExtractionError('Unsupported file type. Upload a PDF or DOCX.', 415)
  }

  const arrayBuffer = await file.arrayBuffer()

  let raw: string
  try {
    raw =
      kind === 'pdf'
        ? await extractPdf(new Uint8Array(arrayBuffer))
        : await extractDocx(Buffer.from(arrayBuffer))
  } catch (err) {
    // The underlying parser error is for our logs, not the user's screen.
    console.error('[extract] parser threw:', err)
    throw new ExtractionError(
      'Could not read that file. It may be corrupted or password-protected.',
      422,
    )
  }

  const text = normaliseText(raw)

  if (text.length < MIN_TEXT_CHARS) {
    throw new ExtractionError(
      'Almost no text could be read — this looks like a scanned image. ' +
        'Try a text-based PDF, or paste your resume instead.',
      422,
    )
  }

  return text.length > MAX_TEXT_CHARS ? text.slice(0, MAX_TEXT_CHARS) : text
}