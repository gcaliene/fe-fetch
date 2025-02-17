import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { FaPaw } from 'react-icons/fa';
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
    Text,
    useBreakpointValue,
    Icon,
    HStack,
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { login } from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface LoginFormValues {
    name: string;
    email: string;
}

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
});

const Login = () => {
    const navigate = useNavigate();
    const { setIsAuthenticated } = useAuth();
    const isMobile = useBreakpointValue({ base: true, md: false });

    const handleSubmit = async (
        values: LoginFormValues,
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
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
            position="fixed"
            top="0"
            left="0"
        >
            {/* Left Section - Hidden on mobile */}
            {!isMobile && (
                <Flex
                    flex="1"
                    position="relative"
                    direction="column"
                    justify="center"
                    align="center"
                    p="8"
                >
                    <Box
                        position="absolute"
                        top="0"
                        left="0"
                        right="0"
                        bottom="0"
                        bgImage="url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b')"
                        bgSize="cover"
                        bgPosition="center"
                        filter="blur(2px)"
                        _after={{
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bg: 'blackAlpha.600',
                        }}
                    />
                    <Stack
                        spacing="6"
                        zIndex="1"
                        color="white"
                        textAlign="center"
                        maxWidth="600px"
                    >
                        <HStack justify="center" spacing="3">
                            <Heading size="2xl">
                                Dog Fetcher
                            </Heading>
                            <Icon as={FaPaw} w={10} h={10} />
                        </HStack>
                        <Text fontSize="xl" fontWeight="medium">
                            Welcome to the ultimate platform for finding your ideal canine companion. 
                            Our intelligent matching system helps connect you with dogs that perfectly 
                            fit your lifestyle and preferences.
                        </Text>
                    </Stack>
                </Flex>
            )}

            {/* Right Section - Form */}
            <Flex 
                flex={isMobile ? "1" : "1"}
                align="center"
                justify="center"
                bg="white"
            >
                <Box
                    p="8"
                    width={isMobile ? "90%" : "full"}
                    maxWidth="500px"
                >
                    <Stack spacing="6">
                        {isMobile && (
                            <HStack justify="center" spacing="3">
                                <Heading size="xl">
                                    Dog Fetcher
                                </Heading>
                                <Icon as={FaPaw} w={8} h={8} />
                            </HStack>
                        )}
                        
                        <Stack spacing="4" align="center">
                            <Heading size="lg">Welcome Back</Heading>
                            <Text color="gray.600">
                                Please sign in to continue
                            </Text>
                        </Stack>
                        
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
        </Flex>
    );
};

export default Login;