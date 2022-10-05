import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import api from "../../../service/api";
import { FormTable } from "./FormTable";
export function FormHomeBody() {
  // get params from url
  const param = useParams();

  const fetchData = async () => {
    const response = await api.get("/form/" + param.id);
    return response.data["data"]
  };

  const { data, status } = useQuery(["fetchData", param.id], fetchData);

  return (
    <div>
      {status === "loading" && <div>Loading...</div>}
      {status === "error" && <div>Error</div>}
      {status === "success" && (
        <FormTable data={data.rows} header={data.header} />
      )}
    </div>
  );
}
