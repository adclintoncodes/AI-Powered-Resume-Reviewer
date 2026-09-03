<<<<<<< HEAD
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

🚧 In active development. Frontend built against a mock fixture; scoring backend in progress.
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> cdd31f0 (Initial commit from Create Next App)
