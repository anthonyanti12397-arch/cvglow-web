import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature') || ''

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )

    // Handle relevant events
    switch (event.type) {
      case 'charge.succeeded':
        await handleChargeSucceeded(event.data.object as Stripe.Charge)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 400 }
    )
  }
}

async function handleChargeSucceeded(charge: Stripe.Charge) {
  console.log(`Payment succeeded: ${charge.id}`)

  // Send confirmation email
  try {
    await sendPaymentConfirmationEmail({
      email: charge.billing_details?.email || '',
      amount: charge.amount,
      currency: charge.currency,
      chargeId: charge.id,
    })
  } catch (error) {
    console.error('Failed to send email:', error)
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log(`Subscription created: ${subscription.id}`)
  // Update user subscription status in database (future)
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log(`Subscription updated: ${subscription.id}`)
  // Update user subscription status
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log(`Subscription deleted: ${subscription.id}`)
  // Mark subscription as cancelled in database
}

async function sendPaymentConfirmationEmail({
  email,
  amount,
  currency,
  chargeId,
}: {
  email: string
  amount: number
  currency: string
  chargeId: string
}) {
  // For now, just log - will implement with SendGrid/Resend later
  console.log(`Email to ${email}: Payment of ${amount} ${currency} confirmed (${chargeId})`)

  // TODO: Integrate with email service
  // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({...})
  // })
}
