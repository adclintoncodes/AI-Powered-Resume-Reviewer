export const RUBRIC = [
  {
    id: 'keywords',
    label: 'Keyword & Skills Match',
    weight: 0.30,
    blurb: 'Do the hard skills, tools, and terminology in the posting appear in the resume?',
  },
  {
    id: 'relevance',
    label: 'Experience Relevance',
    weight: 0.25,
    blurb: 'Does past work map onto the responsibilities this role actually lists?',
  },
  {
    id: 'impact',
    label: 'Quantified Impact',
    weight: 0.20,
    blurb: 'Are achievements backed by numbers, scale, or measurable outcomes?',
  },
  {
    id: 'ats',
    label: 'ATS Readability',
    weight: 0.15,
    blurb: 'Clean sections, standard headings, no tables or graphics that parsers choke on.',
  },
  {
    id: 'credentials',
    label: 'Education & Credentials',
    weight: 0.10,
    blurb: 'Degrees, certifications, and requirements the posting treats as mandatory.',
  },
] as const

export type RubricId = (typeof RUBRIC)[number]['id']