# AI Resume Reviewer

Scores a resume against a **specific** job description and tells you what to fix.

Most resume tools give you a generic checklist. This one reads the actual posting,
grades your resume across five weighted dimensions, and returns concrete edits —
including rewritten versions of your weakest bullet points.

## How the score works

The LLM never outputs an overall score. It rates each dimension independently with
written justification and supporting quotes; the application then computes the
weighted total in TypeScript.

| Dimension | Weight | What it measures |
|---|---|---|
| Keyword & Skills Match | 30% | Do the posting's hard skills and tools appear in the resume? |
| Experience Relevance | 25% | Does past work map onto the listed responsibilities? |
| Quantified Impact | 20% | Are achievements backed by numbers and outcomes? |
| ATS Readability | 15% | Will an applicant tracking system parse it cleanly? |
| Education & Credentials | 10% | Are stated requirements met? |

This matters: ask a model for "a score out of 100" and you get an unreproducible
vibe. Scoring each dimension and doing the arithmetic in code means the same
inputs give the same result, the user sees *why* they scored what they scored,
and the weights can be retuned without touching the prompt.

## Stack

- **Next.js 16** (App Router) — one deployable unit, UI and API together
- **TypeScript** — the report shape is a single shared contract between server and UI
- **Tailwind CSS v4** — design tokens defined in `@theme`
- **Claude API** (`claude-opus-5`) with **structured outputs** — a Zod schema constrains
  generation, so no JSON parsing or repair logic
- **unpdf / mammoth** — server-side PDF and DOCX text extraction

## Architecture notes

- The Anthropic API key lives only in a route handler and is never exposed to the
  browser. The route handler is the trust boundary.
- Document parsing runs server-side rather than shipping `pdf.js` to every visitor.
- UI state is a discriminated union of five states, so impossible combinations
  (analyzing *and* errored, a report with no resume) can't be constructed.

## Status

In active development. Frontend built against a mock fixture; scoring backend in progress.