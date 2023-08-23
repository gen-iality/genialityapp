import { LoadingOutlined } from '@ant-design/icons'
import {
  checkinAttendeeInActivity,
  updateAttendeeInActivityRealTime,
} from '@helpers/HelperAuth'
import { Button } from 'antd'
import { CSSProperties, FunctionComponent, PropsWithChildren, useState } from 'react'

interface IMarkAsViewedButtonProps {
  eventUser: any
  activity: any
}

const style: CSSProperties = {
  border: 'none',
  borderRadius: '10px',
  color: 'white',
  backgroundColor: '#ff82e2',
  fontSize: '12px',
  height: '20px',
  lineHeight: '20px',
  marginLeft: '2px',
}

const MarkAsViewedButton: FunctionComponent<
  PropsWithChildren<IMarkAsViewedButtonProps>
> = (props) => {
  const { children, eventUser, activity } = props
  const [isLoading, setIsLoading] = useState(false)

  const markAsViewed = async () => {
    // Create the whole checked in data
    await checkinAttendeeInActivity(eventUser, activity._id).finally(() => {
      setIsLoading(false)
    })
    // Set the view progress: 1 = 100%
    await updateAttendeeInActivityRealTime(eventUser, activity._id, {
      viewProgress: 1.0,
    })
  }

  const onClick = () => {
    setIsLoading(true)

    markAsViewed().finally(() => setIsLoading(false))

    console.log(eventUser)
  }

  return (
    <Button
      role="button"
      onClick={onClick}
      style={style}
      size="small"
      icon={isLoading && <LoadingOutlined />}
    >
      {children}
    </Button>
  )
}

export default MarkAsViewedButton
