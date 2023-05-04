/** React's libraries */
import { useEffect, useState, FunctionComponent } from 'react'
import { useIntl } from 'react-intl'

/** Antd imports */
import { List, Avatar, Typography, Row, Divider, Card, Space } from 'antd'
import { AlertOutlined } from '@ant-design/icons'

/** Helpers and utils */
import { EventsApi, SpeakersApi, ToolsApi } from '@helpers/request'

/** Context */
import { useEventContext } from '@context/eventContext'

interface HostListProp {
  event: any
}

const { Text } = Typography

const HostList: FunctionComponent<HostListProp> = (props) => {
  const { event } = props
  const intl = useIntl()

  const [speakers, setSpeakers] = useState<any[]>([])
  const [tools, setTools] = useState<any[]>([])

  useEffect(() => {
    ;(async () => {
      const speakersApi = await SpeakersApi.byEvent(event._id)
      setSpeakers(speakersApi)
    })()

    // Take the tool
    ;(async () => {
      const toolsApi = await ToolsApi.byEvent(event._id)
      console.log('toolsApi', toolsApi)
      setTools(toolsApi)
    })()
  }, [event])

  return (
    <>
      {event.duration && (
        <>
          <Row style={{ marginBottom: '1rem' }}>
            <h3>DURACIÓN</h3>
            <Divider style={{ margin: '15px 0px' }} />
            <Text style={{ marginLeft: '1.5rem' }}>
              {event.duration}{' '}
              {intl.formatMessage({
                id: 'label.duration.content',
                defaultMessage: 'de contenido',
              })}
            </Text>
          </Row>
        </>
      )}

      {event.event_tip && (
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
            <Text style={{ fontSize: '1.5rem' }}>{event.event_tip}</Text>
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
