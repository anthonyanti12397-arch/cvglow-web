import { NextRequest, NextResponse } from 'next/server'
import { GrokClient } from '@/lib/grok-client'

export async function POST(req: NextRequest) {
  try {
    const { resume_content, job_title, job_description } = await req.json()

    if (!resume_content || !job_title || !job_description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const result = await GrokClient.scoreATS(resume_content, job_title, job_description)

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('ATS score failed:', error)
    return NextResponse.json(
      { error: 'Failed to score resume', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}
