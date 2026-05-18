# NeXlab Edu Hub

India's first immersive learning platform delivering next-level, hands-on educational experiences through VR, AR, AI tutors, and AVGC studios.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Form Validation**: Zod
- **State Management**: React Query (TanStack Query)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-org/nexlab-eduhub.git
cd nexlab-eduhub
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` and add your Google Sheets Web App URL (see [Google Sheets Integration](#google-sheets-integration)).

4. Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page
│   ├── not-found.tsx       # 404 page
│   ├── sitemap.ts          # SEO sitemap
│   └── robots.ts           # SEO robots.txt
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   ├── HomePage.tsx        # Main landing page content
│   ├── RegisterModal.tsx   # Registration form modal
│   ├── Providers.tsx       # App providers (React Query, Tooltip)
│   └── StructuredData.tsx  # JSON-LD structured data
├── lib/                    # Utility functions
│   ├── utils.ts            # Tailwind merge utility
│   ├── rateLimit.ts        # In-memory API rate limiting
│   ├── registrationSchema.ts  # Shared Zod validation
│   └── submitRegistrationToSheet.ts  # Registration API client
├── app/api/register/       # Registration API (rate limit, validation)
├── hooks/                  # Custom React hooks
├── public/                 # Static assets
│   └── images/             # Image assets
├── scripts/                # Utility scripts
│   └── google-apps-script-append-row.gs  # Google Apps Script
└── styles/                 # Global styles
```

## Google Sheets Integration

This project can save registration data to Google Sheets via Google Apps Script.

### Setup

1. Create a new Google Sheet
2. Go to Extensions > Apps Script
3. Copy the contents of `scripts/google-apps-script-append-row.gs`
4. Deploy as a Web App (Execute as: Me, Who has access: Anyone)
5. Copy the deployment URL to your `.env` file (server-only — do not use `NEXT_PUBLIC_`):

```
GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

6. (Recommended) Set `REGISTRATION_API_SECRET` in both `.env` and Apps Script **Script properties** so only your server can append rows.

### Registration API security

`POST /api/register` is protected with:

- In-memory rate limiting (default: 5 requests / 15 minutes per IP)
- Server-side Zod validation
- Honeypot and minimum fill-time checks
- 8KB body size limit

`GET /api/register` returns `{ configured: boolean }` without exposing the Sheets URL.

**Note:** In-memory rate limits reset on restart and do not sync across multiple serverless instances. For high-traffic production on Vercel, consider [Upstash Redis](https://upstash.com/) later.

## SEO Features

- Server-side rendering for better SEO
- Metadata API with Open Graph and Twitter cards
- Dynamic sitemap generation
- Structured data (JSON-LD) for organization and courses
- Optimized images with `next/image`

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run tests

## License

Private - All rights reserved by NeXlab Edu Hub.
