import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Text,
  Anchor,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import api from "../../service/api";
import { handleError } from "../../utils/error";
import { useAuth } from "../../hooks/useAuth";

export function LoginBody() {
  const { login: setCurrentUser } = useAuth();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => {
        if (value.length === 0) {
          return "Email is required";
        }
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          return "Invalid email address";
        }
      },
      password: (value) => {
        if (value.length === 0) {
          return "Password is required";
        }
      },
    },
  });

  const onSubmit = async (values: any) => {
    const respose = await api.post("/user/login", values);
    return respose.data;
  };

  const { mutateAsync: login, isLoading } = useMutation(onSubmit, {
    onSuccess: (data) => {
      const { token, payload } = data;
      setCurrentUser(token, payload);
    },
    onError: (error) => {
      handleError(error);
    },
  });

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Login to FormShet
      </Title>
      <Paper withBorder={true} shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(async (values) => await login(values))}>
          <TextInput
            label="Email"
            placeholder="you@email.com"
            required={true}
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required={true}
            mt="md"
            {...form.getInputProps("password")}
          />
          <Button
            type="submit"
            loading={isLoading}
            color="teal"
            fullWidth={true}
            mt="xl"
          >
            Login
          </Button>
        </form>
        <Text color="dimmed" size="sm" align="center" mt="md">
          Do not have an account?{" "}
          <Anchor component={Link} to="/auth/register" size="sm">
            Create account
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}
