import { Divider } from "@mantine/core";
import { FormsGrid } from "./FormsGrid";
import { TopSession } from "./TopSession";


export function HomeBody() {
    return (
        <div>
            <TopSession />
            <Divider my="md" />
            <FormsGrid />
            {/* <div>
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
            </div> */}
        </div>
    )
}