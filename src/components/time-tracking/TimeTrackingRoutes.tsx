import { Route, Switch, withRouter } from 'react-router-dom'

import TimeTracking from './TimeTracking'

function TimeTrackingRoutes({ ...props }: { event: any; match: any }) {
  const { event, match } = props
  return (
    <>
      <Switch>
        <Route
          exact
          path={`${match.url}/`}
          render={() => <TimeTracking event={event} matchUrl={match.url} />}
        />
      </Switch>
    </>
  )
}

export default withRouter(TimeTrackingRoutes)
