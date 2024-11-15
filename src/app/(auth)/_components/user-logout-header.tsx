"use client";

import { createClient } from "@/app/(auth)/_supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  email: string;
}

export default function UserLogoutHeader({ email }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-between border-b border-b-slate-700 py-8 h-12 items-center mb-4">
      <div className="flex items-cente text-sm">
        <Link className=" hover:text-primary/80 border-r pr-3 mr-3" href="/">
          &lt; Home
        </Link>
        <p className="font-medium text-sky-300">Welcome, {email}</p>
      </div>
      <button
        onClick={handleSignOut}
        disabled={isLoading}
        className="text-red-400 disabled:opacity-50 text-sm"
      >
        {isLoading ? "Signing out..." : "Logout"}
      </button>
    </div>
  );
}
