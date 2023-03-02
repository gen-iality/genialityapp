import { List, Avatar } from 'antd'
import { useEffect, useState } from 'react'
import { useEventContext } from '@context/eventContext'
import { SpeakersApi, ToolsApi } from '@helpers/request'

const dataDuration = [
  {
    title: '1 hora de contenido',
  },
  {
    title: '6 horas de práctica',
  },
]

const HostList = () => {
  const cEvent = useEventContext()
  const [speakers, setSpeakers] = useState<any[]>([])
  const [tools, setTools] = useState<any[]>([])

  useEffect(() => {
    (async () => {
      const speakersApi = await SpeakersApi.byEvent(cEvent.value._id)
      setSpeakers(speakersApi)
    })()
  }, [])

  useEffect(() => {
    (async () => {
      const toolsApi = await ToolsApi.byEvent(cEvent.value._id)
      setTools(toolsApi)
    })()
  }, [])

  return (
    <>
      <List
        size="small"
        header={<h3>DURACIÓN</h3>}
        dataSource={dataDuration}
        renderItem={(item) => (
          <List.Item>
            <p style={{ margin: 0, padding: 0, lineHeight: 1 }}>{item.title}</p>
          </List.Item>
        )}
      />
      <List
        size="small"
        header={<h3>HERRAMIENTAS</h3>}
        dataSource={tools}
        renderItem={(item) => (
          <List.Item>
            <p style={{ margin: 0, padding: 0, lineHeight: 1 }}>{item.name}</p>{' '}
          </List.Item>
        )}
      />
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
                  <p style={{ margin: 0, padding: 0, lineHeight: 1 }}>{item.profession || 'Profesor'}</p>
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
