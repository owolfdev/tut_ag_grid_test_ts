import React, { useState, useEffect, useContext } from "react";
import { useSupabase } from "../utils/useSupabase";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

import { DataContext } from "../context/DataContext";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";

function DataGrid() {
  //state for data and columns
  const [data, setData] = useState<any[]>([]);
  const [displayedColumns, setDisplayedColumns] = useState([]);

  const dataContext = useContext(DataContext);

  const [testData, setTestData] = useState<any>();

  useEffect(() => {
    //console.log("testData:", testData);
  }, [testData]);

  //supabase
  const supabase = useSupabaseClient();

  //methods for getting data and columns
  const { getProfiles, getFilms } = useSupabase();

  //router
  const router = useRouter();

  //data queries for profiles and films
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

  //combine profiles and films data
  useEffect(() => {
    // console.log("data:", data);
    let filmAndProfileData: any[] = [];

    filmsData &&
      profilesData &&
      filmsData?.map((film) => {
        const profile = profilesData?.filter((profile) => {
          return profile.id === film.filmmaker;
        });
        // console.log("profile:", profile);
        // console.log("film:", film.id);

        const filmAndProfile = {
          ...film,
          name: profile[0] ? profile[0].username : "No Name",
          email: profile[0] ? profile[0].email : "No Email",
          origin: profile[0] ? profile[0].origin : "No Origin",
          organization: profile[0]
            ? profile[0].organization
            : "No Organization",
        };
        filmAndProfileData.push(filmAndProfile);
      });
    setData([...filmAndProfileData]);
    dataContext?.setFilmsData([...filmAndProfileData]);
  }, [filmsData]);

  useEffect(() => {
    //console.log("data:", data);
  }, [data]);

  //components for ag-grid columns
  //see the readme for latest idea on how to resolve this
  const CheckboxComponentForAccepted = (params: any) => {
    const [checked, setChecked] = useState(false);

    useEffect(() => {
      setChecked(params.data.accepted);
    }, []);

    const handleCheckAccepted = (e: any) => {
      setChecked(!checked);
      const filmData = { ...params.data };
      filmData.accepted = !filmData.accepted;
      filmData.rejected = false;
      setTimeout(() => {
        updateFilmData(filmData);
      }, 0);
    };

    return (
      <div>
        <input
          type="checkbox"
          id={params.data.id}
          name="accepted"
          onChange={handleCheckAccepted}
          checked={checked}
          //disabled={filmsStatus === "loading"}
        />
      </div>
    );
  };

  const CheckboxComponentForRejected = (params: any) => {
    const [checked, setChecked] = useState(false);

    useEffect(() => {
      setChecked(params.data.rejected);
    }, []);

    const handleCheckRejected = (event: any) => {
      setChecked(!checked);
      //console.log("params:", params.data);
      const filmData = { ...params.data };
      filmData.rejected = !filmData.rejected;
      filmData.accepted = false;
      updateFilmData(filmData);
    };

    return (
      <div>
        <input
          type="checkbox"
          id={params.data.id}
          name="accepted"
          onChange={handleCheckRejected}
          checked={checked}
        />
      </div>
    );
  };

  const ComponentForAwards = (params: any) => {
    // console.log("params for", params.data.id, ":", params);
    // console.log("data", params.data);
    const awards = JSON.parse(params.data.awards);
    return <div>{awards && awards.length}</div>;
  };

  const ComponentForId = (params: any) => {
    // console.log("params for", params.data.id, ":", params);

    return (
      <button id={params.data.id} onClick={handleEditFilm}>
        Edit: {params.data.id}
      </button>
    );
  };

  //columns for ag-grid
  const titleColumn = { field: "title", checkboxSelection: true };
  const idColumn = { field: "id", sort: "asc", cellRenderer: ComponentForId };
  const acceptedColumn = {
    field: "accepted",
    cellRenderer: CheckboxComponentForAccepted,
  };
  const rejectedColumn = {
    field: "rejected",
    cellRenderer: CheckboxComponentForRejected,
  };
  const awardsColumn = {
    field: "awards",
    cellRenderer: ComponentForAwards,
  };
  const filmmakerColumn = {
    field: "filmmaker",
    headerName: "Filmmaker Id",
  };
  const nameColumn = { field: "name", headerName: "Filmmaker Name" };

  useEffect(() => {
    setDisplayedColumns(sortColumnDefs(columnDefs));
  }, []);

  const [columnDefs, setColumnDefs] = useState([
    titleColumn,
    idColumn,
    acceptedColumn,
    rejectedColumn,
    awardsColumn,
    filmmakerColumn,
    nameColumn,
  ]);

  const defaultColDef = {
    resizable: true,
    editable: true,
    filter: true,
    filterParams: {
      buttons: ["reset"],
    },
    sortable: true,
  };

  const filterFilms = (id: any) => {
    console.log("id", id);

    const film = data.filter((film: any) => {
      return film.id === id;
    });
    console.log("film", film);

    return film;
  };

  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const refreshFilms = () => {
    // Code for the refresh action goes here
    console.log("refreshing!!!!");
    filmsRefetch();
  };

  //methods for handling changes to data
  async function updateFilmData(filmData: any) {
    // clearTimeout(timeoutId as NodeJS.Timeout);
    // const newTimeoutId = setTimeout(refreshFilms, 1000);
    // setTimeoutId(newTimeoutId);
    try {
      let { data, error, status } = await supabase
        .from("films_duplicate")
        .update({ accepted: filmData.accepted, rejected: filmData.rejected })
        .eq("id", filmData.id);
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
      refreshFilms();
    }
  }

  const handleCellValueChanged = (event: any) => {
    //const { data } = event;
  };

  const handleCellClicked = (event: any) => {
    //console.log("event", event);
    //router.push(`/film/${event.data.id}`);
  };

  const sortColumnDefs = (columnDefs: any) => {
    return columnDefs.sort((a: any, b: any) => a.id - b.id);
  };

  const handleEditFilm = (event: any) => {
    //console.log("event", event.target.id);
    router.push(`/film/${event.target.id}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Data</h1>
      <div className="ag-theme-alpine" style={{ height: 800 }}>
        {/* <AgGridReact
          rowData={data}
          columnDefs={[
            { headerName: "Film ID", field: "id" },
            { headerName: "Title", field: "title" },
            { headerName: "Link", field: "link" },
            { headerName: "Name", field: "name" },
            { headerName: "Email", field: "email" },
            { headerName: "Origin", field: "origin" },
            { headerName: "Organization", field: "organization" },
          ]}
        /> */}
        <AgGridReact
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onCellValueChanged={handleCellValueChanged}
          onCellClicked={handleCellClicked}
          pagination={true}
          paginationPageSize={20}
        ></AgGridReact>
      </div>
      <button onClick={() => filterFilms(6)}>Filter Films</button>
    </div>
  );
}

export default DataGrid;
