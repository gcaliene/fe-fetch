import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    Heading,
    Stack,
    Flex,
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { login } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
});

const Login = () => {
    const navigate = useNavigate();
    const { setIsAuthenticated } = useAuth();

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        try {
            await login(values.name, values.email);
            setIsAuthenticated(true);
            navigate('/search');
        } catch (error) {
            console.error('Login failed:', error);
            setIsAuthenticated(false);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Flex 
            minHeight="100vh"
            width="100vw"
            align="center"
            justify="center"
            bg="gray.50"
            position="fixed"
            top="0"
            left="0"
        >
            <Box
                p="8"
                maxWidth="400px"
                width="90%"
                borderRadius="lg"
                bg="white"
                boxShadow="lg"
            >
                <Stack spacing="6">
                    <Heading size="xl" textAlign="center">
                        Find Your Perfect Dog
                    </Heading>
                    
                    <Formik
                        initialValues={{ name: '', email: '' }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, errors, touched, handleChange, isSubmitting, }) => (
                            <Form>
                                <Stack spacing="4">
                                    <FormControl isInvalid={!!errors.name && touched.name}>
                                        <FormLabel>Name</FormLabel>
                                        <Input
                                            name="name"
                                            value={values.name}
                                            onChange={handleChange}
                                            size="lg"
                                        />
                                        <FormErrorMessage>{errors.name}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={!!errors.email && touched.email}>
                                        <FormLabel>Email</FormLabel>
                                        <Input
                                            name="email"
                                            type="email"
                                            value={values.email}
                                            onChange={handleChange}
                                            size="lg"
                                        />
                                        <FormErrorMessage>{errors.email}</FormErrorMessage>
                                    </FormControl>

                                    <Button
                                        mt="2"
                                        size="lg"
                                        width="full"
                                        colorScheme="blue"
                                        isLoading={isSubmitting}
                                        type="submit"
                                    >
                                        Login
                                    </Button>
                                </Stack>
                            </Form>
                        )}
                    </Formik>
                </Stack>
            </Box>
        </Flex>
    );
};

export default Login;