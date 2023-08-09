import { Route, Routes } from 'react-router-dom'

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
      <Routes>
        <Route
          exact
          path={`${matchUrl}/`}
          render={() => <TimeTracking event={event} />}
        />
      </Routes>
    </>
  )
}

export default TimeTrackingRoutes
