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

## What's Been Implemented (Jan 2026)
- [x] Dashboard layout with sidebar navigation
- [x] Dashboard overview with stats (credits, orders, files, spent)
- [x] Recent activity feed
- [x] Quick actions panel
- [x] Chiptuning Configurator with vehicle/tuning selection
- [x] File Wizard placeholder (4-step wizard UI)
- [x] Credits page with balance and packages
- [x] Orders history table
- [x] Profile page with tabs (personal, company, API)
- [x] Language toggle (DE/EN)
- [x] Dark theme with red/black/grey colors
- [x] Phosphor icons for technical aesthetic
- [x] Exo 2 + IBM Plex Sans fonts

## Prioritized Backlog

### P0 (Critical - Next)
- File Wizard implementation (detailed steps per user requirements)
- External API authentication integration
- Backend API for credits, orders, user data

### P1 (High)
- PayPal payment integration
- Real-time order status updates
- File download functionality

### P2 (Medium)
- Notifications system
- Mobile responsive improvements
- Search functionality

## Next Tasks
1. Get File Wizard specifications from user
2. Implement authentication API connection
3. Build backend CRUD for credits/orders
4. Integrate PayPal for credit purchases
