import { Button, Space, Modal, Spin, Row, Col, Image, Typography, Card, Grid, Tooltip } from 'antd';
import Rules from './Rules';
import { useMillonaireLanding } from '../hooks/useMillonaireLanding';
import Stages from './Stages';
import { getCorrectColor } from '@/helpers/utils';
const { useBreakpoint } = Grid;
export default function MenuGame() {
  const { millonaire, loading, onAnnouncement, onChangeStatusGame, scores, scoreUser } = useMillonaireLanding();
  const screens = useBreakpoint();
  const backgroundMillonaire = millonaire.appearance.background_color || '#120754'
  const primaryMillonaire = millonaire.appearance.primary_color || '#FFFFFFCC'
  const userExits = scores?.find((score) => score?.uid === scoreUser?.uid);
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
          backgroundColor: primaryMillonaire,
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
                    src={'https://via.placeholder.com/800/D4D1E3/FFFFFF/?text=Cargando'}
                  />
                }
                style={{
                  width: '200px',
                  height: '200px',
                }}
                alt='logo.png'
              />
            )}
            <Typography.Title level={4} style={{ textAlign: 'center', color: getCorrectColor(primaryMillonaire) }}>
              {millonaire.name}
            </Typography.Title>
          </Space>
          <Space size={'middle'} direction='vertical' style={{ width: '100%' }}>
            <Tooltip placement='top' title={userExits ? 'No puedes volver a jugar.' : null}>
              <Button style={{backgroundColor:backgroundMillonaire}} block size='large' disabled={userExits ? true : false} onClick={() => onAnnouncement()}>
                <Typography.Text style={{color:getCorrectColor(backgroundMillonaire)}} strong>{userExits ? 'Ya participaste' : 'Jugar'}</Typography.Text>
              </Button>
            </Tooltip>

            <Button style={{backgroundColor:backgroundMillonaire}} block size='large' onClick={() => onChangeStatusGame('GAME_OVER')}>
              <Typography.Text style={{color:getCorrectColor(backgroundMillonaire)}} strong>Ranking</Typography.Text>
            </Button>
            <Rules bgColor={backgroundMillonaire} rules={millonaire.rules} />
            <Stages />
          </Space>
        </Row>
      </Card>
    </Row>
  );
}
