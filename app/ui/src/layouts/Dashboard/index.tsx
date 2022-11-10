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
  ThemeIcon,
  Navbar,
  Burger,
} from "@mantine/core";
import React from "react";
import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
  matchPath,
  useParams,
} from "react-router-dom";
import {
  ChevronDown,
  Cloud,
  Code,
  Home,
  Logout,
  Settings,
} from "tabler-icons-react";
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

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  path: string;
}

const useMatch = (path: string) => {
  const { pathname } = useLocation();
  return matchPath(path, pathname);
};
function MainLink({ icon, color, label, path }: MainLinkProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const params = useParams();
  let newPath = `/form/${params.id}${path}`;

  return (
    <UnstyledButton
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        backgroundColor: matchPath(newPath, pathname)
          ? theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0]
          : undefined,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
      onClick={() => navigate(newPath)}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>

        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
}
const formPath = "/form/:id/*";

const data = [
  { icon: <Home size={16} />, color: "blue", label: "Home", path: "/" },
  {
    icon: <Cloud size={16} />,
    color: "teal",
    label: "Intergation",
    path: "/intergation",
  },
  {
    icon: <Code size={16} />,
    color: "red",
    label: "Code Snippets",
    path: "/code",
  },
  {
    icon: <Settings size={16} />,
    color: "orange",
    label: "Settings",
    path: "/settings",
  },
];

export default function DashboardLayout() {
  const { isLogged, profile, logout } = useAuth();
  const [opened, setOpened] = React.useState(false);
  const [userMenuOpened, setUserMenuOpened] = React.useState(false);
  const navigate = useNavigate();
  const match = useMatch(formPath);

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
      fixed={true}
      header={
        <Header height={HEADER_HEIGHT}>
          <Container className={classes.inner}>
            <Group>
              {match && (
                <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                  <Burger
                    opened={opened}
                    onClick={() => setOpened((o) => !o)}
                    size="sm"
                    mr="xl"
                  />
                </MediaQuery>
              )}
              <Text
                onClick={() => navigate("/")}
                className={classes.curosrPointer}
                weight="bold"
                size="lg"
              >
                FormShet
              </Text>
            </Group>
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
                <Menu.Item 
                onClick={() => navigate("/settings")}
                icon={<Settings size={14} />}>Settings</Menu.Item>
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
      navbar={
        match ? (
          <Navbar
            p="md"
            hiddenBreakpoint="sm"
            hidden={!opened}
            width={{ sm: 200, lg: 250 }}
          >
            <Navbar.Section grow={true}>
              {data.map(({ icon, color, label, path }) => (
                <MainLink
                  key={label}
                  icon={icon}
                  color={color}
                  label={label}
                  path={path}
                />
              ))}
            </Navbar.Section>
          </Navbar>
        ) : undefined
      }
    >
      <Container>
        <Outlet />
      </Container>
    </AppShell>
  );
}
