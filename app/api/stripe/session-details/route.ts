import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing sessionId' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Extract subscription ID from the session
    const subscriptionId = session.subscription as string

    return NextResponse.json({
      sessionId: session.id,
      paymentStatus: session.payment_status,
      subscriptionId,
      customerEmail: session.customer_email,
      createdAt: new Date(session.created * 1000),
    })
  } catch (error) {
    console.error('Stripe session details error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve session details' },
      { status: 500 }
    )
  }
}
