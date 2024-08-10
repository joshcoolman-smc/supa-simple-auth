![Screenshot of the app](public/screenshots.png)

# Next.js Supabase Auth Starter
### Minimal version of the supabase auth next js starter without signup. Intended for creating a quick authenticated admin area for a next project.


## Local Setup

1. Install dependencies:
   ```
   pnpm i
   ```

2. Save `.env.local.example` as `.env.local` file in the root directory and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```
   

3. Run 
   ```
   pnpm run dev
   ```

## Copying project files from this repo to existing project

1. Install Deps
   ```
   % pnpm i @supabase/ssr @supabase/supabase-js
   ```
2. Copy middleware.ts from project root to project root of existing Next JS project
3. Copy (supa-simple-auth) dir to the app dir of existing project
4. Add supabase environment variables to .env.local
   ```
   NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```
5. Create new user/password from the supabase admin 
6. Run the app locally
   ```
   pnpm run dev
   ```
7. Go to http://localhost:3000/login and log in with your user creds. You will be directed to http://localhost:3000/dashboard
8. Do what you want with it