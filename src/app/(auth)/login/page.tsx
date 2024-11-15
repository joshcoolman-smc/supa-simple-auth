import { createClient } from "@/app/(auth)/_supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "../_components/submit-button";
import Link from "next/link";

export default async function Login({
  searchParams,
}: {
  searchParams: { message?: string | string[] };
}) {
  const supabase = await createClient();

  // Check if user is already logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/dashboard");
  }

  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return redirect("/login?message=Please provide both email and password");
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect(`/login?message=${encodeURIComponent(error.message)}`);
    }

    return redirect("/dashboard");
  };

  const params = await searchParams;
  const message = params?.message
    ? Array.isArray(params.message)
      ? params.message[0]
      : params.message
    : null;

  return (
    <div className="w-full flex flex-col justify-center items-center pt-24">
      <div className="w-full max-w-md space-y-8">
        <form className="space-y-6">
          <div className="flex flex-col bg-gray-800 p-8 gap-6 rounded-xl border border-gray-700">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-300"
              >
                Email address
              </label>
              <input
                id="email"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100  rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                className="w-full px-3 rounded py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="password"
                name="password"
                placeholder="••••••••"
                required
              />
            </div>

            <SubmitButton formAction={signIn} pendingText="Signing in...">
              Sign in
            </SubmitButton>
          </div>
        </form>

        {message && (
          <div className="p-4 text-sm rounded bg-red-900/20 text-red-400 ">
            {message}
          </div>
        )}

        <div className="text-center">
          <Link href="/" className="text-sm text-blue-400 hover:text-blue-300">
            &larr; Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
