import { NextResponse } from 'next/server'
import { ExtractionError, extractResumeText } from '@/lib/extract'

// Buffer and the PDF parser need Node primitives — this cannot run on Edge.
export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(req: Request) {
  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json(
      { error: 'Expected a file upload.' },
      { status: 400 },
    )
  }

  const file = form.get('file')

  // get() returns File | string | null — instanceof both validates and narrows.
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file received.' }, { status: 400 })
  }

  try {
    const text = await extractResumeText(file)

    return NextResponse.json({
      text,
      filename: file.name,
      chars: text.length,
    })
  } catch (err) {
    if (err instanceof ExtractionError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }

    console.error('[api/extract] unexpected:', err)
    return NextResponse.json(
      { error: 'Something went wrong reading that file.' },
      { status: 500 },
    )
  }
}