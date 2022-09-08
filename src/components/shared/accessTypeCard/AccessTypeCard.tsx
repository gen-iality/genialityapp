import { Avatar, Badge, Button, Card, Row, Space, Typography } from 'antd';
import { AccessTypeCardInterface } from './interfaces/interfaces';

const AccessTypeCard = ({
  index,
  icon,
  title,
  description = '',
  extra = () => {},
  infoIcon = [],
  callBackSelectedItem = () => {},
  itemSelected = '',
  extraState = false,
  isCms = false,
}: AccessTypeCardInterface) => {
  return (
    <Card
      bodyStyle={{ paddingTop: '0px' }}
      headStyle={{ border: 'none' }}
      title={
        <Avatar
          style={{
            color: itemSelected === index ? '#2593FC' : '#FFFFFF',
            backgroundColor: itemSelected === index ? '#2593FC' + '4D' : '#C4C4C4',
          }}
          size={'large'}
          shape='square'
          icon={icon}
        />
      }
      extra={
        <Space style={{ fontSize: '22px', color: itemSelected === index ? '#2593FC' + '99' : '#C4C4C4' }}>
          {infoIcon.map((item) => item)}
        </Space>
      }
      style={{
        height: '100%',
        minHeight: '350px',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        borderColor: itemSelected === index ? '#2593FC' : '#F0F0F0',
      }}>
      <Space style={{ width: '100%', height: '100%', userSelect: 'none' }} direction='vertical'>
        <Typography.Text strong style={{ fontSize: '16px' }}>
          {title}
        </Typography.Text>
        <Typography.Paragraph>{description}</Typography.Paragraph>

        <div>{extra({ callBackSelectedItem, extraState })}</div>
        <Row justify='end' align='bottom' style={{ position: 'absolute', bottom: '15px', right: '24px' }}>
          <div onClick={() => callBackSelectedItem(index)}>
            <Button
              style={{
                color: itemSelected === index ? '#2593FC' : '#FFFFFF',
                backgroundColor: itemSelected === index ? '#2593FC' + '4D' : '#C4C4C4',
              }}
              size='large'
              type={'text'}>
              {itemSelected === index ? 'Activado' : 'Seleccionar'}
            </Button>
          </div>
        </Row>
      </Space>
    </Card>
  );
};

export default AccessTypeCard;
