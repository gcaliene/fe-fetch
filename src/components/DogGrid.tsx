import { Grid } from '@chakra-ui/react';
import DogCard from './DogCard';
import { Dog } from '../types';

interface DogGridProps {
    dogs: Dog[];
    favorites: Set<string>;
    onToggleFavorite: (dogId: string) => void;
    isLoading: boolean;
}

const DogGrid = ({ dogs, favorites, onToggleFavorite }: DogGridProps) => {
    return (
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
                    onToggleFavorite={onToggleFavorite}
                />
            ))}
        </Grid>
    );
};

export default DogGrid; 