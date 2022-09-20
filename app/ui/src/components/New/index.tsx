import {
  Alert,
  Button,
  Container,
  createStyles,
  Group,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { AlertCircle } from "tabler-icons-react";
import api from "../../service/api";
import { errorMessage } from "../../utils/error";

const useStyles = createStyles(() => {
  return {
    form: {
      marginTop: 20,
    },
  };
});

export function NewBody() {
  const { classes } = useStyles();
  const [error, setError] = React.useState("");
  const client = useQueryClient();
  const form = useForm({
    initialValues: {
      url: "",
    },
    validate: {
      url: (value) => {
        if (value.length === 0) {
          return "URL is required";
        }
        const regex =
          /https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)\//;
        if (!regex.test(value)) {
          return "Invalid URL";
        }
      },
    },
  });

  const onVerify = async (url: string) => {
    const response = await api.post("/form/verify", { url });
    return response.data;
  };

  const onCreate = async (data: any) => {
    const response = await api.post("/form/create", data);
    return response.data;
  };

  const {
    isLoading: isVerifyLoading,
    mutateAsync: verify,
    isError: isVerifyError,
    isSuccess: isVerifySuccess,
  } = useMutation(onVerify, {
    onError: (error) => {
      const message = errorMessage(error);
      setError(message);
    },
  });
  const {
    isLoading: isCreateLoading,
    mutateAsync: create,
    isError: isCreateError,
  } = useMutation(onCreate, {
    onSuccess: () => {
      client.invalidateQueries(["findAllUserForms"]);
    },
    onError: (error) => {
      const message = errorMessage(error);
      setError(message);
    },
  });

  return (
    <Container my={20}>
      <Title>New Form</Title>
      <Text size="sm" color="dimmed">
        A new form represents a single google sheet that will be used to collect
        data.
      </Text>
      {isVerifyError && (
        <Alert my="md" color="red" icon={<AlertCircle size={16} />}>
          {error}
        </Alert>
      )}
      {isVerifySuccess && (
        <Alert my="md" color="green" icon={<AlertCircle size={16} />}>
          Google Sheet Connected Successfully
        </Alert>
      )}

      {isCreateError && (
        <Alert my="md" color="red" icon={<AlertCircle size={16} />}>
          {error}
        </Alert>
      )}
      <div className={classes.form}>
        <form
          onSubmit={form.onSubmit(async (values) => {
            await create(values);
          })}
        >
          <TextInput
            placeholder="Paste a Google Sheet URL"
            required
            {...form.getInputProps("url")}
          />
          <Group spacing={10} mt="md">
            <Button
              disabled={isCreateLoading || form.values.url.length === 0}
              color="blue"
              onClick={async () => {
                const isOk = form.validate().errors;
                if (isOk.url === undefined) {
                  const url = form.values.url;
                  await verify(url);
                }
              }}
              loading={isVerifyLoading}
            >
              Test Connection
            </Button>
            <Button
              disabled={isVerifyError || isVerifyLoading}
              loading={isCreateLoading}
              type="submit"
              color="teal"
            >
              Create Form
            </Button>
          </Group>
        </form>
      </div>
    </Container>
  );
}
