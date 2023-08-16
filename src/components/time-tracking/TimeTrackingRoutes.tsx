import { Route, Routes } from 'react-router-dom'

import TimeTracking from './TimeTracking'
import { FunctionComponent } from 'react'

interface ITimeTrackingRoutesProps {
  event: any
}

const TimeTrackingRoutes: FunctionComponent<ITimeTrackingRoutesProps> = (props) => {
  const { event } = props
  return (
    <Routes>
      <Route path={`/`} element={<TimeTracking event={event} />} />
    </Routes>
  )
}

export default TimeTrackingRoutes
