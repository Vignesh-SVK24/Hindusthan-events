# Hindusthan College of Engineering and Technology — Events & Discovery Hub 🎓
### Central Campus Event Discovery, Bespoke Dynamic Webpages & Real-time Registration Platform

> 🚀 **OFFICIAL LIVE APPLICATION URL:**  
> ### 👉 [https://hindusthan-events-hicet.vercel.app](https://hindusthan-events-hicet.vercel.app)
>
> **Status:** 🟢 **LIVE & PRODUCTION-READY**  
> *(Hosted on Vercel with full-stack Node.js serverless execution, dynamic event routes, admin password authentication, and QR pass generation.)*

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Vignesh-SVK24/hindusthan-events-hicet)

A modern full-stack web application developed for **Hindusthan College of Engineering and Technology (HiCET)** under **Hindusthan Educational and Charitable Trust**, Coimbatore. It provides a centralized discovery portal for all college events, an animated college logo opening sequence, dynamically generated independent webpages with bespoke themes, and a strict event-wise registration ON/OFF engine with QR code entry tickets.

---

## 🌟 Key Architecture & Features

1. **Animated College Logo Zoom-Out Intro**
   - Cinematic zoom-out reveal of the official Hindusthan Educational Trust emblem on first visit.
   - Session-cached to avoid re-triggering during internal navigation, with an instant "Intro" replay button in the navbar.

2. **Public Event Discovery & Dynamic Webpages (`/events/[slug]`)**
   - Unique URL generated for every event (e.g. `/events/hack-hindusthan-2026`, `/events/frame-fest-2026`, `/events/yukti-tech-symposium-2026`).
   - Every event has its own independent theme palette (Cyberpunk Green, Festive Magenta, Electric Blue, Sports Arena Orange, Clean Minimal Slate), custom typography, and ambient graphics.
   - Public visitors can browse all events, venues, schedules, and coordinators freely without any login.

3. **Open Registration with Instant QR Code Tickets**
   - **Registration ON:** Any student or attendee can register directly by filling out their name, email, register number, department, and contact number. Confirmed registrations instantly receive a scannable digital entry ticket pass with dynamic QR code.
   - **Registration OFF:** Displays a "Registration Closed" badge and strictly rejects direct API registration attempts with **HTTP 403 Forbidden**.

4. **Single Admin-Only Authentication (`/login`)**
   - Single clean login screen strictly for college administrators.
   - Password-verified on the server using constant-time cryptographic comparison.
   - Brute-force rate limiting and lockout protection.
   - Cryptographically signed HMAC SHA-256 session tokens stored in secure HTTP-only cookies.
   - Protected Admin CMS (`/admin`) for publishing events, uploading posters, editing themes, toggling registration ON/OFF, and exporting CSV rosters.

5. **AIML Event Archives (`/event-archives`)**
   - Official historical registry showcasing events, workshops, technical sessions, and seminars conducted by the Department of Artificial Intelligence and Machine Learning (AIML).
   - Authoritative source documentation: `2025-2026 AIML EVENT DETAILS CONSOLIDATED.docx`.
   - Exact preservation of original event titles, dates, resource persons, faculty coordinators, and original numbering irregularities.
   - High-resolution event photographs and GPS geo-tagged field verification photos.
   - Dedicated dynamic historical pages (`/event-archives/[slug]`) strictly separated from live upcoming events.
   - Comprehensive Admin CMS management under "Manage Event Archives".

---

## 🏛️ Departmental Initiative & Attribution

- **Organized by:** Department of Artificial Intelligence and Machine Learning (AIML)
- **Website Developed and managed by Vignesh S - AIML**

---

## 🌐 Live Web Addresses

- **Production Live URL (Vercel):** [https://hindusthan-events-hicet.vercel.app](https://hindusthan-events-hicet.vercel.app)
- **GitHub Repository:** [https://github.com/Vignesh-SVK24/hindusthan-events-hicet](https://github.com/Vignesh-SVK24/hindusthan-events-hicet)

---

## 🚀 Run Locally

```bash
git clone https://github.com/Vignesh-SVK24/hindusthan-events-hicet.git
cd hindusthan-events-hicet
cp .env.example .env.local
npm install
npm run build
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Spatial UI design system)
- **Animations:** Framer Motion, Canvas Confetti
- **Icons:** Lucide React
- **QR Engine:** QRCode
- **Security:** Server-only HMAC SHA-256 signed session cookies, constant-time comparison, brute-force rate limiter
- **Storage & Database:** File-backed persistent JSON engine with atomic transactional writes and pre-seeded college categories and events.
