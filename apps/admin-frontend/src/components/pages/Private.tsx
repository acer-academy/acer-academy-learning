import React from 'react';
import { Text, VStack } from '@chakra-ui/react';

export const Private: React.FC = () => {
  return (
    <VStack className="page" spacing={3}>
      <Text fontSize="2xl">Members area</Text>
      <Text>This is the private members area</Text>
    </VStack>
  );
};
