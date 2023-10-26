import { FunctionComponent, useContext, useEffect, useState } from 'react'
import { Result } from 'antd'
import { SmileOutlined } from '@ant-design/icons'
import HeaderColumnswithContext from '../HeaderColumns'

import ImageComponentwithContext from '../ImageComponent'
import GcoreStreamingPlayer from '../GcoreStreamingPlayer'
import AgendaContext from '@context/AgendaContext'
import ReactPlayer from 'react-player'

import { IBasicActivityProps } from './basicTypes'
import { getActivityFirestoreData } from './getActivityFirestoreData'
import { useEventContext } from '@context/eventContext'

const StreamingActivityDisplayer: FunctionComponent<IBasicActivityProps> = (props) => {
  const { activity, onActivityProgress } = props
  const [activityState, setActivityState] = useState('')
  const [meetingId, setMeetingId] = useState('')
  const [fnCiclo, setFnCiclo] = useState(false)

  const cEvent = useEventContext()

  // Estado para controlar origen de transmision

  const { transmition, setTransmition } = useContext(AgendaContext)

  // IDK
  useEffect(() => {
    if (typeof onActivityProgress === 'function') onActivityProgress(100)
  }, [])

  useEffect(() => {
    if (!activity._id) return
    if (!activity.content?.reference) return

    setMeetingId(activity.content.reference)
    async function GetStateStreamingRoom() {
      if (!fnCiclo) {
        await getActivityFirestoreData(cEvent.value._id, activity._id, (data) => {
          console.log(data)
          const { habilitar_ingreso } = data
          console.log('realtime:', data)
          setActivityState(habilitar_ingreso)
          setTransmition(data.transmition)
          setFnCiclo(true)
        })
      }
    }

    if (activity != null) {
      GetStateStreamingRoom()
    }
  }, [activity.content, cEvent.value])

  const ViewTypeStreaming = (habilitar_ingreso: string | null | undefined) => {
    switch (habilitar_ingreso) {
      case 'open_meeting_room':
        return (
          <>
            <GcoreStreamingPlayer
              activity={activity}
              transmition={transmition}
              meeting_id={meetingId}
              isOnline={true}
            />
          </>
        )

      case 'closed_meeting_room':
        return (
          <>
            <Result icon={<SmileOutlined />} title="La transmisión iniciará pronto!" />
          </>
        )

      case 'ended_meeting_room':
        return activity?.video ? (
          <>
            <div className="mediaplayer" style={{ aspectRatio: '16/9' }}>
              <ReactPlayer
                style={{ objectFit: 'cover' }}
                width="100%"
                height="100%"
                url={activity && activity?.video}
                controls
              />
            </div>
          </>
        ) : (
          <>
            <Result icon={<SmileOutlined />} title="La transmisión ha terminado!" />
          </>
        )
      case 'created_meeting_room':
        return (
          <>
            <ImageComponentwithContext />
          </>
        )
      case 'no_visibe':
        return (
          <>
            <ImageComponentwithContext />
          </>
        )
      case null:
      case undefined:
        return (
          <>
            <GcoreStreamingPlayer
              activity={activity}
              transmition={transmition}
              meeting_id={meetingId}
              isOnline={false}
            />
          </>
        )
    }
  }

  return (
    <>
      <HeaderColumnswithContext isVisible activityState={activityState} />
      {ViewTypeStreaming(activityState)}
    </>
  )
}

export default StreamingActivityDisplayer
