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
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../service/api";
import { handleError } from "../../utils/error";

export function RegisterBody() {
  const { login: setCurrentUser } = useAuth();
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validate: {
      name: (value) => {
        if (value.length === 0) {
          return "Name is required";
        }
      },
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
        } else if (value.length < 6) {
          return "Password must be at least 6 characters";
        }
      },
    },
  });

  const onSubmit = async (values: any) => {
    const respose = await api.post("/user/register", values);
    return respose.data;
  };

  const { mutateAsync: register, isLoading } = useMutation(onSubmit, {
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
        Register to FormShet
      </Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form
          onSubmit={form.onSubmit(async (values) => await register(values))}
        >
          <TextInput
            label="Name"
            placeholder="John Doe"
            required
            {...form.getInputProps("name")}
          />
          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            {...form.getInputProps("password")}
            mt="md"
          />
          <Button
            loading={isLoading}
            color="teal"
            fullWidth
            mt="xl"
            type="submit"
          >
            Register
          </Button>
        </form>
        <Text color="dimmed" size="sm" align="center" mt="md">
          Already have an account?{" "}
          <Anchor component={Link} to="/auth/login" size="sm">
            Login
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}
