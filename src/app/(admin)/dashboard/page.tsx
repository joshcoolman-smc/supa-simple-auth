import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import UserLogoutHeader from "../components/user-logout-header";

export default async function Page() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="px-4">
      <UserLogoutHeader />
      <h1>Dashboard</h1>
    </div>
  );
}
