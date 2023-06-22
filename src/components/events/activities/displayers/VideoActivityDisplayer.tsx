import { useState, useEffect, FunctionComponent } from 'react'
import ReactPlayer from 'react-player'
import HeaderColumnswithContext from '../HeaderColumns'
import { IBasicActivityProps } from './basicTypes'
import { Badge } from 'antd'

import { useUserEvent } from '@context/eventUserContext'
import {
  updateAttendeeInActivityRealTime,
  monitorAttendeeInActivityRealTime,
  getAttendeeInActivity,
} from '@helpers/HelperAuth'

const VideoActivityDisplayer: FunctionComponent<IBasicActivityProps> = (props) => {
  const { activity, onActivityProgress } = props
  const urlVideo = activity?.video

  const [activityState] = useState('')
  const [isItAnFrame, setIsItAnFrame] = useState(false)
  const [viewprogress, setViewProgress] = useState(0)
  const [reactPlayervideoState, setReactPlayervideoState] = useState({
    duration: 0,
    videostate: {},
  })

  const [realTimeAsistenteActividad, setRealTimeAsistenteActividad] = useState({})

  const cEventUser = useUserEvent()

  const updateViewedVideoProgress = (state: any) => {
    let newProgress = Math.round(state.played * 100 * 10) / 10
    if (newProgress != viewprogress) setViewProgress(newProgress)
  }

  const handleOnDuration = (duration: any) => {
    console.log('vimeo dura', duration)
    setReactPlayervideoState((state) => {
      return { ...state, duration: duration }
    })
  }
  const handleOnPlayerReady = async (videostate: any) => {
    setReactPlayervideoState((state) => {
      return { ...state, videostate: videostate }
    })
  }

  //Con duración y estado consideramos en player listo
  useEffect(() => {
    if (!(reactPlayervideoState.duration && reactPlayervideoState.videostate)) return
    storedProgressUpdate(reactPlayervideoState)
  }, [reactPlayervideoState])

  const storedProgressUpdate = async ({ duration, videostate }) => {
    try {
      let doc = await getAttendeeInActivity(cEventUser.value, activity._id)
      let data = doc.data()
      if (!data || !data.viewProgess) return
      //Initial load check: Stored progress of current activity
      if (data.viewProgess && data.viewProgess > viewprogress) {
        setViewProgress(data.viewProgess)
        videostate.seekTo((data.viewProgess / 100) * duration)
      }
    } catch (e) {
      console.log('vimeo error', { e })
    }
  }

  useEffect(() => {
    if (!(cEventUser.value && activity._id)) return
    return monitorAttendeeInActivityRealTime(
      cEventUser.value,
      activity._id,
      (data: any) => {
        console.log('vimeo data', data)
        setRealTimeAsistenteActividad(data)
      },
    )
  }, [cEventUser, activity])

  useEffect(() => {
    if (!viewprogress) return

    //actualizamos la base de datos solo con números enteros
    if (Math.round(viewprogress / 1) !== viewprogress) return
    updateAttendeeInActivityRealTime(cEventUser.value, activity._id, {
      viewProgess: viewprogress,
    })

    //External callback on progress
    if (onActivityProgress) onActivityProgress(viewprogress)
  }, [viewprogress])

  useEffect(() => {
    if (activity.type.name === 'cargarvideo') {
      setIsItAnFrame(true)
    } else {
      setIsItAnFrame(false)
    }
  }, [activity])

  return (
    <>
      <HeaderColumnswithContext isVisible activityState={activityState} />
      <div className="mediaplayer" style={{ aspectRatio: '16/9' }}>
        {true && (
          <div className="animate__animated animate__bounceIn animate__delay-2s">
            <Badge count={`Progreso: ${viewprogress}%`} status="processing" />
            <Badge
              count={`${
                realTimeAsistenteActividad?.checked_in === true
                  ? 'Completo'
                  : 'No completado'
              }`}
              status={
                realTimeAsistenteActividad?.checked_in === true ? 'success' : 'default'
              }
            />
          </div>
        )}
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
            onReady={handleOnPlayerReady}
            onDuration={handleOnDuration}
            onProgress={updateViewedVideoProgress}
            style={{ objectFit: 'cover' }}
            width="100%"
            height="100%"
            url={urlVideo}
            controls
          />
        )}
      </div>
    </>
  )
}

export default VideoActivityDisplayer
