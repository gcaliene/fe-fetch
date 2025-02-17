import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, VStack, Flex, useToast, Box } from '@chakra-ui/react';
import { getBreeds, searchDogs, getDogs, logout } from '../services/api';
import { Dog } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchHeader from '../components/SearchHeader';
import SearchControls from '../components/SearchControls';
import DogGrid from '../components/DogGrid';
import Pagination from '../components/Pagination';

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
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
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
            } finally {
                setIsInitialLoading(false);
            }
        };
        fetchBreeds();
    }, [toast]);

    useEffect(() => {
        const fetchDogs = async () => {
            setIsSearching(true);
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
                setIsSearching(false);
            }
        };
        fetchDogs();
    }, [selectedBreeds, sortOrder, cursor, toast]);

    const handleBreedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        // Create an array from the select's options
        const selectedOptions = Array.from(event.target.selectedOptions);
        // Map the selected options to their values
        const selectedValues = selectedOptions.map(option => option.value);
        
        // Update selected breeds
        setSelectedBreeds(selectedValues);
        
        // Reset pagination when breeds change
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

    if (isInitialLoading) {
        return <LoadingSpinner message="Loading..." />;
    }

    return (
        <Flex
            minHeight="100vh"
            width="100vw"
            align="center"
            justify="center"
            bg="gray.50"
        >
            <Container maxW="1200px" py={6} px={4}>
                <VStack spacing={8} align="stretch" width="100%">
                    <SearchHeader onLogout={handleLogout} />
                    
                    <Flex direction={{ base: "column", lg: "row" }} gap={6}>
                        <Box width={{ base: "100%", lg: "300px" }} flexShrink={0}>
                            <SearchControls
                                breeds={breeds}
                                selectedBreeds={selectedBreeds}
                                sortOrder={sortOrder}
                                favoritesCount={favorites.size}
                                onBreedChange={handleBreedChange}
                                onSortOrderChange={handleSortOrderChange}
                                onGenerateMatch={handleMatch}
                                isLoading={isSearching}
                            />
                        </Box>

                        <Box flex={1}>
                            <DogGrid
                                dogs={dogs}
                                favorites={favorites}
                                onToggleFavorite={handleToggleFavorite}
                                isLoading={isSearching}
                            />

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                isLoading={isSearching}
                                onPrevPage={handlePrevPage}
                                onNextPage={handleNextPage}
                            />
                        </Box>
                    </Flex>
                </VStack>
            </Container>
        </Flex>
    );
};

export default Search; 