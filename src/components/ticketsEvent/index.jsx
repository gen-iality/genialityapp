import { Route, Switch } from 'react-router-dom'
import Tickets from './tickets'
import Ticket from './ticket'

function TicketsRoutes(props) {
  const { event, matchUrl } = props

  return (
    <>
      <Switch>
        <Route
          exact
          path={`${matchUrl}/`}
          render={() => <Tickets event={event} parentUrl={matchUrl} />}
        />
        <Route
          exact
          path={`${matchUrl}/ticket`}
          render={() => <Ticket event={event} parentUrl={matchUrl} {...props} />}
        />
      </Switch>
    </>
  )
}

export default TicketsRoutes
