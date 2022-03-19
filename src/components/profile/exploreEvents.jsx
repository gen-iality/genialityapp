import { Button, Card, message, Result, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';

const ExploreEvents = () => {
  return (
    <Card
      style={{ borderRadius: '10px', border: '2px dashed #cccccc', cursor: 'pointer' }}
      bodyStyle={{ padding: '0px' }}>
      <Result
        icon={' '}
        title='No encontramos eventos en los que este registrado'
        extra={
          <Link to={'/'}>
            <Button size='large' type='primary'>
              Explorar eventos
            </Button>
          </Link>
        }
      />
    </Card>
  );
};

export default ExploreEvents;
