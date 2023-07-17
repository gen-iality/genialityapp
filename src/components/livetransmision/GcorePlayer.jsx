import { useContext, useEffect, useState, memo } from 'react'
import ReactPlayer from 'react-player'
import { getLiveStream } from '../../adaptors/gcoreStreamingApi'
import { Spin } from 'antd'
import AgendaContext from '@context/AgendaContext'
import { Grid } from 'antd'

const { useBreakpoint } = Grid

function GcorePlayer({ meeting_id, thereIsConnection }) {
  const screens = useBreakpoint()

  const defaultVideo =
    'https://firebasestorage.googleapis.com/v0/b/geniality-sas.appspot.com/o/public%2Fgeniality-loading-streaming.mp4?alt=media&token=97dc8cbf-dc80-477d-862c-6be0eeb11076'

  const { typeActivity } = useContext(AgendaContext)

  const [platformurl, setPlatformurl] = useState(defaultVideo)
  const [visibleReactPlayer, setVisibleReactPlayer] = useState(false)
  const [isConected, setIsConected] = useState(false)

  useEffect(() => {
    if (!meeting_id) return
    if (!thereIsConnection) {
      setIsConected(true)
      setPlatformurl(defaultVideo)
      setVisibleReactPlayer(true)
    } else if (thereIsConnection) {
      const asyncfunction = async () => {
        setIsConected(true)
        setPlatformurl('none')
        const live_stream = await getLiveStream(meeting_id)
        const url = live_stream.iframe_url
        visibleReactPlayer && setVisibleReactPlayer(false)
        /** se hace uso de un TimeOut para dar tiempo a wowza de inicializar la playList para que no devuelva error 404 la primera vez que el origen 'eviusMeets' envie data */
        setTimeout(() => {
          const aditionalParameters = typeActivity !== 'url' ? '?muted=1&autoplay=1' : ''
          setPlatformurl(url + aditionalParameters)
        }, 2000)
      }
      asyncfunction()
    } else if (typeActivity === 'youTube') {
      setVisibleReactPlayer(true)
      setIsConected(true)
      setPlatformurl('https://youtu.be/' + meeting_id)
    } else {
      setPlatformurl(meeting_id)
      setVisibleReactPlayer(false)
      setIsConected(true)
    }
    return () => {
      setPlatformurl(null)
    }
  }, [meeting_id, thereIsConnection, typeActivity])

  return (
    <>
      <div className="mediaplayer">
        {isConected && visibleReactPlayer ? (
          <>
            <ReactPlayer
              style={{ aspectRatio: '16/9' }}
              muted={false}
              playing
              loop
              width="100%"
              height="100%"
              url={platformurl}
              controls={false}
            />
          </>
        ) : isConected ? (
          <>
            <iframe
              style={screens.xs ? { aspectRatio: '10/20' } : { aspectRatio: '16/9' }}
              width="100%"
              height="100%"
              src={platformurl}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </>
        ) : (
          <Spin />
        )}
      </div>
    </>
  )
}

export default memo(GcorePlayer)
