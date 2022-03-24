import { Card, Button, Space, Typography } from 'antd';
import { DeleteOutlined, WarningOutlined } from '@ant-design/icons';
import { useTypeActivity } from '../../../../context/typeactivity/hooks/useTypeActivity';

const TransmitionOptions = (props: any) => {
  const { toggleActivitySteps } = useTypeActivity();

  return (
    <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
      <Card.Meta
        title={
          <Typography.Text style={{ fontSize: '20px' }} strong>
            Opciones de {props.type}
          </Typography.Text>
        }
        avatar={<WarningOutlined style={{ color: '#FE5455', fontSize: '25px' }} />}
        description={
          <Space>
            {props.type === 'Transmisión' && <Button type='default'>Reiniciar</Button>}
            {props.type === 'Transmisión' && (
              <Button type='primary' danger>
                Detener
              </Button>
            )}
            <Button onClick={() => toggleActivitySteps('initial')} type='text' danger>
              <DeleteOutlined /> Eliminar {props.type}
            </Button>
          </Space>
        }
      />
    </Card>
  );
};

export default TransmitionOptions;
