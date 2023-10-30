import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { Alert, Grid, Result } from 'antd'
import { SmileOutlined } from '@ant-design/icons'
import HeaderColumnswithContext from '../HeaderColumns'

import ImageComponentwithContext from '../ImageComponent'

import { IBasicActivityProps } from './basicTypes'
import { getActivityFirestoreData } from './getActivityFirestoreData'
import { useEventContext } from '@context/eventContext'
import ReactPlayer from 'react-player'
import { Link } from 'react-router-dom'

const StreamingActivityDisplayer: FunctionComponent<IBasicActivityProps> = (props) => {
  const { activity, onActivityProgress } = props
  const [activityState, setActivityState] = useState<any>(null)
  const [fnCiclo, setFnCiclo] = useState(false)

  const [finalUrl, setFinalUrl] = useState<string | null>(null)

  const screens = Grid.useBreakpoint()

  const cEvent = useEventContext()

  // if (!finalUrl) return <Alert type="warning" message="Sin contenido" />

  // Estado para controlar origen de transmision

  // IDK
  useEffect(() => {
    if (typeof onActivityProgress === 'function') onActivityProgress(100)
  }, [])

  useEffect(() => {
    if (activity.content?.reference) {
      setFinalUrl(activity.content.reference)
    }
  }, [activity.content?.reference])

  useEffect(() => {
    if (!activity._id) return
    if (!finalUrl) return

    async function GetStateStreamingRoom() {
      if (!fnCiclo || 1) {
        await getActivityFirestoreData(cEvent.value._id, activity._id!, (data) => {
          console.log(data)
          const { meeting_id } = data
          console.log('realtime:', data)
          setActivityState(data)
          setFnCiclo(true)

          if (meeting_id && meeting_id !== finalUrl) {
            setFinalUrl(meeting_id)
            // window.location.reload()
          }
        })
      }
    }

    if (activity != null) {
      GetStateStreamingRoom()
    }
  }, [finalUrl, cEvent.value])

  const looksLikeYouTubeOrVimeoLink = useMemo(() => {
    if (!finalUrl) return false
    if (!activity.content?.reference) return false

    if (
      finalUrl.toLocaleLowerCase().includes('youtube.com') ||
      finalUrl.toLocaleLowerCase().includes('youtu.be') ||
      finalUrl.toLocaleLowerCase().includes('vimeo.com')
    ) {
      return true
    }

    return false
  }, [finalUrl])

  const ViewTypeStreaming = (habilitar_ingreso: string | null | undefined) => {
    if (!finalUrl) return <Alert type="warning" message="Sin contenido" />

    switch (habilitar_ingreso) {
      case 'open_meeting_room':
        return looksLikeYouTubeOrVimeoLink ? (
          <ReactPlayer
            style={{ aspectRatio: '16/9' }}
            muted={false}
            playing
            loop
            width="100%"
            height="100%"
            url={finalUrl}
            controls={false}
          />
        ) : (
          <div style={{ aspectRatio: screens.xs ? '9/12' : '16/9' }}>
            <iframe
              width="100%"
              style={{ height: '100%' }}
              allow="autoplay; fullscreen; camera *;microphone *"
              allowFullScreen
              src={finalUrl}
            ></iframe>
          </div>
        )

      case 'ended_meeting_room':
        return <Result icon={<SmileOutlined />} title="La transmisión ha terminado!" />
      case 'created_meeting_room':
        return <ImageComponentwithContext />
      case 'no_visibe':
        return <ImageComponentwithContext />
      case null:
      case undefined:
      case '':
      case 'closed_meeting_room':
        return <Result icon={<SmileOutlined />} title="La transmisión iniciará pronto!" />
    }
  }

  return (
    <>
      <HeaderColumnswithContext isVisible activityState={activityState} />
      {ViewTypeStreaming(activityState?.habilitar_ingreso ?? activityState?.roomState)}
      <Link to={finalUrl ?? ''} target="_blank">
        {finalUrl}
      </Link>
    </>
  )
}

export default StreamingActivityDisplayer
