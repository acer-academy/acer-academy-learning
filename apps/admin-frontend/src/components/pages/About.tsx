import React from "react";
import { Typography, Space } from "antd";

export const About: React.FC = () => {
  return (
    <Space direction="vertical" style={{ padding: "16px" }}>
      <Typography.Title level={3}>About page</Typography.Title>
      <Typography.Text>This is the text for the about page</Typography.Text>
    </Space>
  );
};