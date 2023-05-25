import { Route, Switch, withRouter } from 'react-router-dom'

import TimeTracking from './TimeTracking'

function TimeTrackingRoutes({ ...props }: { event: any; matchUrl: any }) {
  const { event, matchUrl } = props
  return (
    <>
      <Switch>
        <Route
          exact
          path={`${matchUrl}/`}
          render={() => <TimeTracking event={event} />}
        />
      </Switch>
    </>
  )
}

export default withRouter(TimeTrackingRoutes)
