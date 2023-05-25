import { FunctionComponent, useCallback, useContext, useEffect, useState } from 'react'
import { Result } from 'antd'
import { SmileOutlined } from '@ant-design/icons'
import HeaderColumnswithContext from '../HeaderColumns'
import WithEviusContext from '@context/withContext'
import ImageComponentwithContext from '../ImageComponent'
import { withRouter } from 'react-router-dom'
import GcoreStreamingPlayer from '../GcoreStreamingPlayer'
import AgendaContext from '@context/AgendaContext'
import ReactPlayer from 'react-player'

import { IBasicActivityProps } from './basicTypes'
import { getActivityFirestoreData } from './getActivityFirestoreData'

const StreamingActivityDisplayer: FunctionComponent<IBasicActivityProps> = (props) => {
  const { activity } = props
  const [activityState, setactivityState] = useState('')
  const [meetingId, setmeetingId] = useState('')
  const [fnCiclo, setFnCiclo] = useState(false)

  // Estado para controlar origen de transmision

  const { transmition, setTransmition } = useContext(AgendaContext)

  useEffect(() => {
    async function GetStateStreamingRoom() {
      if (!fnCiclo) {
        await getActivityFirestoreData(props.cEvent.value._id, activity._id, (data) => {
          const { habilitar_ingreso, meeting_id } = data
          setactivityState(habilitar_ingreso)
          setmeetingId(meeting_id)
          setTransmition(data.transmition)
          setFnCiclo(true)
        })
      }
    }

    if (activity != null) {
      GetStateStreamingRoom()
    }
  }, [activity, props.cEvent])

  const ViewTypeStreaming = useCallback((actividad_estado) => {
    switch (actividad_estado) {
      case 'open_meeting_room':
        return (
          <>
            <GcoreStreamingPlayer
              activity={activity}
              transmition={transmition}
              meeting_id={meetingId}
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
        return (
          <>
            <GcoreStreamingPlayer
              activity={activity}
              transmition={transmition}
              meeting_id={meetingId}
            />
          </>
        )
    }
  })

  return (
    <>
      <HeaderColumnswithContext isVisible activityState={activityState} />
      {ViewTypeStreaming(activityState)}
    </>
  )
}

export default withRouter(WithEviusContext(StreamingActivityDisplayer))
