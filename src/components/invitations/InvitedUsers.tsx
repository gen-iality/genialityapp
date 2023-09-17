import { FunctionComponent, useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import EventUsersList from './eventUsersList'
import CreateMessage from './send'
import ImportUsers from '../import-users/ImportUsers'
import { EventsApi } from '@helpers/request'

interface IInvitedUsersProps {
  event: any
}

const InvitedUsers: FunctionComponent<IInvitedUsersProps> = (props) => {
  const { event } = props

  const location = useLocation()

  const getEventData = async () => {
    const respEvento = await EventsApi.getOne(event._id)
    setUserProperties(respEvento.user_properties)
  }

  useEffect(() => {
    if (!event?._id) return

    if (location.pathname.startsWith(`/eventadmin/${event._id}`)) {
      getEventData()
    }
  }, [location.pathname, event])

  const [guestSelected, setGuestSelected] = useState([])
  const [userProperties, setUserProperties] = useState([])

  return (
    <Routes>
      <Route
        path="/"
        element={
          <EventUsersList
            event={event}
            eventID={event._id}
            setGuestSelected={setGuestSelected}
          />
        }
      />
      <Route
        path="/createmessage"
        element={
          <CreateMessage event={event} eventID={event._id} selection={guestSelected} />
        }
      />

      <Route
        path="/importar-excel"
        element={
          <ImportUsers
            extraFields={userProperties}
            eventId={event._id}
            event={event}
            locationParams={location}
          />
        }
      />
    </Routes>
  )
}

export default InvitedUsers
