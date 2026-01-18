# SubTrack Frontend

> Modern React Dashboard for Subscription & Billing Management

![Stack](https://img.shields.io/badge/Stack-React%20%7C%20TypeScript%20%7C%20Vite%20%7C%20Tailwind-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Quick Start

```bash
# From root directory (SubTrack_System)
docker-compose -f docker-compose.dev.yml up -d
```

**Frontend URL:** http://localhost:5173

## Features

- 🔐 **Authentication** - Login, Register, Forgot Password, 2FA
- 📊 **Dashboard** - Analytics and subscription overview
- 👥 **User Management** - Team members and organization settings
- 💳 **Billing** - Subscription plans, invoices, payment methods
- 🔔 **Notifications** - Real-time alerts and preferences
- ⚙️ **Settings** - Profile and application configuration

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + Radix UI
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Project Structure

```
SubTrack_frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/            # shadcn/ui components
│   │   └── layout/        # Header, Sidebar, etc.
│   ├── contexts/          # React contexts (Auth, Theme)
│   ├── lib/               # API services & utilities
│   ├── pages/             # Route page components
│   └── hooks/             # Custom React hooks
├── public/                # Static assets
├── docs/                  # Frontend documentation
├── vite.config.ts         # Vite configuration
└── tailwind.config.ts     # Tailwind configuration
```

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test
```

## Environment Variables

Environment variables are configured in the Docker container:

| Variable       | Description             | Default                   |
| -------------- | ----------------------- | ------------------------- |
| `VITE_API_URL` | Backend API Gateway URL | `http://api-gateway:3000` |

## API Integration

All API calls go through the Vite proxy to the API Gateway:

```typescript
// Frontend makes requests to /api/*
fetch('/api/v1/auth/login', { ... })

// Vite proxies to the API Gateway
// /api/* → http://api-gateway:3000/api/*
```

## Pages

| Route              | Description            |
| ------------------ | ---------------------- |
| `/login`           | User login             |
| `/register`        | New user registration  |
| `/forgot-password` | Password reset request |
| `/dashboard`       | Main dashboard         |
| `/users`           | User management        |
| `/organizations`   | Organization settings  |
| `/billing`         | Subscription & plans   |
| `/invoices`        | Invoice history        |
| `/notifications`   | Notification center    |
| `/settings`        | User settings          |

## License

MIT
