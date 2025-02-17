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
            direction={isMobile ? "column" : "row"}
        >
            {/* Background Image - Full screen on mobile */}
            {isMobile && (
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
                        bg: 'whiteAlpha.700',
                    }}
                />
            )}

            {/* Desktop Left Section */}
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

            {/* Content Section */}
            <Flex 
                flex={isMobile ? "1" : "1"}
                align="center"
                justify="center"
                bg={isMobile ? "transparent" : "white"}
                zIndex="1"
            >
                <Box
                    p="8"
                    width={isMobile ? "90%" : "full"}
                    maxWidth="500px"
                >
                    <Stack spacing="4">
                        {/* Mobile Hero Content */}
                        {isMobile && (
                            <Stack spacing="6" textAlign="center">
                                <HStack justify="center" spacing="3">
                                    <Heading size="xl" color="gray.800">
                                        Dog Fetcher
                                    </Heading>
                                    <Icon as={FaPaw} w={8} h={8} color="gray.800" />
                                </HStack>
                                <Text fontSize="lg" fontWeight="medium" color="gray.700">
                                    Welcome to the ultimate platform for finding your ideal canine companion. 
                                    Our intelligent matching system helps connect you with dogs that perfectly 
                                    fit your lifestyle and preferences.
                                </Text>
                            </Stack>
                        )}

                        {/* Login Form Section */}
                        <Stack 
                            spacing="6" 
                            bg="transparent"
                            p={isMobile ? 6 : 0}
                            borderRadius="lg"
                        >
                            <Stack spacing="4" align="center">
                                <Heading size="lg" color="gray.800">Welcome Back</Heading>
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
                                                    borderColor="gray.400"
                                                    _hover={{ borderColor: "gray.500" }}
                                                    _focus={{ 
                                                        borderColor: "gray.700",
                                                        boxShadow: "0 0 0 1px rgba(45, 55, 72, 0.6)"
                                                    }}
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
                                                    borderColor="gray.400"
                                                    _hover={{ borderColor: "gray.500" }}
                                                    _focus={{ 
                                                        borderColor: "gray.700",
                                                        boxShadow: "0 0 0 1px rgba(45, 55, 72, 0.6)"
                                                    }}
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
                    </Stack>
                </Box>
            </Flex>
        </Flex>
    );
};

export default Login;