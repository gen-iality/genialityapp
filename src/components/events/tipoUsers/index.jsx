import { Fragment } from 'react'
import { Route, Switch } from 'react-router-dom'
import TipoAsistentes from './TipoAsistentes'
import TipoAsistente from './TipoAsistente'

function TipoUsersRoutes(props) {
  const { event, matchUrl } = props
  return (
    <Fragment>
      <Switch>
        <Route
          exact
          path={`${matchUrl}/`}
          render={() => <TipoAsistentes event={event} parentUrl={matchUrl} />}
        />
        <Route
          exact
          path={`${matchUrl}/tipoAsistente`}
          render={() => <TipoAsistente event={event} parentUrl={matchUrl} {...props} />}
        />
      </Switch>
    </Fragment>
  )
}

export default TipoUsersRoutes
