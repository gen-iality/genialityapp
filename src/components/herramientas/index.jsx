import { Route, Switch } from 'react-router-dom'
import Herramientas from './Herramientas'
import Herramienta from './Herramienta'

function HerramientaRoutes(props) {
  const { event, matchUrl } = props

  return (
    <>
      <Switch>
        <Route
          exact
          path={`${matchUrl}/`}
          render={() => <Herramientas event={event} parentUrl={matchUrl} />}
        />
        <Route
          exact
          path={`${matchUrl}/herramienta`}
          render={() => <Herramienta event={event} parentUrl={matchUrl} {...props} />}
        />
      </Switch>
    </>
  )
}

export default HerramientaRoutes
