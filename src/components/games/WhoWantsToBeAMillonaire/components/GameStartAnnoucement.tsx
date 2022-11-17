import { Space, Image, Typography, Button, Card, Row, Grid, Result } from 'antd';
import { useMillonaireLanding } from '../hooks/useMillonaireLanding';
const { useBreakpoint } = Grid;
export default function GameStartAnnoucement() {
  const { millonaire, visibilityControl, onStartGame, onChangeStatusGame } = useMillonaireLanding();
  const { name, appearance } = millonaire;
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
          icon={appearance.logo && <Image preview={false} src={appearance.logo} width={200} />}
          title={<Typography.Title level={2}>{name}</Typography.Title>}
          subTitle={
            <Typography.Paragraph>
              ¿Estas listo para iniciar? No olvides estar muy atento al tiempo que tienes por pregunta, en caso de que
              el contador llegue a cero no podrás continuar jugando.
            </Typography.Paragraph>
          }
          extra={
            <Space>
              <Button
                size='large'
                disabled={visibilityControl.active === false}
                type='primary'
                onClick={() => onStartGame()}>
                Empezar
              </Button>
              <Button size='large' onClick={() => onChangeStatusGame('NOT_STARTED')}>
                Volver
              </Button>
            </Space>
          }
        />
      </Card>
    </Row>
  );
}
