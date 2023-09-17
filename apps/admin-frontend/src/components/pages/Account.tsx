import { AuthData } from "../../auth/AuthWrapper";
import { Text, VStack } from "@chakra-ui/react";

export const Account: React.FC = () => {
  const { user } = AuthData();

  return (
    <VStack className="page" spacing={3}>
      <Text fontSize="2xl">Your Account</Text>
      <Text>Name: {user.name}</Text>
      <Text>Email: {user.email}</Text>
    </VStack>
  );
};
