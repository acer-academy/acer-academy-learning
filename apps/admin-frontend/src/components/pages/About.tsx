import React from "react";
import { Text, VStack } from "@chakra-ui/react";

export const About: React.FC = () => {
  return (
    <VStack className="page" spacing={3}>
      <Text fontSize="2xl">About page</Text>
      <Text>This is the text for the about page</Text>
    </VStack>
  );
};