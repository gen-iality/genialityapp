import { FunctionComponent, useMemo } from 'react'

import { Button, Card, Typography } from 'antd'
import { useCurrentUser } from '@context/userContext'

export enum GoToType {
  MEETING = 'MEETING',
  LIVE = 'LIVE',
}

export interface GoToMeetProps {
  activityId: string
  type: GoToType
}

const baseUrl = 'https://meet.evius.co'

// TODO: define when this component should be used. Check that name, the type of link too

/**
 * Crea un componente que permite ir al Meet.
 * @param props Generalmente el ID de actividad y el tipo de contenido (traducido).
 * @returns Un componente de React.
 */
const GoToMeet: FunctionComponent<GoToMeetProps> = (props) => {
  const user = useCurrentUser()

  const urlReunion = useMemo(
    () => `${baseUrl}/${props.activityId}`,
    [props.activityId, user],
  )

  const urlEviusTransmision = useMemo(
    () => `${baseUrl}/${props.activityId}`,
    [props.activityId, user],
  )

  console.debug('GoToMeet:props:', props)

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
                props.type === GoToType.MEETING ? urlReunion : urlEviusTransmision,
                '_blank',
              )
            }
            type="primary"
          >
            {props.type === GoToType.MEETING
              ? 'Entrar a la reunión'
              : props.type === GoToType.LIVE
              ? 'Entrar para transmitir'
              : 'Entrar'}
          </Button>
        }
      />
    </Card>
  )
}

export default GoToMeet
