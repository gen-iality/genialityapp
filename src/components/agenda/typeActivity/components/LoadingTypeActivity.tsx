;
import { Result } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const LoadingTypeActivity = () => {
  return <Result icon={<LoadingOutlined />} title='Este proceso puede tardar unos minutos' />;
};

export default LoadingTypeActivity;
