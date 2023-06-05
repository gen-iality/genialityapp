import { ReactNode } from 'react'
import { useMemo, memo } from 'react'
import './Step.css'

export interface StepProps {
  children: ReactNode
  isActive?: boolean | number
  isSurvey?: boolean
  key?: string
  isFocus?: boolean
  onClick?: () => void
}

function Step(props: StepProps) {
  const { children, isActive, isSurvey, isFocus, ...rest } = props

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
        props.onClick && props.onClick()
      }}
    >
      {children}
    </div>
  )
}

export default memo(Step)
