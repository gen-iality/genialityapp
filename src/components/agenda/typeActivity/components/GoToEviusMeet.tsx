import { Button, Card, Typography } from 'antd';
import { UseCurrentUser } from '../../../../context/userContext';
import { useContext } from 'react';
import AgendaContext from '@/context/AgendaContext';

const GoToEviusMeet = (props: any) => {
  const { dataLive } = useContext(AgendaContext);

  const user = UseCurrentUser();
  const baseUrl = 'https://stagingeviusmeet.netlify.app/prepare';
  const urlReunion = `${baseUrl}?meetingId=${props.activityId}&username=${user.value?.names}&rol=1`;
  const urlEviusTransmision = `${baseUrl}?meetingId=${props.activityId}&username=${user.value?.names}&rtmp=${dataLive?.push_url}&rol=1`;
  console.log('TYPE==>', props);
  return (
    <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
      <Card.Meta
        title={
          <Typography.Text style={{ fontSize: '20px' }} strong>
            GEN Connect
          </Typography.Text>
        }
        description={
          <Button
            onClick={() => window.open(props.type === 'reunión' ? urlReunion : urlEviusTransmision, '_blank')}
            type='primary'>
            {props.type === 'reunión' && 'Entrar a la reunión'}
            {props.type === 'EviusMeet' && 'Entrar para transmitir'}
          </Button>
        }
      />
    </Card>
  );
};

export default GoToEviusMeet;
