import { Button, Card, Typography } from 'antd';
import { UseCurrentUser } from '../../../../context/userContext';
import { useContext } from 'react';
import AgendaContext from '@/context/AgendaContext';

const GoToEviusMeet = (props: any) => {
  const { dataLive } = useContext(AgendaContext);

  const user = UseCurrentUser();
  const baseUrl = 'https://eviusmeets.netlify.app/prepare';

  return (
    <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
      <Card.Meta
        title={
          <Typography.Text style={{ fontSize: '20px' }} strong>
            Evius Meet
          </Typography.Text>
        }
        description={
          <Button
            onClick={() =>
              window.open(
                `${baseUrl}?meetingId=${props.activityId}&username=${user.value?.names}&rtmp=${dataLive?.push_url}&rol=1`,
                '_blank'
              )
            }
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
