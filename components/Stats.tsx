import React from "react";
import { useSupabase } from "../utils/useSupabase";
import { useQuery } from "@tanstack/react-query";

function Stats() {
  const { getProfiles, getFilms } = useSupabase();

  const {
    data: profilesData,
    status: profilesStatus,
    refetch: profilesRefetch,
  } = useQuery({
    queryKey: ["profiles"],
    queryFn: getProfiles,
  });

  const {
    data: filmsData,
    status: filmsStatus,
    refetch: filmsRefetch,
  } = useQuery({
    queryKey: ["films"],
    queryFn: getFilms,
  });

  return (
    <div>
      <h1 className="font-bold text-2xl">Stats</h1>
      <div>Filmmakers Registered: {profilesData?.length}</div>
      <div>Films Submitted: {filmsData?.length}</div>
    </div>
  );
}

export default Stats;
