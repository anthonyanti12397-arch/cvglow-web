import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

export async function POST(req: NextRequest) {
  try {
    const { subscriptionId } = await req.json()

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Missing subscriptionId' },
        { status: 400 }
      )
    }

    // Cancel the subscription at the end of the current billing period
    const canceledSubscription = await stripe.subscriptions.update(
      subscriptionId,
      { cancel_at_period_end: true }
    )

    return NextResponse.json({
      success: true,
      subscriptionId: canceledSubscription.id,
      canceledAt: canceledSubscription.canceled_at
        ? new Date(canceledSubscription.canceled_at * 1000)
        : null,
      currentPeriodEnd: (canceledSubscription as any).current_period_end
        ? new Date((canceledSubscription as any).current_period_end * 1000)
        : null,
    })
  } catch (error) {
    console.error('Stripe cancel subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}
