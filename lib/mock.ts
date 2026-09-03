import type { AnalysisReport } from './types'
import { computeOverallScore, verdictFor } from './types'

const categories: AnalysisReport['categories'] = [
  {
    id: 'keywords',
    score: 62,
    reasoning:
      'Core language and framework requirements are present, but the posting leans heavily on distributed systems vocabulary the resume never uses.',
    evidence: ['"Python, TypeScript, React" — Skills', '"Kafka" appears 0 times'],
  },
  {
    id: 'relevance',
    score: 74,
    reasoning:
      'Two prior roles involved backend API work that maps cleanly onto the first three responsibilities listed.',
    evidence: ['"Built and maintained 12 REST endpoints" — Acme internship'],
  },
  {
    id: 'impact',
    score: 41,
    reasoning:
      'Most bullets describe duties rather than outcomes. Only one of nine bullets contains a number.',
    evidence: ['"Responsible for maintaining the data pipeline" — no metric'],
  },
  {
    id: 'ats',
    score: 88,
    reasoning:
      'Standard section headings, single-column layout, no images or text boxes. Parsed cleanly.',
    evidence: ['Sections detected: Education, Experience, Skills, Projects'],
  },
  {
    id: 'credentials',
    score: 90,
    reasoning: 'Degree in progress matches the stated requirement; graduation date is visible.',
    evidence: ['"B.A. Computer Science, expected 2027"'],
  },
]

export const MOCK_REPORT: AnalysisReport = {
  overallScore: computeOverallScore(categories),
  verdict: verdictFor(computeOverallScore(categories)),
  summary:
    'A solid technical foundation that undersells itself. The experience is relevant and the formatting is ATS-safe, but nearly every bullet describes responsibility instead of result — which is what costs you the screen.',
  categories,
  matchedKeywords: ['Python', 'TypeScript', 'React', 'REST', 'PostgreSQL', 'Git', 'CI/CD'],
  keywordGaps: [
    { term: 'Kafka', importance: 'critical', whereToAdd: 'Skills, if you have any exposure' },
    { term: 'distributed systems', importance: 'critical', whereToAdd: 'Reframe the data pipeline bullet' },
    { term: 'Docker', importance: 'important', whereToAdd: 'Skills section' },
    { term: 'observability', importance: 'important', whereToAdd: 'The monitoring work at Acme' },
    { term: 'Terraform', importance: 'nice-to-have', whereToAdd: 'Only if genuinely used' },
  ],
  improvements: [
    {
      priority: 'high',
      title: 'Put a number on every bullet',
      why: 'Eight of nine bullets have no metric. Reviewers read impact, not job descriptions — this is the single largest score drag.',
      action: 'For each bullet ask: how many, how much faster, how much cheaper, for how many users? Add the figure even if approximate.',
    },
    {
      priority: 'high',
      title: 'Reframe the pipeline work in the posting\'s language',
      why: 'You did distributed data work but never use the words the posting screens for, so keyword matching misses it entirely.',
      action: 'Rewrite "maintained the data pipeline" to name the queue, the throughput, and the failure handling.',
    },
    {
      priority: 'medium',
      title: 'Move Projects above Education',
      why: 'Your strongest evidence for this role is project work, but it sits last where it gets skimmed.',
      action: 'Reorder sections: Experience, Projects, Skills, Education.',
    },
    {
      priority: 'low',
      title: 'Trim the summary paragraph',
      why: 'Four lines of adjectives compete with the content that actually earns the interview.',
      action: 'Cut to one line, or delete it and let the first bullet lead.',
    },
  ],
  bulletRewrites: [
    {
      original: 'Responsible for maintaining the data pipeline.',
      improved:
        'Maintained a Kafka-backed ingestion pipeline processing 40M events/day, cutting failed-batch retries by 60% with idempotent consumers.',
      rationale:
        'Names the technology the posting screens for, quantifies scale, and states an outcome instead of a duty.',
    },
    {
      original: 'Worked on the frontend with React.',
      improved:
        'Shipped 6 React features to 12k monthly users, reducing dashboard load time from 3.2s to 900ms via query batching.',
      rationale: 'Converts an activity into shipped scope plus a measured performance win.',
    },
  ],
  strengths: [
    'ATS-safe formatting that parsed without errors',
    'Directly relevant backend API experience in two prior roles',
    'Credentials clearly exceed the stated minimum',
  ],
  redFlags: [
    'A 7-month gap between the Acme and Beta roles is unexplained',
    'No evidence of the distributed systems work the posting emphasizes most',
  ],
}