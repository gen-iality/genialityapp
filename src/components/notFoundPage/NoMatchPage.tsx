import { Result, Button } from 'antd'
import { FunctionComponent } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

interface INoMatchPageProps {
  eventId?: any
  org?: any
  parentUrl?: string
}

const error403 = '403'
const error404 = '404'

const NoMatchPage: FunctionComponent<INoMatchPageProps> = (props) => {
  const params = useParams<any>()
  const location = useLocation<any>()

  return (
    <Result
      status={params.withoutPermissions === 'true' ? error403 : error404}
      // icon={
      //   props.match.params.withoutPermissions === 'true' ? (
      //     <img src={error403} alt="403"></img>
      //   ) : (
      //     <img src={error404} alt="404"></img>
      //   )
      // }
      title="Lo sentimos."
      subTitle={
        params.withoutPermissions === 'true' ? (
          <b>no está autorizado para acceder a esta página</b>
        ) : (
          <div>
            <div>
              <b>La ruta a la cual deseas acceder no existe</b>
            </div>
            <div>
              {(props.eventId ?? props.org?._id) && <code>{location.pathname}</code>}
            </div>
          </div>
        )
      }
      extra={[
        /** Si se recibe algun id de organización no se mostraran botones*/
        !props.org?._id &&
          params.id !== 'withoutPermissions' &&
          (props.parentUrl ? (
            <Link to={`${props.parentUrl}/main`}>
              <Button type="primary" key="eventData">
                Ir a datos del curso
              </Button>
            </Link>
          ) : (
            <>
              <Link to={`/`}>
                <Button type="primary" key="eventData">
                  Ver más cursos
                </Button>
              </Link>
              <Link to={`/landing/${props.eventId ?? params.id}`}>
                <Button key="moreEvents">Ir a la landing de este curso</Button>
              </Link>
            </>
          )),
        params.id === 'withoutPermissions' && (
          <Link to={`/`}>
            <Button type="primary" key="eventData">
              Ver más cursos
            </Button>
          </Link>
        ),
      ]}
    />
  )
}

export default NoMatchPage
