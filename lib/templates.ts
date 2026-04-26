export type TemplateId = 'classic' | 'tech' | 'finance' | 'creative' | 'minimal'

export interface TemplateConfig {
  id: TemplateId
  name: string
  description: string
  bestFor: string
  preview: string // CSS gradient for thumbnail
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Clean serif layout with a bold header line.',
    bestFor: 'Any industry',
    preview: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Dark header, monospace skill tags. Built for engineers.',
    bestFor: 'Software, Engineering, IT',
    preview: 'linear-gradient(135deg, #0A1628, #1a3a6b)',
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Traditional centered layout. Conservative and authoritative.',
    bestFor: 'Banking, Finance, Law',
    preview: 'linear-gradient(135deg, #1a1a2e, #16213e)',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Two-column with a bold sidebar. Visual and modern.',
    bestFor: 'Design, Marketing, Media',
    preview: 'linear-gradient(135deg, #FF6B5B, #ff8c7f)',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Maximum white space. Confident and understated.',
    bestFor: 'Executive, Consulting, Senior roles',
    preview: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
  },
]
