import { Form, Switch } from 'antd';
import React from 'react';

interface IFormSettingProps {
  controlled: boolean;
  setControlled: React.Dispatch<React.SetStateAction<boolean>>;
}
const FormSetting = ({controlled, setControlled}:IFormSettingProps) => {
  return (
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
  );
};

export default FormSetting;
