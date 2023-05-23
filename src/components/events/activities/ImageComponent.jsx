import { useState, useEffect } from 'react'
import WithEviusContext from '@context/withContext'
import { useHelper } from '@context/helperContext/hooks/useHelper'
import { Result } from 'antd'

const ImageComponent = (props) => {
  const { willStartSoon } = props
  const { currentActivity } = useHelper()
  const [activityState, setactivityState] = useState('')

  useEffect(() => {
    setactivityState(currentActivity?.habilitar_ingreso)
    return () => {
      setactivityState('')
    }
  }, [currentActivity])

  function RenderTextActivity(state) {
    switch (state) {
      case 'closed_meeting_room':
        return 'Esta lección esta por iniciar'

      case '':
        return 'Esta lección esta siendo configurada'

      default:
        break
    }
  }

  let imagePlaceHolder = ''
  if (props.cEvent.value.styles.toolbarDefaultBg) {
    imagePlaceHolder =
      'https://via.placeholder.com/1500x540/' +
      props.cEvent.value.styles.toolbarDefaultBg.replace('#', '') +
      '/' +
      props.cEvent.value.styles.textMenu.replace('#', '') +
      '?text=' +
      props.cEvent.value.name
  }
  const imageToShow = willStartSoon
    ? currentActivity?.image
      ? currentActivity?.image
      : props.cEvent.value.styles?.banner_image
      ? props.cEvent.value.styles?.banner_image
      : props.cEvent.value.styles.event_image
      ? props.cEvent.value.styles.event_image
      : imagePlaceHolder
    : props.cEvent.value.styles?.banner_image

  return (
    <div className="mediaplayer">
      {props.cEvent.value.styles.toolbarDefaultBg != undefined ||
      props.cEvent.value.styles.toolbarDefaultBg != '' ? (
        imageToShow && (
          <img
            className="activity_image"
            style={{
              width: '100%',
              height: '60vh',
              objectFit: 'cover',
            }}
            src={imageToShow}
            alt="Activity"
          />
        )
      ) : (
        <Result title={RenderTextActivity(activityState)} />
      )}
    </div>
  )
}

const ImageComponentwithContext = WithEviusContext(ImageComponent)
export default ImageComponentwithContext
