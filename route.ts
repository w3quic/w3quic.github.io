import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/payments/approve
 * Approves a Pi Network payment on the backend
 * Calls Pi's approval endpoint
 */
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
          // Note: In production, include your app's API key
          // 'Authorization': `Key ${process.env.PI_API_KEY}`
        },
        body: JSON.stringify({
          // Optional: Include any additional approval metadata
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

    // Store approval in your database here
    // await db.payments.update(paymentId, { status: 'approved', approvedAt: new Date() })

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
