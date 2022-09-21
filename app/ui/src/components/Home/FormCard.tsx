import { Card, Text, Group, createStyles, Badge } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  card: {
    transition: "transform 150ms ease, box-shadow 100ms ease",
    cursor: "pointer",

    "&:hover": {
      boxShadow: theme.shadows.md,
      transform: "scale(1.02)",
    },

    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      width: 6,
    },
  },
}));

export function FormCard(data: any) {
  const { classes } = useStyles();
  const navigate = useNavigate();

  return (
    <Card
      shadow="sm"
      p="lg"
      className={classes.card}
      onClick={() => navigate(`/form/${data.id}`)}
    >
      <Text weight={500}>{data?.name || "Form Name"}</Text>
      <Group
        position="apart"
        style={{
          marginTop: "1rem",
        }}
      >
        <Text size="sm" color="dimmed">
          0 Submissions in last 24 hours
        </Text>
      </Group>
    </Card>
  );
}
