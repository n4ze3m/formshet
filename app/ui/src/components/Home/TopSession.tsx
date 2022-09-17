import { Button, Group, Title } from "@mantine/core";
import { Plus } from "tabler-icons-react";
import React from "react";

export function TopSession() {
    return (
        <Group position="apart" >
            <Title>
                My Forms
            </Title>
            <Button color="teal"
                leftIcon={<Plus />}
            >
                New Form
            </Button>
        </Group>
    );
}