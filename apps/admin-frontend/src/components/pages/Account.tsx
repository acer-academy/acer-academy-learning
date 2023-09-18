import React from "react";
import { useAuth } from "../../auth/AuthContext";
import { Typography, Space } from "antd";

export const Account: React.FC = () => {
  const { user } = useAuth();

  return (
    <Space direction="vertical" style={{ padding: "16px" }}>
      <Typography.Title level={3}>Your Account</Typography.Title>
      <Typography.Text>Name: {user.name}</Typography.Text>
      <Typography.Text>Email: {user.email}</Typography.Text>
    </Space>
  );
};