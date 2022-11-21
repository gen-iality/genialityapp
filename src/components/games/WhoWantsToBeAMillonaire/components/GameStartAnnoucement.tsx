import { Space, Image, Typography, Button, Card, Row, Grid, Result, Modal } from 'antd';
import { useMillonaireLanding } from '../hooks/useMillonaireLanding';
const { useBreakpoint } = Grid;
import Stages from './Stages';
export default function GameStartAnnoucement() {
  const { millonaire, visibilityControl, onStartGame, onChangeStatusGame } = useMillonaireLanding();
  const { name, appearance } = millonaire;
  const screens = useBreakpoint();

  const startGame = () => {
    Modal.confirm({
      title: 'Estás a punto de iniciar el juego',
      content:
        'Recuerda que solo tienes UNA oportunidad, puedes arriesgarte en cada etapa o retirarte en cualquier momento y conservar tus puntos ganados.',
      type: 'confirm',
      okType: 'primary',
      okText: 'Jugar ahora',
      onOk: () => onStartGame(),
    });
  };

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
          icon={appearance.logo && <Image preview={false} src={appearance.logo} width={200} />}
          title={<Typography.Title level={2}>{name}</Typography.Title>}
          subTitle={
            <Typography.Paragraph>
              ¿Estás listo para iniciar? Puedes revisar las etapas para que identifiques cual te sirve de salvavidas. No
              olvides que cuentas con la ayuda del 50/50 pero ¡Ten mucho cuidado con el contador! Al llegar a cero
              perderás.
            </Typography.Paragraph>
          }
          extra={
            <Space wrap>
              <Button
                size='large'
                disabled={visibilityControl.active === false}
                type='primary'
                onClick={() => startGame()}>
                Empezar
              </Button>
              <Button size='large' onClick={() => onChangeStatusGame('NOT_STARTED')}>
                Volver
              </Button>
              <Stages />
            </Space>
          }
        />
      </Card>
    </Row>
  );
}
