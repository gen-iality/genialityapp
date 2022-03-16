import React from 'react';
import { Input } from 'antd';

/**
  addonBefore: 'https://vimeo.com/event/' || https://youtu.be/ || <LinkOutlined />
*/
interface propsOptions {
  addonBefore: React.ReactNode;
  placeholder?: string;
}

const InputSource = ({ addonBefore, placeholder }: propsOptions) => {
  return <Input addonBefore={addonBefore} placeholder={placeholder} size='large' />;
};

export default InputSource;
