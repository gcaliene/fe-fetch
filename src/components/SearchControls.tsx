import { Box, VStack, Select, HStack, Button, Badge, RangeSlider, RangeSliderTrack, RangeSliderFilledTrack, RangeSliderThumb, Text, Stack, Input, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';

interface SearchControlsProps {
    breeds: string[];
    selectedBreeds: string[];
    sortOrder: 'asc' | 'desc';
    favoritesCount: number;
    isLoading: boolean;
    ageRange: [number, number];
    zipCode: string;
    onBreedChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    onSortOrderChange: () => void;
    onGenerateMatch: () => void;
    onAgeRangeChange: (range: [number, number]) => void;
    onZipCodeChange: (zipCode: string) => void;
}

const SearchControls = ({
    breeds,
    selectedBreeds,
    sortOrder,
    favoritesCount,
    isLoading,
    ageRange,
    zipCode,
    onBreedChange,
    onSortOrderChange,
    onGenerateMatch,
    onAgeRangeChange,
    onZipCodeChange
}: SearchControlsProps) => {
    const hasNonDigits = /\D/.test(zipCode);

    return (
        <Box 
            width="100%" 
            height={{ base: "auto", lg: "calc(100vh - 100px)" }}
            position="sticky"
            top="20px"
        >
            <VStack spacing={4} align="stretch" height="100%">
                <HStack
                    spacing={4}
                    wrap="wrap"
                    justify={{ base: "center", md: "flex-start" }}
                    gap={4}
                    order={{ base: 3, lg: 1 }}
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

                <Stack spacing={4} order={{ base: 2, lg: 2 }}>
                    <Text fontSize="sm" fontWeight="medium">Age Range (years)</Text>
                    <HStack spacing={4}>
                        <Text fontSize="sm" color="gray.600">{ageRange[0]}</Text>
                        <RangeSlider
                            aria-label={['min age', 'max age']}
                            value={ageRange}
                            min={0}
                            max={20}
                            step={1}
                            onChange={(val) => onAgeRangeChange([val[0], val[1]])}
                            isDisabled={isLoading}
                        >
                            <RangeSliderTrack>
                                <RangeSliderFilledTrack />
                            </RangeSliderTrack>
                            <RangeSliderThumb index={0} />
                            <RangeSliderThumb index={1} />
                        </RangeSlider>
                        <Text fontSize="sm" color="gray.600">{ageRange[1]}</Text>
                    </HStack>
                </Stack>

                <FormControl isInvalid={hasNonDigits} order={{ base: 2, lg: 3 }}>
                    <FormLabel fontSize="sm" fontWeight="medium">Zip Code</FormLabel>
                    <Input
                        value={zipCode}
                        onChange={(e) => onZipCodeChange(e.target.value)}
                        placeholder="Enter zip code"
                        maxLength={5}
                        isDisabled={isLoading}
                    />
                    {hasNonDigits && (
                        <FormErrorMessage>Please enter numbers only</FormErrorMessage>
                    )}
                </FormControl>

                <Select
                    multiple
                    size="lg"
                    value={selectedBreeds}
                    onChange={onBreedChange}
                    height={{ base: "auto", lg: "calc(100vh - 400px)" }}
                    minHeight="100px"
                    isDisabled={isLoading}
                    order={{ base: 1, lg: 4 }}
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
            </VStack>
        </Box>
    );
};

export default SearchControls; 