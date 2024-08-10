import { createClient } from "@/app/(supa-simple-auth)/_supabase/server";
import Link from "next/link";
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
    return redirect("/");
  };
  return (
    <>
      {user && (
        <div>
          <div
            className="flex justify-between border-b      
        border-b-white/20 h-12 items-center mb-4 text-gray-300"
          >
            <div className="flex items-center">
              <Link className=" text-sky-300  border-r pr-3 mr-3" href="/">
                &lt; Home
              </Link>
              <p className="font-medium">Howdy, {user.email}</p>
            </div>
            <form action={signOut}>
              <button className="text-sky-300">Logout</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
