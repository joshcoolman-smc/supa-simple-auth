# Next.js Supabase Auth Starter

A minimal authentication starter for Next.js 14+ using Supabase Auth. Built with zero component libraries and minimal dependencies for easy implementation in any project. This starter is designed for quickly adding an authenticated admin area to your Next.js project, focusing only on email/password login (no signup flow included).

## Features

- 🔒 Email/Password Authentication
- 🛡️ Protected Routes with Middleware
- 🔄 Server-Side Session Handling
- ⚡ Fast Page Transitions
- 🎨 Clean UI with Pure Tailwind CSS (No Component Libraries)
- 📝 Form Validation with Zod
- 🎯 Minimal Dependencies

## Project Structure

```
src/
├── app/
│   └── (auth)/                 # Auth-related routes group
│       ├── _components/         # Shared components
│       │   ├── submit-button.tsx
│       │   └── user-logout-header.tsx
│       ├── _lib/               # Utilities
│       │   └── validations.ts  # Zod schemas
│       ├── _supabase/          # Supabase configuration
│       │   ├── client.ts       # Browser client
│       │   ├── middleware.ts   # Auth middleware
│       │   └── server.ts       # Server client
│       ├── dashboard/          # Protected dashboard
│       │   └── page.tsx
│       └── login/              # Login page
│           └── page.tsx
└── middleware.ts               # Root middleware
```

## How It Works

1. **Authentication Flow**:
   - Users can only log in (no signup)
   - Protected routes redirect to login if not authenticated
   - Session handling via Supabase middleware
   - Automatic token refresh

2. **Security Features**:
   - Server-side authentication checks
   - Form validation with Zod
   - Secure session management
   - Protected API routes

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Create `.env.local` from `.env.local.example`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```

3. Set up Supabase:
   - Create a new project in Supabase
   - Enable Email auth in Authentication settings
   - Create users via Supabase dashboard (no signup flow included)

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Visit http://localhost:3000/login to test the auth flow

## Adding to Existing Project

1. Install required dependencies:
   ```bash
   pnpm add @supabase/ssr @supabase/supabase-js zod
   ```

2. Copy these directories to your project:
   - `src/app/(auth)`
   - `middleware.ts` (root)

3. Add environment variables to `.env.local`

4. Start using protected routes with Supabase auth!

## License

MIT
