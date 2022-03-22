import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

function NoMatchPage(props) {
  const error403 = '403';
  const error404 = '404';
  return (
    <Result
      status={props.match.params.withoutPermissions === 'true' ? error403 : error404}
      // icon={
      //   props.match.params.withoutPermissions === 'true' ? (
      //     <img src={error403} alt='403'></img>
      //   ) : (
      //     <img src={error404} alt='404'></img>
      //   )
      // }
      title='Lo sentimos.'
      subTitle={
        props.match.params.withoutPermissions === 'true' ? (
          <b>no está autorizado para acceder a esta página</b>
        ) : (
          <div>
            <div>
              <b>La ruta a la cual deseas acceder no existe</b>
            </div>
            <div>{(props.eventId || props?.org?._id) && <code>{props.location.pathname}</code>}</div>
          </div>
        )
      }
      extra={[
        /** Si se recibe algun id de organización no se mostraran botones*/
        !props?.org?._id &&
          props.match.params.id !== 'withoutPermissions' &&
          (props?.path ? (
            <Link to={`${props.path}/main`}>
              <Button type='primary' key='eventData'>
                Ir a datos del evento
              </Button>
            </Link>
          ) : (
            <>
              <Link to={`/`}>
                <Button type='primary' key='eventData'>
                  Ver más eventos
                </Button>
              </Link>
              <Link to={`/landing/${props.eventId ? props.eventId : props.match.params.id}`}>
                <Button key='moreEvents'>Ir a la landing de este evento</Button>
              </Link>
            </>
          )),
        props.match.params.id === 'withoutPermissions' && (
          <Link to={`/`}>
            <Button type='primary' key='eventData'>
              Ver más eventos
            </Button>
          </Link>
        ),
      ]}
    />
  );
}

export default NoMatchPage;
