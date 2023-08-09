import { Fragment } from 'react'
import { Route, Routes } from 'react-router-dom'
import Espacios from './Espacios'
import Espacio from './Espacio'

function EspacioRoutes(props) {
  const { event, matchUrl } = props

  return (
    <Fragment>
      <Routes>
        <Route
          exact
          path={`${matchUrl}/`}
          render={() => <Espacios event={event} parentUrl={matchUrl} />}
        />
        <Route
          exact
          path={`${matchUrl}/espacio`}
          render={() => <Espacio event={event} parentUrl={matchUrl} {...props} />}
        />
      </Routes>
    </Fragment>
  )
}

export default EspacioRoutes
