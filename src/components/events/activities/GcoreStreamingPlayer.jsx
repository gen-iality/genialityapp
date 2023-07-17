import { useState, useEffect, useContext } from 'react'

import { Grid } from 'antd'
import AgendaContext from '@context/AgendaContext'
import { CurrentEventUserContext } from '@context/eventUserContext'

import GcorePlayer from '@components/livetransmision/GcorePlayer'

const { useBreakpoint } = Grid

function GcoreStreamingPlayer({ meeting_id, transmition, activity, isOnline }) {
  const screens = useBreakpoint()

  const { request, typeActivity } = useContext(AgendaContext)
  const evetUserContext = useContext(CurrentEventUserContext)

  const [visibleMeets, setVisibleMeets] = useState(false)

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

  return (
    <>
      {((transmition == 'EviusMeet' && !visibleMeets) || transmition !== 'EviusMeet') && (
        <>
          <GcorePlayer meeting_id={meeting_id} thereIsConnection={isOnline} />
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
          ></iframe>
        </div>
      )}
    </>
  )
}

export default GcoreStreamingPlayer
