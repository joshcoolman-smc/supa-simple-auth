# Implementing Supabase Authentication in Next.js with Middleware

This guide walks you through implementing Supabase authentication in a fresh Next.js 14+ application using the App Router.

## Initial Setup

First, create a new Next.js project with the App Router:

```bash
npx create-next-app@latest my-auth-app --typescript --tailwind --eslint --app --src-dir
```

Your project structure should look like this:

```
your-app/
├── src/
│   ├── app/
│   │   ├── (auth)/               # Group for auth-related routes
│   │   │   ├── _components/      # Shared auth components
│   │   │   ├── _supabase/       # Supabase client setup
│   │   │   ├── login/           # Login page
│   │   │   └── dashboard/       # Protected dashboard
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── middleware.ts            # Root middleware
├── .env.local                   # Environment variables
└── package.json
```

## Prerequisites

1. A fresh Next.js 14+ project with App Router and src directory
2. A Supabase account and project
3. Your Supabase project URL and anon key

## Installation

Install the required dependencies:

```bash
npm install @supabase/ssr
```

## Implementation Steps

### 1. Environment Setup

Create a `.env.local` file in your project root with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Create Supabase Clients

Create the following directory structure:
```
src/app/(auth)/_supabase/
```

#### Server Client (server.ts)
Create a server-side Supabase client that handles cookies properly:

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return await cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};
```

#### Browser Client (client.ts)
Create a browser-side Supabase client:

```typescript
import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
```

### 3. Set Up Middleware

Create a `middleware.ts` file in your project root:

```typescript
import { type NextRequest } from "next/server";
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

Create the middleware helper (middleware.ts in _supabase folder):

```typescript
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();

  return response;
};
```

### 4. Create Authentication Components

#### Submit Button Component
Create a client-side submit button component:

```typescript
"use client";
import { useFormStatus } from "react-dom";
import { type ComponentProps } from "react";

type Props = ComponentProps<"button"> & {
  pendingText?: string;
};

export function SubmitButton({ children, pendingText, className = "", ...props }: Props) {
  const { pending, action } = useFormStatus();
  const isPending = pending && action === props.formAction;

  return (
    <button
      {...props}
      type="submit"
      disabled={pending}
      className={`w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isPending ? pendingText : children}
    </button>
  );
}
```

#### Login Page
Create a login page with email/password authentication:

```typescript
import { createClient } from "@/app/(auth)/_supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "../_components/submit-button";
import Link from "next/link";
import { loginSchema } from "../_lib/validations";

export default async function Login({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const result = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!result.success) {
      const errorMessage = result.error.issues
        .map((issue) => issue.message)
        .join(", ");
      return redirect(`/login?message=${encodeURIComponent(errorMessage)}`);
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: result.data.email,
      password: result.data.password,
    });

    if (error) {
      return redirect(`/login?message=${encodeURIComponent(error.message)}`);
    }
    return redirect("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center pt-24">
      <form>
        <div className="flex flex-col gap-6 rounded bg-white/10 p-8 w-[350px]">
          <input
            className="rounded px-4 py-2 bg-inherit border"
            name="email"
            placeholder="Email"
            required
          />
          <input
            className="rounded px-4 py-2 bg-white/10 border"
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <SubmitButton
            formAction={signIn}
            className="bg-green-700 rounded px-4 py-2 font-bold"
            pendingText="Signing In..."
          >
            Sign In
          </SubmitButton>
        </div>
      </form>
      {searchParams["message"] && (
        <p className="mt-4 p-4 text-red-300 text-center">
          {searchParams["message"]}
        </p>
      )}
    </div>
  );
}
```

### 5. Protected Routes

Create a protected dashboard page:

```typescript
import { createClient } from "@/app/(supa-simple-auth)/_supabase/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div>
      <h1>Protected Dashboard</h1>
      <p>Welcome {user.email}</p>
    </div>
  );
}
```

## Usage

1. Users can sign in through the login page
2. Protected routes will automatically redirect to login if not authenticated
3. Middleware handles session refresh automatically
4. Use the Supabase client in server components with:
   ```typescript
   const supabase = await createClient();
   ```

## Security Notes

1. Always validate user authentication state on the server side
2. Use environment variables for Supabase credentials
3. Implement proper error handling
4. Consider adding CSRF protection
5. Use proper password policies in Supabase Auth settings

## Testing

1. Create a test user in Supabase Authentication dashboard
2. Test login flow
3. Test protected routes
4. Test session persistence
5. Test logout functionality

Remember to handle errors appropriately and add loading states for better user experience.
