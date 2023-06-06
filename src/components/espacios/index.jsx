import { Fragment } from 'react'
import { Route, Switch } from 'react-router-dom'
import Espacios from './Espacios'
import Espacio from './Espacio'

function EspacioRoutes(props) {
  const { event, matchUrl } = props

  return (
    <Fragment>
      <Switch>
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
      </Switch>
    </Fragment>
  )
}

export default EspacioRoutes
