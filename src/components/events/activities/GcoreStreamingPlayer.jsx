import { useState, useEffect, useContext } from 'react'

import { CurrentUserContext } from '@context/userContext'
import { Grid } from 'antd'
import AgendaContext from '@context/AgendaContext'
import { CurrentEventUserContext } from '@context/eventUserContext'
import { getLiveStreamStatus } from '../../../adaptors/gcoreStreamingApi'
import GcorePlayer from '@components/livetransmision/GcorePlayer'

const { useBreakpoint } = Grid

function GcoreStreamingPlayer({ meeting_id, transmition, activity }) {
  const screens = useBreakpoint()

  const { request, typeActivity } = useContext(AgendaContext)
  const evetUserContext = useContext(CurrentEventUserContext)

  const [livestreamStatus, setLivestreamStatus] = useState(null)
  const [visibleMeets, setVisibleMeets] = useState(false)
  const [timer_id, setTimerId] = useState(null)

  const urlDefault =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4FLnQiNROZEVxb5XJ2yTan-j7TZKt-SI7Bw&usqp=CAU'

  const eviusmeetUrl = `https://meet.evius.co/${activity._id}`

  // Ejecuta el acceso a la solicitud del estudiante de participar en la transmisión
  useEffect(() => {
    if (transmition !== 'EviusMeet' || !evetUserContext.value) return
    if (
      request &&
      request[evetUserContext.value._id] &&
      request[evetUserContext.value._id].active
    ) {
      setVisibleMeets(true)
    } else {
      setVisibleMeets(false)
    }
  }, [transmition, request, evetUserContext.value])

  //Escucha cuando la transmisión se detiene
  useEffect(() => {
    if (!livestreamStatus?.active) {
      clearTimeout(timer_id)
      setTimerId(null)
    }
  }, [livestreamStatus])

  return (
    <>
      {livestreamStatus?.live ? (
        <>
          {((transmition == 'EviusMeet' && !visibleMeets) ||
            transmition !== 'EviusMeet') && (
            <>
              <GcorePlayer
                meeting_id={meeting_id}
                thereIsConnection={livestreamStatus?.live}
              />
            </>
          )}
          {transmition == 'EviusMeet' && visibleMeets && (
            <div style={{ aspectRatio: screens.xs ? '9/12' : '16/9' }}>
              <iframe
                width="100%"
                style={{ height: '100%' }}
                allow="autoplay; fullscreen; camera *;microphone *"
                allowFullScreen
                allowusermedia
                src={eviusmeetUrl}
                frameBorder="0"
              ></iframe>
            </div>
          )}
        </>
      ) : (
        <>
          {((transmition == 'EviusMeet' && !visibleMeets) ||
            transmition !== 'EviusMeet') && (
            <>
              <GcorePlayer
                meeting_id={meeting_id}
                thereIsConnection={livestreamStatus?.live}
              />
            </>
          )}
          {transmition == 'EviusMeet' && visibleMeets && (
            <div style={{ aspectRatio: screens.xs ? '9/12' : '16/9' }}>
              <iframe
                width="100%"
                style={{ height: '100%' }}
                allow="autoplay; fullscreen; camera *;microphone *"
                allowFullScreen
                allowusermedia
                src={eviusmeetUrl}
                frameBorder="0"
              ></iframe>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default GcoreStreamingPlayer
