# W3QUIC Market Hub - Pi Network Payment Integration Guide

Complete guide for implementing Pi Network payments in the W3QUIC Market Hub.

## 🎯 Quick Overview

### Payment Flow
1. User clicks "Pay with Pi Network" button
2. Pi SDK creates payment with amount and metadata
3. User approves payment in Pi app
4. Payment ready for server approval
5. Backend calls Pi's approval endpoint
6. Payment ready for completion
7. Backend calls Pi's completion endpoint
8. Order created and payment completed

## 🔧 Implementation Details

### 1. SDK Initialization

**File**: `lib/pi-marketplace.ts`

\`\`\`typescript
export async function initializePiSDK(): Promise<boolean> {
  try {
    if (typeof window.Pi === 'undefined') {
      console.error('[Pi SDK] Pi object not available')
      return false
    }

    await window.Pi.init({
      version: '2.0',
      sandbox: true, // false for mainnet
    })

    console.log('[Pi SDK] Initialized successfully')
    return true
  } catch (error) {
    console.error('[Pi SDK] Initialization failed:', error)
    return false
  }
}
\`\`\`

**Usage**:
\`\`\`typescript
const initialized = await initializePiSDK()
if (!initialized) {
  throw new Error('Pi SDK initialization failed')
}
\`\`\`

### 2. User Authentication

**File**: `lib/pi-marketplace.ts`

\`\`\`typescript
export async function authenticateWithPi(): Promise<string | null> {
  try {
    if (typeof window.Pi === 'undefined') {
      console.error('[Pi Auth] Pi object not available')
      return null
    }

    const scopes = ['username', 'payments']
    const user = await window.Pi.authenticate(scopes)

    if (user && user.username) {
      console.log(`[Pi Auth] Authenticated as: ${user.username}`)
      return user.username
    }

    return null
  } catch (error) {
    console.error('[Pi Auth] Authentication failed:', error)
    return null
  }
}
\`\`\`

**Usage**:
\`\`\`typescript
const username = await authenticateWithPi()
if (username) {
  setPiUsername(username)
  // User authenticated, show marketplace
}
\`\`\`

### 3. Creating Payments

**File**: `components/w3quic/listing-details.tsx`

\`\`\`typescript
const handlePayment = async () => {
  setProcessingPayment(true)
  setPaymentError(null)
  setPaymentSuccess(false)

  try {
    const paymentId = await createPiPayment(
      listing.priceInPi,
      {
        memo: `W3QUIC Market Hub Purchase`,
        metadata: {
          productId: listing.id,
          category: listing.category,
          buyerUsername: piUsername,
          marketplace: 'W3QUIC',
        },
      },
      {
        onReadyForServerApproval: async (paymentId) => {
          console.log('[Payment] Ready for approval:', paymentId)
          const approved = await approvePaymentOnBackend(paymentId)
          if (!approved) {
            throw new Error('Server approval failed')
          }
        },
        onReadyForServerCompletion: async (paymentId) => {
          console.log('[Payment] Ready for completion:', paymentId)
          const completed = await completePaymentOnBackend(paymentId)
          if (!completed) {
            throw new Error('Server completion failed')
          }
          
          // Create order
          createOrder({
            id: `order-${Date.now()}`,
            buyerId: piUsername,
            buyerUsername: piUsername,
            sellerId: listing.sellerId,
            listingId: listing.id,
            listingTitle: listing.title,
            priceInPi: listing.priceInPi,
            payment: {
              paymentId,
              amount: listing.priceInPi,
              memo: `W3QUIC Market Hub Purchase`,
              metadata: {
                productId: listing.id,
                category: listing.category,
              },
              status: 'completed',
              createdAt: Date.now(),
              completedAt: Date.now(),
            },
            status: 'confirmed',
            createdAt: Date.now(),
          })

          setPaymentSuccess(true)
        },
        onCancel: () => {
          setPaymentError('Payment cancelled by user')
        },
        onError: (error) => {
          setPaymentError(error.message)
        },
      }
    )

    if (!paymentId) {
      setPaymentError('Failed to create payment')
    }
  } catch (error) {
    setPaymentError(error instanceof Error ? error.message : 'Payment failed')
  } finally {
    setProcessingPayment(false)
  }
}
\`\`\`

### 4. Backend Payment Approval

**File**: `app/api/payments/approve/route.ts`

\`\`\`typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { paymentId } = await request.json()

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      )
    }

    console.log(`[Backend] Approving payment: ${paymentId}`)

    // Call Pi's payment approval endpoint
    const piResponse = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include your Pi API key in production
          // 'Authorization': `Key ${process.env.PI_API_KEY}`
        },
        body: JSON.stringify({
          metadata: {
            approvedAt: new Date().toISOString(),
            marketplace: 'W3QUIC',
          },
        }),
      }
    )

    if (!piResponse.ok) {
      const error = await piResponse.json()
      console.error('[Backend] Pi approval failed:', error)
      return NextResponse.json(
        { error: 'Payment approval failed', details: error },
        { status: piResponse.status }
      )
    }

    const approvedPayment = await piResponse.json()
    console.log('[Backend] Payment approved:', approvedPayment)

    // Store in your database here
    // await db.payments.update(paymentId, { status: 'approved' })

    return NextResponse.json({
      success: true,
      paymentId,
      status: 'approved',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Backend] Approval error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
\`\`\`

### 5. Backend Payment Completion

**File**: `app/api/payments/complete/route.ts`

\`\`\`typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { paymentId } = await request.json()

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      )
    }

    console.log(`[Backend] Completing payment: ${paymentId}`)

    // Call Pi's payment completion endpoint
    const piResponse = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include your Pi API key in production
          // 'Authorization': `Key ${process.env.PI_API_KEY}`
        },
        body: JSON.stringify({
          metadata: {
            completedAt: new Date().toISOString(),
            marketplace: 'W3QUIC',
          },
        }),
      }
    )

    if (!piResponse.ok) {
      const error = await piResponse.json()
      console.error('[Backend] Pi completion failed:', error)
      return NextResponse.json(
        { error: 'Payment completion failed', details: error },
        { status: piResponse.status }
      )
    }

    const completedPayment = await piResponse.json()
    console.log('[Backend] Payment completed:', completedPayment)

    // Update your database here
    // await db.payments.update(paymentId, { status: 'completed' })

    return NextResponse.json({
      success: true,
      paymentId,
      status: 'completed',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Backend] Completion error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
\`\`\`

## 📊 Payment Data Structure

### PiPaymentInfo
\`\`\`typescript
interface PiPaymentInfo {
  paymentId: string      // Unique payment identifier
  amount: number         // Amount in Pi
  memo: string          // Payment description
  metadata: {           // Additional context
    productId: string
    category: string
    buyerUsername: string
    marketplace: string
    [key: string]: any
  }
  status: 'pending' | 'approved' | 'completed' | 'failed'
  createdAt: number
  completedAt?: number
}
\`\`\`

### Payment Callback Types
\`\`\`typescript
interface PiPaymentCallbacks {
  // Called when payment is ready for server approval
  onReadyForServerApproval: (paymentId: string) => Promise<void>
  
  // Called when payment is ready for server completion
  onReadyForServerCompletion: (paymentId: string) => Promise<void>
  
  // Called when user cancels payment
  onCancel: (paymentId?: string) => void
  
  // Called on payment error
  onError: (error: Error, paymentId?: string) => void
}
\`\`\`

## 🔑 Required Scopes

\`\`\`typescript
const scopes = ['username', 'payments']
const user = await Pi.authenticate(scopes)
\`\`\`

- **username**: Access to user's Pi Network username
- **payments**: Ability to create and process payments

## 🛡️ Security Best Practices

1. **Always Verify on Backend**: Never trust client-side payment state
2. **Use HTTPS**: All API calls must use HTTPS in production
3. **Validate PaymentId**: Verify payment ID format before processing
4. **Store Securely**: Use database for payment records, not localStorage
5. **Implement Rate Limiting**: Prevent payment API abuse
6. **Log All Transactions**: Maintain audit trail for all payments
7. **Error Handling**: Don't expose sensitive error details to client

## 🧪 Testing Checklist

- [ ] Pi SDK loads successfully
- [ ] Authentication works with Pi app
- [ ] Username displays in header after auth
- [ ] Payment creation button works
- [ ] Payment callbacks fire in correct order
- [ ] Backend approval endpoint returns success
- [ ] Backend completion endpoint returns success
- [ ] Order is created after successful payment
- [ ] Payment status shows as completed
- [ ] User receives confirmation message
- [ ] Cancel payment shows error message
- [ ] Network errors are handled gracefully

## 🚀 Production Deployment

### Environment Variables
\`\`\`env
PI_API_KEY=your_pi_api_key_here
NEXT_PUBLIC_PI_SDK_URL=https://sdk.minepi.com/pi-sdk.js
PI_SANDBOX=false
\`\`\`

### Update Configuration
\`\`\`typescript
// lib/system-config.ts
export const PI_NETWORK_CONFIG = {
  SDK_URL: process.env.NEXT_PUBLIC_PI_SDK_URL,
  SDK_LITE_URL: "https://sdk.minepi.com/pi-sdk-lite.js",
  SANDBOX: process.env.PI_SANDBOX === 'true',
}
\`\`\`

### Enable API Key in Backend
\`\`\`typescript
// app/api/payments/approve/route.ts
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Key ${process.env.PI_API_KEY}`
}
\`\`\`

## 📱 Testing Sandbox Payments

1. Set `SANDBOX: true` in config
2. Use test Pi Network account
3. Test with small amounts
4. Verify backend endpoints are called
5. Check console logs for detailed flow

## 🐛 Troubleshooting

### Pi SDK Not Loading
\`\`\`
Error: Pi object not available
\`\`\`
**Solution**: Ensure SDK URL is correct and not blocked by CORS

### Authentication Fails
\`\`\`
Error: Authentication failed
\`\`\`
**Solution**: Check scopes are correct ['username', 'payments']

### Payment Creation Fails
\`\`\`
Error: Pi.createPayment is not a function
\`\`\`
**Solution**: Ensure Pi.init() was called before createPayment()

### Backend Approval Fails
\`\`\`
Error: Payment approval failed
\`\`\`
**Solution**: Check Pi API key is set in production; verify paymentId format

## 📚 Additional Resources

- [Pi Network Developer Docs](https://developers.minepi.com)
- [Pi Payment API Reference](https://developers.minepi.com/reference)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Error Handling Best Practices](https://developers.minepi.com/payment-errors)

---

**Need Help?** Check the Pi Network community forums or developer documentation.
