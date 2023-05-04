/** React's libraries */
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

/** Antd imports */
import { List, Avatar, Typography, Row, Divider, Card, Space } from 'antd'
import { AlertOutlined } from '@ant-design/icons'

/** Helpers and utils */
import { EventsApi, SpeakersApi, ToolsApi } from '@helpers/request'

/** Context */
import { useEventContext } from '@context/eventContext'

const { Title, Text } = Typography

const HostList = () => {
  const cEvent = useEventContext()
  const intl = useIntl()

  const [speakers, setSpeakers] = useState<any[]>([])
  const [tools, setTools] = useState<any[]>([])
  const [duration, setDuration] = useState<any[]>([])

  useEffect(() => {
    ;(async () => {
      const speakersApi = await SpeakersApi.byEvent(cEvent.value._id)
      setSpeakers(speakersApi)
    })()
  }, [cEvent.value])

  useEffect(() => {
    ;(async () => {
      const toolsApi = await ToolsApi.byEvent(cEvent.value._id)
      console.log('toolsApi', toolsApi)
      setTools(toolsApi)
    })()
  }, [cEvent.value])

  useEffect(() => {
    ;(async () => {
      const event = await EventsApi.getOne(cEvent.value._id)
      console.log('event', event)
      setDuration(event.duration)
    })()
  }, [cEvent.value])

  return (
    <>
      {duration && (
        <>
          <Row style={{ marginBottom: '1rem' }}>
            <h3>DURACIÓN</h3>
            <Divider style={{ margin: '15px 0px' }} />
            <Text style={{ marginLeft: '1.5rem' }}>
              {duration}{' '}
              {intl.formatMessage({
                id: 'label.duration.content',
                defaultMessage: 'de contenido',
              })}
            </Text>
          </Row>
        </>
      )}

      {cEvent.value.event_tip && (
        <Card
          style={{
            borderRadius: '10px',
            border: '2px solid #bae637',
            margin: '0px 10px',
            textAlign: 'center',
          }}
        >
          <Space direction="vertical" align="center">
            <AlertOutlined style={{ fontSize: '2rem' }} />
            <Text style={{ fontSize: '1.5rem' }}>{cEvent.value.event_tip}</Text>
          </Space>
        </Card>
      )}

      {tools.length !== 0 && (
        <List
          size="small"
          header={<h3>HERRAMIENTAS</h3>}
          dataSource={tools}
          renderItem={(item) => (
            <List.Item>
              {item.link ? (
                <a href={item.link} target="_blank">
                  {item.name}
                </a>
              ) : (
                <p style={{ margin: 0, padding: 0, lineHeight: 1 }}>{item.name}</p>
              )}
            </List.Item>
          )}
        />
      )}

      <List
        size="small"
        header={<h3>COLABORADORES</h3>}
        dataSource={speakers}
        renderItem={(item: any) => (
          <List.Item className="shadow-box">
            <List.Item.Meta
              avatar={<Avatar src={item.image} />}
              description={
                <>
                  <p style={{ margin: 0, padding: 0, lineHeight: 1 }}>{item.name}</p>
                  <p style={{ margin: 0, padding: 0, lineHeight: 1 }}>
                    {item.profession || 'Profesor'}
                  </p>
                </>
              }
            />
          </List.Item>
        )}
      />
    </>
  )
}
export default HostList
