import UserRating from './UserRating';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';
import { Button, Card, Col, Form, Row, Switch } from 'antd';
import Ranking from '../../common/Ranking';

export default function PlayMillonaireCMS() {
  const { published, active, onChangeVisibilityControl, scores, onResetProgressAll, millonaire } = useMillonaireCMS();
  const scoresOrder = scores.sort((a, b) => {
    if (a.score < b.score) {
      return 1;
    }
    if (a.score > b.score) {
      return -1;
    }
    if (new Date(a.time?.seconds * 1000) < new Date(b.time?.seconds * 1000)) {
      return 1;
    }
    if (new Date(a.time?.seconds * 1000) < new Date(b.time?.seconds * 1000)) {
      return -1;
    }
    return 0;
  });
  const newScores = scoresOrder.map((score, index) => {
    return {
      ...score,
      index: index + 1,
    };
  });
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
              disabled={millonaire.numberOfQuestions! > millonaire?.stages?.length}
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
              disabled={millonaire.numberOfQuestions! > millonaire?.stages?.length}
            />
          </Form.Item>
          <Form.Item
            tooltip='Elimana todos los puntajes, progreso de los asistentes'
            label={<label>Restablecer dinamica</label>}>
            <Button disabled={!active} onClick={() => onResetProgressAll()}>
              Restablecer
            </Button>
          </Form.Item>
        </Card>
      </Col>
      <Col>
        <Card hoverable style={{ borderRadius: '20px', width: '100%' }}>
          <Ranking scores={newScores} type={'points'} />
        </Card>
      </Col>
    </Row>
  );
}
