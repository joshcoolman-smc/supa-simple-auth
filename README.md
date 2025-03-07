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
│   ├── (auth)/                 # Auth-related routes group
│   │   ├── _components/         # Shared components
│   │   │   ├── submit-button.tsx
│   │   │   └── user-logout-header.tsx
│   │   ├── _lib/               # Utilities
│   │   │   └── validations.ts  # Zod schemas
│   │   ├── _supabase/          # Supabase configuration
│   │   │   ├── client.ts       # Browser client
│   │   │   ├── middleware.ts   # Auth middleware
│   │   │   └── server.ts       # Server client
│   │   └── login/              # Login page
│   │       └── page.tsx
│   └── dashboard/              # Protected dashboard (outside auth group)
│       └── page.tsx
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

2. Copy the auth configuration to your project:

   - `src/app/(auth)` - Core authentication setup:
     - `_components/` - Reusable auth UI components (submit button, logout header)
     - `_lib/` - Form validation schemas
     - `_supabase/` - Supabase client configuration and middleware
     - `login/` - Login page implementation
   - `middleware.ts` (root) - Base middleware for session handling

3. Add environment variables to `.env.local`

4. Start building protected routes!

   The `src/app/dashboard` directory shows an example of how to create a protected route with server-side authentication checks and login redirect. You can use this as a reference, but you don't need to copy it to your project. Instead, apply the same pattern to your own protected routes:

   ```typescript
   // Example protected route
   import { createClient } from "@/app/(auth)/_supabase/server";
   import { redirect } from "next/navigation";

   export default async function ProtectedPage() {
     const supabase = await createClient();
     const { data: { user } } = await supabase.auth.getUser();

     if (!user) {
       return redirect("/login?message=Please sign in to access this page");
     }

     return <div>Your protected content here</div>;
   }
   ```

## Understanding the Middleware

This starter uses two middleware files that work together to handle authentication:

### 1. Root Middleware (`middleware.ts`)

The entry point middleware that Next.js executes for all routes:
```typescript
import { updateSession } from "@/app/(auth)/_supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

- Lives at the root of your project
- Gets automatically executed by Next.js for all matching routes
- Contains a matcher configuration that applies it to all routes except static assets
- Simply imports and calls the `updateSession` function from the Supabase middleware
- Acts as a "connector" that hooks the Supabase auth logic into Next.js's middleware system

### 2. Supabase Middleware (`src/app/(auth)/_supabase/middleware.ts`)

Contains the actual implementation of the authentication logic:
```typescript
export const updateSession = async (request: NextRequest) => {
  // Create Supabase client with cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Cookie management implementation
      }
    }
  );

  await supabase.auth.getUser();
  return response;
};
```

- Lives in the auth-related directory structure
- Exports the `updateSession` function that's imported by the root middleware
- Creates a Supabase server client with cookie handling
- Refreshes the user's session
- Manages authentication cookies

### How They Work Together

1. When a request comes in, Next.js executes the root middleware
2. The root middleware calls `updateSession` from the Supabase middleware
3. The Supabase middleware refreshes the user's session and handles cookies
4. Protected routes perform an additional server-side check:

```typescript
// Example from dashboard/page.tsx
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  return redirect("/login?message=Please sign in to access this page");
}
```

This separation of concerns allows for:
- Clean organization of code (auth logic stays in the auth directory)
- Easy reuse of the Supabase middleware in other projects
- A single entry point for Next.js middleware

## License

MIT
