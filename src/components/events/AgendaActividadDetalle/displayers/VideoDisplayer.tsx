import { useState, useEffect, FunctionComponent } from 'react'
import ReactPlayer from 'react-player'
import HeaderColumnswithContext from '../HeaderColumns'

import { IBasicActivityProps } from './basicTypes'

const VideoDisplayer: FunctionComponent<IBasicActivityProps> = (props) => {
  const { activity } = props
  const urlVideo = activity?.video

  const [activityState] = useState('')
  const [isItAnFrame, setIsItAnFrame] = useState(false)

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

export default VideoDisplayer
