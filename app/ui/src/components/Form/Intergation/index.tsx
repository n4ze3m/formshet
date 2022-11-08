import { Card, Group, Switch, Text, Alert } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { InfoCircle } from "tabler-icons-react";
import api from "../../../service/api";
import { handleError } from "../../../utils/error";
export function FormIntergationBody() {
    // get params from url
    const param = useParams();
    const client = useQueryClient();

    const fetchData = async () => {
        const response = await api.get(`/form/${param.id}/integration`);
        return response.data
    };

    const updateIntergationData = async (data: any) => {
        const response = await api.put(`/form/${param.id}/integration`, data);
        return response.data
    }

    const { data, status } = useQuery(["fetchIntergationData", param.id], fetchData);


    const {
        mutate: updateIntergation,
    } = useMutation(updateIntergationData, {
        onSuccess: () => {
            client.invalidateQueries(["fetchIntergationData", param.id]);
            showNotification({
                message: "Intergation updated",
            })
        },
        onError: (error: any) => {
            handleError(error)
        }
    });

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
                            More integrations will be added in the future.
                        </Alert>
                        {data.map((intg: any) => (
                            <Card withBorder mb="md" radius="md" key={intg.id}>
                                <Group position="apart" mt="md">
                                    <div>
                                        <Text weight={500}>{intg.label}</Text>
                                        <Text size="xs" color="dimmed">
                                            {intg.description}
                                        </Text>
                                    </div>
                                    <Switch
                                        checked={intg.value}
                                        onChange={(value) => {
                                            updateIntergation({
                                                id: intg.id.toString(),
                                                value: value.currentTarget.checked
                                            })
                                        }}
                                    />
                                </Group>
                            </Card>
                        ))}
                    </div>
                )
            }
        </div>
    );
}
