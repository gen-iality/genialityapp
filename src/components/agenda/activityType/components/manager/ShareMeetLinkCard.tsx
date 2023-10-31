import { Button, Card, Input, Space, Tooltip, Typography } from 'antd'
import { CopyFilled, LoadingOutlined } from '@ant-design/icons'

import { StateMessage } from '@context/MessageService'
import { useEffect, useState } from 'react'

export interface ShareMeetLinkCardProps {
  activityId: string
  onChange?: (finalLink: string) => void
}

const copyToClipboard = (data: string) => {
  navigator.clipboard.writeText(data)
  StateMessage.show(null, 'success', 'Copiado correctamente.!')
}

const CardShareLinkEviusMeet = (props: ShareMeetLinkCardProps) => {
  const [finalUrl, setFinalUrl] = useState<string | null>(null)

  useEffect(() => {
    if (props.activityId) {
      setFinalUrl(`https://meet.evius.co/${props.activityId}`)
    }
  }, [props.activityId])

  useEffect(() => {
    if (typeof props.onChange === 'function' && finalUrl) {
      props.onChange(finalUrl)
    }
  }, [finalUrl])

  if (!finalUrl) {
    return <LoadingOutlined />
  }

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
              value={finalUrl} /* value={linkRolProductor} */
            />
            <Tooltip title="Copiar productor url">
              <Button
                onClick={() => copyToClipboard(finalUrl)}
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
              value={finalUrl} /* value={linkRolProductor} */
            />
            <Tooltip title="Copiar speaker url">
              <Button
                onClick={() => copyToClipboard(finalUrl)}
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
