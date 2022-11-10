import UserRating from './UserRating';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';
import { Card, Col, Form, Row, Switch } from 'antd';
export default function PlayMillonaireCMS() {
  return (
    <div>
      <Row>
        <Col>
          <Card hoverable style={{ borderRadius: '20px' }}>
            <Form.Item
              tooltip='Controla la visibilidad del módulo para los asistentes'
              label={<label>Publicar dinámica</label>}
              valuePropName='checked'
              name='published'>
              <Switch checkedChildren='Si' unCheckedChildren='No' />
            </Form.Item>
            <Form.Item
              tooltip='Abrir o cerrar la dinámica para que los asistentes puedan participar'
              label={<label>Abrir dinámica</label>}
              valuePropName='checked'
              name='active'>
              <Switch checkedChildren='Si' unCheckedChildren='No' />
            </Form.Item>
            {/* Aqui deberia ir lo de controlar el estado publicado y abierto */}
          </Card>
        </Col>
        <Col>
          <UserRating />
        </Col>
      </Row>
    </div>
  );
}
