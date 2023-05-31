import { Button, Card, Input, Space, Tooltip, Typography } from 'antd'
import { CopyFilled } from '@ant-design/icons'
import { useContext } from 'react'
import AgendaContext from '@context/AgendaContext'

export interface ShareMeetLinkCardProps {
  activityId: string
}

const CardShareLinkEviusMeet = (props: ShareMeetLinkCardProps) => {
  const { copyToClipboard } = useContext(AgendaContext)
  return (
    <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
      <Card.Meta
        title={
          <Typography.Text style={{ fontSize: '20px' }} strong>
            Enlaces para participantes
          </Typography.Text>
        }
        description={
          'Puedes compartir estos enlaces a las personas que participaran en tu reunión, ten en cuenta que los hosts pueden administrar la sala de reuniones, personalizarla e incluso finalizarla'
        }
      />
      <br />
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Typography.Text>Enlace para host</Typography.Text>
          <Input.Group compact>
            <Input
              style={{ width: 'calc(100% - 31px)' }}
              disabled
              value={`https://meet.evius.co/${props.activityId}`} /* value={linkRolProductor} */
            />
            <Tooltip title="Copiar productor url">
              <Button
                onClick={() =>
                  copyToClipboard(`https://meet.evius.co/${props.activityId}`)
                }
                icon={<CopyFilled style={{ color: '#0089FF' }} />}
              />
            </Tooltip>
          </Input.Group>
        </Space>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Typography.Text>Enlace para speakers</Typography.Text>
          <Input.Group compact>
            <Input
              style={{ width: 'calc(100% - 31px)' }}
              disabled
              value={`https://meet.evius.co/${props.activityId}`} /* value={linkRolProductor} */
            />
            <Tooltip title="Copiar speaker url">
              <Button
                onClick={() =>
                  copyToClipboard(`https://meet.evius.co/${props.activityId}`)
                }
                icon={<CopyFilled style={{ color: '#0089FF' }} />}
              />
            </Tooltip>
          </Input.Group>
        </Space>
      </Space>
    </Card>
  )
}

export default CardShareLinkEviusMeet
