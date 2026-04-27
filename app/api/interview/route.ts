import { NextRequest, NextResponse } from 'next/server'
import { GrokClient } from '@/lib/grok-client'

export async function POST(req: NextRequest) {
  try {
    const { resumeContent, jobTitle, history, candidateAnswer } = await req.json()
    if (!resumeContent || !jobTitle) {
      return NextResponse.json({ error: 'Missing resumeContent or jobTitle' }, { status: 400 })
    }
    const result = await GrokClient.interviewTurn(resumeContent, jobTitle, history || [], candidateAnswer || '')
    return NextResponse.json(result)
  } catch (err) {
    console.error('Interview API error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Interview failed' },
      { status: 500 }
    )
  }
}
