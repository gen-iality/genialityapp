import { Route, Routes } from 'react-router-dom'
import Tickets from './tickets'
import Ticket from './ticket'

function TicketsRoutes(props) {
  const { event } = props

  return (
    <Routes>
      <Route path={`/`} element={<Tickets event={event} parentUrl={matchUrl} />} />
      <Route path={`/ticket`} element={<Ticket event={event} {...props} />} />
    </Routes>
  )
}

export default TicketsRoutes
