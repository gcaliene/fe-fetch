import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Heading,
    Button,
    Grid,
    Select,
    HStack,
    VStack,
    Text,
    useToast,
    Flex,
    Badge,
} from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { getBreeds, searchDogs, getDogs, logout } from '../services/api';
import DogCard from '../components/DogCard';
import { Dog } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

interface PageInfo {
    next: string | null;
    prev: string | null;
}

const Search = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [breeds, setBreeds] = useState<string[]>([]);
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [isLoading, setIsLoading] = useState();
    const [cursor, setCursor] = useState<string | null>(null);
    const [pageInfo, setPageInfo] = useState<PageInfo>({ next: null, prev: null });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    const totalPages = Math.ceil(totalResults / 25);

    useEffect(() => {
        const fetchBreeds = async () => {
            try {
                const breedList = await getBreeds();
                setBreeds(breedList);
            } catch (error) {
                console.error('Error fetching breeds:', error);
                toast({
                    title: 'Error fetching breeds',
                    status: 'error',
                    duration: 3000,
                });
            }
        };
        fetchBreeds();
    }, [toast]);

    useEffect(() => {
        const fetchDogs = async () => {
            setIsLoading(true);
            try {
                const searchResponse = await searchDogs({
                    breeds: selectedBreeds,
                    size: 20,
                    from: cursor || undefined,
                    sort: `breed:${sortOrder}`,
                });
                const dogList = await getDogs(searchResponse.resultIds);
                setDogs(dogList);
                setTotalResults(searchResponse.total);

                const nextCursor = searchResponse.next?.split('from=')[1]?.split('&')[0] || null;
                const prevCursor = searchResponse.prev?.split('from=')[1]?.split('&')[0] || null;

                setPageInfo({ next: nextCursor, prev: prevCursor });
            } catch (error) {
                console.error('Error fetching dogs:', error);
                toast({
                    title: 'Error fetching dogs',
                    status: 'error',
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchDogs();
    }, [selectedBreeds, sortOrder, cursor, toast]);

    const handleBreedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const values = Array.from(event.target.selectedOptions, option => option.value);
        setSelectedBreeds(values);
        setCursor(null);
        setCurrentPage(1);
    };

    const handleSortOrderChange = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        setCursor(null);
        setCurrentPage(1);
    };

    const handleToggleFavorite = (dogId: string) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(dogId)) {
                newFavorites.delete(dogId);
            } else {
                newFavorites.add(dogId);
            }
            return newFavorites;
        });
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
            toast({
                title: 'Logout failed',
                status: 'error',
                duration: 3000,
            });
        }
    };

    const handleMatch = () => {
        navigate('/match', { state: { favoriteIds: Array.from(favorites) } });
    };

    const handleNextPage = () => {
        setCursor(pageInfo.next);
        setCurrentPage(prev => prev + 1);
    };

    const handlePrevPage = () => {
        setCursor(pageInfo.prev);
        setCurrentPage(prev => prev - 1);
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
            {isLoading ? <LoadingSpinner message="Fetching dogs..." /> :
                <Container
                    maxW="1200px"
                    py={6}
                    px={4}
                >
                    <VStack spacing={8} align="stretch" width="100%">
                        <Flex
                            justify="space-between"
                            align="center"
                            direction={{ base: "column", md: "row" }}
                            gap={4}
                        >
                            <Heading size="lg">Find Your Perfect Dog</Heading>
                            <Button variant="outline" onClick={handleLogout}>
                                Logout
                            </Button>
                        </Flex>

                        <Box width="100%">
                            <VStack spacing={4} align="stretch">
                                <Select
                                    multiple
                                    size="lg"
                                    value={selectedBreeds}
                                    onChange={handleBreedChange}
                                    height="auto"
                                    minHeight="100px"
                                >
                                    {breeds.map((breed) => (
                                        <option key={breed} value={breed}>
                                            {breed}
                                        </option>
                                    ))}
                                </Select>

                                <HStack
                                    spacing={4}
                                    wrap="wrap"
                                    justify={{ base: "center", md: "flex-start" }}
                                    gap={4}
                                >
                                    <Button
                                        leftIcon={sortOrder === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                        onClick={handleSortOrderChange}
                                        size={{ base: "sm", md: "md" }}
                                    >
                                        {sortOrder === 'asc' ? 'Sort by Breed (A → Z)' : 'Sort by Breed (Z → A)'}
                                    </Button>

                                    <Button
                                        colorScheme="blue"
                                        onClick={handleMatch}
                                        isDisabled={favorites.size === 0}
                                        size={{ base: "sm", md: "md" }}
                                    >
                                        Generate Match
                                        {favorites.size > 0 && (
                                            <Badge ml={2} colorScheme="green">
                                                {favorites.size}
                                            </Badge>
                                        )}
                                    </Button>
                                </HStack>
                            </VStack>
                        </Box>

                        <Grid
                            templateColumns={{
                                base: '1fr',
                                sm: 'repeat(2, 1fr)',
                                lg: 'repeat(3, 1fr)',
                                xl: 'repeat(4, 1fr)'
                            }}
                            gap={{ base: 4, md: 6 }}
                            width="100%"
                        >
                            {dogs.map((dog) => (
                                <DogCard
                                    key={dog.id}
                                    dog={dog}
                                    isFavorite={favorites.has(dog.id)}
                                    onToggleFavorite={handleToggleFavorite}
                                />
                            ))}
                        </Grid>

                        {totalPages > 1 && (
                            <VStack spacing={2} width="100%" py={4}>
                                <HStack justify="center" spacing={2} wrap="wrap">
                                    <Button
                                        onClick={handlePrevPage}
                                        isDisabled={currentPage === 1 || isLoading}
                                        size={{ base: "sm", md: "md" }}
                                    >
                                        Previous
                                    </Button>
                                    <Text>
                                        Page {currentPage} of {totalPages}
                                    </Text>
                                    <Button
                                        onClick={handleNextPage}
                                        isDisabled={currentPage === totalPages || isLoading}
                                        size={{ base: "sm", md: "md" }}
                                    >
                                        Next
                                    </Button>
                                </HStack>
                            </VStack>
                        )}
                    </VStack>
                </Container>
            }
        </Flex>
    );
};

export default Search; 