import { Fragment } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import Agenda from './agenda'
import AgendaTypeCat from './typecat'
import AgendaTypeCatCE from './AgendaTypeCatCE'
import ActivityTypeProvider from '@context/activityType/activityTypeProvider'
import AgendaEditPage from './AgendaEditPage'
import AgendaCreatorPage from './AgendaCreatorPage'

function AgendaRoutes({ ...props }) {
  const { event, matchUrl } = props

  return (
    <Fragment>
      <Switch>
        <Route
          exact
          path={`${matchUrl}/`}
          render={(routeProps) => (
            <Agenda event={event} matchUrl={routeProps.match.url} />
          )}
        />
        {/* <Route exact path={`${matchUrl}/activity`} render={() => <ActivityTypeProvider><AgendaEdit event={event} matchUrl={matchUrl} /></ActivityTypeProvider>} /> */}
        <Route
          exact
          path={`${matchUrl}/activity`}
          render={(routeProps) => (
            <ActivityTypeProvider>
              <AgendaEditPage event={event} matchUrl={routeProps.match.url} />
            </ActivityTypeProvider>
          )}
        />
        <Route
          exact
          path={`${matchUrl}/create-activity`}
          render={(routeProps) => (
            <ActivityTypeProvider>
              <AgendaCreatorPage event={event} matchUrl={routeProps.match.url} />
            </ActivityTypeProvider>
          )}
        />
        <Route
          exact
          path={`${matchUrl}/tipos`}
          render={(routeProps) => (
            <AgendaTypeCat event={event} matchUrl={routeProps.match.url} />
          )}
        />
        <Route
          exact
          path={`${matchUrl}/categorias`}
          render={(routeProps) => (
            <AgendaTypeCat event={event} matchUrl={routeProps.match.url} />
          )}
        />
        <Route
          exact
          path={`${matchUrl}/:subject`}
          render={(routeProps) => (
            <AgendaTypeCatCE event={event} matchUrl={routeProps.match.url} />
          )}
        />
      </Switch>
    </Fragment>
  )
}

export default withRouter(AgendaRoutes)
