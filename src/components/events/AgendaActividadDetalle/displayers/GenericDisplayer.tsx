import { FunctionComponent } from 'react'
import { SmileOutlined } from '@ant-design/icons'
import { Result } from 'antd'
import HeaderColumnswithContext from '../HeaderColumns'

import { IBasicActivityProps } from './basicTypes'

const GenericActivity: FunctionComponent<IBasicActivityProps> = (props) => {
  const { activity } = props

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

export default GenericActivity
