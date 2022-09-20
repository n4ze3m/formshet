import { Grid, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import api from "../../service/api";
import { FormCard } from "./FormCard";
import { FormsLoading } from "./FormsLoading";

const FormGrid = ({ data }: any) => {
  if (data.length === 0) {
    return <Text>You don't have any forms yet. Create one now!</Text>;
  }

  const skeletons = data.map((form: any) => (
    <Grid.Col key={form.id} md={6} lg={6}>
      <FormCard {...form} />
    </Grid.Col>
  ));

  return <Grid>{skeletons}</Grid>;
};

export const FormsGrid = () => {
  const fetchData = async () => {
    const response = await api.get("/form/all");
    return response.data;
  };

  const { data, status } = useQuery(["findAllUserForms"], fetchData);

  return (
    <div>
      {status === "loading" && <FormsLoading />}
      {status === "success" && <FormGrid data={data} />}
      {status === "error" && <Text>Failed to fetch data</Text>}
    </div>
  );
};
