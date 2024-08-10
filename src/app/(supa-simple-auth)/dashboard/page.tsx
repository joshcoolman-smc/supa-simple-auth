import { createClient } from "@/app/(supa-simple-auth)/_supabase/server";
import { redirect } from "next/navigation";
import UserLogoutHeader from "../_components/user-logout-header";

export default async function Page() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  return (
    <div className="px-4">
      <UserLogoutHeader />
      <h1>Dashboard</h1>
    </div>
  );
}
