import { Flex, Heading, Button, IconButton } from '@chakra-ui/react';
import { FiLogOut } from 'react-icons/fi';

interface SearchHeaderProps {
    onLogout: () => Promise<void>;
}

const SearchHeader = ({ onLogout }: SearchHeaderProps) => {
    return (
        <Flex
            justify="space-between"
            align="center"
            width="100%"
        >
            <Heading size="lg">Find Your Perfect Dog</Heading>
            <IconButton
                aria-label="Logout"
                icon={<FiLogOut />}
                variant="outline"
                onClick={onLogout}
                display={{ base: "flex", md: "none" }}
            />
            <Button 
                variant="outline" 
                onClick={onLogout}
                display={{ base: "none", md: "flex" }}
            >
                Logout
            </Button>
        </Flex>
    );
};

export default SearchHeader; 