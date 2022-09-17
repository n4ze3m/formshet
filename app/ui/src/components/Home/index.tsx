import { Divider, Grid } from "@mantine/core";
import { FormCard } from "./FormCard";
import { TopSession } from "./TopSession";


export function HomeBody() {
    return (
        <div>
            <TopSession />
            <Divider my="md" />
            <div>
                <Grid>
                    <Grid.Col md={6} lg={6}>
                        <FormCard />
                    </Grid.Col>
                    <Grid.Col md={6} lg={6}>
                        <FormCard />
                    </Grid.Col>
                    <Grid.Col md={6} lg={6}>
                        <FormCard />
                    </Grid.Col>
                    <Grid.Col md={6} lg={6}>
                        <FormCard />
                    </Grid.Col>
                </Grid>
            </div>
        </div>
    )
}