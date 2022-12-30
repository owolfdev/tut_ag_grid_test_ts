import { useContext } from "react";
import { DataContext } from "../context/DataContext";

import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";

export const useSupabase = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const user = useUser();
  const dataContext = useContext(DataContext);

  async function createProfile() {
    try {
      const { data, error } = await supabase.from("profiles").upsert({
        id: user?.id,
        email: session?.user.email,
        username: "",
      });
      console.log("create profile", data, error);
      return data;
    } catch (error) {}
  }

  async function getProfiles() {
    try {
      let { data, error, status } = await supabase.from("profiles").select();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        //console.log("data from supabase getFilms:", data, data.length);

        return data;
      } else {
        console.log("no data");
        return data;
      }
    } catch (error) {
      console.log("error from get profile", error);
    } finally {
      //console.log("finally");
    }
  }

  async function getProfile() {
    if (!user?.id)
      return {
        username: "",
        email: session?.user.email,
        id: user?.id,
        organization: "",
        website: "",
        origin: "",
        phone_number: "",
        age: "",
        isOverEighteen: false,
      };

    try {
      let { data, error, status } = await supabase
        .from("profiles")
        .select(
          `username, email, website, organization, avatar_url, origin, phone_number, age, isOverEighteen`
        )
        .eq("id", user?.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        return data;
      } else {
        console.log("no data!!!");
        createProfile();
        return;
      }
    } catch (error) {
      console.log("error from get profile", error);
    } finally {
    }
  }

  async function updateProfile({
    username,
    email,
    organization,
    website,
    origin,
    phone_number,
    age,
    isOverEighteen,
  }: any) {
    try {
      const updates = {
        id: user?.id,
        username,
        email,
        organization,
        website,
        origin,
        phone_number,
        age,
        isOverEighteen,
        updated_at: new Date().toISOString(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;
      //alert("Profile updated!");
      //setProfileUpdated(true);
    } catch (error) {
      alert("Error updating the data!");
      console.log(error);
    } finally {
      //setLoading(false);
      setTimeout(() => {
        //setProfileUpdated(false);
      }, 4000);
    }
  }

  async function getFilms() {
    try {
      let { data, error, status } = await supabase
        .from("films_duplicate")
        .select();
      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        return data;
      } else {
        console.log("no data");
        return data;
      }
    } catch (error) {
      console.log("error from get profile", error);
    } finally {
    }
  }

  return { getFilms, getProfile, getProfiles, updateProfile, createProfile };
};
