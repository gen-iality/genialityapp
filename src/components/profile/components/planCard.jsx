import { Card, Statistic, Typography } from 'antd';

const planCard = ({ title, value, icon }) => {
  return (
    <Card style={{ textAlign: 'center', borderRadius: '15px' }}>
      <Statistic title={<Typography.Text strong>{title}</Typography.Text>} value={value} prefix={icon} />
    </Card>
  );
};

export default planCard;
