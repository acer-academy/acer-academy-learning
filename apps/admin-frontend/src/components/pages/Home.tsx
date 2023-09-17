import React from "react";
import { Text, VStack } from "@chakra-ui/react";

export const Home: React.FC = () => {
  return (
    <VStack className="page" spacing={3}>
      <Text fontSize="2xl">Home page</Text>
      <Text>This is the text for the home page</Text>
    </VStack>
  );
};