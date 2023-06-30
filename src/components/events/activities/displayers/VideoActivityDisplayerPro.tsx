import { useState, useEffect, FunctionComponent, useRef } from 'react'
import ReactPlayer from 'react-player'
import HeaderColumnswithContext from '../HeaderColumns'
import { IBasicActivityProps } from './basicTypes'
import { FB } from '@helpers/firestore-request'

import { useUserEvent } from '@context/eventUserContext'
import { updateAttendeeInActivityRealTime } from '@helpers/HelperAuth'
import { Badge } from 'antd'

const VideoActivityDisplayer: FunctionComponent<IBasicActivityProps> = (props) => {
  const { activity, onActivityProgress } = props
  const urlVideo = activity?.video

  const [activityState] = useState('')
  const [isItAnFrame, setIsItAnFrame] = useState(false)
  const [viewedVideoProgress, setViewedVideoProgress] = useState(0)
  const [attendeeRealTime, setAttendeeRealTime] = useState<any>({})
  const [viewProgress, setViewProgress] = useState(0)

  const ref = useRef<ReactPlayer>()

  const cEventUser = useUserEvent()

  useEffect(() => {
    if (onActivityProgress !== undefined) onActivityProgress(0)
  }, [])

  useEffect(() => {
    console.log(ref.current, activity?._id, cEventUser.value?._id)
    if (!ref.current) return
    if (!activity?._id) return
    if (!cEventUser.value?._id) return

    if (activity.type.name === 'cargarvideo') {
      setIsItAnFrame(true)
    } else {
      setIsItAnFrame(false)

      // Load the current view progress (with R after the G)
      FB.Attendees.get(activity._id, cEventUser.value._id).then((data: any) => {
        setAttendeeRealTime(data)
        if (parseFloat(data.viewProgress)) {
          console.log('load video to:', data.viewProgress * 100, '%')
          setViewedVideoProgress(data.viewProgress)
          setViewProgress(data.viewProgress)
        }
      })
    }
  }, [activity, cEventUser.value, ref.current])

  useEffect(() => {
    if (!viewedVideoProgress) return
    console.log('vimeo timeupdate', activity, viewedVideoProgress)

    if (typeof onActivityProgress === 'function')
      onActivityProgress(viewedVideoProgress * 100)
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
                checked_in: false,
                checkedin_at: null,
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
