import {
    TextInput,
    PasswordInput,
    Paper,
    Title,
    Container,
    Button,
    Text,
    Anchor
} from '@mantine/core';
import { Link } from 'react-router-dom';

export function RegisterBody() {
    return (
        <Container size={420} my={40}>
            <Title
                align="center"
                sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
            >
                Register to FormShet
            </Title>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <TextInput label="Name" placeholder="John Doe" required />
                <TextInput label="Email" placeholder="you@example.com" required />
                <PasswordInput label="Password" placeholder="Your password" required mt="md" />
                <Button color="teal" fullWidth mt="xl">
                    Register
                </Button>
                <Text color="dimmed" size="sm" align="center" mt="md">
                    Already have an account?{' '}
                    <Anchor component={Link} to="/auth/login" size="sm" >
                        Login
                    </Anchor>
                </Text>
            </Paper>
        </Container>
    );
}