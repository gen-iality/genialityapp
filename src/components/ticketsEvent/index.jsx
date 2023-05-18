import { Fragment } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import Tickets from './tickets'
import Ticket from './ticket'

function TicketsRoutes(props) {
  const { event, matchUrl } = props
  return (
    <Fragment>
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
    </Fragment>
  )
}

export default withRouter(TicketsRoutes)
