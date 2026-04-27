/**
 * WhatsApp Bot — Twilio WhatsApp API webhook
 *
 * Setup:
 * 1. Sign up at https://twilio.com → get Account SID + Auth Token
 * 2. Enable WhatsApp Sandbox: Twilio Console → Messaging → Try it out → WhatsApp
 * 3. Set webhook URL to: https://cvglow-web.vercel.app/api/whatsapp/webhook
 * 4. Add to .env.local:
 *      TWILIO_ACCOUNT_SID=ACxxxx
 *      TWILIO_AUTH_TOKEN=xxxx
 *      TWILIO_WHATSAPP_FROM=whatsapp:+14155238886  (Twilio sandbox number)
 *
 * For production: register a dedicated WhatsApp Business number with Twilio.
 *
 * Commands supported:
 *   "score" — get ATS score tips
 *   "interview" — get interview prep tips for your saved job
 *   "jobs" — get job board links for HK
 *   "help" — list commands
 */

import { NextRequest, NextResponse } from 'next/server'

const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || ''

// Verify Twilio signature (security)
async function verifyTwilioSignature(req: NextRequest, body: string): Promise<boolean> {
  if (!TWILIO_AUTH_TOKEN) return true // Skip in dev
  const twilioSig = req.headers.get('x-twilio-signature') || ''
  const url = req.url
  // Production signature validation would use twilio.validateRequest()
  // For now, check header exists
  return !!twilioSig && !!url
}

function twimlResponse(message: string): Response {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${message}</Message>
</Response>`
  return new Response(xml, {
    headers: { 'Content-Type': 'text/xml' },
  })
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const params = new URLSearchParams(body)

  const from = params.get('From') || ''
  const messageBody = (params.get('Body') || '').trim().toLowerCase()

  // Log for debugging
  console.log(`WhatsApp message from ${from}: ${messageBody}`)

  // Command routing
  if (messageBody === 'help' || messageBody === 'hi' || messageBody === 'hello') {
    return twimlResponse(
      `👋 Welcome to *CVGlow* — your AI job hunt copilot for Hong Kong!\n\n` +
      `Commands:\n` +
      `• *score* — tips to improve your ATS score\n` +
      `• *interview* — quick interview prep tips\n` +
      `• *jobs* — top Hong Kong job boards\n` +
      `• *app* — open CVGlow\n\n` +
      `Reply with a command to get started!`
    )
  }

  if (messageBody === 'score' || messageBody === 'ats') {
    return twimlResponse(
      `📊 *ATS Score Tips*\n\n` +
      `Top 5 ways to boost your score:\n` +
      `1. Mirror keywords from the job description\n` +
      `2. Use standard section headings (Experience, Skills, Education)\n` +
      `3. Avoid tables and graphics — ATS can't read them\n` +
      `4. Quantify achievements (e.g. "grew revenue 30%")\n` +
      `5. Include both full names and abbreviations (e.g. "JavaScript (JS)")\n\n` +
      `Get your score at: https://cvglow-web.vercel.app`
    )
  }

  if (messageBody === 'interview') {
    return twimlResponse(
      `🎤 *Interview Prep Tips*\n\n` +
      `Use the STAR method:\n` +
      `• *S*ituation — set the context\n` +
      `• *T*ask — what was your responsibility\n` +
      `• *A*ction — what did YOU do\n` +
      `• *R*esult — quantify the outcome\n\n` +
      `Practice with AI now: https://cvglow-web.vercel.app/interview`
    )
  }

  if (messageBody === 'jobs') {
    return twimlResponse(
      `🔍 *Top HK Job Boards*\n\n` +
      `• JobsDB: https://hk.jobsdb.com\n` +
      `• LinkedIn: https://linkedin.com/jobs\n` +
      `• Indeed HK: https://hk.indeed.com\n` +
      `• CTgoodjobs: https://ctgoodjobs.hk\n` +
      `• Glassdoor: https://glassdoor.com\n\n` +
      `Tip: Customise your CV for each job at cvglow-web.vercel.app`
    )
  }

  if (messageBody === 'app' || messageBody === 'open') {
    return twimlResponse(
      `🚀 Open CVGlow: https://cvglow-web.vercel.app\n\n` +
      `Build your AI-powered resume in 5 minutes!`
    )
  }

  // Default response
  return twimlResponse(
    `I didn't understand that. Reply *help* to see available commands.\n\n` +
    `CVGlow — AI job hunt copilot for Hong Kong 🇭🇰`
  )
}
