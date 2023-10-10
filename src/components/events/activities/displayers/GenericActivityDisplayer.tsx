import { FunctionComponent, useEffect } from 'react'
import { SmileOutlined } from '@ant-design/icons'
import { Result } from 'antd'
import HeaderColumnswithContext from '../HeaderColumns'

import { IBasicActivityProps } from './basicTypes'

const GenericActivityDisplayer: FunctionComponent<IBasicActivityProps> = (props) => {
  const { activity, onActivityProgress } = props

  useEffect(() => {
    if (typeof onActivityProgress === 'function') onActivityProgress(100)
  }, [])

  return (
    <>
      <HeaderColumnswithContext isVisible activityState={activity} />
      <Result
        icon={<SmileOutlined />}
        title="Puedes asignar un contenido audiovisual a esta lección"
      />
    </>
  )
}

export default GenericActivityDisplayer
