# Chiptuningfile.de Portal PRD

## Original Problem Statement
Build a dashboard for Tuningfiles portal for Chiptuningfile.de (tuning files dealer). Customer-facing portal with technical, carbon, modern design. Colors: red, black, grey.

## User Personas
- **Customers**: Car enthusiasts, mechanics, tuning shops who purchase tuning files
- **Super Admin**: Manages users via external EasyAdmin/Symfony portal

## Core Requirements (Static)
- Bilingual support (German/English)
- Technical automotive design aesthetic
- Authentication via external super admin API
- Credits system for file purchases
- PayPal payment integration (planned)

## What's Been Implemented

### UI/Frontend (Jan-Feb 2026)
- [x] Dashboard layout with sidebar navigation
- [x] Dashboard overview with stats (credits, orders, files, spent)
- [x] Recent activity feed & Quick actions panel
- [x] Chiptuning Configurator with vehicle/tuning selection
- [x] Orders history table
- [x] Profile page with tabs (personal, company, API)
- [x] Language toggle (DE/EN)
- [x] Dark theme with red/black/grey colors
- [x] Phosphor icons, Exo 2 + IBM Plex Sans fonts
- [x] Price List page (PKW/LKW tabs, stages, gearbox, options)

### Credits Kaufen Page (Mar 2026)
- [x] 10 credit packages (10-5000 Credits) with exact pricing from production
- [x] 3-column card grid with badges (BESTSELLER, AM BELIEBTESTEN, TOP DEAL)
- [x] Purchase sidebar (right) with package selection, price breakdown, buy button
- [x] Old price display (crossed out) for 1000 Credits package
- [x] Per-file pricing for 2000+ credit packages
- [x] Benefits info card

### New Order Combined (Feb 2026)
- [x] Combined Step 2+3 wizard: 2-column layout (left: stage buttons, right: performance data)
- [x] Dyno chart, options grid, gearbox stages, credits total
- [x] Step 3 review with cost summary
- [x] Submit → redirects to Live Order Tracking

### Order Live Tracking (Mar 2026)
- [x] Real-time animated status timeline after order submission
- [x] Phases: Datei empfangen → WinOLS Prüfung → Match/No Match → Auto/Support → Done
- [x] Two paths: AUTO (WinOLS match → auto-created → download) or SUPPORT (manual handling)
- [x] Global progress bar animation (red → green)
- [x] Order summary sidebar (vehicle, tuning, file info)
- [x] Download button on auto-completion, support info on manual path
- [x] Connected to both FileWizard and NewOrderCombined submit buttons

### E-Mail Templates (Mar 2026)
- [x] 6 templates: Auftragsbestätigung, File fertig, Support-Übernahme, Credits gekauft, Rechnung, Willkommen
- [x] Preview mode (rendered HTML in iframe) and HTML Code mode (raw code)
- [x] Copy-to-clipboard functionality
- [x] Design matches portal (red/black/grey, #8B2635)
- [x] Sidebar menu item "E-Mail Templates"

### Configurator (Feb 2026)
- [x] Vehicle type selector (PKW, LKW, Motorrad, Agrar, Jetski, Andere)
- [x] 4-level cascading dropdowns (Hersteller/Baureihe/Modell/Motor)
- [x] ECU display, Dyno chart, Performance bars, Tuning stages, Gearbox stages, Options grid

### File Wizard (Feb 2026)
- [x] Step 1: File Upload & Lesegerät
- [x] Step 2: Fahrzeugauswahl with cascading dropdowns
- [x] Step 2: Leistungsdaten with Recharts charts
- [x] Step 3: Optionen (tuning stages, options, gearbox, credit calculation)
- [x] Step 4: Übersicht (review + submit → order-live)

### Backend
- Nothing yet (server.py exists but empty logic)

## Prioritized Backlog

### P0 (Critical - Next)
- Backend MongoDB CRUD (Users, Orders, Tickets, Invoices)
- Frontend ↔ Backend integration (replace mocked data)
- Symfony API Authentication Integration

### P1 (High)
- PayPal payment integration for credits
- File upload/download to backend storage
- Code deduplication (vehicleData/ecuData into shared lib/data.js)

### P2 (Medium)
- Invoice PDF Generator
- Real-time order status updates (WebSocket)
- Notifications system
- FileWizard.jsx refactoring (split into components)

## Architecture
```
/app/
├── backend/
│   ├── server.py              
│   └── requirements.txt
├── frontend/
│   ├── public/logos/
│   └── src/
│       ├── components/
│       │   ├── layout/        # DashboardLayout, Sidebar, Header
│       │   └── ui/            # Shadcn UI components
│       ├── pages/
│       │   ├── FileWizard.jsx
│       │   ├── NewOrderCombined.jsx
│       │   ├── OrderLive.jsx
│       │   ├── Configurator.jsx
│       │   ├── Credits.jsx
│       │   ├── EmailTemplates.jsx
│       │   ├── PriceList.jsx
│       │   ├── Dashboard.jsx
│       │   ├── OrdersNew.jsx
│       │   ├── OrderDetail.jsx
│       │   ├── Invoices.jsx
│       │   ├── Tickets.jsx
│       │   ├── TicketDetail.jsx
│       │   └── Profile.jsx
│       ├── context/
│       └── index.css          
```

## Key Design Tokens
- Primary Red: #8B2635
- Fonts: Exo 2 (headings), IBM Plex Sans (body)
- Icons: Phosphor Icons (@phosphor-icons/react)
- Style: Technical, carbon fiber, dark theme
