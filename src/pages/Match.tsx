import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container,
    Heading,
    Button,
    Card,
    CardBody,
    Image,
    Stack,
    Text,
    Spinner,
    Center,
    Flex,
    SlideFade,
    ScaleFade,
} from '@chakra-ui/react';
import { generateMatch, getDogs } from '../services/api';
import { Dog } from '../types';

const Match = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [matchedDog, setMatchedDog] = useState<Dog | null>(null);

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                const favoriteIds = location.state?.favoriteIds;
                if (!favoriteIds?.length) {
                    navigate('/search');
                    return;
                }

                const { match } = await generateMatch(favoriteIds);
                const [dog] = await getDogs([match]);
                setMatchedDog(dog);
            } catch (error) {
                console.error('Failed to generate match:', error);
                navigate('/search');
            }
        };
        fetchMatch();
    }, [location.state, navigate]);

    if (!matchedDog) {
        return (
            <Center w="100vw" h="100vh">
                <Spinner size="xl" />
            </Center>
        );
    }

    return (
        <Flex 
            minHeight="100vh"
            width="100vw"
            align="center"
            justify="center"
            bg="gray.50"
        >
            <Container maxW="container.sm" py={10}>
                <ScaleFade initialScale={0.9} in={true}>
                    <Stack spacing={8} align="center">
                        <Heading 
                            size="xl" 
                            textAlign="center"
                            bgGradient="linear(to-r, blue.400, purple.500)"
                            bgClip="text"
                        >
                            Your Perfect Match!
                        </Heading>
                        
                        <Card 
                            maxW="500px" 
                            w="100%" 
                            boxShadow="xl"
                            borderRadius="lg"
                            overflow="hidden"
                        >
                            <SlideFade in={true} offsetY="20px">
                                <Image
                                    src={matchedDog.img}
                                    alt={matchedDog.name}
                                    height={{ base: "300px", md: "400px" }}
                                    width="100%"
                                    objectFit="cover"
                                    objectPosition="center"
                                />
                                <CardBody py={{ base: 4, md: 6 }}>
                                    <Stack spacing={{ base: 3, md: 4 }} align="center" textAlign="center">
                                        <Heading 
                                            size="md"
                                            color="blue.600"
                                        >
                                            Meet {matchedDog.name}!
                                        </Heading>
                                        <Text fontSize={{ base: "md", md: "lg" }}>
                                            <strong>Breed:</strong> {matchedDog.breed}
                                        </Text>
                                        <Text fontSize={{ base: "md", md: "lg" }}>
                                            <strong>Age:</strong> {matchedDog.age} years
                                        </Text>
                                        <Text fontSize={{ base: "md", md: "lg" }}>
                                            <strong>Location:</strong> {matchedDog.zip_code}
                                        </Text>
                                    </Stack>
                                </CardBody>
                            </SlideFade>
                        </Card>

                        <Button
                            colorScheme="blue"
                            size="lg"
                            onClick={() => navigate('/search')}
                            boxShadow="md"
                            _hover={{
                                transform: 'translateY(-2px)',
                                boxShadow: 'lg',
                            }}
                            transition="all 0.2s"
                        >
                            Back to Search
                        </Button>
                    </Stack>
                </ScaleFade>
            </Container>
        </Flex>
    );
};

export default Match; 