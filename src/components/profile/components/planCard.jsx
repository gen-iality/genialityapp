import { Card, Statistic, Typography } from 'antd';

const planCard = ({ title, value, icon, message }) => {
  return (
    <Card style={{ textAlign: 'center', borderRadius: '15px', height: '125px' }}>
      <Statistic title={<Typography.Text strong>{title}</Typography.Text>} value={value} prefix={icon} />
      <small>{message}</small>
    </Card>
  );
};

export default planCard;
