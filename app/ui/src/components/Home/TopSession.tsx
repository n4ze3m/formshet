import { Button, Group, Title } from "@mantine/core";
import { Plus } from "tabler-icons-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export function TopSession() {
  const navigate = useNavigate();
  return (
    <Group position="apart">
      <Title>My Forms</Title>
      <Button color="teal" leftIcon={<Plus />} onClick={() => navigate("/new")}>
        New Form
      </Button>
    </Group>
  );
}
