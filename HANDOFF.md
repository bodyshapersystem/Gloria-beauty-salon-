# Gloria Beauty Salon — Technical Handoff

## Repository
- GitHub: bodyshapersystem/Gloria-beauty-salon-
- Default branch: main
- Framework: Next.js 14 / React 18 / TypeScript / Tailwind
- Backend: Supabase
- Hosting: Vercel

## Product Architecture
- Public website: Gloria Beauty Salon
- Booking: Gloria On Demand
- Client portal: Gloria Access
- Staff/admin: Gloria Hub / Gloria Team

## Brand System
- Ivory #F8F5EF
- Champagne #D4B896
- Taupe #A68F7B
- Mocha #6B4F43
- Espresso #2E2724
- Blush #EAD6D1
- Editorial serif + Manrope
- Tagline: REALZA TU ESENCIA, DEFINE TU ESTILO.

## Core Business Details
- Gloria Beauty Salon
- 1130 SW 8th St, Miami, FL 33130
- +1 (305) 781-5456
- Tue–Sat 9:00 AM–5:00 PM
- Instagram: @gloriabeautysalon_
- Facebook: iamgloriastylist

## Team
- Gloria: Hair
- Nudis: Hair
- Diana: Nails / Brows / Wax / Makeup
- Caro: Lashes
- Emmy: Spray Tan

## Public Website Status
- Mobile nav compacted to fit viewport better.
- Gloria Access menu item should link to /access/login and display “Iniciar sesión”, not “Muy pronto”.
- Hair services grouped into editorial accordions:
  - Cortes
  - Secados
  - Color
  - Tratamientos
  - Extensiones
  - Estilismo
- Public booking is split into:
  - instant booking: blowdry/secado, brows and wax
  - reviewed inquiry: all other services, subject to team approval
- Team “Reservar con…” CTAs route into /reservar with the professional preselected.
- Public Memberships route exists for prepaid beauty plans; first concept is 4 blowouts per month as one-time payment.

## PENDING — PUBLIC WEBSITE
- Fill / complete the Gallery with approved real salon/client imagery.
- Improve the main homepage visual hierarchy and content flow after core booking QA.
- Connect Stripe later for deposits and prepaid Memberships / one-time payments.
- Finalize pricing and commercial rules for the “4 secados al mes” prepaid plan before enabling checkout.

## Gloria Access
Existing routes include:
- /access
- /access/login
- /access/create-account
- /access/appointments
- /access/appointments/[id]
- /access/book
- /access/beauty-profile
- /access/shop
- /access/profile
- /access/orders
- /access/favorites

Implemented concepts:
- Supabase Auth client portal
- Real appointments only; no fabricated history
- Next appointment home module
- Upcoming/Past appointments
- Appointment detail
- Reschedule / cancel client flows
- Book Again / same professional
- Add to Calendar / Directions
- Access booking flow using authenticated profile data
- My Beauty Profile with client-visible Client Memory only
- Beauty Intelligence cards only from real published recommendations
- Product recommendations from active Gloria catalog
- BSS partner recommendation architecture with no private data transfer
- Expanded Profile / preferences / privacy / saved addresses / account management

## Gloria Hub / Team
Existing routes include:
- /hub
- /hub/appointments
- /hub/calendar
- /hub/clients
- /hub/clients/[id]
- /hub/team
- /hub/services
- /hub/products
- /hub/orders
- /hub/settings
- /hub/my-agenda
- /hub/progress
- /hub/messages
- /hub/inquiries

Implemented concepts:
- Protected Hub shell and role-aware navigation
- Owner/admin business views
- Staff routed to Team/My Agenda experience
- Appointments list and status actions
- Calendar Day / Week / Month
- Business Pulse dashboard
- Team overview
- Services management
- Products management
- Orders view
- Appointment Settings
- My Agenda
- My Progress
- Inquiry review inbox for services requiring approval
- Save & Complete / service-specific Client Memory workflow foundations

## Appointments Architecture
Supabase has been extended with:
- appointment metadata fields
- source
- notes_client / notes_internal
- cancelled_at / completed_at / no_show_at
- appointment_settings
- appointment_events
- staff_breaks
- staff_blocks
- availability functions
- first-available search
- server-side booking confirmation
- client reschedule/cancel RPCs
- Hub status/reschedule RPCs
- conflict protection / server-side slot revalidation
- timezone America/New_York
- booking_inquiries for reviewed service requests

Important booking rule:
- instant public booking is limited to blowdry/secado, brows and wax.
- other services create a pending inquiry and must be approved by an authorized team member.

## Client Memory + Beauty Intelligence
Supabase structures include or were extended for:
- client_memory
- client_memory_entries
- client_preferences
- client_photos
- product_catalog
- client_product_recommendations
- beauty_recommendations
- beauty_recommendation_outcomes
- client_value_metrics
- client_segment_rules
- partner_recommendations
- partner_referral_events

Naming:
- Hub: CLIENT MEMORY
- Access: MY BEAUTY PROFILE
- Suggestions: BEAUTY INTELLIGENCE
- Internal segmentation: CLIENT VALUE

Privacy boundary:
- Internal staff notes never appear in Access.
- Only explicitly client-visible memory/photos/recommendations can be read by clients.
- BSS remains a separate brand/database; no silent profile sync.

## Current QA / Deployment State
A GitHub Actions build workflow was added to run install + `npm run build` on main.
Recent production failures were caused mainly by TypeScript inference on Supabase relation joins returning arrays in generated query types. These are being normalized to singular relations in UI code.

Do not claim production is live until:
1. GitHub build check on latest main is SUCCESS.
2. Vercel latest production deployment is READY.
3. Production URL is fetched/checked for expected navigation and key routes.

## Deployment
Vercel project:
- Project ID: prj_gtS1fGMOqchUe5nJxPmKHsZjUrue
- Team ID: team_Y0STY7brxE76TIbPXAksjmrk
- Project name: gloria-beauty-salon
- Domain: www.gloriabeautysalonmiami.com

Supabase:
- Project ref: ferznukzbfvzhjefcrye
- URL: https://ferznukzbfvzhjefcrye.supabase.co

Never place secret keys/tokens in this file or chat.

## Deferred Until Core Product Is Stable
- reminder/rebooking/birthday automation delivery
- compliant SMS appointment notifications (Twilio):
  - provision a dedicated US number and Twilio Messaging Service
  - register Gloria Beauty Salon as an A2P 10DLC Low-Volume Standard Brand/Campaign
  - capture and store explicit SMS consent, source, timestamp and opt-out status for every client
  - never assume imported Vagaro contacts consented unless their consent can be documented
  - send confirmation, reschedule, cancellation, 24-hour reminder and optional 2-hour reminder messages
  - add deposit/payment-link and payment-received notifications when Stripe is connected
  - support STOP, START and HELP and record Twilio delivery callbacks/failures in Supabase
  - show message delivery status in Hub and use email only as a secondary channel when available
- Stripe payments end to end:
  - connect the Gloria Stripe account and production webhooks
  - let clients buy Shop products directly on the site with Stripe Checkout
  - let clients pay for appointments/services directly during booking
  - calculate and collect required service deposits before confirming the appointment
  - save payment, deposit, refund and remaining-balance status in Supabase and show it in Hub/Access
  - enable Memberships / prepaid packages checkout
- advanced generative Beauty Intelligence

## Immediate Next Steps for Any Engineer/Agent
1. Run/inspect latest GitHub build check.
2. Fix any remaining TypeScript/build errors until green.
3. Verify Vercel production deployment is Ready on latest main commit.
4. QA /reservar for instant booking vs inquiry behavior.
5. QA /hub/inquiries approval flow and email delivery.
6. Verify public menu shows Memberships and Hub Access.
7. Complete gallery and homepage refinement after functional QA.
8. Implement and QA the complete Stripe payment block listed above.
9. Provision Twilio, complete A2P 10DLC registration, and implement the compliant SMS notification block listed above.
