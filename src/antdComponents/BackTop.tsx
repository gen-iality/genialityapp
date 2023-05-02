import { BackTop as BackTopAnt, Button, Tooltip } from 'antd'
import { UpOutlined } from '@ant-design/icons'
import { FunctionComponent } from 'react'

const BackTop: FunctionComponent = () => (
  <BackTopAnt style={{ marginRight: '-90px', marginBottom: '-30px' }}>
    <Tooltip title="Subir para guardar cambios">
      <Button type="primary" shape="circle" icon={<UpOutlined />} size="large" />
    </Tooltip>
  </BackTopAnt>
)

export default BackTop
