import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, VStack, Flex, useToast } from '@chakra-ui/react';
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
    const [isLoading, setIsLoading] = useState(true);
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
        >
            {isLoading ? <LoadingSpinner message="Fetching dogs..." /> : (
                <Container maxW="1200px" py={6} px={4}>
                    <VStack spacing={8} align="stretch" width="100%">
                        <SearchHeader onLogout={handleLogout} />
                        
                        <SearchControls
                            breeds={breeds}
                            selectedBreeds={selectedBreeds}
                            sortOrder={sortOrder}
                            favoritesCount={favorites.size}
                            onBreedChange={handleBreedChange}
                            onSortOrderChange={handleSortOrderChange}
                            onGenerateMatch={handleMatch}
                        />

                        <DogGrid
                            dogs={dogs}
                            favorites={favorites}
                            onToggleFavorite={handleToggleFavorite}
                        />

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            isLoading={isLoading}
                            onPrevPage={handlePrevPage}
                            onNextPage={handleNextPage}
                        />
                    </VStack>
                </Container>
            )}
        </Flex>
    );
};

export default Search; 