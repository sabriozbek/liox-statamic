# LioX Frontend

Modern React frontend for LioXERP marketing website with Statamic CMS backend.

## Tech Stack

- **Framework**: React 19 + Vite 6
- **Routing**: React Router 7
- **Styling**: TailwindCSS 4
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **i18n**: react-i18next

## Project Structure

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── forms/
│   │   │   ├── LeadForm.tsx
│   │   │   ├── AssessmentForm.tsx
│   │   │   └── AppointmentForm.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   └── sections/
│   │       ├── Hero.tsx
│   │       ├── ModulesGrid.tsx
│   │       └── Testimonials.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── ErpPage.tsx
│   │   ├── SectorLanding.tsx
│   │   ├── ModuleDetail.tsx
│   │   ├── BlogIndex.tsx
│   │   └── BlogPost.tsx
│   ├── hooks/
│   │   ├── useLeadForm.ts
│   │   ├── useAssessmentForm.ts
│   │   └── useApi.ts
│   ├── services/
│   │   └── api.ts
│   ├── stores/
│   │   ├── popupStore.ts
│   │   └── variantStore.ts
│   ├── i18n/
│   │   └── locales/
│   │       └── tr.json
│   ├── lib/
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── App.tsx
│   └── main.tsx
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

```env
VITE_API_URL=http://localhost:8000/api
VITE_SITE_URL=http://localhost:3000
VITE_GA_MEASUREMENT_ID=
VITE_HOTJAR_ID=
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/crm/lead` | Submit lead form |
| POST | `/api/assessment` | Submit needs assessment |
| POST | `/api/appointment` | Book appointment |

## Development

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Format code
npm run format