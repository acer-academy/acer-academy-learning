/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 This is a starter component and can be deleted.
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 Delete this file and get started with your project!
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
import { AAButton } from '@acer-academy-learning/common-ui';
import {
  Button,
  useToast
} from '@chakra-ui/react';

export function NxWelcome({ title }: { title: string }) {
  const toast = useToast();

  return (
    <div>
      Hello world
      <AAButton />
      <Button
        onClick={() =>
          toast({
            title: 'Account created.',
            description: "We've created your account for you.",
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        }
      >
        Show Toast
      </Button>
    </div>
  );
}

export default NxWelcome;
