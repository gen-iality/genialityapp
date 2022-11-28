import { Row, Card, Col, Typography, Statistic } from 'antd';
import React from 'react';
import Participants from '../../common/Stadistics/Participants';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';

const { Title } = Typography;

export default function GeneratedData() {
        
 const { scores, millonaire,participants } = useMillonaireCMS();
  const scoresParticipants = participants.map((participant) => participant.score);
  const avaregeScore =  Math.round(scoresParticipants.reduce((acc, score) => acc + score, 0) / scoresParticipants.length);
  const scoreMax = Math.max(...scoresParticipants);
  const scoreMin = Math.min(...scoresParticipants);
  const socoreLessThan0 = scores.filter((score) => Number(score.score) < 0).length;
  const socoreGreaterThan0 = scores.filter((score) => Number(score.score) > 0).length;  
  const  minimunDate = new Date(Math.min(...participants.map((participant) => participant.time.seconds * 1000)));
  const  maximunDate = new Date(Math.max(...participants.map((participant) => participant.time.seconds * 1000)));

  //Tiempo total de juego  de todos los participantes
  const totalTime = participants.reduce((acc, participant) => acc + participant.stages.reduce((acc, stage) => acc + stage.time, 0), 0);
  const avaregeTime = totalTime / participants.length;
  const avaregeTimePerStages = avaregeTime / millonaire.stages.length;

  return (
    <Row gutter={[16, 16]} style={{ padding: '40px' }}>
      <Col>
        <Participants participants={participants} />
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
          <Row gutter={[16, 16]}>
            <Col>
              <Statistic title='Fecha minima de finalizacion' value={new Date(minimunDate).toLocaleString()} />
            </Col>
            <Col>
              <Statistic title='Tiempo maximo de finalizacion' value={new Date(maximunDate).toLocaleString()} />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col>
              <Statistic title='Tiempo promedio de respuesta' value={avaregeTime + ' Segundos'} />
            </Col>
            <Col>
              <Statistic title='Tiempo total de respuesta' value={totalTime + ' Segundos'} />
            </Col>
            <Col>
              <Statistic title='Tiempo promedio por etapa' value={avaregeTimePerStages + ' Segundos'} />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
}
