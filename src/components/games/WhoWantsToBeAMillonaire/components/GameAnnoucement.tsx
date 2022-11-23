import { Space, Image, Typography, Button, Card, Row, Grid, Result } from 'antd';
import { ClockCircleOutlined, FireOutlined, CloseCircleOutlined, PoweroffOutlined } from '@ant-design/icons';
const { useBreakpoint } = Grid;
import { useMillonaireLanding } from '../hooks/useMillonaireLanding';
import Stages from './Stages';

const CASES_ANNOUNCEMENT = {
  TIME_OVER: {
    icon: <ClockCircleOutlined />,
    title: 'Se acabó el tiempo',
    subTitle: 'Lo sentimos, se acabó el tiempo para responder la pregunta, ya no puedes continuar jugando',
  },
  WRONG_ANSWER: {
    icon: <CloseCircleOutlined />,
    title: 'Respuesta incorrecta',
    subTitle: 'Lo sentimos, la respuesta que elegiste es incorrecta, ya no puedes continuar jugando',
  },
  RETIRED: {
    icon: <PoweroffOutlined />,
    title: 'Te retiraste',
    subTitle: 'Lo sentimos, te retiraste del juego, ya no puedes continuar jugando',
  },
  WIN: {
    icon: <FireOutlined />,
    title: 'Felicidades',
    subTitle: 'Felicidades, has ganado el juego, ya no puedes continuar jugando',
  },
};

export default function GameAnnoucement() {
  // lo iba crear para hacer la parte este de que mostrar que gano o perdio pero no me dio tiempo :(
  const { onChangeStatusGame, statusGame } = useMillonaireLanding();

  const screens = useBreakpoint();
  return (
    <Row
      align='middle'
      justify='center'
      style={{
        height: '100%',
      }}>
      <Card
        style={{
          border: 'none',
          backgroundColor: '#FFFFFFCC',
          backdropFilter: 'blur(8px)',
          maxWidth: screens.xs ? '95vw' : '45vw',
        }}>
        <Result
          icon={CASES_ANNOUNCEMENT[statusGame as keyof typeof CASES_ANNOUNCEMENT].icon}
          title={
            <Typography.Title level={2}>
              {CASES_ANNOUNCEMENT[statusGame as keyof typeof CASES_ANNOUNCEMENT].title}
            </Typography.Title>
          }
          subTitle={
            <Typography.Paragraph>
              {CASES_ANNOUNCEMENT[statusGame as keyof typeof CASES_ANNOUNCEMENT].subTitle}
            </Typography.Paragraph>
          }
          extra={
            <Space>
              <Button size='large' type='primary' onClick={() => onChangeStatusGame('GAME_OVER')}>
                Ir al Ranking
              </Button>
              <Button size='large' onClick={() => onChangeStatusGame('NOT_STARTED')}>
                Ir al Menu
              </Button>
            </Space>
          }
        />
      </Card>
    </Row>
  );
}
