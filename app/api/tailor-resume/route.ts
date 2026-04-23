import { NextRequest, NextResponse } from 'next/server'
import { ResumeContent } from '@/lib/types'

export async function POST(req: NextRequest) {
  const { resumeContent, jobTitle, jobDescription } = await req.json()

  const apiKey = process.env.XAI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'No API key' }, { status: 500 })

  const prompt = `You are an expert CV writer. Tailor this resume for the target job.

TARGET JOB TITLE: ${jobTitle}
${jobDescription ? `JOB DESCRIPTION:\n${jobDescription}` : ''}

CURRENT RESUME (JSON):
${JSON.stringify(resumeContent, null, 2)}

Rules:
- Keep the same person (name, email, phone, company names, dates)
- Rewrite summary to match the target job
- Rewrite experience descriptions to highlight relevant skills and achievements
- Reorder skills so the most relevant ones appear first; add obvious missing skills if they fit the person's background
- Keep the same JSON structure
- Be specific and impactful, use action verbs
- Return ONLY valid JSON matching the exact same structure, no explanation`

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'grok-3',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error('Grok API error:', err)
    return NextResponse.json({ error: 'Grok API failed' }, { status: 500 })
  }

  const data = await response.json()
  const raw = data.choices[0].message.content

  // Strip markdown code fences if present
  const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()

  try {
    const tailored: ResumeContent = JSON.parse(cleaned)
    return NextResponse.json({ tailored })
  } catch {
    console.error('Failed to parse Grok response:', cleaned)
    return NextResponse.json({ error: 'Invalid JSON from Grok' }, { status: 500 })
  }
}
