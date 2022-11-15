import { Space, Image, Typography, Button } from 'antd';
import { useMillonaireLanding } from '../hooks/useMillonaireLanding';
export default function GameStartAnnoucement() {
  const { millonaire, visibilityControl, onStartGame, onChangeStatusGame } = useMillonaireLanding();
  const { name, appearance } = millonaire;
  return (
    <Space direction='vertical' align='center'>
      <Typography.Title level={2}>{name}</Typography.Title>
      {appearance.logo && <Image src={appearance.logo} width={200} />}
      <Typography.Paragraph>
        El juego esta por empezar, recuerde que tiene que responder antes del tiempo termine o si no perdera
      </Typography.Paragraph>
      <Space>
        <Button disabled={visibilityControl.active === false} type='primary' onClick={() => onStartGame()}>
          Empezar
        </Button>
        <Button onClick={() => onChangeStatusGame('NOT_STARTED')}>Volver</Button>
      </Space>
    </Space>
  );
}
