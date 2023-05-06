import { useState } from 'react'
import { SmileOutlined } from '@ant-design/icons'
import { Result } from 'antd'
import HeaderColumnswithContext from '../HeaderColumns'

const GenericActivity = () => {
  const [activityState] = useState('')

  return (
    <>
      <HeaderColumnswithContext isVisible activityState={activityState} />
      <Result
        icon={<SmileOutlined />}
        title="Puedes asignar un contenido audiovisual a esta lección"
      />
    </>
  )
}

export default GenericActivity
