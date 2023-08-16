import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import InvitedUsers from './eventUsersList'
import CreateMessage from './send'
import ImportUsers from '../import-users/importUser'
import { EventsApi } from '@helpers/request'

function ListaInvitados(props) {
  const { eventId, event } = props

  const location = useLocation()

  useEffect(() => {
    if (location.pathname.startsWith(`/eventadmin/${eventId}`)) {
      obtenerEvento()
    }

    async function obtenerEvento() {
      const respEvento = await EventsApi.getOne(eventId)
      setUserProperties(respEvento.user_properties)
    }
  }, [parentUrl])

  const [guestSelected, setGuestSelected] = useState([])
  const [userProperties, setUserProperties] = useState([])

  return (
    <Routes>
      <Route
        path="/invitados"
        element={
          <InvitedUsers
            event={event}
            eventID={eventId}
            setGuestSelected={setGuestSelected}
          />
        }
      />
      <Route
        exact
        path="/invitados/createmessage"
        element={
          <CreateMessage event={event} eventID={eventId} selection={guestSelected} />
        }
      />

      <Route
        exact
        path="/invitados/importar-excel"
        element={
          <ImportUsers
            extraFields={userProperties}
            eventId={eventId}
            event={event}
            locationParams={location}
          />
        }
      />
    </Routes>
  )
}

export default ListaInvitados
