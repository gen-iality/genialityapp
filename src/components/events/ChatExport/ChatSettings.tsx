import { Form, Switch } from 'antd';
import React, { useState } from 'react';

const ChatSettings = () => {
  const [controlled, setControlled] = useState(false);
  return (
    <>
      <Form layout='vertical'>
        <Form.Item label={'Chats controlados'}>
          <Switch
            style={{ marginLeft: 10 }}
            checked={controlled}
            checkedChildren='Si'
            unCheckedChildren='No'
            onChange={(value) => {
              setControlled(value);
            }}
          />
        </Form.Item>
      </Form>
    </>
  );
};

export default ChatSettings;
