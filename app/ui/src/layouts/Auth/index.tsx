import React from "react";
import {
    createStyles,
    Header,
    Text,
    Container,
    AppShell,
} from "@mantine/core";
import { Outlet } from "react-router-dom";
const HEADER_HEIGHT = 65;

const useStyles = createStyles(() => ({
    inner: {
        height: HEADER_HEIGHT,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    curosrPointer: {
        cursor: "pointer",
    },
}));

export default function AuthLayout() {
    const { classes } = useStyles();
    return (
        <AppShell
            styles={(theme) => ({
                main: {
                    backgroundColor:
                        theme.colorScheme === "dark"
                            ? theme.colors.dark[8]
                            : theme.colors.gray[0],
                },
            })}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            fixed
            header={
                <Header height={HEADER_HEIGHT}>
                    <Container className={classes.inner}>
                        <Text
                            className={classes.curosrPointer}
                            weight="bold"
                            size="lg"
                        >
                            FormShet
                        </Text>
                    </Container>
                </Header>
            }
        >
            <Outlet />
        </AppShell>
    );
}
