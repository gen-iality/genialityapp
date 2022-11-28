import { Row, Card, Col, Typography, Statistic } from 'antd';
import React from 'react';
import Participants from '../../common/Stadistics/Participants';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';
import CardStatistic from './CardStatistic';

const { Title } = Typography;

export default function GeneratedData() {
  const { scores, millonaire, participants } = useMillonaireCMS();
  const scoresParticipants = participants.map((participant) => participant.score);
  const avaregeScore = Math.round(
    scoresParticipants.reduce((acc, score) => acc + score, 0) / scoresParticipants.length
  );
  const scoreMax = Math.max(...scoresParticipants);
  const scoreMin = Math.min(...scoresParticipants);
  const socoreLessThan0 = scores.filter((score) => Number(score.score) < 0).length;
  const socoreGreaterThan0 = scores.filter((score) => Number(score.score) > 0).length;
  const minimunDate = new Date(Math.min(...participants.map((participant) => participant.time.seconds * 1000)));
  const maximunDate = new Date(Math.max(...participants.map((participant) => participant.time.seconds * 1000)));

  //Tiempo total de juego  de todos los participantes
  const totalTime = participants.reduce(
    (acc, participant) => acc + participant.stages.reduce((acc, stage) => acc + stage.time, 0),
    0
  );
  const avaregeTime = totalTime / participants.length;
  const avaregeTimePerStages = avaregeTime / millonaire.stages.length;

  const listStatistics = [
    { id: 1, title: 'Etapas Totales', value: millonaire.stages.length, suffix: '' },
    { id: 2, title: 'Participantes', value: scores.length, suffix: '' },
    { id: 3, title: 'Puntaje promedio', value: avaregeScore, suffix: '' },
    { id: 4, title: 'Puntaje máximo registrado', value: scoreMax, suffix: '' },
    { id: 5, title: 'Puntaje mínimo registrado', value: scoreMin, suffix: '' },
    { id: 6, title: 'Participantes con puntaje (0)', value: socoreLessThan0, suffix: '' },
    { id: 7, title: 'Participantes con puntaje mayor a 0', value: socoreGreaterThan0, suffix: '' },
    { id: 8, title: 'Fecha minima de finalizacion', value: new Date(minimunDate).toLocaleString(), suffix: '' },
    { id: 9, title: 'Fecha maxima de finalizacion', value: new Date(maximunDate).toLocaleString(), suffix: '' },
    {
      id: 10,
      title: 'Tiempo promedio de respuesta',
      value: avaregeTime,
      suffix: <small>s</small>,
    },
    {
      id: 10,
      title: 'Tiempo total de respuesta',
      value: totalTime,
      suffix: <small>s</small>,
    },
    {
      id: 10,
      title: 'Tiempo promedio por etapa',
      value: avaregeTimePerStages,
      suffix: <small>s</small>,
    },
  ];

  return (
    <Row gutter={[16, 16]} style={{ padding: '40px' }}>
      <Col span={24}>
        <Participants participants={participants} />
      </Col>
      <Col span={24}>
        <Card hoverable style={{ borderRadius: '20px' }}>
          <Title level={4}>Estadisticas</Title>
          <Row justify='space-around' gutter={[16, 16]}>
            {listStatistics.map((statistic) => (
              <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={6} key={statistic.id}>
                <CardStatistic title={statistic.title} value={statistic.value} suffix={statistic.suffix} />
              </Col>
            ))}
          </Row>
        </Card>
      </Col>
    </Row>
  );
}
