import { createClient } from "@/app/(supa-simple-auth)/_supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "../_components/submit-button";
import Link from "next/link";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }
    return redirect("/dashboard");
  };

  return (
    <div className="w-full flex flex-col justify-center items-center pt-24">
      <form>
        <div className="flex flex-col bg-white/10 p-8 gap-6 rounded w-[350px]">
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
            className="bg-green-700 rounded px-4 py-2 font-bold "
            pendingText="Signing In..."
          >
            Sign In
          </SubmitButton>
        </div>
      </form>
      <Link href="/" className="text-sky-500 mt-4">
        &lt; Back to Home Page
      </Link>

      {searchParams?.message && (
        <p className="mt-4 p-4 text-red-300 text-center block">
          {searchParams.message}
        </p>
      )}
    </div>
  );
}
