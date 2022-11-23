import { Row, Card, Col, Typography, Statistic } from 'antd';
import React from 'react';
import Participants from '../../common/Stadistics/Participants';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';

const { Title } = Typography;

export default function GeneratedData() {
  const { scores, millonaire } = useMillonaireCMS();
  const avaregeScore = scores.reduce((acc, score) => acc + Number(score.score), 0) / scores.length || 0;
  const scoreMax = scores.reduce((acc, score) => (Number(score.score) > acc ? Number(score.score) : acc), 0);
  const scoreMin = scores.reduce((acc, score) => (Number(score.score) < acc ? Number(score.score) : acc), 0);
  const socoreLessThan0 = scores.filter((score) => Number(score.score) < 0).length;
  const socoreGreaterThan0 = scores.filter((score) => Number(score.score) > 0).length;
  const minimunTime = scores.reduce(
    (acc, score) => (Number(score.time.seconds) < acc ? Number(score.time.seconds) : acc),
    0
  );
  const maximunTime = scores.reduce(
    (acc, score) => (Number(score.time.seconds) > acc ? Number(score.time.seconds) : acc),
    0
  );
  return (
    <Row gutter={[16, 16]} style={{ padding: '40px' }}>
      <Col>
        <Participants participants={scores} />
      </Col>
      <Col>
        <Card hoverable style={{ borderRadius: '20px' }}>
          <Title level={4}>Estadisticas</Title>
          <Row gutter={[16, 16]}>
            <Col>
              <Statistic title='Preguntas' value={millonaire.stages.length} />
            </Col>
            <Col>
              <Statistic title='Participantes' value={scores.length} />
            </Col>
            <Col>
              <Statistic title='Puntaje promedio' value={avaregeScore} />
            </Col>
            <Col>
              <Statistic title='Puntaje máximo' value={scoreMax} />
            </Col>
            <Col>
              <Statistic title='Puntaje mínimo' value={scoreMin} />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col>
              <Statistic title='Cantidad de participantes con score menor 0' value={socoreLessThan0} />
            </Col>
            <Col>
              <Statistic title='Cantidad de participantes con score mayor  0' value={socoreGreaterThan0} />
            </Col>
          </Row>
          {/* <Row gutter={[16, 16]}>
            <Col>
              <Statistic title='Tiempo minimo finalizado' value={new Date(minimunTime).toLocaleDateString()} />
            </Col>
            <Col>
              <Statistic title='Tiempo maximo finalizado' value={new Date(maximunTime).toLocaleDateString()} />
            </Col>
          </Row> */}
        </Card>
      </Col>
    </Row>
  );
}
