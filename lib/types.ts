import { RUBRIC, type RubricId } from './rubric'

export type Verdict = 'strong' | 'good' | 'partial' | 'weak'

export interface CategoryScore {
  id: RubricId
  score: number          // 0–100, produced by the model
  reasoning: string      // one or two sentences justifying the number
  evidence: string[]     // short quotes from the resume or posting
}

export interface KeywordGap {
  term: string
  importance: 'critical' | 'important' | 'nice-to-have'
  whereToAdd: string     // e.g. "Skills section" or "the Stripe internship bullet"
}

export interface Improvement {
  priority: 'high' | 'medium' | 'low'
  title: string          // "Quantify the API migration"
  why: string            // what it costs you to leave this alone
  action: string         // the concrete edit to make
}

export interface BulletRewrite {
  original: string
  improved: string
  rationale: string
}

export interface AnalysisReport {
  overallScore: number   // COMPUTED, never returned by the model
  verdict: Verdict       // derived from overallScore
  summary: string
  categories: CategoryScore[]
  matchedKeywords: string[]
  keywordGaps: KeywordGap[]
  improvements: Improvement[]
  bulletRewrites: BulletRewrite[]
  strengths: string[]
  redFlags: string[]
}

/**
 * The model scores each dimension; we do the arithmetic.
 * Same sub-scores in => same total out, every time.
 */
export function computeOverallScore(categories: CategoryScore[]): number {
  const weighted = RUBRIC.reduce((sum, dim) => {
    const found = categories.find((c) => c.id === dim.id)
    return sum + (found ? found.score * dim.weight : 0)
  }, 0)
  return Math.round(weighted)
}

export function verdictFor(score: number): Verdict {
  if (score >= 80) return 'strong'
  if (score >= 65) return 'good'
  if (score >= 45) return 'partial'
  return 'weak'
}

/** Where the resume text came from — a parsed upload, or pasted directly. */
export type ResumeSource =
  | { kind: 'file'; filename: string; text: string }
  | { kind: 'pasted'; text: string }

