import { AppShell, Container, createStyles, Header, Text, Group, Avatar, MediaQuery } from "@mantine/core";
import React from "react";
import { Outlet } from "react-router-dom";
import { ChevronDown } from "tabler-icons-react";
const HEADER_HEIGHT = 65;

const useStyles = createStyles((theme) => ({
    inner: {
        height: HEADER_HEIGHT,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    links: {
        [theme.fn.smallerThan("sm")]: {
            display: "none",
        },
    },

    burger: {
        [theme.fn.largerThan("sm")]: {
            display: "none",
        },
    },

    link: {
        display: "block",
        lineHeight: 1,
        padding: "8px 12px",
        borderRadius: theme.radius.sm,
        textDecoration: "none",
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[0]
                : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
        },
    },

    linkLabel: {
        marginRight: 5,
    },
    curosrPointer: {
        cursor: "pointer",
    },
}));

export default function DashboardLayout() {
    const { classes } = useStyles();
    const [email, setEmail] = React.useState("mock@mock.com");
    const [avatar, setAvatar] = React.useState("https://avatars.dicebear.com/api/jdenticon/formshet.svg?background=%230000ff")
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
                        <Group spacing={7}>
                            <Avatar
                                src={avatar}
                                radius="xl"
                                size={30}
                            />
                            <MediaQuery
                                smallerThan={"sm"}
                                styles={{ display: "none" }}>
                                <span>
                                    {email}
                                </span>
                            </MediaQuery>
                            <ChevronDown size={12} />
                        </Group>
                    </Container>
                </Header>
            }
        >
            <Container>
                <Outlet />
            </Container>
        </AppShell>
    )
}