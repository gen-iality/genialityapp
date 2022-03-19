;
import { Card, Button, Space, Typography } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

const TransmitionOptions = () => {
  return (
    <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
      <Card.Meta
        title={
          <Typography.Text style={{ fontSize: '20px' }} strong>
            Evius Meet
          </Typography.Text>
        }
        avatar={<WarningOutlined style={{ color: '#FE5455', fontSize: '25px' }} />}
        description={
          <Space>
            <Button type='default'>Reiniciar</Button>
            <Button type='primary' danger>
              Detener
            </Button>
            <Button type='text' danger>
              Eliminar transmición
            </Button>
          </Space>
        }
      />
    </Card>
  );
};

export default TransmitionOptions;
