import { Result, Typography } from 'antd';
import InputSource from '../InputSource';

interface propsOptions {
  addonBefore: React.ReactNode;
  placeholder?: string;
  icon: string;
  subtitle?: string;
  type: string;
}

const ContentSource = ({ addonBefore, icon, subtitle, placeholder, type }: propsOptions) => {
  return (
    <Result
      style={{ margin: '0px 100px 0px 100px' }}
      icon={<img width={150} src={icon} />}
      subTitle={<Typography.Paragraph>{subtitle}</Typography.Paragraph>}
      title={<InputSource type={type} addonBefore={addonBefore} placeholder={placeholder} />}
    />
  );
};

export default ContentSource;
