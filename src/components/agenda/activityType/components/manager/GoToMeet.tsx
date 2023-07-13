import { useMemo } from 'react'

import { Button, Card, Typography } from 'antd'
import { useCurrentUser } from '@context/userContext'
import type { ActivityType } from '@context/activityType/types/activityType'

export interface GoToMeetProps {
  activityId: string
  type: ActivityType.TypeAsDisplayment
}

const baseUrl = 'https://meet.evius.co'

/**
 * Crea un componente que permite ir al Meet.
 * @param props Generalmente el ID de actividad y el tipo de contenido (traducido).
 * @returns Un componente de React.
 */
const GoToMeet = (props: GoToMeetProps) => {
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
                props.type === 'reunión' ? urlReunion : urlEviusTransmision,
                '_blank',
              )
            }
            type="primary"
          >
            {props.type === 'reunión' && 'Entrar a la reunión'}
            {props.type === 'EviusMeet' && 'Entrar para transmitir'}
          </Button>
        }
      />
    </Card>
  )
}

export default GoToMeet
