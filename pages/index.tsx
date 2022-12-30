import { useEffect, useContext } from "react";
import { DataContext } from "../context/DataContext";
import { Inter } from "@next/font/google";
import DataGrid from "../components/DataGrid";
import Navbar from "../components/Navbar";
import Stats from "../components/Stats";
import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const user = useUser();
  const dataContext = useContext(DataContext);

  useEffect(() => {
    if (user) {
      console.log(user);
    }
  }, [user]);

  return (
    <div>
      <Navbar />
      <div className="px-5">
        {session && user?.email === "oliverwolfson@gmail.com" && (
          <>
            {dataContext?.showStats && (
              <div className="mb-5">
                <Stats />
              </div>
            )}
            <div>
              <DataGrid />
            </div>
          </>
        )}
        {session && user?.email !== "oliverwolfson@gmail.com" && (
          <p>You are not authorized to view this page.</p>
        )}
        {!session && <p>You are not signed in.</p>}
      </div>
    </div>
  );
}
