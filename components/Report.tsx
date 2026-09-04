'use client'

import type { AnalysisReport } from '@/lib/types'
import { verdictFor } from '@/lib/types'
import { RUBRIC } from '@/lib/rubric'
import { ScoreGauge } from './ScoreGauge'
import { VERDICT_CLASS, PRIORITY_CLASS, IMPORTANCE_CLASS } from '@/lib/score-display'

function Section({ title, hint, children }: {
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-fg">{title}</h2>
        {hint && <p className="mt-0.5 text-xs text-fg-subtle">{hint}</p>}
      </div>
      {children}
    </section>
  )
}

export function Report({ report, onReset }: { report: AnalysisReport; onReset: () => void }) {
  return (
    <div className="space-y-10">
      {/* Headline */}
      <div className="space-y-5">
        <ScoreGauge score={report.overallScore} verdict={report.verdict} />
        <p className="text-sm leading-relaxed text-fg-muted">{report.summary}</p>
      </div>

      {/* Per-dimension breakdown */}
      <Section title="Breakdown" hint="Each dimension scored independently, then weighted.">
        <div className="space-y-4">
          {RUBRIC.map((dim) => {
            const cat = report.categories.find((c) => c.id === dim.id)
            if (!cat) return null
            const v = verdictFor(cat.score)

            return (
              <div key={dim.id} className="rounded-lg border border-border bg-surface-2 p-4">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-sm font-medium text-fg">{dim.label}</p>
                  <p className="shrink-0 text-sm text-fg-subtle">
                    <span className={`font-semibold ${VERDICT_CLASS[v].text}`}>{cat.score}</span>
                    <span className="mx-1.5">·</span>
                    {Math.round(dim.weight * 100)}% weight
                  </p>
                </div>

                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-surface-0">
                  <div
                    className={`h-full rounded-full ${VERDICT_CLASS[v].bg}`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>

                <p className="mt-3 text-sm leading-relaxed text-fg-muted">{cat.reasoning}</p>

                {cat.evidence.length > 0 && (
                  <ul className="mt-2.5 space-y-1">
                    {cat.evidence.map((e, i) => (
                      <li key={i} className="border-l-2 border-border pl-3 text-xs text-fg-subtle">
                        {e}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </Section>

      {/* Strengths / red flags */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Section title="Strengths">
          <ul className="space-y-2">
            {report.strengths.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-fg-muted">
                <span className="text-score-strong">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Red flags">
          <ul className="space-y-2">
            {report.redFlags.map((f, i) => (
              <li key={i} className="flex gap-2 text-sm text-fg-muted">
                <span className="text-score-weak">!</span>
                {f}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Keywords */}
      <Section title="Keywords" hint="What the posting screens for, and what's missing.">
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs text-fg-subtle">Found in your resume</p>
            <div className="flex flex-wrap gap-1.5">
              {report.matchedKeywords.map((k) => (
                <span
                  key={k}
                  className="rounded-full border border-score-good/40 px-2.5 py-1 text-xs text-score-good"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs text-fg-subtle">Missing</p>
            <div className="space-y-2">
              {report.keywordGaps.map((g) => (
                <div
                  key={g.term}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-border bg-surface-2 px-3 py-2"
                >
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs ${IMPORTANCE_CLASS[g.importance]}`}
                  >
                    {g.term}
                  </span>
                  <span className="text-xs text-fg-muted">{g.whereToAdd}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Improvements */}
      <Section title="What to fix" hint="Ordered by how much it costs you to leave alone.">
        <ol className="space-y-3">
          {report.improvements.map((imp, i) => (
            <li key={i} className="rounded-lg border border-border bg-surface-2 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded px-2 py-0.5 text-xs font-medium uppercase tracking-wide ${PRIORITY_CLASS[imp.priority]}`}
                >
                  {imp.priority}
                </span>
                <p className="text-sm font-medium text-fg">{imp.title}</p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{imp.why}</p>
              <p className="mt-2 text-sm leading-relaxed text-fg">
                <span className="text-fg-subtle">Do this: </span>
                {imp.action}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Rewrites */}
      <Section title="Rewritten bullets" hint="Your weakest lines, rebuilt.">
        <div className="space-y-4">
          {report.bulletRewrites.map((b, i) => (
            <div key={i} className="overflow-hidden rounded-lg border border-border">
              <div className="border-b border-border bg-surface-2 p-4">
                <p className="mb-1.5 text-xs uppercase tracking-wide text-fg-subtle">Before</p>
                <p className="text-sm text-fg-muted line-through decoration-fg-subtle/40">
                  {b.original}
                </p>
              </div>
              <div className="bg-surface-1 p-4">
                <p className="mb-1.5 text-xs uppercase tracking-wide text-score-good">After</p>
                <p className="text-sm leading-relaxed text-fg">{b.improved}</p>
                <p className="mt-2 text-xs text-fg-subtle">{b.rationale}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <button
        onClick={onReset}
        className="rounded-lg border border-border px-4 py-2 text-sm text-fg-muted transition hover:border-fg-subtle hover:text-fg"
      >
        Analyze another resume
      </button>
    </div>
  )
}