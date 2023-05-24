import { Link } from 'react-router-dom'
import { Result, Button } from 'antd'
import { FunctionComponent } from 'react'

const NotFoundPage: FunctionComponent = () => (
  <Result
    status="404"
    title="404"
    subTitle="Lo sentimos, la página que está visitando no existe."
    extra={
      <Link to="/">
        <Button type="primary">Ir a la página principal</Button>
      </Link>
    }
  />
)

export default NotFoundPage
