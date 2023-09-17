/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 This is a starter component and can be deleted.
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 Delete this file and get started with your project!
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
import { AAButton } from '@acer-academy-learning/common-ui';
import { Row, Button, Calendar, notification } from 'antd';

export function NxWelcome({ title }: { title: string }) {
  // const toast = useToast();
  const [notifApi, contextHolder] = notification.useNotification();
  return (
    <div>
      Hello world
      <Row>
        <AAButton />
      </Row>
      <Row>
        {contextHolder}
        <Button
          onClick={() =>
            notifApi.success({
              message: 'Account created.',
              description: "We've created your account for you.",
              duration: 3,
            })
          }
        >
          Show Toast
        </Button>
      </Row>
      <Calendar />
    </div>
  );
}

export default NxWelcome;
