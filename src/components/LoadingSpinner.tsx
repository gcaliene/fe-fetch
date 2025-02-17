import { Flex, Spinner, Text, VStack } from '@chakra-ui/react';

interface LoadingSpinnerProps {
    message?: string;
}

const LoadingSpinner = ({ message = 'Loading...' }: LoadingSpinnerProps) => {
    return (
        <Flex 
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            zIndex={999}
            backgroundColor="rgba(255, 255, 255, 0.8)"
            justify="center"
            align="center"
        >
            <VStack spacing={4}>
                <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="xl"
                />
                <Text fontSize="lg" fontWeight="medium">
                    {message}
                </Text>
            </VStack>
        </Flex>
    );
};

export default LoadingSpinner; 