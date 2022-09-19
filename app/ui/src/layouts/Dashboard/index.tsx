import {
  AppShell,
  Container,
  createStyles,
  Header,
  Text,
  Group,
  Avatar,
  MediaQuery,
  Menu,
  UnstyledButton,
} from "@mantine/core";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ChevronDown, Logout, Settings } from "tabler-icons-react";
import { useAuth } from "../../hooks/useAuth";
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

  user: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: "background-color 100ms ease",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    },
  },

  burger: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },

  userActive: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
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
  const { isLogged, profile, logout } = useAuth();
  const [userMenuOpened, setUserMenuOpened] = React.useState(false);

  if (!isLogged) {
    return <Navigate to="/auth/login" />;
  }

  const { classes, cx } = useStyles();

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
            <Text className={classes.curosrPointer} weight="bold" size="lg">
              FormShet
            </Text>
            <Menu
              width={260}
              position="bottom-end"
              transition="pop-top-right"
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
            >
              <Menu.Target>
                <UnstyledButton
                  className={cx(classes.user, {
                    [classes.userActive]: userMenuOpened,
                  })}
                >
                  <Group spacing={7}>
                    <Avatar src={profile?.avatar} radius="xl" size={30} />
                    <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
                      <span>{profile?.email}</span>
                    </MediaQuery>
                    <ChevronDown size={12} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item icon={<Settings size={14} />}>Settings</Menu.Item>
                <Menu.Divider />
                <Menu.Label>Danger zone</Menu.Label>
                <Menu.Item
                  color="red"
                  icon={<Logout size={14} />}
                  onClick={logout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Container>
        </Header>
      }
    >
      <Container>
        <Outlet />
      </Container>
    </AppShell>
  );
}
