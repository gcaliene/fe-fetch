import { Card, CardBody, Image, Stack, Heading, Text, IconButton } from '@chakra-ui/react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Dog } from '../types';

interface DogCardProps {
    dog: Dog;
    isFavorite: boolean;
    onToggleFavorite: (dogId: string) => void;
}

const DogCard = ({ dog, isFavorite, onToggleFavorite }: DogCardProps) => {
    return (
        <Card position="relative">
            <Image
                src={dog.img}
                alt={dog.name}
                height="200px"
                objectFit="cover"
            />
            <IconButton
                aria-label="Favorite"
                icon={isFavorite ? <FaHeart /> : <FaRegHeart />}
                position="absolute"
                top={2}
                right={2}
                colorScheme={isFavorite ? "red" : "gray"}
                onClick={() => onToggleFavorite(dog.id)}
                bg="white"
                opacity={0.8}
                _hover={{ opacity: 1 }}
            />
            <CardBody>
                <Stack spacing={2}>
                    <Heading size="md">{dog.name}</Heading>
                    <Text><strong>Breed:</strong> {dog.breed}</Text>
                    <Text><strong>Age:</strong> {dog.age} years</Text>
                    <Text><strong>Location:</strong> {dog.zip_code}</Text>
                </Stack>
            </CardBody>
        </Card>
    );
};

export default DogCard; 