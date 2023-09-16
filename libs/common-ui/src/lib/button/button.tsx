import { Button, message } from 'antd';

export const AAButton = () => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <Button
      type="primary"
      onClick={() =>
        messageApi.success({
          type: 'success',
          content: 'Button works!',
          duration: 1,
        })
      }
    >
      {contextHolder}
      Acer Academy Button
    </Button>
  );
};
