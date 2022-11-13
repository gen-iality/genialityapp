import { Space, Image, Typography, Button } from 'antd';
import { useMillonaireLanding } from '../hooks/useMillonaireLanding';
export default function GameStartAnnoucement() {
  const { millonaire, onStartGame } = useMillonaireLanding();
  const { name, appearance } = millonaire;
  return (
    <Space direction='vertical' align='center'>
      <Typography.Title level={2}>{name}</Typography.Title>
      {appearance.logo && <Image src={appearance.logo} width={200} />}
      <Typography.Paragraph>
        El juego esta por empezar, recuerde que tiene que responder antes del tiempo termine o si no perdera
      </Typography.Paragraph>
      <Button type='primary' onClick={() => onStartGame()}>
        Empezar
      </Button>
    </Space>
  );
}
