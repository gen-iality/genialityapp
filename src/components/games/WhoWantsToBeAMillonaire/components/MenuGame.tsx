import { Button, Space, Modal, Spin, Row, Col, Image, Typography, Card, Grid } from 'antd';
import Rules from './Rules';
import { useMillonaireLanding } from '../hooks/useMillonaireLanding';

const { useBreakpoint } = Grid;
export default function MenuGame() {
  const { millonaire, loading, onAnnouncement, onChangeStatusGame, statusGame } = useMillonaireLanding();
  const screens = useBreakpoint();

  if (loading) return <Spin />;

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
          maxWidth: screens.xs ? '95vw' : 'auto',
        }}>
        <Row gutter={[0, 80]} align='middle' justify='center'>
          <Space direction='vertical' align='center' style={{ width: '100%' }}>
            {millonaire?.appearance?.logo && (
              <Image
                preview={false}
                src={millonaire?.appearance?.logo}
                fallback={'https://via.placeholder.com/500/?text=Image not found!'}
                placeholder={
                  <Image
                    preview={false}
                    height={'200px'}
                    width={'200px'}
                    src={'https://via.placeholder.com/800/000000/FFFFFF/?text=Cargando'}
                  />
                }
                style={{
                  width: '200px',
                  height: '200px',
                }}
                alt='logo.png'
              />
            )}
            <Typography.Title level={4} style={{ textAlign: 'center' }}>
              {millonaire.name}
            </Typography.Title>
          </Space>
          <Space size={'middle'} direction='vertical' style={{ width: '100%' }}>
            <Button
              block
              size='large'
              //disabled={statusGame === 'GAME_OVER' ? true : false}
              onClick={() => onAnnouncement()}>
              <Typography.Text strong>Jugar</Typography.Text>
            </Button>
            <Button block size='large' onClick={() => onChangeStatusGame('GAME_OVER')}>
              <Typography.Text strong>Ranking</Typography.Text>
            </Button>
            <Rules rules={millonaire.rules} />
          </Space>
        </Row>
      </Card>
    </Row>
  );
}
