# Project Plan

**Status**: Awaiting Integration
**Created**: 2026-10-26
**Mode**: NEW

---

## 1. Project Overview

**Goal**: Build a polished, responsive, single-page luxury wedding invitation for the `wedding-invitation` repository, with a personalized royal-envelope opening, event information, accessible calendar actions, local media, and graceful fallbacks. The project is designed so that every module is independently testable.

**App Type**: Static SPA (frontend only)

**API Login**: No

**Mode**: NEW

**Deployment Plan**: No deployment plan found

---

## 2. Wedding Invitation — frontend

| Component | Technology |
|-----------|-----------|
| **Language** | JavaScript |
| **Framework** | React 18 + Vite |
| **Package Manager** | npm |
| **Test Runner** | vitest |
| **Mocking Library** | vi.mock |
| **Test Command** | npm test |

The frontend is an independently testable static SPA. Use Tailwind CSS, framer-motion, canvas-confetti, and lucide-react; pin React 18. Keep wedding copy and event details in one editable content module. There is no API or runtime service dependency.

---

## 3. Services Required

| Azure Service | Role in App | Environment Variable | Default Value (Local) | Classification |
|---------------|------------|---------------------|----------------------|----------------|
| No Azure services required | Static frontend; publish the built `dist/` output on Netlify Free as specified, with no Azure provisioning | — | — | Essential |

---

## 4. Prerequisites

### Run

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| Node.js | wedding-invitation | ✅ | 22.22.0 |
| npm | wedding-invitation | ✅ | 10.9.4 |

### Debug

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| Chrome | wedding-invitation | ✅ | 155.0.8059.85 |

---

## 5. Design System & UI

**Component Library**: Fluent UI v9
**Style Direction**: An intimate, editorial invitation with a deep ruby envelope, antique-gold details, warm paper surfaces, cinematic photography, and restrained motion. Use generous whitespace, fine borders, soft layered shadows, and compact controls that remain comfortable on touch screens.
**Typography**: Cinzel for ceremonial display type, Plus Jakarta Sans for reading and controls

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#7F2638` | Ruby envelope, invitation actions, and selected navigation |
| `accent`  | `#B58A43` | Foil-like rules, date details, and restrained highlights |
| `surface` | `#FFFDF8` | Warm paper page and invitation surfaces |
| `text`    | `#28231F` | High-contrast ceremony copy and event details |
| `muted`   | `#716A62` | Venue caveats, captions, and secondary labels |
| `border`  | `#E6DCCB` | Fine paper-like dividers and control outlines |

### Pages

| Page | Route | Purpose | Layout |
|------|-------|---------|--------|
| Wedding Invitation | `/` | Present the personalized invitation, reception and muhurtham details, local photo reel, venue search, and calendar reminder actions | `header + nav + hero + main + grid + modal + action-bar + footer` |

### Sample Content

Wedding Invitation — event and venue details:
| Record | Date | Time | Location / state |
|--------|------|------|------------------|
| Reception | Wednesday 18 November 2026 | 6:30-10:00 PM IST | KARNATAKA PATEL BHAWAN, Vijayanagar, Bengaluru |
| Muhurtham | Thursday 19 November 2026 | 9:00-10:30 AM IST | KARNATAKA PATEL BHAWAN, Vijayanagar, Bengaluru |
| Venue | KARNATAKA PATEL BHAWAN | — | 31/10, left of Magadi Main Road, behind Saraswathi Convention Center, Govindaraja Nagar Ward, Stage 1, Vijayanagar, Bengaluru, Karnataka 560079 |

Invitation content: Ajith B & Anjana S. Groom's parents: Balakrishna M and Rani B. Bride's parents: Shivakumar S and Manjula. These names, dates, times, and venue address were supplied by the user. The greeting reads the optional `?to=` value as text and uses a graceful default when absent. Keep content, dates, copy, venue text, media references, and eventual public domain centrally editable.

Static preview state coverage: populated event details are the data state; a media skeleton represents local media loading; the empty-media fallback represents the optional hero video or personal photos not being supplied; and an inline calendar retry state represents a browser/download failure. These are fallback presentations, not a claim that the default invitation is currently failing.

---

## 6. Project Structure

```
wedding-invitation/
├── .azure/
│   ├── requirements.json
│   └── project-plan.md
├── netlify.toml
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── public/
│   ├── bg-music.mp3
│   ├── hero-bg.mp4                 # Optional, only when licensed/provided
│   ├── assets/
│   │   ├── hero-fallback.webp
│   │   ├── story-01.webp
│   │   ├── story-02.webp
│   │   ├── story-03.webp
│   │   └── og-image.jpg            # 1200x630
│   └── media-provenance.md
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── content/
│   │   └── wedding.js
│   ├── components/
│   │   ├── RoyalEnvelope.jsx
│   │   ├── CalendarReminderDialog.jsx
│   │   ├── VinylPlayer.jsx
│   │   ├── EventCountdown.jsx
│   │   └── PhotoReel.jsx
│   ├── pages/
│   │   └── InvitationPage.jsx
│   ├── utils/
│   │   └── calendar.js
│   └── styles/
│       └── index.css
└── tests/
    ├── calendar.test.js
    ├── personalization.test.jsx
    └── invitation.test.jsx
```

---

## 7. Route Definitions

| # | Method | Path | Description | Request Body | Response Body | Status Codes |
|---|--------|------|-------------|-------------|--------------|-------------|
| 1 | GET | `/` | Static invitation SPA; optional `?to=` personalizes the greeting as safely rendered text | — | Invitation shell, event details, and bundled local assets | 200 |

---

## 8. Next Steps

1. Review this plan in the plan preview and approve it before implementation.
2. After approval, hand off to **azure-project-scaffold** to build the static React 18/Vite app, run focused tests and a production build, and start the development server on an available port.
3. Before publication, verify the real couple details, venue address, media licenses/provenance, and public domain; do not deploy or commit as part of this plan.
