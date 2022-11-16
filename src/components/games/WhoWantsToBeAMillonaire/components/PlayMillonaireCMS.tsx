import UserRating from './UserRating';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';
import { Button, Card, Col, Form, Row, Switch } from 'antd';
import Ranking from '../../common/Ranking';

export default function PlayMillonaireCMS() {
  const { published, active, onChangeVisibilityControl, scores, onResetProgressAll } = useMillonaireCMS();
  return (
    <Row gutter={[16, 16]} style={{ padding: '40px' }}>
      <Col>
        <Card hoverable style={{ borderRadius: '20px' }}>
          <Form.Item
            tooltip='Controla la visibilidad del módulo para los asistentes'
            label={<label>Publicar dinámica</label>}>
            <Switch
              onChange={(checked) => onChangeVisibilityControl('published', checked)}
              checkedChildren='Si'
              unCheckedChildren='No'
              checked={published}
              defaultChecked={published}
            />
          </Form.Item>
          <Form.Item
            tooltip='Abrir o cerrar la dinámica para que los asistentes puedan participar'
            label={<label>Abrir dinámica</label>}>
            <Switch
              onChange={(checked) => onChangeVisibilityControl('active', checked)}
              checkedChildren='Si'
              unCheckedChildren='No'
              checked={active}
              defaultChecked={active}
            />
          </Form.Item>
          <Form.Item
            tooltip='Elimana todos los puntajes, progreso de los asistentes'
            label={<label>Restablecer dinamica</label>}>
            <Button onClick={() => onResetProgressAll()}>Restablecer</Button>
          </Form.Item>
        </Card>
      </Col>
      <Col>
        <Card hoverable style={{ borderRadius: '20px', width: '100%' }}>
          <Ranking scores={scores} type={'points'} />
        </Card>
      </Col>
    </Row>
  );
}
