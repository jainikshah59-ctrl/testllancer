Collancer — Full Functional & Integration Audit
Audit target: uploaded collancer.zip
Primary application source: src/App.jsx
Audit date: 2026-10-05
Scope: functionality, placement/entry points, behavior, state/data flow, backend integrations, external services, persistence, authentication, API endpoints, security rules, and operational lifecycle.
Explicitly excluded: visual design, styling, colors, typography, spacing, animations, iconography, decorative assets, and other design decisions.
1. Executive summary
The current Collancer application is a Vite + React 18 single-page application. Almost all product functionality is implemented in one very large src/App.jsx, with Cleo/AI functionality split into dedicated modules under src/cleo*.js, src/collancer*.js, and src/CleoLaunchPanel.jsx.
The app has three roles:
1. Business — creator discovery, creator profiles, bookings, wallet, campaigns, reviews, referral page, business Pro, Requirement Marketplace, AI and support/legal pages.
2. Creator — onboarding/profile, verification, creator discovery presence, booking management, delivery submission, earnings/payouts, Be On Top promotion, portfolio/demo videos, Requirements Marketplace, Creator Pro, AI assistant, notifications, support/legal pages.
3. Admin — verification review, delivery/QC review and payment release, creator payout processing, business wallet deposit verification.
The persistence layer is Firebase Authentication + Cloud Firestore in project collancer-8fd62. Firebase SDK v10.7.1 is dynamically loaded from gstatic.com rather than installed through npm. The app uses two named Firebase app instances in the browser, but both point to the same Firebase project/database.
Media is handled by Cloudinary using unsigned upload presets. Creator profile pictures use Cloudinary on the creator side, while the business profile picture is stored directly as a base64 string in Firestore. Marketplace brief images/videos and booking brief media are uploaded to Cloudinary.
There is no real payment gateway integration in the supplied code. Card/UPI fields are collected in several payment screens, but the main booking and Pro flows are explicitly demo/simulated payment flows. The real wallet funding flow is manual UPI + UTR verification by an admin. Wallet booking debits are real Firestore transactions.
Cleo is designed to be provider-free. Its main answer stack is deterministic/local retrieval, with optional live web search and an optional local Qwen 0.6B ONNX model in the browser. Voice uses Microsoft Edge TTS through a direct WebSocket first, then a Vercel /api/edge-tts proxy, then browser speech synthesis. The app also has /api/cleo-ai and /api/cleo-search serverless endpoints.
There are several legacy or partially disconnected paths inside the source. These must be distinguished from the canonical flows during a rebuild. Examples include the older writeBookingToFirebase/addCampaign path, static referral data, hardcoded/demo creator data, unused Google Auth helpers, and Cleo audit logging to a collection that is not present in the supplied Firestore rules.
2. Application architecture
2.1 Runtime stack
- React 18.2.0
- React DOM 18.2.0
- Vite 5.2.0
- @vitejs/plugin-react
- @huggingface/transformers 4.3.0
- JavaScript/JSX only; no TypeScript
- Vercel deployment configuration
- Vite SPA fallback through vercel.json
- PWA manifest + service worker
package.json contains no Firebase npm dependency, no Cloudinary SDK, no Stripe/Razorpay SDK, and no other payment SDK. Firebase is imported at runtime from the Firebase CDN.
2.2 Main entry
src/main.jsx:
1. imports React/ReactDOM and App;
2. registers /sw.js on window load when service workers are supported;
3. mounts <App /> into #root.
index.html supplies the root element and the initial HTML metadata. It also contains a small DOM mutation observer that modifies the AI navigation presentation; this is functional only insofar as it reacts to rendered navigation content, not a separate product capability.
2.3 Root role gate
App() is the top-level application router/state gate.
It stores the selected role in browser localStorage under:
- collancer_role
Supported values:
- business
- creator
- admin
Behavior:
- no saved role → role-selection screen;
- saved role → role is restored after refresh;
- returning users get a short Firebase-authentication curtain before the role screen is shown;
- switching role removes collancer_role and returns to role selection.
There is no React Router. Page navigation is entirely state-based (page state inside each role app).
3. Firebase integration
3.1 Firebase project
The application uses Firebase project:
- project ID: collancer-8fd62
- auth domain: collancer-8fd62.firebaseapp.com
- storage bucket field is configured as collancer-8fd62.firebasestorage.app
- messaging sender ID: 154521281878
- app ID: 1:154521281878:web:ae6439817888eedd6ce2f7
The public Firebase web config is embedded directly in source.
3.2 Firebase SDK loading
The app dynamically injects ES module scripts from:
- https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js
- https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js
- https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js
The first loader exposes:
- window.__cdb
- window.__cauth
- window.__cfs
- window.__cauthOps
The creator/home loader exposes:
- window.__db
- window.__auth
- window.__fsOps
- window.__authOps
Both use the same Firebase project.
The Firestore instances attempt to enable experimentalAutoDetectLongPolling through the internal _settings object to improve behavior in restrictive networking environments.
A 12-second safety timeout unblocks the UI if Firebase never initializes.
3.3 Firebase Authentication
Implemented operations:
- email/password registration
- email/password sign-in
- sign-out
- auth state listeners
- Google provider helpers
- popup Google sign-in helper
- redirect Google sign-in helper
- redirect result handling
The Google provider functions are loaded and the business app handles redirect results, but the visible authentication forms in the supplied source primarily expose email/password registration/login. Treat Google authentication as an available integration helper, not as a guaranteed visible product path.
3.4 Business authentication placement
BusinessApp initializes Firebase and then listens to onAuthStateChanged.
Business document:
businesses/{auth.uid}
Registration creates a business document with fields including:
- uid
- bizName
- email
- whatsapp
- address
- industry
- type: "business"
- createdAt
- waitlisted: true
The registration is also written to the same businesses/{uid} document through writeToAdminRegistrations, with registration-summary fields such as:
- name
- email
- phone
- niche
- platform
- socialUsername
- registrationType
- status = new
- submittedAt
Business login reads businesses/{uid} after Firebase Auth succeeds. If no matching business document exists, the user is rejected with a registration message.
3.5 Creator authentication placement
CreatorApp initializes Firebase and observes the creator auth state.
Creator document:
creators/{auth.uid}
Registration creates:
- id
- name
- handle
- handleLower
- email
- platform
- niche
- city
- whatsapp
- address
- barterEligible
- followers
- ytSubscribers
- engagement
- rating
- price
- bio
- verified
- trending
- featured
- tags
- reviews
- avgViews
- avgLikes
- reach
- prices
- createdAt
- active
- verificationStatus
- addedToCollancer
- waitlisted
The creator registration also creates a deterministic handle reservation in:
creatorHandles/{handleLower}
The reservation and creator document are intended to be created atomically in a transaction.
There is a fallback path for older rulesets that cannot write creatorHandles.
3.6 Handle uniqueness
Creator handles are normalized to lowercase through handleLower.
At registration:
1. pre-check creators for matching handleLower;
2. create Firebase Auth user;
3. transactionally check creatorHandles;
4. transactionally check existing creator documents;
5. reserve the handle;
6. create creator document.
On profile edit, changing the handle attempts the same reservation swap atomically:
- reserve new handle;
- verify it is not held by another creator;
- delete old reservation;
- update creator profile.
This is one of the most important concurrency rules to preserve in a rebuild.
4. Firestore collections and responsibilities
The following collections are referenced by the current code.
Canonical active collections
creators
Creator profiles and marketplace/discovery records.
Read behavior:
- public discovery reads are allowed by rules.
- creator-owned profile updates are allowed except protected/admin fields.
- admin can update protected verification/visibility fields.
Important fields:
- identity/contact: id, name, email, handle, handleLower, whatsapp, address
- platform: platform, ytChannel, ytConnected, ytTotalViews
- audience: followers, ytSubscribers, engagement, avgViews, avgLikes, reach, rating
- content/business: niche, categories, promotionTypes, prices, discountedPrices, bio, profileLink, tags
- state: verified, verificationStatus, addedToCollancer, active, hasActiveBooking, banned, featured, trending
- Pro: creatorIsPro, creatorProPlan, creatorProExpiresAt
- media: pfp
businesses
Business account/profile, wallet, and Pro state.
Important fields:
- uid
- bizName
- email
- whatsapp
- address
- industry
- type
- pfp
- walletBalance
- isPro
- proActive
- proPlan
- proExpiresAt
- proPurchasedAt
- createdAt
- waitlisted
creatorHandles
Atomic creator handle reservations.
Document ID is the lowercased handle.
Typical fields:
- creatorId
- handle
- createdAt
bookings
Canonical collaboration lifecycle and payment/escrow record.
This is the most important operational collection.
Typical fields include:
Identity:
- creatorId
- creatorName
- creatorHandle
- creatorPlatform
- creatorNiche
- creatorCity
- bizId
- bizName
- bizPfp
- bizIsPro
- bizCampaignId
Campaign:
- campaignName
- productName
- brief
- deliverables
- platform
- platforms
- deadline
- targetAudience
- category
- promotionCategory
- cta
- contactNumber / contact
- shipping
- hashtags
- websiteLink
- couponOrCTA
- usageRights
- revisions
- exclusivity
- requirements
- barterOffer
- barterOfferValue
- barterDeliverables
- productValue
- barterTerms
- mediaFiles
Pricing/payment:
- amount
- creatorPrice
- escrowAmount
- platformFee
- paidAmount
- paymentMethod
- paymentStatus
- escrowStatus
- paymentReference
- demoPayment
- paymentApproved
- refundProcessed
- refundAmount
- refundStatus
- refundedAt
Lifecycle:
- status
- seenByCreator
- seenByBiz
- createdAt
- paidAt
- acceptedAt
- acceptedByCreator
- rejectedAt
- rejectedByCreator
- rejectionReason
- cancelledAt
- cancelledByBiz
- cancelReason
- completionRequestedAt
- deliverySubmittedAt
- completedAt
- adminRejected
- adminRejectionReason
Delivery:
- promotedVideoLink
- driveLink
- driveLinkSentToBiz
- referenceMediaFiles
Marketplace linkage:
- fromMarketplace
- requirementId
- offerId
- collaborationFingerprint
Barter address-sharing fields:
- creatorAddress
- addressSharedAt
- addressSharedTo
reviews
Business/user reviews of creators.
Fields include:
- creatorId
- review text/metadata supplied by the review form
- stars
- business identity fields such as bizName, bizPfp
- createdAt
The average rating is recomputed from all reviews for the creator and cached back to creators/{creatorId}.rating.
bizCampaigns
Business campaign display metadata.
Important implementation detail: the app treats bookings as the source of truth for campaign status. bizCampaigns is mainly display/context metadata and is merged into booking-derived campaign rows.
bizNotifs
Business notifications.
Examples:
- booking_accepted
- booking_rejected
- drive_link_shared
- promotion_completed
- completion_approved
- deposit_credited
- deposit_rejected
- post_deleted_by_admin
- generic success/system notifications
creatorNotifs
Creator notifications.
Examples:
- booking_received
- verification_approved
- verification_rejected
- payment_approved
- completion_rejected
- payout_approved
- payout_rejected
- payout_paid
- offer_rejected
- ad_success
- video_removed
adminNotifs
System/admin event notifications tied to bookings. Admins can read/update them.
adminRevenue
Admin-only revenue ledger except for creator-created ad_revenue entries used by Be On Top.
Canonical payment release creates:
adminRevenue/rev_{bookingId}
Fields:
- bookingId
- creatorId
- bizId
- grossAmount
- creatorShare
- platformRevenue
- createdAt
payoutRequests
Creator withdrawal requests.
Fields:
- creatorId
- amount
- method
- upi
- bank
- ifsc
- account
- status
- createdAt
- reviewedAt
- reviewedBy
- paidAt
- paidBy
- rejectReason
Statuses:
- pending
- approved
- paid
- rejected
verificationRequests
Creator verification submissions.
Document ID is the creator UID.
Fields include:
- creatorId
- creator identity/social information
- platform
- followers
- profile URL
- niche
- city
- submitted data
- status
- rejectReason
- reviewedAt
- reviewedBy
- previousRejectReason
Statuses:
- pending
- verified
- rejected
walletDeposits
Business manual wallet top-up requests.
Fields:
- bizId
- amount
- method
- upiId
- utr
- status
- creditedAt
- creditedBy
- rejectReason
- review metadata
Statuses include:
- pending
- credited
- rejected
walletTransactions
Append-only wallet ledger.
Types used:
- deposit
- booking_deduction
- refund
Canonical IDs:
- deposit_{depositId}
- booking_{fingerprint} for standard wallet bookings
- mkt_{bookingId} for marketplace wallet bookings
- refund_{bookingId} for refunds
requirements
Requirements Marketplace business briefs.
Important fields:
- bizId
- bizName
- bizPfp
- bizIsPro
- title
- description
- budget
- category
- promoType
- mediaFiles
- status
- offerCount
- acceptedOfferId
- matchedAt
- updatedAt
- createdAt
- Cleo-generated metadata such as niche, follower range, language, location, deliverables, application instructions, brand/product/brief may also exist.
Typical statuses:
- open
- matched
A requirement can be reopened if the accepted marketplace creator rejects the resulting booking.
requirementOffers
Creator proposals against requirements.
Fields:
- requirementId
- bizId
- creatorId
- creatorName
- creatorHandle
- price
- message
- timeline
- status
- createdAt
- updatedAt
- withdrawnAt
Statuses:
- pending
- accepted
- rejected
- withdrawn
promoDemos
Creator portfolio/promotion demo videos.
Fields include:
- creatorId
- creator name
- demo type
- format
- title/description
- media URL
- thumbnail URL
- timestamps
- admin removal metadata where applicable
Public read; creator-owned write/update/delete, admin moderation.
adCampaigns
Creator-paid Be On Top profile promotion campaigns.
Fields include:
- creatorId
- plan/days
- price
- categories
- status
- startedAt
- endsAt
- related revenue/transaction fields
Business discovery listens to all active campaigns to determine boosted creator IDs and category-specific boosts.
proPayments
Business Pro purchase log.
creatorProPayments
Creator Pro purchase log.
Collections referenced but not fully canonicalized
Cleo contains generalized marketplace compatibility code that also attempts to read:
- creatorProfiles
- freelancers
- influencers
- marketplaceCreators
- creatorMarketplace
- users
These are compatibility fallbacks; the main Collancer app uses creators as its canonical creator collection.
collancerKnowledge.js also scans generic business-spend sources:
- bookings
- collaborations
- payments
- transactions
- orders
Only bookings is canonical in the supplied app. The other names are generic fallback sources.
cleoRepository.js writes cleoAuditLogs for Cleo actions, but cleoAuditLogs is not defined in the supplied firestore.rules. Therefore those writes may fail under the supplied rules and are intentionally treated as a non-canonical/possibly nonfunctional audit path in this audit.
5. Firestore security model
firestore.rules is unusually important to the rebuild because the client directly performs many operational writes.
5.1 Admin identity
Admin access is not based on a hardcoded UID in the rules.
The rule helper:
isAdmin() = authenticated AND exists(admins/{uid})
The client has ADMIN_UIDS = [] and uses the Firestore admins/{uid} document as the actual gate.
Client cannot write admin documents.
5.2 Creator rules
- public read
- creator can create own document only if protected fields are initially absent/false
- creator can update own profile except protected fields:
  - verificationStatus
  - verified
  - addedToCollancer
  - adminNotes
- admin can update anything
- signed-in users can update only cached rating within 0–5
- creator deletion is disabled
5.3 Business rules
- signed-in users can get business docs
- list is owner/admin restricted
- create requires owner and zero wallet balance
- owner cannot directly write walletBalance
- owner may decrease wallet balance under restricted rules
- refund credit is allowed only when pinned to a valid cancelled wallet booking
- deletion disabled
5.4 Booking rules
Reads are party-scoped:
- admin, or
- authenticated creator party, or
- authenticated business party
Creation requires:
- authenticated business owner
- bizId == auth.uid
- creator ID present
- status = Pending
- paymentApproved == false
- no client-created admin revenue/release fields
Creator-side status transitions are tightly constrained.
Business-side cancellation is tightly constrained.
Deletion disabled.
5.5 Wallet security
Wallet funding cannot be self-credited by the client.
Business can create a walletDeposits request, but only admin can update it to credited.
Only the admin transaction increases wallet balance from a deposit.
Wallet booking deductions are transactionally tied to the booking and wallet ledger.
Refund credits are transactionally tied to one cancelled wallet-paid booking and require:
- cancelled booking
- correct business
- correct creator actor
- wallet payment method
- not already refunded
- no existing refund ledger
- exact escrow amount
5.6 Payout security
Creator can create only their own pending payout request.
Only admin can change payout status.
5.7 Verification security
Creator creates/updates their own pending verification request.
Admin can approve/reject.
Creator can resubmit after rejection.
5.8 Marketplace security
Requirements:
- public read
- business creates own open requirement
- business manages own requirement
- creator can reopen only in the narrowly defined accepted-offer/rejected-booking case
Offers:
- creator creates own pending offer
- creator can withdraw own offer
- business owning requirement can accept/reject
- creator can release an accepted offer back to pending when the resulting booking is rejected
5.9 Reviews
- public read
- any authenticated user can create
- update/delete disabled
5.10 Promo demos
- public read
- creator creates own
- creator updates/deletes own
- admin can moderate
5.11 Pro payments
Business and creator Pro purchase logs are readable by owner/admin and createable by the corresponding owner. Update/delete are disabled.
6. Business role — complete functional inventory
Business page state is controlled by BusinessApp.
Primary pages:
- discover
- dashboard
- ai
- wallet
- marketplace
- referral
- pro
- support
- privacy
- terms
6.1 Discover
Component: DiscoverPage
Placement: business main navigation, default business page.
Functions:
- browse creators
- search creators
- category filtering
- filter by platform, followers, rating, city, budget, niche
- open creator profile
- start booking
- AI-assisted creator discovery entry point
- boosted/Be On Top creator placement logic
Creator source:
1. local/hardcoded creator dataset INFS
2. live Firestore creators
3. extraCreators state is populated from live Firestore creators that:
   - addedToCollancer == true
   - not banned
   - no active booking
Live creator records are passed through dedupeCreators().
Business-side creator snapshots include all Firestore fields so profile changes appear in real time.
6.2 Creator profile
Component: ProfilePage
Opened from Discover or other creator selection paths.
Functional tabs:
- Overview
- Promo Demos
- Analytics
- Reviews
Overview data
- followers/subscribers
- average views
- rating
- estimated views
- estimated likes
- estimated reach
- estimated conversion range
- pricing by promotion type
- promotion categories the creator accepts
Pricing
Supported paid promotion keys:
- story
- reel
- video
- personalvideo
- personalad
If a creator has no modern prices map, legacy fallback prices are derived from price.
Creator Pro discount pricing can expose:
- MRP
- discounted price
- discount percentage
Promo Demos
- locked for non-Pro business users
- unlocked for business Pro
- reads promoDemos for the selected creator
- demo data is public in Firestore
Analytics
- locked for non-Pro business users
- unlocked for business Pro
- displays derived/available analytics from creator data
- intended to expose engagement trends, audience information and campaign estimation
The code is primarily client-rendered; there is no separate analytics service.
Reviews
- public reviews are read from reviews
- businesses can submit a review after a completed campaign
- rating is recomputed and written to creator profile
6.3 Booking flow
Component: BookModal
Placement: opened from creator profile/discovery/AI creator selection.
Six conceptual stages:
1. Type
2. Package
3. Details
4. Review
5. Payment
6. Sent
Collaboration types
Paid collaboration
Creator-published package is selected.
Business cannot modify creator package price.
Creator price is loaded from:
creator.prices[packageKey]
Legacy fallback uses creator.price.
Standard paid amount
creatorPrice + 12% platform/transaction fee - 5% Pro discount
Where Pro discount applies to the creator price.
The booking stores:
- amount = total
- creatorPrice
- escrowAmount = total
- paymentStatus = escrow_held
- escrowStatus = held
- status = Pending
Paid payment methods
The booking UI accepts payment method values including wallet, UPI, card and other displayed methods depending on checkout state.
Important: the payment UI is a demo/simulated checkout, not a real card/UPI gateway integration.
The app generates a synthetic reference such as:
DEMO_<timestamp>_<random>
Wallet paid booking
When Cleo explicitly chooses wallet payment:
1. booking fingerprint is generated;
2. booking document ID is collab_{fingerprint};
3. existing non-cancelled duplicate is rejected;
4. a Firestore transaction reads live business balance;
5. balance must be >= total;
6. wallet balance decreases;
7. booking is created in the same transaction;
8. wallet transaction ledger entry is created in the same transaction.
This is a real backend transaction.
Barter collaboration
Business supplies:
- offered products/services
- offer value
- deliverables
- requirements
- campaign details
- shipping terms
Amount is zero.
Payment status is not_required.
Status starts Pending.
Creator acceptance then optionally shares creator address with the business.
Booking idempotency
Paid standard booking fingerprint uses:
- business ID
- creator ID
- package key
- campaign name
- deadline
SHA-256 is truncated to 32 hex characters.
This prevents duplicate active collaboration requests with the same fingerprint.
6.4 Booking lifecycle
Canonical statuses:
Pending → Active → PendingCompletion → Completed
Cancellation path:
Pending → Cancelled
Admin rejection path:
PendingCompletion → Active with adminRejected = true, followed by creator resubmission to PendingCompletion.
Pending
Creator must explicitly accept or reject.
Accept
Creator acceptance writes:
- status: Active
- acceptedAt
- acceptedByCreator
For barter:
- fetch creator address
- require address
- write creatorAddress
- addressSharedAt
- addressSharedTo
Reject
Creator rejection writes:
- status: Cancelled
- rejection reason
- rejection timestamps/actor fields
For wallet-paid paid bookings, a transaction can:
- refund exact escrow amount to business wallet
- create refund_{bookingId} ledger record
- set booking refund fields
If automatic refund fails, booking is marked for manual review.
For marketplace bookings, rejecting the resulting booking can reopen the requirement and return the accepted offer to pending.
Completion
Creator submits a delivery link.
For normal collaboration:
- status → PendingCompletion
- driveLink / promotedVideoLink
- delivery timestamp
- admin-review flags
For personal-ad campaigns, Google Drive delivery flow has an additional business notification path.
Admin QC
Admin sees PendingCompletion items.
Admin approval atomically:
1. re-reads booking
2. checks not already released
3. computes creator share
4. marks booking Completed
5. sets paymentApproved = true
6. sets paymentStatus = released
7. sets escrowStatus = released
8. sets completedAt
9. creates adminRevenue/rev_{bookingId}
10. creates creator payment-release notification
11. creates business completion notification
This transaction is designed to be idempotent.
Creator share
creatorShareOf(booking):
- use creatorPrice if present
- otherwise use amount
- multiply by 0.95
The platform revenue is the difference between gross booking amount and creator share.
6.5 Business Dashboard
Component: DashPage
Placement: business dashboard page.
Displays:
- active campaign count
- pending count
- completed count
- total spend
- campaign list
- campaign status
- creator information
- product/brief metadata
- completed delivery links
- cancellation/rejection reasons
- review action after completion
- business profile name/photo editing
- logout
- support/legal entry points
Campaign data source:
bookings is the source of truth.
bizCampaigns is merged in for display metadata.
Real-time listener queries bookings by:
bizId == authUser.uid
6.6 Business notifications
Business listens to all bizNotifs for the authenticated business.
Special live behavior:
- booking rejection creates a rejection toast
- admin deletion of a requirement creates a blocking notice
- drive link / promotion completion notifications create dedicated delivery popups
Notifications remain in Firestore and can be read/marked read.
6.7 Wallet
Component: WalletPage
Placement: business wallet page.
Functions:
- display current wallet balance
- add money
- show deposit requests
- show transaction history
- support wallet-funded bookings
- display refund credits
Funding process
The funding process is manual:
1. business enters amount, minimum ₹100;
2. app shows Collancer UPI ID:
   collancer@upi
3. business pays externally through its own UPI app;
4. business enters the UPI ID used to pay;
5. business enters 12-digit UTR/reference;
6. app creates walletDeposits document with pending status;
7. admin verifies externally;
8. admin transaction credits wallet;
9. admin creates walletTransactions/deposit_{id};
10. deposit becomes credited.
The client cannot self-credit the wallet under Firestore rules.
Transaction history
Reads walletTransactions for the business and renders:
- deposit
- booking deduction
- refund
6.8 Business Pro
Components:
- ProFeatureModal
- CollancerProPage
- ProStatusPage
- payment success/expiry components
Plans:
- monthly: ₹799/month
- 6 months: ₹649/month-equivalent, total ₹3,894
- annual: ₹499/month-equivalent, total ₹5,988
Functional Pro benefits represented by the code:
- Requirements Marketplace
- Collancer AI Assistant
- 5% booking discount
- deeper creator analytics
- promotion demo videos
Purchase behavior
The UI collects UPI or card fields.
The checkout is explicitly labeled demo/in-app confirmation.
No external payment gateway is called.
On purchase:
- businesses/{uid} gets isPro: true
- proActive: true
- proPlan
- proExpiresAt
- proPurchasedAt
A proPayments log is created.
Subscription expiry is checked:
- immediately on business snapshot
- every 60 seconds while logged in
Expired Pro is revoked by updating the business document.
6.9 Referral page
Component: ReferralPage.
Placement: business referral page.
Functional UI claims:
- 5% referral reward
- referral link
- email invite
- referral history
- payout information
However, the current implementation is static/demo data:
- referral code is hardcoded: BIZ-COLLANCER-2026
- referral link is hardcoded from that code
- referral rows are hardcoded examples
- total earned is hardcoded from those rows
- email invite only toggles local UI state
- no Firestore referral collection is used
- no email service is invoked
- no real attribution or payout logic exists
Do not reproduce this as a live backend feature unless explicitly desired for the rebuild.
6.10 Business AI
Component: CollancerAIPage / CleoLaunchPanel.
Placement: business ai page and Cleo entry points.
Capabilities are detailed in Section 11.
6.11 Business support/legal
Components:
- SupportPage
- LegalPage
Support contains deterministic support responses and links/contact guidance. Legal content is local/static data.
7. Creator role — complete functional inventory
Creator page state is controlled by CreatorApp.
Primary pages:
- dashboard
- marketplace
- bookings
- creatorpro
- profile
- earnings
- collancer-ai
- notifications
- support
- privacy
- terms
Additional modal/page states:
- verification request page
- Be On Top/ad campaign page
- booking detail modal
- logout confirmation
- profile warning
7.1 Creator onboarding and profile completion
Registration creates a creator account with baseline empty stats.
The product intentionally does not fabricate real follower/engagement data.
A minimum of 10,000 followers is required by the creator AI/profile completeness logic for a fully complete/eligible profile.
Profile completeness requires:
- name
- handle
- bio
- platform
- niche
- city
- 10,000+ followers
- at least one price
7.2 Creator Dashboard
Component: DashboardPage
Placement: creator dashboard page.
Functions:
- profile completion status
- verification state
- add-to-Collancer state
- active booking state
- review summary
- Be On Top entry
- promotion type/rate-card setup
- creator status
- navigation to profile, bookings, earnings, marketplace and Pro
A creator is considered live only after the necessary verification/add-to-Collancer state is satisfied.
If not live, the dashboard remains the main page rather than exposing the full live creator workspace.
7.3 Creator verification
Component: VerificationRequestPage.
Placement: dashboard verification action.
Creator submits verification data to:
verificationRequests/{creator.uid}
Admin sees pending requests.
Admin approve:
- request status → verified
- creator verificationStatus → verified
- creator verified → true
- creator notification created
Admin reject:
- request status → rejected
- creator verification status → rejected
- rejection reason stored
- creator notification created
Creator can resubmit after rejection.
7.4 Add to Collancer / marketplace visibility
Creator profile contains addedToCollancer.
Business discovery only includes live Firestore creators when:
- addedToCollancer == true
- not banned
- hasActiveBooking is false
Creator booking listener maintains hasActiveBooking based on whether any booking is Active or PendingCompletion.
This flag is also written back to the creator document so business discovery can hide currently engaged creators.
7.5 Creator profile editing
Component: ProfilePageH.
Functional tabs:
- profile
- rate card
- account
Editable profile information includes:
- name
- handle
- bio
- platform
- niche
- city
- followers/subscribers
- engagement
- average views
- average likes
- reach
- social profile links
- YouTube channel
- profile photo
- categories
- promotion types
- pricing
Rate card
Promotion types depend on platform.
Modern price fields include:
- story
- reel
- video
- personalad
- ytshorts
Creators can also set discounted prices for Pro pricing flows.
Categories
Creator can choose from the platform promotion categories.
Profile photo
Creator profile picture:
1. read file
2. compress to JPEG
3. upload to Cloudinary
4. save returned secure URL to Firestore
Business profile picture is handled differently: it is stored directly as base64 in Firestore.
7.6 Creator bookings
Component: BookingsPage
Placement: creator bookings page.
Filters:
- All
- Pending
- Active
- PendingCompletion
- Completed
- Cancelled
Bookings are read in real time from:
bookings where creatorId == creator.id
Newest bookings sort first.
Unseen Pending bookings are marked seenByCreator when opened.
7.7 Booking Detail
Component: BookingDetailModal.
Creator can:
- accept pending booking
- reject pending booking
- view campaign brief
- view payment status
- view escrow status
- view address-sharing state for barter
- submit delivery link
- resubmit after admin rejection
- send Google Drive link for personal-ad flows
Accept
Requires no manual payment operation by creator.
For barter, creator address must exist before acceptance.
Reject
Requires rejection reason.
Wallet-paid bookings can trigger a transactional refund to business wallet.
Delivery
Creator enters a URL.
URL preview is generated locally by LinkPreviewChip/detectDeliverableLink logic.
The creator does not directly release payment.
7.8 Personal Ad workflow
Personal Ad is a special premium promotion type.
When approved/eligible:
- creator submits a Google Drive link
- business is notified
- admin reviews completion
- payment is released only after admin approval
7.9 Earnings
Component: EarningsPage.
Placement: creator earnings page.
Calculates:
- active/in-progress earnings
- pending completion earnings
- completed but locked earnings
- completed/released earnings
- already requested payout amount
- withdrawable amount
Creator share is 95% of creatorPrice when available.
Withdrawal rules in UI
- minimum withdrawal ₹100
- cannot request if withdrawable <= 0
- only one pending/approved request at a time
- UPI format validation
- bank account validation
- IFSC validation
Payout request is written to payoutRequests with status pending.
Admin then:
- approves
- rejects, or
- marks approved request as paid
7.10 Be On Top / creator advertising
Component: AdCampaignPage.
Plans:
- 1 day — ₹249
- 2 days — ₹449
- 3 days — ₹649
- 4 days — ₹799
- 5 days — ₹999
- 6 days — ₹1,199
- 7 days — ₹1,399
Creator can choose promotion categories for the boost.
Business discovery listens to adCampaigns and derives:
- active boosted creator IDs
- active boosted creator IDs by category
An ad is active when:
- status == active
- endsAt > now
The app records an adminRevenue ad-revenue entry in the permitted creator-side path; the supplied code does not implement a real external payment gateway for this purchase.
7.11 Promo demo portfolio
Component: PromoDemoSection.
Placement: creator profile/dashboard ecosystem and business creator profile.
Creator can upload promotion demo videos.
Supported demo types/formats are defined in:
- DEMO_TYPES
- DEMO_FORMATS
Uploads use Cloudinary video/image endpoints.
Maximum number of selected uploads is constrained by the component.
Business Pro users can view creator demo videos from the business creator profile.
Admin can remove/moderate demo videos through notification flows.
7.12 Creator notifications
Real-time listener:
creatorNotifs where creatorId == creator.id
All notifications are loaded; the app does not filter only unread documents because doing so previously caused a race where newly created notifications could be missed after read-state changes.
The client tracks IDs in a Set to identify genuinely new notifications.
Notification inbox supports:
- mark one read
- mark all read
- open related booking
7.13 Creator Pro
Plans:
- monthly: ₹599 / 30 days
- quarterly: ₹1,499 / 90 days
- yearly: ₹4,999 / 365 days
Features represented in code:
- Requirements Marketplace access
- Personal Ad Shoot
- MRP + discounted creator pricing
- Pro badge/ring state
Purchase writes:
creators/{uid}:
- creatorIsPro: true
- creatorProPlan
- creatorProExpiresAt
- updatedAt
And logs:
creatorProPayments
Again, this is a simulated/demo payment flow; no external gateway is called.
7.14 Creator AI
Component: CreatorAIPage.
Tools:
- account-aware booking status answers
- earnings/payout explanations
- profile completeness analysis
- pricing guidance
- pitch drafting
- brief interpretation
- deliverable checklists
- profile improvement tips
- static QA knowledge retrieval
Details in Section 11.
7.15 Creator support/legal
Components:
- HomeSupportPage
- HomeLegalPage
These are local/static functional pages.
8. Admin role — complete functional inventory
Component: AdminApp.
Admin authentication:
- email/password Firebase Auth
- access check via admins/{uid} document
Tabs:
1. Verification
2. Completions
3. Payouts
4. Deposits
8.1 Verification queue
Real-time query:
verificationRequests where status == pending
Actions:
- approve
- reject with required reason
Approval updates both request and creator document and sends creator notification.
8.2 Completion/QC queue
Real-time query:
bookings where status == PendingCompletion
Displays creator, business, amount, creator share, delivery link, delivery note.
Actions:
- Approve & Release
- Send Back
Approve uses one transaction for:
- booking completion
- payment release
- admin revenue
- creator notification
- business notification
Send Back:
- booking status → Active
- adminRejected = true
- adminRejectionReason
- creator notification
8.3 Payout queue
Real-time query:
payoutRequests where status in [pending, approved]
Actions:
- approve pending request
- reject pending request with reason
- mark approved request paid
Notifications are written to creator notification collection.
8.4 Deposit queue
Real-time query:
walletDeposits where status == pending
Admin verifies UTR externally.
Approve transaction:
- read deposit
- verify still pending
- read business balance
- increase wallet balance
- create deposit ledger entry
- mark deposit credited
- notify business
Reject stores reason and notifies business.
9. Requirement Marketplace
The marketplace exists on both sides but is unlocked/positioned as a Pro feature in product logic.
9.1 Business side
Component: RequirementsPage.
Business can:
- browse all requirements
- create a requirement
- attach up to 4 media files
- set title
- description
- budget
- category
- promotion type
- view own posts
- view offers
- reject offers
- open creator profile when available
- accept an offer
- book from an offer
- delete own requirement
Media upload:
Cloudinary unsigned upload, folder:
collancer_market_briefs
Accepted upload types:
- image
- video
9.2 Creator side
Component: MarketplacePage.
Creator can:
- browse open/matched requirements
- view budget/category/promotion type
- submit proposal
- specify price
- write message
- specify timeline
- view own offer status
Offer writes:
requirementOffers/{autoId}
and increments requirements.offerCount.
9.3 Offer acceptance
Business acceptance opens BookFromOfferModal.
Pricing:
- offer price = creator proposed price
- marketplace platform fee = 12%
- Pro business savings = 5% of base price
- final = base + 12% fee - Pro 5% saving
The UI labels the 12% as a combination of platform fee and secure payment fee in the order summary.
Booking creation stores:
- creatorPrice = offer.price
- amount = finalPrice
- escrowAmount = finalPrice
- paymentStatus = escrow_held
- escrowStatus = held
- status = Pending
- fromMarketplace = true
- requirementId
- offerId
Wallet payment uses a Firestore transaction for:
- wallet deduction
- wallet ledger
- booking creation
- requirement match
- offer acceptance
The creator is notified and must explicitly accept the booking.
9.4 Offer rejection
Business can reject a pending offer.
The creator receives:
creatorNotifs with offer_rejected.
10. Booking/payment/escrow model — rebuild specification
This section should be treated as the canonical operational model.
10.1 Paid booking
Business selects creator package.
Price components:
- creator-set price
- 12% fee
- optional business Pro 5% discount
Booking begins as:
- status: Pending
- paymentStatus: escrow_held
- escrowStatus: held
- paymentApproved: false
The creator must accept before work becomes active.
10.2 Barter booking
No monetary escrow.
Begins:
- status: Pending
- paymentStatus: not_required
- escrowStatus: not_required
- amount: 0
Creator acceptance can share shipping address.
10.3 Wallet debit
Wallet debit is the only fully transactional client-side payment operation.
The transaction must lock the live wallet value by reading the business document inside the transaction.
Never calculate a wallet debit from stale React state only.
10.4 Refund
Only wallet-paid cancelled bookings can be automatically refunded.
The exact booking amount is returned.
Refund ledger ID is deterministic:
refund_{bookingId}
Booking is marked refunded in the same transaction.
10.5 Completion release
Only admin can release escrow/payment in the canonical flow.
Creator cannot set paymentApproved.
Admin transaction is idempotent.
10.6 Creator payout
Creator does not receive funds directly into a Firebase wallet balance.
Instead:
1. booking completion is approved;
2. creator share is recorded in the booking/revenue ledger;
3. creator calculates withdrawable amount from approved completed bookings minus non-rejected payout requests;
4. creator creates payout request;
5. admin approves and later marks paid externally.
11. Cleo / Collancer AI — complete functional audit
Cleo is a substantial subsystem rather than a single API call.
Primary files:
- src/CleoLaunchPanel.jsx
- src/collancerAI.js
- src/cleoStep2.js
- src/cleoIntelligenceV2.js
- src/cleoIntelligenceCore.js
- src/cleoLocalModel.js
- src/cleoOntology.js
- src/cleoEngine.js
- src/cleoConversation.js
- src/cleoCampaignExtract.js
- src/cleoRepository.js
- src/cleoMarketplace.js
- src/collancerKnowledge.js
- src/collancerKnowledgeBase.v2.js
- src/collancerQA.v2.js
- src/collancerQA.v3.js
- src/cleoVoicePipeline.js
- src/cleoEdgeTTS.js
- api/cleo-ai.js
- api/cleo-search.js
- api/edge-tts.js
11.1 Cleo entry points
Cleo is mounted through CleoLaunchPanel from the business AI experience.
The creator side has its own CreatorAIPage based on creatorAiEngine.js.
Cleo can operate in:
- text/chat mode
- creator discovery mode
- campaign planning mode
- requirement publishing mode
- booking assistance mode
- voice mode
11.2 Creator discovery engine
cleoEngine.js parses:
- niche
- budget
- maximum budget
- minimum followers
- minimum engagement
- result count
- platform
- city
- language
- price unit
Supported discovery concepts include:
- Instagram
- YouTube
- cities including Mumbai, Delhi, Bengaluru/Bangalore, Hyderabad, Chennai, Kolkata, Jaipur, Pune, Kochi, Ahmedabad, Rajkot, Surat, Vadodara
- language terms
- budget units
- follower thresholds
- engagement thresholds
Creator matching checks:
- niche/category
- platform
- city
- language
- budget
- follower minimum
- engagement minimum
- availability
- banned state
- business/platform/system roles
Hard failures are excluded from exact results.
Scoring factors include:
- matching reasons
- engagement
- reach/average views
- rating
- value relative to price
The engine can produce both exact results and alternatives, but the stricter Cleo UI path intentionally avoids showing unrelated alternatives when explicit hard constraints produce no matches.
11.3 Creator data sources
Cleo marketplace sync checks:
1. window-level creator stores
2. localStorage creator stores
3. extraCreators
4. Firestore collections:
   - creators
   - creatorProfiles
   - freelancers
   - influencers
   - marketplaceCreators
   - creatorMarketplace
   - users
Records are normalized and deduplicated.
11.4 Conversation memory
cleoConversation.js persists versioned conversation state in localStorage.
Keys:
- collancer_ai_conversation_v2
- collancer_ai_memory_v2
Conversation stores:
- turns
- query
- intent/kind
- constraints
- answer
- result keys
- page keys
- active search
Memory can preserve campaign facts such as:
- brand
- product
- budget
- niche
- preferences
Conversation page size is 8 creators.
The planner supports follow-up refinement such as:
- only Instagram
- under a new budget
- different niche
- different location
- more results
Ordinal follow-ups can resolve:
- first
- second
- third
- etc.
Superlative queries can answer:
- highest followers
- highest engagement
- most affordable
Comparisons use current result records, not an external model.
11.5 Campaign extraction
cleoCampaignExtract.js extracts:
- brand
- product
- niche
- region
- platform
- deliverables
- budget
- deadline
- additional requirements
It has explicit validation to avoid sentence-sized brands/products and to avoid confusing brand and product names.
Missing data remains empty rather than invented.
11.6 Requirement generation
Cleo can turn a natural-language request into a Requirement Marketplace post containing:
- title
- description
- niche
- category
- budget
- platform
- follower range
- timeline
- location
- language
- deliverables
- application instructions
- brand
- product
- original brief
Requirement IDs can be deterministic using an FNV-style hash of business + key post fields.
11.7 AI response stack
collancerAI.js is the public AI entry.
Pipeline:
1. Step 2 intelligence
2. instruction-leak safety guard
3. if confidence is high, return grounded answer
4. if low confidence and suitable intent, try local model
5. if local model fails, keep grounded answer
No Gemini, Groq, OpenAI, Anthropic or other paid LLM API key is required by the supplied code.
11.8 Intelligence V2
cleoIntelligenceV2.js uses:
- collancerQA.v2.js
- collancerQA.v3.js
- collancerKnowledgeBase.v2.js
- ontology matching
- session memory
Primary behavior:
1. normalize question
2. detect small talk
3. detect concepts/entities
4. retrieve QA entries
5. if high-confidence QA match, answer
6. if ambiguous, ask clarification
7. retrieve comprehensive topic KB
8. comparison/how-to enrichment
9. fallback to legacy intelligence
10. safe fallback if no verified answer
It explicitly blocks questions about system/developer instructions.
11.9 Legacy intelligence
cleoIntelligenceCore.js provides:
- knowledge ranking
- creator profile lookup
- live web routing
- confidence scoring
- live creator/entity answers
If a creator profile matches the query, it returns the profile directly.
11.10 Live web search
Live web search is triggered only when the intelligence layer decides a question needs web information.
Frontend calls:
GET /api/cleo-search?q=...
The server endpoint:
- requests Google HTML search results
- requests Bing HTML search results
- parses snippets/results
- scores results against query terms
- deduplicates URLs
- returns up to 10 results
- returns a short combined answer
This is HTML scraping, not an official Google/Bing API.
11.11 Local model fallback
cleoLocalModel.js uses:
onnx-community/Qwen3-0.6B-ONNX
via:
@huggingface/transformers
Runtime:
- WebGPU when available
- WASM fallback otherwise
The model receives only supplied evidence:
- grounded answer
- knowledge records
- creator records
It is explicitly instructed not to invent:
- creators
- prices
- availability
- payments
- balances
- bookings
- policies
- transaction states
The local model has a 5-second race timeout in the public AI wrapper.
11.12 Creator AI engine
creatorAiEngine.js is deterministic and local.
Features:
Creator share
95% of creator price.
Profile completeness
Checks required profile fields and 10K follower threshold.
QA search
Searches combined V2/V3 creator QA datasets by token overlap.
Live account answers
Can answer about:
- bookings
- booking status
- earnings
- payouts
- profile verification
- profile completeness
Pricing guidance
Follower tiers:
- under 10K
- 10K–50K
- 50K–200K
- 200K–1M
- 1M+
Provides reel/story suggested ranges and pricing guidance.
Pitch drafting
Generates a personalized creator-to-brand pitch using:
- creator name
- handle
- niche
- followers
- city
- brand
- product
- deliverable
Brief interpreter
Extracts:
- deliverables
- deadline
- usage rights
- revisions
- payment
- content guidelines
Deliverable checklists
Defined for:
- Reel
- Story Set
- Static Post
- YouTube Video
- UGC
Profile tips
Checks:
- missing basics
- bio length
- profile photo
- prices
- profile link
- engagement/profile readiness
11.13 Voice AI
Voice stack is shared between chat and voice answer generation.
Pipeline:
1. clean answer
2. split into chunks
3. synthesize each chunk
4. expose word/character progress
5. keep transcript synchronized with spoken output
6. prefetch next cloud chunk where possible
7. cancel safely on new answer
Voice transport fallback
1. direct Microsoft Edge TTS WebSocket
2. /api/edge-tts proxy
3. browser speechSynthesis
Allowed cloud voices through proxy:
- en-US-ChristopherNeural
- en-US-EmmaNeural
The proxy caps input at 1,200 characters per request.
12. External service connections
12.1 Cloudinary
Cloudinary cloud name:
dd77dqbho
Unsigned upload preset:
collancer
Used for:
- creator profile photos
- promo demo videos/images
- requirement marketplace media
- booking brief media
Endpoints:
https://api.cloudinary.com/v1_1/dd77dqbho/image/upload
https://api.cloudinary.com/v1_1/dd77dqbho/video/upload
Folders used include:
- collancer_pfps
- collancer_market_briefs
- collancer_briefs
12.2 Google Fonts
External font resources are loaded from:
- fonts.googleapis.com
- fonts.gstatic.com
This is not application data functionality but is an external runtime dependency.
12.3 Firebase CDN
Firebase JS modules are loaded from gstatic.com at runtime.
12.4 Google and Bing web search
Only used by Cleo serverless search endpoint.
No official search API key is present.
12.5 Microsoft Edge TTS
Used for Cleo voice.
Direct WebSocket host:
speech.platform.bing.com
Server proxy:
/api/edge-tts
12.6 Hugging Face model
The browser-side local model dynamically loads through Transformers.js and uses the ONNX model:
onnx-community/Qwen3-0.6B-ONNX
This is a runtime model download/inference dependency, not a paid API integration.
12.7 DotLottie / Lottie
Cleo loads a web component from unpkg.com and an animation asset from lottie.host.
This is primarily runtime media/visual behavior rather than product data logic, so no design reconstruction is required from it.
13. Vercel serverless APIs
/api/cleo-ai.js
Method:
POST
Input:
- query
- knowledge[]
- creators[]
- actionContext{}
Behavior:
- calls askStep2Intelligence
- returns provider
- confidence
- answer
- search results
- creator profile
Errors return HTTP 200 with a safe fallback answer rather than exposing an exception to the caller.
/api/cleo-search.js
Method:
GET
Input:
q
Behavior:
- Google search
- Bing search
- HTML parsing
- ranking/deduplication
- safe result extraction
Returns:
- ok
- engine
- answer
- results
- searchedAt
- live
/api/edge-tts.js
Method:
POST
Input:
- text
- rate
- pitch
- volume
- optional voice
Returns base64 audio and word timing data.
Uses a manually implemented TLS WebSocket connection to Microsoft Edge TTS.
14. Media upload behavior
Creator profile photo
- browser FileReader
- image compression
- JPEG conversion
- Cloudinary image upload
- secure URL stored in Firestore
Business profile photo
- image compression
- base64 data URL retained in Firestore
- no Cloudinary upload in this path
Creator promo demo
- image/video upload
- Cloudinary
- secure URL
- thumbnail where applicable
- metadata in promoDemos
Requirement media
- up to 4 selected files
- image/video
- Cloudinary folder collancer_market_briefs
- URLs saved to requirement mediaFiles
Booking brief media
- up to 4 selected files
- image/video
- Cloudinary folder collancer_briefs
- URLs saved to booking mediaFiles
15. PWA/offline/runtime behavior
public/manifest.webmanifest defines the app as a standalone portrait PWA.
public/sw.js:
- cache name collancer-shell-v1
- takes control immediately
- caches successful same-origin GET requests
- removes old cache names
- on network failure returns cached request or /
- does not cache cross-origin requests
- does not intercept non-GET requests
Important: this is network fallback/caching, not an offline-first data layer. Firestore still requires connectivity for authenticated/live operations.
16. Browser localStorage/session state
Known persistent/local keys include:
- collancer_role
- collancer_biz_chats
- collancer_home_chats
- collancer_ai_conversation_v2
- collancer_ai_memory_v2
- marketplace/creator compatibility keys in Cleo marketplace sync
Local state is used for:
- selected role
- AI conversation memory
- business/creator chat history
- Cleo memory
- temporary UI/session behavior
There is no IndexedDB-based application data store in the supplied source.
17. Business/creator data synchronization model
Business live listeners
Business app establishes listeners for:
- businesses/{uid}
- bizNotifs where bizId == uid
- bizCampaigns where bizId == uid
- creators entire collection
- reviews entire collection
- adCampaigns entire collection
- bookings where bizId == uid
- selected creator reviews
Creator live listeners
Creator app establishes listeners for:
- creators/{uid}
- bookings where creatorId == uid
- reviews where creatorId == uid
- creatorNotifs where creatorId == uid
- payoutRequests where creatorId == uid
- adCampaigns where creatorId == uid
- marketplace requirements
- creator marketplace offers
Admin live listeners
Admin establishes listeners for:
- pending verification requests
- pending completion bookings
- pending/approved payouts
- pending wallet deposits
18. Discovery/boost logic
Business discovery receives live creator records only when:
- creator is added to Collancer
- not banned
- no active booking
Boosting is read from adCampaigns.
Active boost condition:
- status = active
- end timestamp > current time
The app derives:
- boostedCreatorIds
- boostedByCategory
Category-aware boosting means a creator is not necessarily treated as boosted for every category; the ad campaign can specify category IDs.
19. Static/demo data that exists in the application
The rebuild should decide deliberately whether these are retained or replaced with real data.
INFS
A hardcoded creator dataset exists in App.jsx for discovery/fallback/demo behavior.
CAMPS
A hardcoded campaign dataset exists.
NOTIFS
A hardcoded notification seed exists for non-authenticated/fallback states.
Referral data
Completely static as described earlier.
Demo payment
Payment references and Pro activation are simulated; no gateway confirmation exists.
Demo marketplace/creator records
Cleo explicitly supports demo creator records as valid selectable marketplace records.
20. Legacy/disconnected functionality that should NOT automatically be copied as canonical
This section is critical for a clean rebuild.
20.1 writeBookingToFirebase
An older generic booking writer exists near the top of App.jsx.
It writes an addDoc booking with a large generic schema.
It is still referenced by legacy addCampaign, but the canonical modern BookModal paid/barter flows create their own booking records.
20.2 addCampaign
BusinessApp contains an older addCampaign function that can:
- write bizCampaigns
- directly manipulate wallet balance
- create wallet ledger entries
- call writeBookingToFirebase
However, rg shows no active invocation of addCampaign( in the current source. Therefore it should be treated as legacy unless the rebuild intentionally wants this old path.
20.3 Referral system
UI exists, but there is no real backend referral attribution/payout implementation.
20.4 Google Auth UI
Google Auth functions are loaded and redirect result handling exists, but visible registration/login is primarily email/password.
20.5 Generic Cleo collections
Cleo's generalized compatibility readers may query collections that are not part of the canonical Collancer schema.
20.6 cleoAuditLogs
Cleo attempts to write audit records, but no corresponding Firestore rules block is present in the supplied rules. Treat it as optional/incomplete.
20.7 External payment gateway
There is no Stripe/Razorpay/payment gateway integration in the source. Do not mistake payment input fields for a real payment processor.
21. Important business rules to preserve
1. Creator-set paid package price is locked for normal booking.
2. Business Pro receives 5% booking discount.
3. Paid standard booking has a 12% fee component before Pro discount.
4. Paid bookings begin Pending, not Active.
5. Creator must explicitly accept/reject.
6. Barter booking does not require monetary escrow.
7. Barter creator address is only shared after creator acceptance.
8. Wallet debit must be transactionally protected against stale balances.
9. Client cannot self-credit wallet.
10. Client cannot self-release creator payment.
11. Admin is the trusted completion/payment-release actor.
12. Completion approval must be idempotent.
13. Creator receives 95% of creator price.
14. Creator payout requests have a ₹100 minimum.
15. Creator cannot directly change verification status.
16. Creator cannot directly set addedToCollancer/verified state.
17. Creator handles must be unique case-insensitively.
18. Active creators are hidden from discovery while they have an active booking.
19. Banned creators must not be bookable/discoverable.
20. Requirements Marketplace offers become bookings only after business acceptance and payment/booking creation.
21. Marketplace creator acceptance still happens through the normal creator booking lifecycle.
22. Wallet refunds must be exact and idempotent.
23. Pro expiration must revoke Pro state.
24. Demo payments must not be treated as gateway-confirmed payments in a real rebuild unless a gateway is added.
22. Rebuild-ready navigation map
Root
App
→ Role Select
→ Business / Creator / Admin
Business
BusinessApp
→ Discover
→ Dashboard
→ AI
→ Wallet
→ Requirements Marketplace
→ Referral
→ Pro
→ Support
→ Privacy
→ Terms
Creator profile is an overlay/subpage from Discover and AI/marketplace contexts.
Booking is a modal/workflow from creator selection.
Creator
CreatorApp
→ Dashboard
→ Marketplace
→ Bookings
→ Creator Pro
→ Profile
→ Earnings
→ Collancer AI
→ Notifications
→ Support
→ Privacy
→ Terms
Additional states:
→ Verification
→ Be On Top
→ Booking Detail
→ Logout confirmation
Admin
AdminApp
→ Verification
→ Completions
→ Payouts
→ Deposits
23. Rebuild-ready event/data flow map
Business registration
BusinessAuthScreen
→ Firebase Auth create user
→ businesses/{uid}
→ registration summary on same business document
→ BusinessApp
→ real-time business listener
Creator registration
AuthScreen
→ Firebase Auth create user
→ handle uniqueness transaction
→ creatorHandles/{handleLower}
→ creators/{uid}
→ registration summary
→ CreatorApp
Business creator discovery
creators snapshot
→ filter live/visible creators
→ dedupe
→ Discover
→ profile
→ booking
Standard paid booking
Creator profile
→ BookModal
→ package selection
→ campaign details
→ demo payment or wallet transaction
→ bookings
→ creator notification/listener
→ creator accept/reject
Barter booking
Creator profile
→ BookModal
→ barter terms
→ bookings with zero monetary amount
→ creator accept
→ address share
→ active collaboration
Marketplace booking
Business requirement
→ creator offer
→ business accepts
→ BookFromOfferModal
→ booking + requirement/offer update
→ creator notification
→ creator accept/reject
Completion
Creator booking detail
→ delivery link
→ PendingCompletion
→ admin completion queue
→ approve or send back
→ if approve: Completed + payment release + revenue + notifications
Creator payout
Completed approved bookings
→ earnings calculation
→ payout request
→ admin approve
→ admin mark paid
→ creator notifications
Wallet deposit
Business wallet
→ external UPI payment
→ UTR submission
→ walletDeposits/pending
→ admin verifies externally
→ atomic wallet credit + ledger
→ business notification
Wallet refund
Creator rejects wallet-paid booking
→ cancelled booking
→ exact escrow transaction refund
→ refund ledger
→ booking marked refunded
24. External integration matrix
Integration	Used for	Client/server	Credentials in source	Rebuild requirement
Firebase Auth	Business/creator/admin login	Client	Firebase public config	Required
Firebase Firestore	All operational data	Client	Firebase public config	Required
Cloudinary	Profile/demo/brief media	Client	Unsigned preset	Required if keeping current media architecture
Vercel Functions	Cleo API/search/TTS proxy	Server	No app API key	Required for current AI voice/search architecture
Google Search HTML	Cleo live search	Server	None	Optional but current implementation uses it
Bing Search HTML	Cleo live search	Server	None	Optional but current implementation uses it
Microsoft Edge TTS	Cleo voice	Server/direct browser	Trusted client token embedded in TTS code	Required for current cloud voice path
Hugging Face ONNX model	Local AI fallback	Browser	None	Optional but part of current Cleo architecture
Google Fonts	Fonts	Client	None	Design/runtime dependency, not business logic
Lottie/Unpkg	Cleo animation asset	Client	None	Not required for functional rebuild


25. What the rebuild needs to recreate to achieve functional parity
Identity/auth
- role selection persistence
- business registration/login
- creator registration/login
- admin access gate
- Firebase auth state restoration
- creator handle uniqueness
Business
- creator discovery
- live creator sync
- search/filter/sort
- creator profile
- reviews/rating
- paid booking
- barter booking
- booking status tracking
- notifications
- wallet
- manual UPI deposits
- wallet transaction ledger
- refunds
- Pro subscription state
- Requirements Marketplace
- offers
- AI/Cleo
- support/legal
Creator
- onboarding
- profile editing
- rate card
- categories
- profile photo upload
- verification request/resubmission
- Add to Collancer/live state
- booking inbox
- accept/reject
- delivery submission
- admin revision loop
- personal ad/Google Drive delivery
- earnings
- payout request
- payout status
- Be On Top
- promo demo upload/management
- notifications
- Requirements Marketplace offers
- Creator Pro
- Creator AI
- support/legal
Admin
- admin gate
- verification queue
- completion/QC queue
- payment release transaction
- revenue ledger
- payout queue
- wallet deposit verification/credit
- notification creation
AI
- creator matching parser
- creator ranking
- deterministic follow-ups
- memory
- campaign extraction
- requirement generation
- QA retrieval
- knowledge retrieval
- live web fallback
- local model fallback
- voice output
- voice fallback
- AI booking context handoff
- AI wallet booking
Backend invariants
- party-scoped bookings
- owner-scoped profile writes
- admin-only protected fields
- transactional wallet deductions
- transactional refunds
- transactional completion release
- deterministic IDs for idempotent financial records
- immutable financial ledgers
- creator handle reservation
26. Source file inventory and responsibility map
Application shell
- src/main.jsx — React mount + service worker registration
- src/App.jsx — main application, all three roles, Firebase integration, most product features
- index.html — root HTML and runtime DOM helper
- vite.config.js — Vite build config
- vercel.json — SPA rewrite
Cleo/AI
- src/CleoLaunchPanel.jsx — Cleo UI, chat/voice/action orchestration
- src/cleoEngine.js — creator normalization, parsing, ranking, requirement/booking fingerprints
- src/cleoCampaignExtract.js — campaign entity extraction
- src/cleoConversation.js — conversation planner, memory, deterministic follow-ups
- src/cleoIntelligenceCore.js — legacy intelligence + web routing
- src/cleoIntelligenceV2.js — QA/KB intelligence layer
- src/cleoOntology.js — query ontology and similarity
- src/cleoStep2.js — intelligence arbitration/evaluation
- src/collancerAI.js — public AI wrapper and local-model fallback
- src/cleoLocalModel.js — Qwen ONNX local model
- src/cleoMarketplace.js — marketplace creator synchronization
- src/cleoRepository.js — Cleo booking/wallet/requirement repository operations
- src/collancerKnowledge.js — product knowledge and business spend lookup
- src/collancerKnowledgeBase.v2.js — comprehensive KB
- src/collancerQA.v2.js — QA dataset
- src/collancerQA.v3.js — expanded QA dataset
- src/cleoVoicePipeline.js — voice chunking/playback synchronization
- src/cleoEdgeTTS.js — Edge TTS client/provider
Server APIs
- api/cleo-ai.js
- api/cleo-search.js
- api/edge-tts.js
Data/security
- firestore.rules
- firestore.indexes.json
PWA
- public/manifest.webmanifest
- public/sw.js
Tests/scripts
- test/cleoEngine.test.mjs
- test/cleoIntelligenceCore.test.mjs
- test/collancerKnowledge.test.mjs
- tests/creator-ai.test.cjs
- tests/creator-ai-engine.bundle.cjs
- scripts/test-conversation.mjs
- scripts/qa-coverage-check.mjs
- scripts/qa-retrieval-probe.mjs
- scripts/merge-qa-v3.mjs
- scripts/verify-bubble.py
The archive also contains .git, .agents, and .ai-office-worktrees. Those are repository/development artifacts, not runtime product features. The audit intentionally does not treat their internal agent workflows as app functionality.
27. Final rebuild notes
Canonical backend source of truth
For operational collaboration state, use:
bookings
not the legacy bizCampaigns data.
Canonical creator source
Use:
creators
with creatorHandles for uniqueness.
Canonical business source
Use:
businesses
Canonical marketplace
Use:
requirements
+
requirementOffers
+
bookings
Canonical money flow
Use:
walletDeposits
+
walletTransactions
+
bookings
+
adminRevenue
+
payoutRequests
Canonical admin trust boundary
Admin identity is Firestore-backed via:
admins/{uid}
Do not recreate admin authorization as a client-only hardcoded UID check.
Canonical completion release
Only admin completion approval should transition escrow-held paid bookings to released/Completed state.
Canonical refund
Only exact, booking-pinned wallet refunds should increase wallet balance.
Canonical Pro state
Business:
businesses/{uid}.isPro / proActive / proPlan / proExpiresAt
Creator:
creators/{uid}.creatorIsPro / creatorProPlan / creatorProExpiresAt
Payment integration warning
The current application has payment UX and Firestore accounting but not a real external payment gateway. A rebuild that needs real money collection must add a payment provider and server-side verification; simply copying the existing payment fields will not make payments real.
Referral warning
The current referral page is not a real referral system.
Cleo warning
Cleo is not a single model/API. It is a layered deterministic retrieval + rules + optional web search + optional local ONNX generation + voice system. Rebuilding only a chat API would not reproduce its current functional behavior.
Firestore rules warning
The rules are part of the application logic. Rebuilding the React UI without reproducing the rules will change the security model and can make financial/identity flows unsafe.
28. Audit conclusion
The supplied Collancer application is a role-based creator marketplace with three operational surfaces and a Firebase-backed collaboration lifecycle. Its essential functional architecture is:
Business discovers creator → selects package/brief → pays/holds funds → booking Pending → creator accepts → Active → creator submits delivery → PendingCompletion → admin QC → Completed/payment released → creator requests payout → admin pays.
Alongside that lifecycle are:
- creator verification
- creator profile/rate card
- creator availability gating
- creator promotion/boosting
- creator demo portfolio
- wallet funding/refunds
- Requirements Marketplace
- offer-to-book conversion
- business/creator Pro subscriptions
- reviews
- notifications
- Cleo creator intelligence
- local AI fallback
- voice assistant
- PWA/network fallback
The most important rebuild distinction is between canonical live functionality and legacy/demo compatibility code. The canonical system is centered on Firebase creators, businesses, bookings, wallet collections, verification/payout collections, requirements/offers, notifications, and Pro payment logs. Static referral data, old booking helpers, demo payment confirmations, and generic Cleo compatibility collections should not be assumed to represent production business logic.
