import { ReactNode, useState } from 'react'
import { useMemo, memo, useEffect } from 'react'
import { useLocation } from 'react-router'
import './Step.css'

export interface StepProps {
  children: ReactNode
  isActive?: boolean | number
  isSurvey?: boolean
  key?: string
  /* onChangeFunction?: any; */
  id?: string
  onClick?: () => void
}

function Step(props: StepProps) {
  const { children, isActive, isSurvey, id, ...rest } = props

  const [activityIdFromUrl, setActivityIdFromUrl] = useState('')

  const location = useLocation()

  const className = useMemo(() => {
    if (isActive) {
      return 'Step active'
    }
    return 'Step'
  }, [isActive])

  // We don't have access to the param activity_id using useMatch because this
  // component is upside of the EventSectionRoutes, then the activity_id will be
  // taken from the url by parsing
  useEffect(() => {
    const urlCompleta = location.pathname
    const urlSplited = urlCompleta.split('activity/')
    const currentActivityId = urlSplited[1]
    setActivityIdFromUrl(currentActivityId)
  }, [location])

  return (
    <div
      className={className}
      style={{
        borderRadius: isSurvey ? '' : '50%',
        backgroundColor: activityIdFromUrl == id ? '#043558' : '',
        color: activityIdFromUrl == id ? '#fff' : '',
      }}
      {...rest}
      onClick={() => {
        props.onClick && props.onClick()
      }}
    >
      {children}
    </div>
  )
}

export default memo(Step)
