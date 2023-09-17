import React from "react";
import { Typography, Space } from "antd";

export const Home: React.FC = () => {
  return (
    <Space direction="vertical" style={{ padding: "16px" }}>
      <Typography.Title level={3}>Home page</Typography.Title>
      <Typography.Text>This is the text for the home page</Typography.Text>
    </Space>
  );
};