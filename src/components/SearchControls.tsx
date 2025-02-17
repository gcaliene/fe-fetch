import { Box, VStack, Select, HStack, Button, Badge } from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';

interface SearchControlsProps {
    breeds: string[];
    selectedBreeds: string[];
    sortOrder: 'asc' | 'desc';
    favoritesCount: number;
    isLoading: boolean;
    onBreedChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    onSortOrderChange: () => void;
    onGenerateMatch: () => void;
}

const SearchControls = ({
    breeds,
    selectedBreeds,
    sortOrder,
    favoritesCount,
    isLoading,
    onBreedChange,
    onSortOrderChange,
    onGenerateMatch
}: SearchControlsProps) => {
    return (
        <Box width="100%">
            <VStack spacing={4} align="stretch">
                <Select
                    multiple
                    size="lg"
                    value={selectedBreeds}
                    onChange={onBreedChange}
                    height="auto"
                    minHeight="100px"
                    isDisabled={isLoading}
                    sx={{
                        '& option:checked': {
                            backgroundColor: 'blue.500',
                            color: 'white'
                        },
                        '& option': {
                            padding: '8px',
                            margin: '2px'
                        }
                    }}
                >
                    {breeds.map((breed) => (
                        <option 
                            key={breed} 
                            value={breed}
                            selected={selectedBreeds.includes(breed)}
                        >
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
                        onClick={onSortOrderChange}
                        size={{ base: "sm", md: "md" }}
                        isDisabled={isLoading}
                    >
                        {sortOrder === 'asc' ? 'Sort by Breed (A → Z)' : 'Sort by Breed (Z → A)'}
                    </Button>

                    <Button
                        colorScheme="blue"
                        onClick={onGenerateMatch}
                        isDisabled={favoritesCount === 0 || isLoading}
                        size={{ base: "sm", md: "md" }}
                    >
                        Generate Match
                        {favoritesCount > 0 && (
                            <Badge ml={2} colorScheme="green">
                                {favoritesCount}
                            </Badge>
                        )}
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
};

export default SearchControls; 