# W3QUIC Market Hub - Architecture Overview

## 🏗️ System Architecture

\`\`\`
┌────────────────────────────────────────────────────────────────┐
│                     Browser / Client                           │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │          W3QUIC Market Hub (Next.js App)              │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │         UI Components (React)                  │ │  │
│  │  │                                                │ │  │
│  │  │  ├─ w3quic-app.tsx          (Main App)        │ │  │
│  │  │  ├─ marketplace-home.tsx    (Homepage)        │ │  │
│  │  │  ├─ listing-details.tsx     (Product Detail)  │ │  │
│  │  │  ├─ search-listings.tsx     (Search)          │ │  │
│  │  │  ├─ create-listing.tsx      (Create Form)     │ │  │
│  │  │  ├─ my-listings.tsx         (Seller View)     │ │  │
│  │  │  ├─ my-orders.tsx           (Orders)          │ │  │
│  │  │  └─ messages-hub.tsx        (Messaging)       │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  │                          ↓                            │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │    State Management (React Context API)       │ │  │
│  │  │                                                │ │  │
│  │  │  ├─ useW3Quic() Hook                          │ │  │
│  │  │  ├─ W3QuicProvider                            │ │  │
│  │  │  ├─ Listings State                            │ │  │
│  │  │  ├─ Orders State                              │ │  │
│  │  │  ├─ User State                                │ │  │
│  │  │  └─ UI State (favorites, cart, etc.)          │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  │                          ↓                            │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │    Core Libraries & Utilities                 │ │  │
│  │  │                                                │ │  │
│  │  │  ├─ pi-marketplace.ts   (Payment Logic)       │ │  │
│  │  │  ├─ w3quic-types.ts     (Types)               │ │  │
│  │  │  ├─ market/types.ts     (Extended Types)      │ │  │
│  │  │  └─ system-config.ts    (Configuration)       │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │     JavaScript Libraries & UI Framework               │  │
│  │                                                        │  │
│  │  ├─ React 19                                          │  │
│  │  ├─ Next.js 16                                        │  │
│  │  ├─ Tailwind CSS v4                                   │  │
│  │  ├─ shadcn/ui Components                              │  │
│  │  └─ lucide-react Icons                                │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │      External SDK Integration                         │  │
│  │                                                        │  │
│  │  Pi Network SDK                                        │  │
│  │  ├─ Pi.init()          (Initialize)                   │  │
│  │  ├─ Pi.authenticate()  (User Auth)                    │  │
│  │  └─ Pi.createPayment() (Payments)                     │  │
│  └────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                           ↓ (HTTP Requests)
┌────────────────────────────────────────────────────────────────┐
│                  Backend / Server (Node.js)                    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │     Next.js API Routes (Payment Processing)           │  │
│  │                                                        │  │
│  │  POST /api/payments/approve                           │  │
│  │  ├─ Receive paymentId from client                     │  │
│  │  ├─ Validate payment data                             │  │
│  │  ├─ Call Pi's approval endpoint                       │  │
│  │  └─ Return approval result                            │  │
│  │                                                        │  │
│  │  POST /api/payments/complete                          │  │
│  │  ├─ Receive paymentId from client                     │  │
│  │  ├─ Validate payment data                             │  │
│  │  ├─ Call Pi's completion endpoint                     │  │
│  │  └─ Return completion result                          │  │
│  └────────────────────────────────────────────────────────┘  │
│                           ↓ (HTTPS Requests)                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │     External API Calls (To Pi Network)                │  │
│  │                                                        │  │
│  │  https://api.minepi.com/v2/payments/{id}/approve     │  │
│  │  https://api.minepi.com/v2/payments/{id}/complete    │  │
│  └────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                           ↓ (HTTP Responses)
┌────────────────────────────────────────────────────────────────┐
│              External Services (Pi Network API)                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Pi Network Backend Services                                  │
│  ├─ User Authentication                                       │
│  ├─ Payment Processing                                        │
│  ├─ Transaction Verification                                  │
│  └─ Balance Management                                        │
└────────────────────────────────────────────────────────────────┘
\`\`\`

## 🔄 Payment Flow Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                      Payment Flow                               │
└─────────────────────────────────────────────────────────────────┘

User Interface                Backend                    Pi Network
(listing-details.tsx)         (API Routes)              (External)

         ┌─────────────────────────────────────────────┐
         │ User clicks                                 │
         │ "Pay with Pi Network"                       │
         └────────────┬────────────────────────────────┘
                      │
         ┌────────────▼────────────────────────────────┐
         │ handlePayment() triggered                   │
         │ createPiPayment() called                    │
         └────────────┬────────────────────────────────┘
                      │
         ┌────────────▼────────────────────────────────────────────┐
         │ Pi.createPayment()                                      │
         │ ├─ amount: listing.priceInPi                           │
         │ ├─ memo: "W3QUIC Market Hub Purchase"                  │
         │ └─ metadata: {productId, category, buyer...}           │
         └────────────┬─────────────────────────────────────────  ┘
                      │
         ┌────────────▼────────────────────────────────┐
         │ Pi App shows payment request                │
         │ to user                                     │
         └────────────┬────────────────────────────────┘
                      │
         ┌────────────▼────────────────────────────────────────────┐
         │ onReadyForServerApproval callback                       │
         └────────────┬─────────────────────────────────────────  ┘
                      │
         ┌────────────▼────────────────────────────────┐
         │ approvePaymentOnBackend(paymentId)          │
         │         ↓                                   │
         │ POST /api/payments/approve                  │
         └────────────┬────────────────────────────────┘
                      │
    ┌─────────────────▼──────────────────────────────────────┐
    │ Backend: validate paymentId                           │
    │ Fetch https://api.minepi.com/v2/payments/{id}/approve │
    │ Return success/error                                   │
    └─────────────────┬──────────────────────────────────────┘
                      │
         ┌────────────▼────────────────────────────────┐
         │ onReadyForServerCompletion callback         │
         └────────────┬────────────────────────────────┘
                      │
         ┌────────────▼────────────────────────────────┐
         │ completePaymentOnBackend(paymentId)         │
         │         ↓                                   │
         │ POST /api/payments/complete                 │
         └────────────┬────────────────────────────────┘
                      │
    ┌─────────────────▼──────────────────────────────────────┐
    │ Backend: validate paymentId                           │
    │ Fetch https://api.minepi.com/v2/payments/{id}/complete│
    │ Return success/error                                   │
    └─────────────────┬──────────────────────────────────────┘
                      │
         ┌────────────▼────────────────────────────────┐
         │ setPaymentSuccess(true)                     │
         │ createOrder(orderData)                      │
         │ Show success message                        │
         └────────────┬────────────────────────────────┘
                      │
         ┌────────────▼────────────────────────────────┐
         │ ✓ Order created                             │
         │ ✓ Payment confirmed                         │
         │ ✓ User sees confirmation                    │
         └────────────────────────────────────────────┘
\`\`\`

## 📊 Data Flow Architecture

\`\`\`
┌──────────────────────────────────────────────────────────┐
│              Global State (W3QuicContext)                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ├─ piUsername: string | null                           │
│  │  └─ Display in header, filter user's listings        │
│  │                                                      │
│  ├─ listings: Listing[]                                 │
│  │  ├─ Displayed on homepage, search, category pages   │
│  │  ├─ Filtered by category, search query               │
│  │  └─ Seed data: 5 sample listings                     │
│  │                                                      │
│  ├─ orders: MarketplaceOrder[]                          │
│  │  ├─ Shown in "My Orders" page                        │
│  │  ├─ Filtered by buyerId (My Orders)                  │
│  │  ├─ Filtered by sellerId (orders to fulfill)         │
│  │  └─ Created on successful payment                    │
│  │                                                      │
│  ├─ sellers: Map<string, MarketplaceSeller>             │
│  │  ├─ Display seller info on listing pages             │
│  │  ├─ Show ratings and verification badges             │
│  │  └─ Seed data: 5 sample sellers                      │
│  │                                                      │
│  ├─ favorites: UserFavorite[]                           │
│  │  ├─ Track user's wishlist items                      │
│  │  ├─ Show favorite icons on listings                  │
│  │  └─ In-memory storage per session                    │
│  │                                                      │
│  ├─ reviews: MarketplaceReview[]                        │
│  │  ├─ Display on seller profiles                       │
│  │  ├─ Calculate seller ratings                         │
│  │  └─ Filtered by sellerId                             │
│  │                                                      │
│  └─ conversations: Conversation[]                       │
│     ├─ Stored between users                             │
│     ├─ Messages for buyer-seller interaction            │
│     └─ Future: integrate with real messaging            │
│                                                          │
└──────────────────────────────────────────────────────────┘
         │
         │ useW3Quic() Hook
         │
         ├─ ┌───────────────────────────────┐
         │  │  Marketplace Home             │
         │  │  ├─ listings                  │
         │  │  ├─ sellers                   │
         │  │  ├─ featured items            │
         │  │  └─ favorites                 │
         │  └───────────────────────────────┘
         │
         ├─ ┌───────────────────────────────┐
         │  │  Listing Details              │
         │  │  ├─ getListing(id)            │
         │  │  ├─ getSeller(id)             │
         │  │  ├─ createOrder()             │
         │  │  └─ favorites toggle          │
         │  └───────────────────────────────┘
         │
         ├─ ┌───────────────────────────────┐
         │  │  Create Listing               │
         │  │  └─ addListing()              │
         │  └───────────────────────────────┘
         │
         ├─ ┌───────────────────────────────┐
         │  │  Search                       │
         │  │  └─ searchListings(query)     │
         │  └───────────────────────────────┘
         │
         ├─ ┌───────────────────────────────┐
         │  │  My Orders                    │
         │  │  └─ getOrdersByBuyer()        │
         │  └───────────────────────────────┘
         │
         └─ ┌───────────────────────────────┐
            │  My Listings                  │
            │  ├─ listings filtered by user │
            │  └─ getOrdersBySeller()       │
            └───────────────────────────────┘
\`\`\`

## 🎨 Component Hierarchy

\`\`\`
w3quic-app.tsx
├─ Authentication Gate
│  ├─ If not logged in: Show login screen
│  └─ If logged in: Show marketplace
│
├─ Header
│  ├─ Logo
│  ├─ Navigation tabs
│  └─ User profile button
│
├─ Router (View Selection)
│  ├─ 'home' → marketplace-home.tsx
│  │  ├─ Category grid
│  │  ├─ Featured listings grid
│  │  └─ Category sections
│  │
│  ├─ 'search' → search-listings.tsx
│  │  ├─ Search input
│  │  ├─ Category filter
│  │  └─ Results grid
│  │
│  ├─ 'listing' → listing-details.tsx
│  │  ├─ Image gallery
│  │  ├─ Product details
│  │  ├─ Seller profile card
│  │  └─ Payment card
│  │
│  ├─ 'create' → create-listing.tsx
│  │  ├─ Category selector
│  │  ├─ Dynamic form fields
│  │  ├─ Category-specific inputs
│  │  └─ Submit button
│  │
│  ├─ 'my-listings' → my-listings.tsx
│  │  ├─ Listing count
│  │  ├─ Listings grid
│  │  └─ Edit buttons
│  │
│  ├─ 'my-orders' → my-orders.tsx
│  │  ├─ Orders list
│  │  ├─ Order status badges
│  │  └─ Order details buttons
│  │
│  └─ 'messages' → messages-hub.tsx
│     ├─ Conversation list
│     ├─ Message bubbles
│     └─ Reply composer
│
└─ Footer
   └─ Navigation links
\`\`\`

## 🔐 Authentication Architecture

\`\`\`
┌─────────────────────────────────────────────────┐
│           Pi Network Authentication             │
└─────────────────────────────────────────────────┘
                      │
         ┌────────────▼────────────────┐
         │ Load Pi SDK from CDN         │
         │ src: https://sdk.minepi.com/ │
         │      pi-sdk.js              │
         └────────────┬────────────────┘
                      │
         ┌────────────▼────────────────────────┐
         │ Initialize Pi                        │
         │ Pi.init({                            │
         │   version: "2.0",                    │
         │   sandbox: true                      │
         │ })                                   │
         └────────────┬────────────────────────┘
                      │
         ┌────────────▼────────────────────────┐
         │ Authenticate User                    │
         │ Pi.authenticate([                    │
         │   "username",                        │
         │   "payments"                         │
         │ ])                                   │
         └────────────┬────────────────────────┘
                      │
         ┌────────────▼────────────────────────┐
         │ Pi App Shows Permission Screen       │
         │ User approves access                 │
         └────────────┬────────────────────────┘
                      │
         ┌────────────▼────────────────────────┐
         │ Receive User Object                  │
         │ {                                    │
         │   username: "john_seller",           │
         │   uid: "...",                        │
         │   accessToken: "..."                 │
         │ }                                    │
         └────────────┬────────────────────────┘
                      │
         ┌────────────▼────────────────────────┐
         │ Store in Context                     │
         │ setPiUsername(username)              │
         └────────────┬────────────────────────┘
                      │
         ┌────────────▼────────────────────────┐
         │ ✓ Authenticated                      │
         │ ✓ Show marketplace                   │
         │ ✓ Display username in header         │
         └────────────────────────────────────┘
\`\`\`

## 💾 Data Storage Architecture

\`\`\`
┌────────────────────────────────────────────────┐
│           Current: In-Memory Storage           │
│              (React Context API)               │
└────────────────────────────────────────────────┘
         │
         ├─ Listings (5 seed items)
         │  └─ Persists during session only
         │
         ├─ Orders (created on payment)
         │  └─ Persists during session only
         │
         ├─ Sellers (5 seed sellers)
         │  └─ Persists during session only
         │
         ├─ Favorites (user's wishlist)
         │  └─ Persists during session only
         │
         ├─ Reviews
         │  └─ Persists during session only
         │
         └─ Conversations
            └─ Persists during session only

┌────────────────────────────────────────────────┐
│      Future: Persistent Storage Options        │
└────────────────────────────────────────────────┘

Option 1: Database (Recommended)
├─ PostgreSQL/MySQL
├─ MongoDB
└─ Firebase

Option 2: Cloud Storage
├─ AWS DynamoDB
├─ Firebase Realtime DB
└─ Supabase

Option 3: Hybrid
├─ Database for listings/orders
├─ Cache layer for performance
└─ LocalStorage for user preferences
\`\`\`

## 🔒 Security Architecture

\`\`\`
┌─────────────────────────────────────────────────────────┐
│              Security Layers                            │
└─────────────────────────────────────────────────────────┘

1. Authentication Layer
   ├─ Pi Network Authentication
   │  └─ OAuth-like flow
   ├─ Scope Validation
   │  ├─ username scope
   │  └─ payments scope
   └─ Session Management
      └─ Username stored in context

2. Authorization Layer
   ├─ User-specific data access
   │  ├─ Only see own orders
   │  ├─ Only edit own listings
   │  └─ Only access own conversations
   └─ Role-based restrictions
      ├─ Buyer permissions
      └─ Seller permissions

3. Data Validation
   ├─ Input validation
   │  ├─ Form validation
   │  ├─ Amount validation
   │  └─ ID validation
   └─ Payment validation
      ├─ PaymentId format
      ├─ Amount consistency
      └─ Status verification

4. API Security
   ├─ Backend verification
   │  ├─ Validate paymentId
   │  ├─ Verify amounts
   │  └─ Log transactions
   ├─ HTTPS enforcement
   └─ Error handling
      └─ No sensitive data in errors

5. External Service Security
   └─ Pi Network API
      ├─ Official endpoints only
      ├─ SSL/TLS encryption
      └─ Request signing
\`\`\`

## 📱 Mobile Architecture

\`\`\`
┌──────────────────────────────────┐
│  Responsive Design Breakpoints   │
├──────────────────────────────────┤
│                                  │
│  Mobile (< 640px)                │
│  ├─ 1 column layout              │
│  ├─ Full-width inputs            │
│  ├─ Bottom navigation bar         │
│  └─ Touch-friendly buttons        │
│                                  │
│  Tablet (640px - 1024px)         │
│  ├─ 2 column layout              │
│  ├─ Adjusted padding             │
│  ├─ Better spacing               │
│  └─ Side navigation option       │
│                                  │
│  Desktop (> 1024px)              │
│  ├─ 3 column layout              │
│  ├─ Sidebar navigation           │
│  ├─ Full-width header            │
│  └─ Max-width container          │
│                                  │
└──────────────────────────────────┘
\`\`\`

## 🚀 Deployment Architecture

\`\`\`
Development Environment
└─ npm run dev
   └─ http://localhost:3000

Staging Environment
└─ Vercel preview branch
   └─ https://staging.w3quic.com

Production Environment
└─ Vercel main branch
   ├─ https://w3quic.com
   ├─ Environment variables configured
   ├─ PI_SANDBOX=false
   ├─ PI_API_KEY=xxx
   └─ Database connected
\`\`\`

---

This architecture provides a solid foundation for a scalable, secure, and user-friendly marketplace application built on the Pi Network.

For more details, see:
- W3QUIC_MARKETPLACE_README.md
- PI_PAYMENT_GUIDE.md
- QUICK_START.md
