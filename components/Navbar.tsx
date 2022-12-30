import React, { useContext } from "react";
import { DataContext } from "../context/DataContext";
import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import { userAgent } from "next/server";

function Navigation() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const user = useUser();
  const dataContext = useContext(DataContext);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }

  return (
    <nav>
      <div className="flex gap-3 mb-5 bg-gray-200 h-12 items-center px-5 justify-between">
        {!session && (
          <button
            className="border border-black rounded px-2 h-8"
            onClick={signInWithGoogle}
          >
            Sign in with Google
          </button>
        )}

        {session && (
          <>
            <div className="flex gap-3 items-center">
              <p>You are signed in</p>
              <button
                className="border border-black  rounded px-2 h-8 hover:bg-gray-300"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
              <button
                className="border border-black  rounded px-2 h-8 hover:bg-gray-300"
                onClick={() =>
                  dataContext?.setShowStats(!dataContext?.showStats)
                }
              >
                Show Stats
              </button>
            </div>
            <div>User: {user?.email}</div>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
