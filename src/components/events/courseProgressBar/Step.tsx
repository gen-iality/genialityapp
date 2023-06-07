import { ReactNode } from 'react'
import { useMemo, memo } from 'react'
import './Step.css'

export interface StepProps {
  children: ReactNode
  isActive?: boolean | number
  isSurvey?: boolean
  key?: string
  isFocus?: boolean
  isBlocked?: boolean
  onClick?: () => void
}

function Step(props: StepProps) {
  const { children, isActive, isSurvey, isFocus, isBlocked, ...rest } = props

  const className = useMemo(() => {
    if (isActive) {
      return 'Step active'
    }
    return 'Step'
  }, [isActive])

  return (
    <div
      className={className}
      style={{
        borderRadius: isSurvey ? '' : '50%',
        backgroundColor: isFocus ? '#043558' : '',
        color: isFocus ? '#fff' : '',
      }}
      {...rest}
      onClick={() => {
        if (typeof props.onClick === 'function') {
          if (!isBlocked) {
            props.onClick()
          }
        }
      }}
    >
      {children}
    </div>
  )
}

export default memo(Step)
