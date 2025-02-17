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
            <Center h="100vh">
                <Spinner size="xl" />
            </Center>
        );
    }

    return (
        <Container maxW="container.sm" py={10}>
            <Stack spacing={6} align="center">
                <Heading>Your Perfect Match!</Heading>
                <Card maxW="500px" w="100%">
                    <Image
                        src={matchedDog.img}
                        alt={matchedDog.name}
                        height="300px"
                        objectFit="cover"
                    />
                    <CardBody>
                        <Stack spacing={3}>
                            <Heading size="md">Meet {matchedDog.name}!</Heading>
                            <Text>
                                <strong>Breed:</strong> {matchedDog.breed}
                            </Text>
                            <Text>
                                <strong>Age:</strong> {matchedDog.age} years
                            </Text>
                            <Text>
                                <strong>Location:</strong> {matchedDog.zip_code}
                            </Text>
                        </Stack>
                    </CardBody>
                </Card>

                <Button
                    colorScheme="blue"
                    size="lg"
                    onClick={() => navigate('/search')}
                >
                    Back to Search
                </Button>
            </Stack>
        </Container>
    );
};

export default Match; 