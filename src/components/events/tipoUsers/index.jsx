import { Fragment } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
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
          render={() => <TipoAsistentes event={event} parentUrl={match.url} />}
        />
        <Route
          exact
          path={`${matchUrl}/tipoAsistente`}
          render={() => <TipoAsistente event={event} parentUrl={match.url} {...props} />}
        />
      </Switch>
    </Fragment>
  )
}

export default withRouter(TipoUsersRoutes)
