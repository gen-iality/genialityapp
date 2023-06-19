import { useState, useEffect, FunctionComponent, useRef } from 'react'
import ReactPlayer from 'react-player'
import HeaderColumnswithContext from '../HeaderColumns'
import { IBasicActivityProps } from './basicTypes'
import { FB } from '@helpers/firestore-request'

import { useUserEvent } from '@context/eventUserContext'
import {
  updateAttendeeInActivityRealTime,
  checkinAttendeeInActivity,
} from '@helpers/HelperAuth'

const VideoActivityDisplayer: FunctionComponent<IBasicActivityProps> = (props) => {
  const { activity } = props
  const urlVideo = activity?.video

  const [activityState] = useState('')
  const [isItAnFrame, setIsItAnFrame] = useState(false)
  const [viewedVideoProgress, setViewedVideoProgress] = useState(0)
  const [attendeeRealTime, setAttendeeRealTime] = useState<any>({})
  const [realtimeUnsubscribe, setRealtimeUnsubscribe] = useState<(() => void) | null>(
    null,
  )

  const ref = useRef<ReactPlayer>()

  const cEventUser = useUserEvent()

  // Unsubscribe the realtime mechanism when the componet gets be unmounted
  useEffect(
    () => () => {
      if (typeof realtimeUnsubscribe === 'function') {
        realtimeUnsubscribe()
      }
    },
    [realtimeUnsubscribe],
  )

  useEffect(() => {
    if (!ref.current) return
    if (!activity?._id) return

    try {
      const unsubscrubeCallback = FB.Attendees.ref(
        activity._id,
        cEventUser.value._id,
      ).onSnapshot((doc) => {
        const data = doc.data()
        if (!data) return

        setAttendeeRealTime(data)
        console.log('vimeo asistente ', data)
        if (parseFloat(data.viewProgress) && data.viewProgess > viewedVideoProgress) {
          setViewedVideoProgress(data.viewProgess)
          console.log('vimeo timeupdate in database', data)
          ref.current!.seekTo(data.viewProgess)
        }
      })
      setRealtimeUnsubscribe(unsubscrubeCallback)
    } catch (e) {
      console.log('vimeo error', { e })
    }
  }, [activity, ref.current])

  useEffect(() => {
    if (!viewedVideoProgress) return
    if (Math.round(viewedVideoProgress / 1) !== viewedVideoProgress) return
    console.log('vimeo timeupdate', activity, viewedVideoProgress)

    updateAttendeeInActivityRealTime(cEventUser.value, activity._id, {
      viewProgess: viewedVideoProgress,
    })

    // Save the progress when it is over 99
    if (viewedVideoProgress >= 99)
      checkinAttendeeInActivity(cEventUser.value, activity._id)
  }, [viewedVideoProgress])

  return (
    <>
      <HeaderColumnswithContext isVisible activityState={activityState} />
      <div className="mediaplayer" style={{ aspectRatio: '16/9' }}>
        <p>
          Progreso: {viewedVideoProgress}% &nbsp; Completo:{' '}
          {attendeeRealTime?.checked_in === true ? 'COMPLETO' : 'AÚN NO'}
        </p>
        {isItAnFrame ? (
          <iframe
            style={{ aspectRatio: '16/9' }}
            width="100%"
            src={urlVideo + '?muted=1&autoplay=0'}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        ) : (
          <ReactPlayer
            style={{ objectFit: 'cover' }}
            ref={ref}
            width="100%"
            height="100%"
            url={urlVideo}
            onProgress={(state) => setViewedVideoProgress(state.played)}
            controls
          />
        )}
      </div>
    </>
  )
}

export default VideoActivityDisplayer
