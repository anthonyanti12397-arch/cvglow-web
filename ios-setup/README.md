# CVGlow iOS Setup Guide

## Current Setup
- Capacitor 8 wrapping the live Vercel web app
- App ID: `com.cvglow.app`
- Points to: `https://cvglow-web.vercel.app`

## Daily Commands

```bash
# Sync web changes to native project
npx cap sync

# Open in Xcode
npx cap open ios

# Build web first, then sync (for App Store build)
npm run build && npx cap sync
```

## Getting to TestFlight

### Step 1: Open Xcode
```bash
npx cap open ios
```

### Step 2: Configure signing
1. Xcode → Signing & Capabilities → Team → select your Apple Developer account
2. Bundle ID: `com.cvglow.app`
3. You need: Apple Developer Program ($99/year)

### Step 3: App Icons
Replace the placeholder icons in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
Sizes needed: 20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024px

### Step 4: Build for TestFlight
- Product → Archive → Distribute App → TestFlight & App Store

### Step 5: Submit to App Store
- App Store Connect → New App → fill metadata
- Screenshots needed: 6.5", 5.5" iPhone + 12.9" iPad

## Apple IAP Warning

Apple requires In-App Purchase (not Stripe) for subscriptions sold within iOS apps.
- Apple takes 30% (15% for small developers under $1M/year)
- Options:
  A) Implement StoreKit 2 for iOS subscriptions (recommended)
  B) Remove paywall from iOS, redirect to web for payment (allowed)
  C) Current Stripe setup will cause App Store rejection

For beta/TestFlight: Stripe works fine, no IAP needed.
For App Store submission: must use Apple IAP or remove payment UI.

## Recommended: Hybrid Approach
- iOS app uses Apple IAP for subscriptions
- Web app uses Stripe
- Share subscription status via your backend (Supabase)

## Files Modified for iOS
- `capacitor.config.ts` — Capacitor config pointing to Vercel
- `app/mobile.css` — iOS safe area + touch fixes
- `app/layout.tsx` — viewport-fit=cover meta tag
