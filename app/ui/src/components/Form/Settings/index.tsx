import {
  Card,
  Group,
  Text,
  Paper,
  Button,
  Divider,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { File, Trash } from "tabler-icons-react";
import api from "../../../service/api";
import { handleError } from "../../../utils/error";
import { SettingType } from "./SettingType";

type ISettingsProps = {
  value: string | boolean | number;
  id: number;
  type: string;
  label: string;
  trigger: string;
  blur: boolean;
};

export function FormSettingsBody() {
  // get params from url
  const param = useParams();
  const navigate = useNavigate();
  const client = useQueryClient();
  const [settingsData, setSettingsData] = React.useState<ISettingsProps[]>([]);
  const [settingsApiData, setSettingsApiData] = React.useState<
    ISettingsProps[]
  >([]);
  const [changes, setChanges] = React.useState({});

  const fetchData = async () => {
    const response = await api.get(`/form/${param.id}/settings`);
    return response.data;
  };

  const { data, status } = useQuery(
    ["fetchFormSettingsData", param.id],
    fetchData,
    {
      onSuccess: (data) => {
        setSettingsData(data["formSettings"]);
        setSettingsApiData(data["formApiSettings"]);
      },
    }
  );

  const updateSettingsData = async (data: any) => {
    const response = await api.put(`/form/${param.id}/settings`, data);
    return response.data;
  };

  const { mutate: updateSettings, isLoading: isUpdating } = useMutation(
    updateSettingsData,
    {
      onSuccess: () => {
        client.invalidateQueries(["fetchFormSettingsData", param.id]);
        showNotification({
          message: "Settings updated",
        });
      },
      onError: (error: any) => {
        handleError(error);
      },
    }
  );

  const deleteForm = async () => {
    const response = await api.delete(`/form/${param.id}`);
    return response.data;
  };

  const { mutate: deleteFormMutation, isLoading: isDeleting } = useMutation(
    deleteForm,
    {
      onSuccess: () => {
        navigate("/");
        showNotification({
          message: "Form deleted successfully",
        });
      },
      onError: (error: any) => handleError(error),
    }
  );

  return (
    <div>
      {status === "loading" && <div>Loading...</div>}
      {status === "error" && <div>Error</div>}
      {status === "success" && (
        <div>
          <Divider my="md" variant="dashed" label="Form" />
          <Paper p={"md"}>
            {settingsData.map((code: ISettingsProps) => (
              <Card mb="md" radius="md" key={code.id}>
                <Group position="apart">
                  <Text weight={500}>{code.label}</Text>
                  <SettingType
                    id={code.id.toString()}
                    type={code.type}
                    blur={code.blur}
                    value={code.value}
                    onChange={(value: any) => {
                      // update the list
                      const index = settingsData.findIndex(
                        (item: any) => item.id === code.id
                      );
                      const updatedSettingsData = [...settingsData];
                      updatedSettingsData[index].value = value;
                      setChanges({
                        [code.id]: value,
                      });

                      setSettingsData(updatedSettingsData);
                    }}
                  />
                </Group>
              </Card>
            ))}
            <Group position="right">
              <Button
                loading={isUpdating}
                color="teal"
                leftIcon={<File />}
                onClick={() => updateSettings(changes)}
              >
                Save
              </Button>
            </Group>
          </Paper>
          <Divider my="md" variant="dashed" label="Form API" />
          <Paper p={"md"}>
            {!data.isPublic && (
              <Text mb="md" color="red">
                In order to use the API, you need to make the form public
              </Text>
            )}
            {settingsApiData.map((code: ISettingsProps) => (
              <Card mb="md" radius="md" key={code.id}>
                <Group position="apart">
                  <Text weight={500}>{code.label}</Text>
                  <SettingType
                    id={code.id.toString()}
                    type={code.type}
                    value={code.value}
                    blur={code.blur}
                    onChange={(value: any) => {}}
                  />
                </Group>
              </Card>
            ))}
          </Paper>
          <Divider my="md" variant="dashed" label="Danger Zone" />
          <Paper p={"md"}>
            <Group position="apart">
              <Text mb="md">
                Deleting a form is permanent and cannot be undone.
              </Text>
              <Button
                onClick={() => deleteFormMutation()}
                loading={isDeleting}
                color="red"
                leftIcon={<Trash />}
              >
                Delete Form
              </Button>
            </Group>
          </Paper>
        </div>
      )}
    </div>
  );
}
