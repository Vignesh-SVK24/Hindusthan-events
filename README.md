# Hindusthan College Events Hub 🎓
### Central Campus Event Discovery, Bespoke Dynamic Webpages & Real-time Registration Platform

> 🚀 **OFFICIAL LIVE APPLICATION URL:**  
> ### 👉 [https://hindusthan-events-hicet.vercel.app](https://hindusthan-events-hicet.vercel.app)
>
> **Status:** 🟢 **LIVE & PRODUCTION-READY**  
> *(Hosted on Vercel with full-stack Node.js serverless execution, dynamic event routes, authentication, and QR pass generation.)*

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Vignesh-SVK24/hindusthan-events-hicet)

A modern full-stack web application developed for **Hindusthan Educational and Charitable Trust**, Coimbatore. It provides a centralized discovery portal for all college events, an animated college logo opening sequence, dynamically generated independent webpages with bespoke themes, and a strict event-wise registration ON/OFF engine with QR code entry tickets.

---

## 🌟 Key Features

1. **Animated College Logo Zoom-Out Intro**
   - Cinematic zoom-out reveal of the official Hindusthan Educational Trust emblem on first visit.
   - Session-cached to avoid re-triggering during internal navigation, with an instant "Intro" replay button in the navbar.

2. **Independent Dynamic Event Webpages (`/events/[slug]`)**
   - Unique URL generated for every event (e.g. `/events/hack-hindusthan-2026`, `/events/frame-fest-2026`, `/events/yukti-tech-symposium-2026`).
   - Every event has its own independent theme palette (Cyberpunk Green, Festive Magenta, Electric Blue, Sports Arena Orange, Clean Minimal Slate), custom fonts, and background effects.

3. **Event-Wise Registration ON / OFF Engine**
   - **Registration ON:** Displays registration forms, prevents duplicate signups, and issues digital event passes with encrypted verification QR codes.
   - **Registration OFF:** Displays a "Registration Closed" badge and strictly rejects direct API registration attempts with **HTTP 403 Forbidden**.

4. **Admin CMS Console (`/admin`)**
   - Live dashboard analytics (Total Events, Active Registrations, Timeline status).
   - Event creation studio with poster upload preview, schedule timeline builder, and bespoke theme designer.
   - 1-Click instant Registration ON/OFF switch.
   - Participant roster management with instant **CSV spreadsheet export**.

5. **Student Profile (`/profile`)**
   - Personal registration history with digital entry passes and scannable QR tickets.

---

## 🌐 Live Web Addresses

- **Production Live URL (Vercel):** [https://hindusthan-events-hicet.vercel.app](https://hindusthan-events-hicet.vercel.app)
- **GitHub Repository:** [https://github.com/Vignesh-SVK24/hindusthan-events-hicet](https://github.com/Vignesh-SVK24/hindusthan-events-hicet)

---

## 🚀 Run Locally

```bash
git clone https://github.com/Vignesh-SVK24/hindusthan-events-hicet.git
cd hindusthan-events-hicet
npm install
npm run build
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@hindusthan.net` | `admin123` | Full CMS privileges, event theme customizer, registration toggles, CSV exports |
| **Student** | `student@hindusthan.net` | `student123` | Browse events, register online, view and download QR ticket passes |

*(Or use the 1-click **⚡ Admin Demo** and **⚡ Student Demo** buttons directly on the navbar & login page)*

---

## 🛠️ Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Spatial UI design system)
- **Animations:** Framer Motion, Canvas Confetti
- **Icons:** Lucide React
- **QR Engine:** QRCode
- **Storage & Database:** File-backed persistent JSON engine with atomic transactional writes and pre-seeded college categories and events.
