import { Card, Group, Switch, Text, Alert } from "@mantine/core";
import { Prism } from "@mantine/prism";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { InfoCircle } from "tabler-icons-react";
import api from "../../../service/api";
export function FormCodeBody() {
    // get params from url
    const param = useParams();

    const fetchData = async () => {
        const response = await api.get(`/form/${param.id}/code`);
        return response.data
    };

    const { data, status } = useQuery(["fetchCodeData", param.id], fetchData);

    return (
        <div>
            {status === "loading" && <div>Loading...</div>}
            {status === "error" && <div>Error</div>}
            {
                status === "success" && (
                    <div>
                        <Alert my="md"
                            icon={<InfoCircle size={32} />}
                        >
                            More code snippets will be added in the future.
                        </Alert>
                        {data.map((code: any) => (
                            <Card withBorder mb="md" radius="md" key={code.id}>
                                <Group position="apart" mt="md">
                                    <div>
                                        <Text weight={500}>{code.label}</Text>
                                        <Text size="xs" color="dimmed">
                                            {code.description}
                                        </Text>
                                    </div>
                                </Group>
                                <Prism language="markup" my="md">
                                    {code.value}
                                </Prism>
                            </Card>
                        ))}
                    </div>
                )
            }
        </div>
    );
}
