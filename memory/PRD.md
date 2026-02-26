# FSS Akademi - Product Requirements Document

## Original Problem Statement
Ultra-premium, elite educational website for "FSS Akademi" with MasterClass + Synthesis.is hybrid design aesthetic.

## User Personas
1. **Academics & Researchers**: Lisans, Lisansüstü öğrencileri ve akademisyenler (MAXQDA, TÜBİTAK, Erasmus projeleri)
2. **Institutions**: Özel okullar ve eğitim kurumları
3. **Parents**: İlkokul ve ortaokul velileri
4. **Students**: İlkokul, ortaokul, lise öğrencileri (LGS, TYT, AYT, DGS, KPSS, ALES)

## Core Requirements (Static)
- Single-page landing website
- Turkish content only
- MasterClass dark/premium aesthetic + Synthesis.is modern layout
- Playfair Display + Manrope typography
- Navy/Gold for Academic side, Amber/Orange for Student side
- Web3Forms contact integration
- Social media links (YouTube, Instagram, X, LinkedIn, TikTok)

## Tech Stack
- Frontend: React 19 + Tailwind CSS + Shadcn/UI Accordion
- Backend: FastAPI (Python)
- Database: MongoDB
- Contact Form: Web3Forms API
- Typography: Google Fonts (Playfair Display, Manrope, Space Grotesk)

## What's Been Implemented

### Phase 1 - Core Site (Jan 2026)
- [x] Hero section with FSS logo, "Biz Kimiz?" heading, description text
- [x] 50/50 Split-screen services layout
- [x] Left side: Academic & Corporate services with glassmorphism accordions
- [x] Right side: Parents & Students services with white glassmorphism cards
- [x] Contact form with Web3Forms (access_key: c872519d-1773-45ee-9b8a-e3fce5c1ffcf)
- [x] Footer with all 5 social media icons
- [x] Parallax scroll, floating elements, smooth animations
- [x] Responsive design (mobile-friendly)
- [x] Custom typography (Playfair Display, Manrope)
- [x] Sticky navigation header with logo, nav links, CTA button
- [x] WhatsApp integration (05436619340) - floating button + CTA buttons
- [x] SEO meta tags (Turkish, Open Graph, Twitter Cards)
- [x] Mobile hamburger menu

### Phase 2 - CMS & Admin Panel (Jan-Feb 2026)
- [x] Full CMS: dynamic content from MongoDB via APIs
- [x] Admin panel V1 at /admin with login (admin/admin123)
- [x] CRUD for Services, Custom Sections
- [x] Media/file upload support
- [x] Comprehensive Admin Panel with sidebar layout
- [x] Dashboard: Summary cards (Content, Messages, Views, Teachers) + Recent tables
- [x] Education/Content Module: Full CRUD for blog/education content
- [x] Site General Settings: Contact info, social media links, logo/favicon
- [x] Inbox: View/manage contact form messages, read/unread status, reply
- [x] Security Settings: Update admin credentials

### Phase 3 - Öğretmenlerimiz (Feb 2026)
- [x] Teachers (Öğretmenlerimiz) section on homepage
- [x] Full CRUD management from admin panel
- [x] Teacher cards with photo, name, title, bio
- [x] Active/passive toggle for visibility on site
- [x] Default teacher seeded: Fatih Selim Sellüm

## Key DB Collections
- `admin_settings`: Admin credentials
- `about_section`: About us content
- `services`: Service accordion items (academic/student)
- `custom_sections`: Custom content sections
- `contents`: Blog/education content with views tracking
- `messages`: Contact form submissions (read/unread)
- `site_settings`: Global site configuration
- `teachers`: Teacher profiles

## Key API Endpoints
- POST /api/admin/login - Admin authentication
- GET/PUT /api/admin/settings - Admin credentials
- GET /api/dashboard/stats - Dashboard summary (totalContents, unreadMessages, totalViews, totalTeachers)
- GET/PUT /api/about - About section
- GET/POST/PUT/DELETE /api/services - Services CRUD
- GET/POST/PUT/DELETE /api/custom-sections - Custom sections CRUD
- GET/POST/PUT/DELETE /api/contents - Content/blog CRUD
- GET/POST/PUT/DELETE /api/messages - Messages CRUD
- GET/PUT /api/site-settings - Site settings
- GET/POST/PUT/DELETE /api/teachers - Teachers CRUD
- GET /api/teachers/active - Public active teachers

## Admin Credentials
- Username: admin
- Password: admin123
- URL: /admin

## Prioritized Backlog
### P1 (High Priority)
- Loading animations/skeleton screens
- Image optimization (lazy loading)
- Google Analytics integration

### P2 (Medium Priority)
- Blog/News section on homepage
- Course detail pages
- Testimonials section
- FAQ section

### P3 (Low Priority)
- Multi-language support
- Dark/Light mode toggle
- Newsletter subscription
- Pricing tables

## 3rd Party Integrations
- Web3Forms: Contact form (key: c872519d-1773-45ee-9b8a-e3fce5c1ffcf)
- WhatsApp: Click-to-chat (905309482654)
- Google Fonts: Playfair Display, Manrope, Space Grotesk
- Lucide React: Icon library
