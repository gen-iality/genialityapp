/** React's libraries */
import { useEffect, useState, FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

/** Antd imports */
import { List, Avatar, Typography, Row, Divider, Card, Space } from 'antd'
import { AlertOutlined } from '@ant-design/icons'

/** Helpers and utils */
import { SpeakersApi, ToolsApi } from '@helpers/request'

interface AdditionalEventInfoProps {
  event: any
}

const { Text } = Typography

const AdditionalEventInfo: FunctionComponent<AdditionalEventInfoProps> = (props) => {
  const { event } = props

  const [isLoading, setIsLoading] = useState(true)
  const [speakers, setSpeakers] = useState<any[]>([])
  const [tools, setTools] = useState<any[]>([])

  const loadData = async () => {
    const speakersApi = await SpeakersApi.byEvent(event._id)
    setSpeakers(speakersApi)

    // Take the tool
    const toolsApi = await ToolsApi.byEvent(event._id)
    console.log('toolsApi', toolsApi)
    setTools(toolsApi)
  }

  useEffect(() => {
    setIsLoading(true)
    loadData().finally(() => setIsLoading(false))
  }, [event])

  return (
    <>
      {event.duration && (
        <>
          <Row style={{ marginBottom: '1rem' }}>
            <h3>
              <FormattedMessage id="label.duration" defaultMessage="Duración" />
            </h3>
            <Divider style={{ margin: '15px 0px' }} />
            <Text style={{ marginLeft: '1.5rem' }}>
              {event.duration}{' '}
              <FormattedMessage
                id="label.duration.content"
                defaultMessage="de contenido"
              />
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

      {tools.length > 0 && (
        <List
          size="small"
          header={
            <h3>
              <FormattedMessage id="label.tools" defaultMessage="Herramientas" />
            </h3>
          }
          dataSource={tools}
          loading={isLoading}
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
        header={
          <h3>
            <FormattedMessage id="label.speakers" defaultMessage="Colaboradores" />
          </h3>
        }
        dataSource={speakers}
        loading={isLoading}
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
export default AdditionalEventInfo
