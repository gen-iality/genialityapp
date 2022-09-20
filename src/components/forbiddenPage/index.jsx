import { Link, useHistory, withRouter } from 'react-router-dom';
import { Result, Button, Statistic, Divider } from 'antd';

const { Countdown } = Statistic;
function ForbiddenPage() {
  const history = useHistory();

  const redirectToHome = () => {
    history.push('/');
  };

  return (
    <Result
      status='403'
      title='Sin acceso'
      subTitle='No tiene permisos para ingresas a esta sección'
      extra={
        <>
          <Countdown
            valueStyle={{ fontWeight: '500', fontSize: '30px', color: '#b5b5b5' }}
            format={'ss'}
            title='Redirigiendo a la página principal en:'
            value={Date.now() + 6 * 1000}
            onFinish={redirectToHome}
          />
          <Divider />
          <Link to={'/'}>
            <Button type='primary'>Ir a la página principal</Button>
          </Link>
        </>
      }
    />
  );
}

export default withRouter(ForbiddenPage);
