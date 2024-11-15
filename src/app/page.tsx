import Link from "next/link";
import { createClient } from "@/app/(auth)/_supabase/server";
import { use } from "react";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <h1 className="text-3xl">Home</h1>
      <Link href={user ? "/dashboard" : "login"} className="text-sky-300 ">
        {user ? "Dashboard" : "Login"}
      </Link>
    </div>
  );
}
