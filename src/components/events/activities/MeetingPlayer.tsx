import { FunctionComponent, useContext, useMemo } from 'react'
import { CurrentUserContext } from '@context/userContext'
import { Grid } from 'antd'

const { useBreakpoint } = Grid

interface IMeetingPlayerProps {
  activity: any
}

const MeetingPlayer: FunctionComponent<IMeetingPlayerProps> = (props) => {
  const { activity } = props

  const screens = useBreakpoint()

  const userContext = useContext(CurrentUserContext)

  // const imageDefault = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4FLnQiNROZEVxb5XJ2yTan-j7TZKt-SI7Bw&usqp=CAU'

  const eviusmeetUrl = useMemo(
    () =>
      `https://meet.evius.co/${activity._id}#userInfo.displayName="${encodeURIComponent(
        userContext.value?.names,
      )}"`,
    [activity, userContext.value],
  )

  return (
    <>
      <div className="mediaplayer">
        <iframe
          style={{ aspectRatio: screens.xs ? '10/20' : '16/9' }}
          width="100%"
          height={'100%'}
          allow="camera *;microphone *"
          frameborder="0"
          allowfullscreen
          src={eviusmeetUrl}
        ></iframe>
      </div>
    </>
  )
}

export default MeetingPlayer
