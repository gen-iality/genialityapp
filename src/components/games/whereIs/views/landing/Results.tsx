import { Card, Col, Image, Result, Row, Space, Tag, Typography } from 'antd';
import HeartBrokenIcon from '@2fd/ant-design-icons/lib/HeartBroken';
import TimerOutlineIcon from '@2fd/ant-design-icons/lib/TimerOutline';
const DataTimerResult = () => {
  return (
    <Tag
      style={{ padding: '5px 10px', fontSize: '16px' }}
      icon={<TimerOutlineIcon style={{ fontSize: '16px' }} />}
      color={'error' /* Si gano 'success', si perdio 'error' */}>
      08:25
    </Tag>
  );
};

export default function Results() {
  const dataResult = {
    winner: {
      icon: ' ',
      title: '¡Felicitaciones!',
      msg:
        'Has logrado el objetivo de la dinámica, esperamos te hayas divertido. Hemos registrado tu tiempo correctamente.',
      extra: <DataTimerResult />,
    },
    loser: {
      icon: <HeartBrokenIcon style={{ color: 'gray' }} />,
      title: 'Lo sentimos',
      msg:
        'Te quedaste sin vidas para continuar con la búsqueda, esperamos te hayas divertido, en otra oportunidad será.',
      extra: <DataTimerResult />,
    },
  };
  return (
    <Row justify='center' align='middle'>
      <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
        <Result
          icon={dataResult.loser.icon}
          title={dataResult.loser.title}
          subTitle={dataResult.loser.msg}
          extra={dataResult.loser.extra}
        />
      </Col>
      <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
        <Card>Ranking</Card>
      </Col>
    </Row>
  );
}
