import { NextRequest, NextResponse } from 'next/server'
import { GrokClient } from '@/lib/grok-client'

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Missing messages' }, { status: 400 })
    }

    // Limit history to last 10 messages to control token usage
    const recentMessages = messages.slice(-10)

    const reply = await GrokClient.coachChat(recentMessages)
    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Coach API error:', error)
    return NextResponse.json({ error: 'Failed to get coach response' }, { status: 500 })
  }
}
