import { Fragment } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import Agenda from './agenda'
import AgendaEdit from './edit'
import AgendaTypeCat from './typecat'
import AgendaTypeCatCE from './AgendaTypeCatCE'
import ActivityTypeProvider from '@context/activityType/activityTypeProvider'
import AgendaEditPage from './AgendaEditPage'
import AgendaCreatorPage from './AgendaCreatorPage'

function AgendaRoutes({ ...props }) {
  const { event, match } = props
  return (
    <Fragment>
      <Switch>
        <Route
          exact
          path={`${match.url}/`}
          render={() => <Agenda event={event} matchUrl={match.url} />}
        />
        {/* <Route exact path={`${match.url}/activity`} render={() => <ActivityTypeProvider><AgendaEdit event={event} matchUrl={match.url} /></ActivityTypeProvider>} /> */}
        <Route
          exact
          path={`${match.url}/activity`}
          render={() => (
            <ActivityTypeProvider>
              <AgendaEditPage event={event} matchUrl={match.url} />
            </ActivityTypeProvider>
          )}
        />
        <Route
          exact
          path={`${match.url}/create-activity`}
          render={() => (
            <ActivityTypeProvider>
              <AgendaCreatorPage event={event} matchUrl={match.url} />
            </ActivityTypeProvider>
          )}
        />
        <Route
          exact
          path={`${match.url}/tipos`}
          render={() => <AgendaTypeCat event={event} matchUrl={match.url} />}
        />
        <Route
          exact
          path={`${match.url}/categorias`}
          render={() => <AgendaTypeCat event={event} matchUrl={match.url} />}
        />
        <Route
          exact
          path={`${match.url}/:subject`}
          render={() => <AgendaTypeCatCE event={event} matchUrl={match.url} />}
        />
      </Switch>
    </Fragment>
  )
}

export default withRouter(AgendaRoutes)
