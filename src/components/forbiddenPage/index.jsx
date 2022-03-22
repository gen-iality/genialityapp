import { Link, withRouter } from 'react-router-dom';
import { Result, Button } from 'antd';

function ForbiddenPage() {
  return (
    <Result
      status='404'
      title='Sin acceso'
      subTitle='No tiene permisos para ingresas a esta sección'
      extra={
        <Link to={'/'}>
          <Button type='primary'>Ir a la página principal</Button>
        </Link>
      }
    />
  );
}

export default withRouter(ForbiddenPage);
