import { useEffect, useState } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import InvitedUsers from './eventUsersList'
import CreateMessage from './send'
import ImportUsers from '../import-users/importUser'
import { EventsApi } from '@helpers/request'

function ListaInvitados(props) {
  const { eventId, event, parentUrl } = props

  const location = useLocation()

  useEffect(() => {
    if (parentUrl === `/eventadmin/${eventId}`) {
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
    <>
      <Switch>
        <Route
          exact
          path={`${parentUrl}/invitados`}
          render={() => (
            <InvitedUsers
              event={event}
              eventID={eventId}
              setGuestSelected={setGuestSelected}
            />
          )}
        />
        <Route
          exact
          path={`${parentUrl}/invitados/createmessage`}
          render={() => (
            <CreateMessage
              event={event}
              eventID={eventId}
              selection={guestSelected}
              parentUrl={parentUrl}
            />
          )}
        />

        <Route
          exact
          path={`${parentUrl}/invitados/importar-excel`}
          render={() => (
            <ImportUsers
              extraFields={userProperties}
              eventId={eventId}
              event={event}
              parentUrl={parentUrl}
              locationParams={location}
            />
          )}
        />
      </Switch>
    </>
  )
}

export default ListaInvitados
