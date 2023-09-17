import React from "react";
import { Typography, Space } from "antd";

export const Private: React.FC = () => {
  return (
    <Space direction="vertical" style={{ padding: "16px" }}>
      <Typography.Title level={3}>Members area</Typography.Title>
      <Typography.Text>This is the private members area</Typography.Text>
    </Space>
  );
};
