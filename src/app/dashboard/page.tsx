import { createClient } from "@/app/(auth)/_supabase/server";
import { redirect } from "next/navigation";
import UserLogoutHeader from "../(auth)/_components/user-logout-header";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login?message=Please sign in to access the dashboard");
  }

  return (
    <div className="px-4">
      <UserLogoutHeader email={user.email || ""} />
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">
          Dashboard
          <span className="block text-sm font-normal text-slate-500">
            (Protected Route)
          </span>
        </h1>
      </div>
    </div>
  );
}
