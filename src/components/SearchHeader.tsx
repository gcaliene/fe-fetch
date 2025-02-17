import { Flex, Heading, Button } from '@chakra-ui/react';

interface SearchHeaderProps {
    onLogout: () => Promise<void>;
}

const SearchHeader = ({ onLogout }: SearchHeaderProps) => {
    return (
        <Flex
            justify="space-between"
            align="center"
            direction={{ base: "column", md: "row" }}
            gap={4}
            width="100%"
        >
            <Heading size="lg">Find Your Perfect Dog</Heading>
            <Button variant="outline" onClick={onLogout}>
                Logout
            </Button>
        </Flex>
    );
};

export default SearchHeader; 