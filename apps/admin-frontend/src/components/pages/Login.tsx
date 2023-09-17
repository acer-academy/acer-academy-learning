import { useReducer, useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthData } from '../../auth/AuthWrapper';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
} from '@chakra-ui/react';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = AuthData();

  type FormData = {
    email: string;
    password: string;
  };

  const [formData, setFormData] = useReducer(
    (state: FormData, newItem: Partial<FormData>) => ({ ...state, ...newItem }),
    { email: '', password: '' },
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const doLogin = async () => {
    try {
      await login(formData.email, formData.password);
      navigate('/account');
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred');
    }
  };

  const handleChange =
    (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormData({ [field]: e.target.value });
    };

  return (
    <VStack spacing={4} className="page">
      <Text fontSize="2xl">Login page</Text>
      <VStack spacing={3} className="inputs" width="300px">
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            value={formData.email}
            onChange={handleChange('email')}
            type="text"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            value={formData.password}
            onChange={handleChange('password')}
            type="password"
          />
        </FormControl>
        <Button onClick={doLogin}>Log in</Button>
        {errorMessage ? (
          <Box className="error" color="red.500">
            {errorMessage}
          </Box>
        ) : null}
      </VStack>
    </VStack>
  );
};
