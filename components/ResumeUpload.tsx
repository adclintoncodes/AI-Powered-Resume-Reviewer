'use client'

import { useRef, useState } from 'react'
import type { ResumeSource } from '@/lib/types'
import { extractResume } from '@/lib/analyze-client'

const MAX_BYTES = 5 * 1024 * 1024
const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const ACCEPTED_EXTS = ['.pdf', '.docx']

function isAccepted(file: File) {
  // Some browsers/OSes report an empty MIME type, so fall back to extension.
  if (ACCEPTED_TYPES.includes(file.type)) return true
  return ACCEPTED_EXTS.some((ext) => file.name.toLowerCase().endsWith(ext))
}

export function ResumeUpload({ onReady }: { onReady: (resume: ResumeSource) => void }) {
  const [mode, setMode] = useState<'file' | 'paste'>('file')
  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pasted, setPasted] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)
  const dragDepth = useRef(0)

  async function handleFile(file: File) {
    setError(null)

    if (!isAccepted(file)) {
      setError('Unsupported file type. Upload a PDF or DOCX.')
      return
    }
    if (file.size > MAX_BYTES) {
      setError(`That file is ${(file.size / 1024 / 1024).toFixed(1)}MB — the limit is 5MB.`)
      return
    }

    setBusy(true)
    try {
      onReady(await extractResume(file))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read that file.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-1 rounded-lg bg-surface-2 p-1 text-sm">
        {(['file', 'paste'] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(null) }}
            className={`flex-1 rounded-md px-3 py-1.5 transition ${
              mode === m ? 'bg-accent text-white' : 'text-fg-muted hover:text-fg'
            }`}
          >
            {m === 'file' ? 'Upload a file' : 'Paste text'}
          </button>
        ))}
      </div>

      {mode === 'file' ? (
        <div
          onDragEnter={(e) => {
            e.preventDefault()
            dragDepth.current += 1
            setDragging(true)
          }}
          onDragOver={(e) => e.preventDefault() /* required, or the browser opens the file */}
          onDragLeave={(e) => {
            e.preventDefault()
            dragDepth.current -= 1
            if (dragDepth.current === 0) setDragging(false)
          }}
          onDrop={(e) => {
            e.preventDefault()
            dragDepth.current = 0
            setDragging(false)
            const file = e.dataTransfer.files?.[0]
            if (file) void handleFile(file)
          }}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-14 text-center transition ${
            dragging
              ? 'border-accent bg-accent/5'
              : 'border-border bg-surface-2 hover:border-fg-subtle'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void handleFile(file)
              e.target.value = '' // allows re-selecting the same file
            }}
          />
          {busy ? (
            <p className="text-sm text-fg-muted">Reading your resume…</p>
          ) : (
            <>
              <p className="text-sm font-medium text-fg">
                Drop your resume here, or click to browse
              </p>
              <p className="text-xs text-fg-subtle">PDF or DOCX · up to 5MB</p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
            rows={12}
            placeholder="Paste the full text of your resume…"
            className="w-full resize-y rounded-xl border border-border bg-surface-2 p-4 text-sm text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none"
          />
          <button
            disabled={pasted.trim().length < 100}
            onClick={() => onReady({ kind: 'pasted', text: pasted.trim() })}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-40"
          >
            Use this text
          </button>
          {pasted.trim().length > 0 && pasted.trim().length < 100 && (
            <p className="text-xs text-fg-subtle">
              {100 - pasted.trim().length} more characters needed.
            </p>
          )}
        </div>
      )}

      {error && <p className="text-sm text-score-weak">{error}</p>}
    </div>
  )
}