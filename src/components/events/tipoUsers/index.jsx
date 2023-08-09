import { Fragment } from 'react'
import { Route, Routes } from 'react-router-dom'
import TipoAsistentes from './TipoAsistentes'
import TipoAsistente from './TipoAsistente'

function TipoUsersRoutes(props) {
  const { event, matchUrl } = props
  return (
    <Fragment>
      <Routes>
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
      </Routes>
    </Fragment>
  )
}

export default TipoUsersRoutes
