import { Route, Switch } from 'react-router-dom'

import TimeTracking from './TimeTracking'
import { FunctionComponent } from 'react'

interface ITimeTrackingRoutesProps {
  event: any
  matchUrl: any
}

const TimeTrackingRoutes: FunctionComponent<ITimeTrackingRoutesProps> = (props) => {
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

export default TimeTrackingRoutes
