import { useReducer, useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { Space, Typography, Form, Input, Button, Alert } from 'antd';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

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
    <Space direction="vertical" style={{ padding: '16px' }}>
      <Typography.Title level={3}>Login page</Typography.Title>
      <Form layout="vertical" style={{ maxWidth: '300px' }}>
        <Form.Item label="Username">
          <Input
            value={formData.email}
            onChange={handleChange('email')}
            type="text"
          />
        </Form.Item>
        <Form.Item label="Password">
          <Input
            value={formData.password}
            onChange={handleChange('password')}
            type="password"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={doLogin}>
            Log in
          </Button>
        </Form.Item>
        {errorMessage ? (
          <Alert message={errorMessage} type="error" showIcon />
        ) : null}
      </Form>
    </Space>
  );
};
