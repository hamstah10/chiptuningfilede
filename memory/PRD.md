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
- [x] Credits page with balance and packages
- [x] Orders history table
- [x] Profile page with tabs (personal, company, API)
- [x] Language toggle (DE/EN)
- [x] Dark theme with red/black/grey colors
- [x] Phosphor icons, Exo 2 + IBM Plex Sans fonts
- [x] Price List page (PKW/LKW tabs, stages, gearbox, options)

### New Order Combined (Feb 2026)
- [x] Combined Step 2+3 wizard: 2-column layout (left: stage buttons, right: performance data)
- [x] Dyno chart, options grid, gearbox stages, credits total
- [x] Step 3 review with cost summary
- [x] Sidebar + Header navigation linked to /new-order

### Configurator (Feb 2026)
- [x] Vehicle type selector (PKW, LKW, Motorrad, Agrar, Jetski, Andere)
- [x] 4-level cascading dropdowns (Hersteller/Baureihe/Modell/Motor)
- [x] ECU display, Dyno chart, Performance bars, Tuning stages, Gearbox stages, Options grid

### File Wizard (Feb 2026)
- [x] Step 1: File Upload & Lesegerät (tool selection, method/type toggles, master/slave, priority)
- [x] Step 2: Fahrzeugauswahl (regex filename parsing, cascading dropdowns, fuzzy matching, "Übernehmen" button)
- [x] Step 2: Leistungsdaten-Anzeige mit Recharts-Charts (PS + Nm Balkendiagramm, Stage 1/2 Vergleich, Tuning-Optionen Vorschau)
- [x] Step 3: Optionen (tuning stage cards, additional options grid, gearbox-specific sub-stages with warning note, credit calculation)
- [x] Step 4: Übersicht (Review-Seite mit Zusammenfassung aller Steps, Kostenaufstellung, Bearbeiten-Links, Absenden-Button)

### Backend
- Nothing yet (server.py exists but empty logic)

## Prioritized Backlog

### P0 (Critical - Next)
- File Wizard Step 4 "Übersicht" (Review page)
- Backend MongoDB CRUD (Users, Orders, Tickets, Invoices)
- Frontend ↔ Backend integration (replace mocked data)

### P1 (High)
- Symfony API Authentication Integration
- PayPal payment integration for credits
- File upload/download to backend storage

### P2 (Medium)
- Invoice PDF Generator
- Real-time order status updates
- Notifications system
- FileWizard.jsx refactoring (split into components)

## Architecture
```
/app/
├── backend/
│   ├── server.py              
│   └── requirements.txt
├── frontend/
│   ├── public/logos/          # Tuning tool brand logos
│   └── src/
│       ├── components/        # Shared UI components
│       ├── pages/             # All page components
│       │   ├── FileWizard.jsx # Multi-step wizard (1570+ lines)
│       │   ├── PriceList.jsx  # Pricing reference
│       │   └── ...            # Dashboard, Orders, Tickets, etc.
│       └── index.css          
```

## Key Design Tokens
- Primary Red: #8B2635
- Fonts: Exo 2 (headings), IBM Plex Sans (body)
- Icons: Phosphor Icons (@phosphor-icons/react)
- Style: Technical, carbon fiber, dark theme
