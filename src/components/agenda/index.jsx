import { Route, Routes } from 'react-router-dom'
import Agenda from './agenda'
import AgendaTypeCat from './typecat'
import AgendaTypeCatCE from './AgendaTypeCatCE'
import ActivityTypeProvider from '@context/activityType/activityTypeProvider'
import AgendaEditPage from './AgendaEditPage'
import AgendaCreatorPage from './AgendaCreatorPage'
import ActivityListPage from '@components/admin/ActivityListPage'

function AgendaRoutes(props) {
  const { event } = props

  return (
    <Routes>
      <Route path="" element={<ActivityListPage event={event} />} />
      <Route path="old" element={<Agenda event={event} />} />
      <Route
        path="activity"
        element={
          <ActivityTypeProvider>
            <AgendaEditPage event={event} />
          </ActivityTypeProvider>
        }
      />
      <Route
        path="create-activity"
        element={
          <ActivityTypeProvider>
            <AgendaCreatorPage event={event} />
          </ActivityTypeProvider>
        }
      />
      <Route path="tipos" element={<AgendaTypeCat event={event} />} />
      <Route path="categorias" element={<AgendaTypeCat event={event} />} />
      <Route path=":subject" element={<AgendaTypeCatCE event={event} />} />
    </Routes>
  )
}

export default AgendaRoutes
