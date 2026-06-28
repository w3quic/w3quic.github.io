# W3QUIC Market Hub - Quick Start Guide

## ⚡ 30-Second Setup

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
# http://localhost:3000
\`\`\`

## 🔑 Key Features at a Glance

| Feature | Location |
|---------|----------|
| Browse Listings | Home page |
| Search Products | Search tab |
| Create Listing | Create Listing button |
| Make Purchase | Click "Pay with Pi Network" |
| View Orders | My Orders tab |
| Manage Listings | My Listings tab |
| Messages | Messages tab |

## 🎯 User Journey

\`\`\`
1. Click "Sign in with Pi Network"
   ↓
2. Approve username & payments access
   ↓
3. Browse or create listings
   ↓
4. To purchase: Click listing → "Pay with Pi Network"
   ↓
5. Approve payment in Pi app
   ↓
6. Order created ✓
\`\`\`

## 📁 Project Structure

\`\`\`
w3quic-market-hub/
├── app/
│   ├── page.tsx                 ← Main entry
│   └── api/payments/           ← Payment APIs
├── components/w3quic/          ← All UI components
├── contexts/                   ← State management
├── lib/
│   ├── pi-marketplace.ts       ← Payment logic
│   └── w3quic-types.ts         ← Types
└── docs/
    ├── BUILD_SUMMARY.md        ← What was built
    ├── W3QUIC_MARKETPLACE_README.md
    ├── PI_PAYMENT_GUIDE.md     ← Payment details
    └── QUICK_START.md          ← This file
\`\`\`

## 🛠️ Essential Code

### Authenticate User
\`\`\`typescript
import { authenticateWithPi } from '@/lib/pi-marketplace'

const username = await authenticateWithPi()
setPiUsername(username)
\`\`\`

### Create Payment
\`\`\`typescript
import { createPiPayment } from '@/lib/pi-marketplace'

const paymentId = await createPiPayment(
  150, // amount in Pi
  {
    memo: "W3QUIC Market Hub Purchase",
    metadata: {
      productId: listing.id,
      buyerUsername: piUsername,
      marketplace: "W3QUIC",
    },
  },
  {
    onReadyForServerApproval: async (paymentId) => {
      await approvePaymentOnBackend(paymentId)
    },
    onReadyForServerCompletion: async (paymentId) => {
      await completePaymentOnBackend(paymentId)
      createOrder(orderData) // create order
    },
    onCancel: () => console.log("User cancelled"),
    onError: (error) => console.error(error),
  }
)
\`\`\`

### Use Context
\`\`\`typescript
import { useW3Quic } from '@/contexts/w3quic-context'

function MyComponent() {
  const { listings, orders, createOrder, addFavorite } = useW3Quic()
  // Use marketplace data
}
\`\`\`

## 🔐 Payment Flow Quick Reference

\`\`\`
User clicks "Pay"
    ↓
Pi.createPayment() → paymentId
    ↓
User approves in Pi app
    ↓
onReadyForServerApproval
    ↓
POST /api/payments/approve
    ↓
Backend calls Pi approval endpoint
    ↓
onReadyForServerCompletion
    ↓
POST /api/payments/complete
    ↓
Backend calls Pi completion endpoint
    ↓
createOrder() → Order saved
    ↓
Show success message ✓
\`\`\`

## 📊 Categories Available

- **Products** - Buy/sell items
- **Services** - Freelance services
- **Jobs** - Job opportunities
- **Vehicles** - Buy/sell cars
- **Real Estate** - Property listings

## 🧪 Test It Out

### Create a Listing
1. Click "Create Listing"
2. Choose category (e.g., Products)
3. Fill in title, description, price
4. Click "Create Listing"

### Browse & Search
1. Click "Browse" or "Search"
2. Filter by category
3. Click any listing to view details

### Make a Purchase
1. Open a listing
2. Click "Pay with Pi Network"
3. Approve payment details
4. Check "My Orders" after payment

## 💻 Development

### File to Modify | Purpose
- `contexts/w3quic-context.tsx` | Add marketplace logic
- `components/w3quic/*.tsx` | Customize UI
- `lib/pi-marketplace.ts` | Payment configuration
- `app/api/payments/*.ts` | Backend payment handling

### Environment Variables (Production)
\`\`\`env
PI_API_KEY=your_pi_api_key
NEXT_PUBLIC_PI_SDK_URL=https://sdk.minepi.com/pi-sdk.js
PI_SANDBOX=false
\`\`\`

## 🚀 Deployment Checklist

- [ ] Update `PI_SANDBOX` to `false`
- [ ] Add `PI_API_KEY` environment variable
- [ ] Test payment flow thoroughly
- [ ] Deploy to Vercel/AWS
- [ ] Verify all backend endpoints work
- [ ] Test with real Pi Network account

## 📱 Mobile Support

✅ Mobile-first responsive design
✅ Touch-friendly buttons (48px minimum)
✅ Optimized for mobile devices
✅ Fast navigation with bottom toolbar
✅ Lazy-loaded images

## 🎨 Colors

- **Primary**: Purple (#A855F7)
- **Secondary**: Blue
- **Success**: Green
- **Error**: Red
- **Background**: Gray-50

## 🔗 Important Links

| Link | Purpose |
|------|---------|
| https://sdk.minepi.com/pi-sdk.js | Pi SDK |
| https://api.minepi.com/v2/payments | Pi API |
| http://localhost:3000 | Dev server |
| https://developers.minepi.com | Pi Docs |

## ❓ Common Issues

### "Pi object not available"
- Ensure Pi SDK is loaded from correct URL
- Check browser console for load errors

### "Authentication failed"
- Verify scopes: ['username', 'payments']
- Check Pi app is installed and updated

### "Payment creation failed"
- Ensure user is authenticated first
- Verify amount is positive number
- Check network connection

### "Backend approval failed"
- Verify paymentId is valid format
- Check /api/payments/approve endpoint exists
- Ensure Pi API key is set (production)

## 📞 Support

1. **Check Documentation**
   - READ W3QUIC_MARKETPLACE_README.md
   - READ PI_PAYMENT_GUIDE.md

2. **Debug Console**
   - Open DevTools (F12)
   - Check console for [Pi] logs
   - Look for error messages

3. **Pi Network Help**
   - Visit https://developers.minepi.com
   - Check Pi Network community forums
   - Review API documentation

## 🎓 Learn More

| Topic | File |
|-------|------|
| Complete Guide | W3QUIC_MARKETPLACE_README.md |
| Payment Details | PI_PAYMENT_GUIDE.md |
| What Was Built | BUILD_SUMMARY.md |
| Quick Start | QUICK_START.md (this file) |

## 🚢 Go Live

### Step 1: Prepare
\`\`\`bash
# Update configuration
# Ensure PI_SANDBOX=false
# Add PI_API_KEY to env
\`\`\`

### Step 2: Deploy
\`\`\`bash
vercel deploy
# or your hosting platform
\`\`\`

### Step 3: Test
- [ ] Authentication works
- [ ] Payment flow complete
- [ ] Orders saved correctly
- [ ] All endpoints responding

### Step 4: Monitor
- Check logs for errors
- Monitor payment transactions
- Track user signups and orders

## ✨ You're Ready!

W3QUIC Market Hub is fully functional and ready to use. Start by:

1. Running `npm run dev`
2. Opening http://localhost:3000
3. Signing in with Pi Network
4. Exploring the marketplace

**Happy selling and buying! ⚡**

---

Questions? Check the full documentation files or visit the Pi Network developer community.
