import React from "react";
import { createStyles, Header, Menu, Group, Center, Burger, Container, AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from "react-router-dom";

const useStyles = createStyles((theme) => ({
    inner: {
        height: 56,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    links: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    burger: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    link: {
        display: 'block',
        lineHeight: 1,
        padding: '8px 12px',
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
    },

    linkLabel: {
        marginRight: 5,
    },
}));

export default function AuthLayout() {
    const { classes } = useStyles();
    const [opened, { toggle }] = useDisclosure(false);
    return (
        <AppShell
            padding="md"
            header={<Header height={56} mb={120}>
                <Container>
                    <div className={classes.inner}>
                        FormShet
                        <Group spacing={5} className={classes.links}>
                        </Group>
                        <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />
                    </div>
                </Container>
            </Header>}
        >
            <Outlet />
        </AppShell>
    )
}