import { Card, Group, Switch, Text, Alert, Input } from "@mantine/core";
import { Prism } from "@mantine/prism";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { InfoCircle } from "tabler-icons-react";
import api from "../../../service/api";
import { SettingType } from "./SettingType";
export function FormSettingsBody() {
    // get params from url
    const param = useParams();

    const fetchData = async () => {
        const response = await api.get(`/form/${param.id}/settings`);
        return response.data
    };

    const { data, status } = useQuery(["fetchFormSettingsData", param.id], fetchData);



    return (
        <div>
            {status === "loading" && <div>Loading...</div>}
            {status === "error" && <div>Error</div>}
            {
                status === "success" && (
                    <div>
                        {data.map((code: any) => (
                            <Card mb="md" radius="md" key={code.id}>
                                <Group position="apart">
                                    <Text weight={500}>{code.label}</Text>
                                    <SettingType id={code.id} type={code.type} value={code.value} />
                                </Group>
                            </Card>
                        ))}
                    </div>
                )
            }
        </div>
    );
}
