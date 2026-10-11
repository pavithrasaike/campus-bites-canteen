# Campus Bites — College Canteen Ordering App

A responsive React + Vite mobile-first web app created for E-Business Management Assignment 2.

## Features
- Searchable menu and category filters
- Add/remove items, cart totals, and 10% demo coupon (`CAMPUS10`)
- Checkout with student name/ID, pickup slot, and simulated payment choice
- Order confirmation and status timeline
- Customer ratings and feedback
- Mobile-responsive layout
- Orders and feedback saved in local browser storage

## Run locally
Requires Node.js 18+.

```bash
npm install
npm run dev
```
Open the local URL printed by Vite, usually http://localhost:5173.

## Deploy on Vercel
1. Create a new GitHub repository named `campus-bites-canteen`.
2. Upload all files/folders from this project to the repository root (not the zip file itself).
3. Open https://vercel.com and sign in with GitHub.
4. Select **Add New → Project**, import `campus-bites-canteen`.
5. Vercel should detect Vite. Use:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. Click **Deploy** and wait for the build to finish.
7. Open the generated `https://....vercel.app` URL on a phone and test the flows.

## Important prototype limits
- Checkout is simulated; no real money is collected and no payment gateway is connected.
- Menu and prices are demo data; replace them with verified canteen details.
- Orders/feedback are stored only in the current browser's local storage, not shared with an admin or across devices.
- Canteen open/closed status and order statuses are demonstration UI, not connected to a real canteen.
- For real use, add an authenticated backend/database, server-side validation, privacy notice, and a real payment gateway.

## Suggested user test
Ask 3 classmates to try: (1) search/filter a product, (2) add items and apply CAMPUS10, (3) complete a demo checkout, (4) find the order under My orders, and (5) submit feedback. Record their actual feedback and changes; do not invent survey results.
