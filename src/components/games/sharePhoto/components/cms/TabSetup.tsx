import { Card, Col, Form, Input, Row, Switch, Typography } from 'antd';
import { SharePhoto } from '../../types';

interface Props {
  sharePhoto: SharePhoto;
}

export default function TabSetup(props: Props) {
  const { sharePhoto } = props;
  return (
    <Row gutter={[16, 16]} style={{ padding: '40px' }}>
      <Col span={18}>
        <Card hoverable style={{ borderRadius: '20px' }}>
          <Form.Item
            rules={[{ required: true, message: 'El nombre es requerido' }]}
            label={<label>Nombre de la dinamica</label>}
            initialValue={sharePhoto.title}
            name='title'>
            <Input type='text' showCount maxLength={50} />
          </Form.Item>
          <Form.Item label={<label>Tematica</label>} initialValue={sharePhoto.tematic} name='tematic'>
            <Input type='text' showCount maxLength={140} />
          </Form.Item>
          <Form.Item
            rules={[
              { min: 1, message: 'El valor debe ser superior o igual a 1' },
              { required: true, message: 'El valor debe ser superior o igual a 1' },
            ]}
            label={<label>Puntos por like</label>}
            initialValue={Number(sharePhoto.points_per_like)}
            name='points_per_like'>
            <Input type='number' min={1} />
          </Form.Item>
        </Card>
      </Col>
      <Col span={6}>
        <Card hoverable style={{ borderRadius: '20px' }}>
          <Form.Item
            tooltip='Controla la visibilidad del módulo para los asistentes'
            label={<label>Publicar dinámica</label>}
            initialValue={sharePhoto.published}
            valuePropName='checked'
            name='published'>
            <Switch checkedChildren='Si' unCheckedChildren='No' />
          </Form.Item>
          <Form.Item
            tooltip='Abrir o cerrar la dinámica para que los asistentes puedan participar'
            label={<label>Abrir dinámica</label>}
            initialValue={sharePhoto.active}
            valuePropName='checked'
            name='active'>
            <Switch checkedChildren='Si' unCheckedChildren='No' />
          </Form.Item>
          {/* Aqui deberia ir lo de controlar el estado publicado y abierto */}
        </Card>
      </Col>
      <Col span={24}>
        <Card hoverable style={{ borderRadius: '20px' }} title='Instrucciones'>
          <Typography>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Amet, cum sunt rerum similique, veritatis
            necessitatibus officiis quaerat sapiente error nulla modi. Sequi reprehenderit dolorem, est quod nihil
            tenetur id temporibus consectetur, nostrum repellendus corporis. Minus odit quia inventore quibusdam
            quaerat?
          </Typography>
        </Card>
      </Col>
    </Row>
  );
}
