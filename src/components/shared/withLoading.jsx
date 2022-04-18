import { Spin } from 'antd';

function WithLoading(Component) {
  return function WihLoadingComponent({ isLoading, ...props }) {
    if (isLoading) return <Spin></Spin>;
    return <Component {...props} />;
  };
}
export default WithLoading;
