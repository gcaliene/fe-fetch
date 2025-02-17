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

const Search = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [breeds, setBreeds] = useState<string[]>([]);
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [isLoading, setIsLoading] = useState(false);
    const [cursor, setCursor] = useState<string | null>(null);
    const [pageInfo, setPageInfo] = useState({ next: null, prev: null });
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
        <Container maxW="container.xl" py={6}>
            <VStack spacing={6} align="stretch">
                <Flex justify="space-between" align="center">
                    <Heading size="lg">Find Your Perfect Dog</Heading>
                    <Button variant="outline" onClick={handleLogout}>
                        Logout
                    </Button>
                </Flex>

                <Box>
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

                        <HStack spacing={4}>
                            <Button
                                leftIcon={sortOrder === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                onClick={handleSortOrderChange}
                            >
                                {sortOrder === 'asc' ? 'Sort by Breed (A → Z)' : 'Sort by Breed (Z → A)'}
                            </Button>

                            <Button
                                colorScheme="blue"
                                onClick={handleMatch}
                                isDisabled={favorites.size === 0}
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
                    templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
                    gap={6}
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
                    <VStack spacing={2}>
                        <HStack justify="center" spacing={2}>
                            <Button
                                onClick={handlePrevPage}
                                isDisabled={currentPage === 1 || isLoading}
                            >
                                Previous
                            </Button>
                            <Text>
                                Page {currentPage} of {totalPages}
                            </Text>
                            <Button
                                onClick={handleNextPage}
                                isDisabled={currentPage === totalPages || isLoading}
                            >
                                Next
                            </Button>
                        </HStack>
                    </VStack>
                )}
            </VStack>
        </Container>
    );
};

export default Search; 