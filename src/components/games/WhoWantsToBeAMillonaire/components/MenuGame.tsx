import { Button, Space, Modal, Spin } from 'antd';
import Rules from './Rules';
import { useMillonaireLanding } from '../hooks/useMillonaireLanding';
export default function MenuGame() {
  const { millonaire, loading, onStartGame } = useMillonaireLanding();

  if (loading) return <Spin />;

  return (
    <div
      style={{
        background: millonaire?.appearance?.background_image
          ? ''
          : millonaire?.appearance?.background_color || '#33166A',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        padding: '1rem',
        backgroundImage: millonaire?.appearance?.background_image || '',
      }}>
      <img
        src={
          millonaire?.appearance?.logo ||
          'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Public%2FsrcImages%2Flogo.svg?alt=media&token=f081de0f-998b-48ba-9c66-16278ad848d7'
        }
        style={{
          width: 200,
          height: 200,
        }}
        alt='logo.png'
      />
      <Space direction='vertical'>
        <Button onClick={() => onStartGame()}>Iniciar</Button>
        <Rules rules={millonaire.rules} />
        <Button>Ranking</Button>
      </Space>
    </div>
  );
}
