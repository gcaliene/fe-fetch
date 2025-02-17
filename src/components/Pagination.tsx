import { VStack, HStack, Button, Text } from '@chakra-ui/react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    isLoading: boolean;
    onPrevPage: () => void;
    onNextPage: () => void;
}

const Pagination = ({
    currentPage,
    totalPages,
    isLoading,
    onPrevPage,
    onNextPage
}: PaginationProps) => {
    if (totalPages <= 1) return null;

    return (
        <VStack spacing={2} width="100%" py={4}>
            <HStack justify="center" spacing={2} wrap="wrap">
                <Button
                    onClick={onPrevPage}
                    isDisabled={currentPage === 1 || isLoading}
                    size={{ base: "sm", md: "md" }}
                >
                    Previous
                </Button>
                <Text>
                    Page {currentPage} of {totalPages}
                </Text>
                <Button
                    onClick={onNextPage}
                    isDisabled={currentPage === totalPages || isLoading}
                    size={{ base: "sm", md: "md" }}
                >
                    Next
                </Button>
            </HStack>
        </VStack>
    );
};

export default Pagination; 