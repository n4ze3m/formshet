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

export function LoginBody() {
    return (
        <Container size={420} my={40}>
            <Title
                align="center"
                sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
            >
                Login to FormShet
            </Title>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <TextInput label="Email" placeholder="you@example.com" required />
                <PasswordInput label="Password" placeholder="Your password" required mt="md" />
                <Button color="teal" fullWidth mt="xl">
                    Login
                </Button>
                <Text color="dimmed" size="sm" align="center" mt="md">
                    Do not have an account?{' '}
                    <Anchor<'a'> href="#" size="sm" onClick={(event) => event.preventDefault()}>
                        Create account
                    </Anchor>
                </Text>
            </Paper>
        </Container>
    );
}