import { useMemo } from 'react';

import { Button, Card, Typography } from 'antd';
import { useCurrentUser } from '@context/userContext';
import { useContext } from 'react';
import AgendaContext from '@context/AgendaContext';
import type { ActivityType } from '@context/activityType/types/activityType';

export interface GoToMeetProps {
  activityId: string,
  type: ActivityType.TypeAsDisplayment,
};

const baseUrl = 'https://stagingeviusmeet.netlify.app/prepare';

/**
 * Crea un componente que permite ir al Meet.
 * @param props Generalmente el ID de actividad y el tipo de contenido (traducido).
 * @returns Un componente de React.
 */
const GoToMeet = (props: GoToMeetProps) => {
  const { dataLive } = useContext(AgendaContext);

  const user = useCurrentUser();

  const urlReunion = useMemo(() => (
    `${baseUrl}?meetingId=${props.activityId}&username=${user.value?.names}&rol=1`),
    [props.activityId, user, dataLive],
  );

  const urlEviusTransmision = useMemo(() => (
    `${baseUrl}?meetingId=${props.activityId}&username=${user.value?.names}&rtmp=${dataLive?.push_url}&rol=1`),
    [props.activityId, user, dataLive],
  );

  console.debug('GoToMeet:props:', props);

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

export default GoToMeet;
