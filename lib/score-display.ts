import type { Verdict } from './types'

export const VERDICT_LABEL: Record<Verdict, string> = {
  strong: 'Strong match',
  good: 'Good match',
  partial: 'Partial match',
  weak: 'Weak match',
}

/**
 * Full class strings, never interpolated.
 * Tailwind scans source text for literal class names at build time —
 * `text-score-${verdict}` produces NOTHING, because that string never
 * appears in the source. This lookup keeps every class literal.
 */
export const VERDICT_CLASS: Record<Verdict, { text: string; stroke: string; bg: string }> = {
  strong: { text: 'text-score-strong', stroke: 'stroke-score-strong', bg: 'bg-score-strong' },
  good: { text: 'text-score-good', stroke: 'stroke-score-good', bg: 'bg-score-good' },
  partial: { text: 'text-score-partial', stroke: 'stroke-score-partial', bg: 'bg-score-partial' },
  weak: { text: 'text-score-weak', stroke: 'stroke-score-weak', bg: 'bg-score-weak' },
}

export const PRIORITY_CLASS: Record<'high' | 'medium' | 'low', string> = {
  high: 'bg-score-weak/15 text-score-weak',
  medium: 'bg-score-partial/15 text-score-partial',
  low: 'bg-surface-2 text-fg-muted',
}

export const IMPORTANCE_CLASS: Record<'critical' | 'important' | 'nice-to-have', string> = {
  critical: 'border-score-weak/40 text-score-weak',
  important: 'border-score-partial/40 text-score-partial',
  'nice-to-have': 'border-border text-fg-muted',
}