import { Skeleton, Grid } from "@mantine/core";
import { FormCard } from "./FormCard";

export function FormsLoading() {
  const FormSkeleton = () => {
    return (
      <Skeleton>
        <FormCard />
      </Skeleton>
    );
  };
  const skeletons = Array.from({ length: 4 }, (_, i) => i).map((i) => (
    <Grid.Col key={i} md={6} lg={6}>
      <FormSkeleton />
    </Grid.Col>
  ));

  return <Grid>{skeletons}</Grid>;
}
