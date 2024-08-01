import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
export default async function UserLogoutHeader() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const signOut = async () => {
    "use server";
    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };
  return (
    <>
      {user && (
        <div>
          <div
            className="flex justify-between border-b      
        border-b-white/20 h-12 items-center mb-4"
          >
            <h1>{user.email}</h1>
            <form action={signOut}>
              <button>Logout</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
