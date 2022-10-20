import { Card, Col, Divider, Row, Space, Typography } from 'antd';
import FormatTextIcon from '@2fd/ant-design-icons/lib/FormatText';
import ImageOutlineIcon from '@2fd/ant-design-icons/lib/ImageOutline';

const CommonSelectTypeValue = ({
  onChange,
  name,
}: {
  onChange: (values: string, name: string) => void;
  name: string;
}) => {
  return (
    <Row align='middle' justify='space-between'>
      <Col span={11}>
        <Card bordered={false} hoverable onClick={() => onChange('text', name)}>
          <Space size={3} direction='vertical' style={{ width: '100%' }}>
            <FormatTextIcon style={{ fontSize: '40px', color: '#6B7283' }} />
            <Typography.Text style={{ fontSize: '16px', color: '#6B7283' }}>Agregar texto</Typography.Text>
          </Space>
        </Card>
      </Col>
      <Divider style={{ height: '50px' }} type='vertical' />
      <Col span={11}>
        <Card bordered={false} hoverable onClick={() => onChange('image', name)}>
          <Space size={3} direction='vertical' style={{ width: '100%' }}>
            <ImageOutlineIcon style={{ fontSize: '40px', color: '#6B7283' }} />
            <Typography.Text style={{ fontSize: '16px', color: '#6B7283' }}>Agregar imagen</Typography.Text>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};

export default CommonSelectTypeValue;
