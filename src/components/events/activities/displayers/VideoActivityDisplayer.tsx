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
import { Badge } from 'antd'

const VideoActivityDisplayer: FunctionComponent<IBasicActivityProps> = (props) => {
  const { activity, onActivityProgress } = props
  const urlVideo = activity?.video

  const [activityState] = useState('')
  const [isItAnFrame, setIsItAnFrame] = useState(false)
  const [viewedVideoProgress, setViewedVideoProgress] = useState(0)
  const [attendeeRealTime, setAttendeeRealTime] = useState<any>({})

  const ref = useRef<ReactPlayer>()

  const cEventUser = useUserEvent()

  useEffect(() => {
    console.log(ref.current, activity?._id)
    if (!ref.current) return
    if (!activity?._id) return

    let unsubscribeCallback: (() => void) | null = null

    if (activity.type.name === 'cargarvideo') {
      setIsItAnFrame(true)
    } else {
      setIsItAnFrame(false)

      try {
        unsubscribeCallback = FB.Attendees.ref(
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
      } catch (e) {
        console.log('vimeo error', { e })
      }
    }

    return () => {
      if (typeof unsubscribeCallback === 'function') {
        unsubscribeCallback()
      }
    }
  }, [activity, ref.current])

  useEffect(() => {
    if (!viewedVideoProgress) return
    // if (Math.round(viewedVideoProgress / 1) !== viewedVideoProgress) return
    console.log('vimeo timeupdate', activity, viewedVideoProgress)

    updateAttendeeInActivityRealTime(cEventUser.value, activity._id, {
      viewProgess: viewedVideoProgress,
      checked_in: false,
      checkedin_at: null,
    })

    // Save the progress when it is over 99
    // if (viewedVideoProgress >= 99)
    //   checkinAttendeeInActivity(cEventUser.value, activity._id)
    if (typeof onActivityProgress === 'function')
      onActivityProgress(viewedVideoProgress * 100)
  }, [viewedVideoProgress])

  return (
    <>
      <HeaderColumnswithContext isVisible activityState={activityState} />
      <div className="mediaplayer" style={{ aspectRatio: '16/9' }}>
        <div>
          <Badge
            count={`Progreso: ${Math.round(viewedVideoProgress * 100)}%`}
            style={{ backgroundColor: '#0E594A', color: 'while' }}
          />
          <Badge
            count={`${
              attendeeRealTime?.checked_in === true ? 'Completo' : 'No completado'
            }`}
            style={{ backgroundColor: '#BA1D36', color: 'while' }}
          />
        </div>

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
