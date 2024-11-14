import { useState, useEffect, FunctionComponent, useRef } from 'react'
import ReactPlayer from 'react-player'
import HeaderColumnswithContext from '../HeaderColumns'
import { IBasicActivityProps } from './basicTypes'
import { FB } from '@helpers/firestore-request'

import { useUserEvent } from '@context/eventUserContext'
import { updateAttendeeInActivityRealTime } from '@helpers/HelperAuth'
import { Badge, Image } from 'antd'
import { useEventContext } from '@context/eventContext'

const VideoActivityDisplayer: FunctionComponent<IBasicActivityProps> = (props) => {
  const { activity, onActivityProgress } = props
  const urlVideo = activity?.content?.reference

  const [activityState] = useState('')
  const [isItAnFrame, setIsItAnFrame] = useState(false)
  const [viewedVideoProgress, setViewedVideoProgress] = useState(0)
  const [attendeeRealTime, setAttendeeRealTime] = useState<any>({})
  const [viewProgress, setViewProgress] = useState(0)

  const ref = useRef<ReactPlayer>()

  const cEventUser = useUserEvent()
  const cEvent = useEventContext()

  useEffect(() => {
    if (onActivityProgress !== undefined) onActivityProgress(0)
  }, [])

  useEffect(() => {
    console.debug(ref.current, activity?._id, cEventUser.value?._id)
    if (!ref.current) return
    if (!activity?._id) return
    if (!cEventUser.value?._id) return

    let unsubscribe: null | (() => void) = null

    const contentType = activity.content?.type

    if (contentType === 'video_url') {
      setIsItAnFrame(true)
      // The external videos are marked as viewed because we CANNOT know the progress (for now)
      if (typeof onActivityProgress === 'function') {
        onActivityProgress(100)
      }
    } else if (contentType === 'vimeo_url' || contentType === 'youtube_url') {
      setIsItAnFrame(false)

      // Load the current view progress (with R after the G)
      FB.Attendees.get(activity._id, cEventUser.value._id).then((data: any) => {
        setAttendeeRealTime(data)
        if (data && parseFloat(data.viewProgress)) {
          console.log('load video to:', data.viewProgress * 100, '%')
          setViewedVideoProgress(data.viewProgress)
          setViewProgress(data.viewProgress)

          // Some problems
          if (data.viewProgress > 1) {
            FB.Attendees.ref(activity._id!, cEventUser.value._id).set(
              {
                viewProgress: 1,
              },
              { merge: true },
            )
          }
        }
      })

      // Don't use the previous lines as realtime because you video player will fly throwing laser rays
      unsubscribe = FB.Attendees.ref(activity._id, cEventUser.value._id).onSnapshot(
        (snapshot) => {
          setAttendeeRealTime(snapshot.data())
        },
      )
    } else {
      console.error('The content type', contentType, 'is unknown')
    }

    return () => {
      typeof unsubscribe === 'function' && unsubscribe()
    }
  }, [activity, activity.content, cEventUser.value, ref.current])

  useEffect(() => {
    if (!viewedVideoProgress) return
    console.debug('vimeo timeUpdate', activity, viewedVideoProgress)

    if (typeof onActivityProgress === 'function') {
      onActivityProgress(viewedVideoProgress * 100)
    }
  }, [viewedVideoProgress])

  useEffect(() => {
    if (!ref.current) return
    if (viewProgress === 0) return
    ref.current.seekTo(viewProgress * ref.current.getDuration())
  }, [viewProgress, ref.current])

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

        {/* {cEvent.value?.permanent_video_banner && (
          <Image
            width="100%"
            src={cEvent.value.permanent_video_banner}
            alt={cEvent.value.permanent_video_banner}
            preview={false}
          />
        )} */}

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
            onReady={() => {
              if (ref.current && viewProgress) {
                console.log('ready: call seekTo')
                setTimeout(() => {
                  ref.current!.seekTo(viewProgress * ref.current!.getDuration())
                }, 2000)
              }
            }}
            onProgress={(state) => {
              if (state.played === 0) return

              setViewedVideoProgress(state.played)
              updateAttendeeInActivityRealTime(cEventUser.value, activity._id, {
                viewProgress: state.played,
                // checked_in: false,
                // checkedin_at: null,
              })
            }}
            controls
          />
        )}
      </div>
    </>
  )
}

export default VideoActivityDisplayer
