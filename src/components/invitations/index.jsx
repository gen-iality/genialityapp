import { useEffect, useState } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import InvitedUsers from './eventUsersList'
import CreateMessage from './send'
import ImportUsers from '../import-users/importUser'
import { EventsApi } from '@helpers/request'

function ListaInvitados({ ...props }) {
  const { eventId, event, match, location } = props

  useEffect(() => {
    if (match.path === `/eventAdmin/${eventId}/invitados`) {
      obtenerEvento()
    }

    async function obtenerEvento() {
      const respEvento = await EventsApi.getOne(eventId)
      setUserProperties(respEvento.user_properties)
    }
  }, [match])

  const [guestSelected, setGuestSelected] = useState([])
  const [userProperties, setUserProperties] = useState([])

  return (
    <>
      <Switch>
        <Route
          exact
          path={`${match.url}/`}
          render={() => (
            <InvitedUsers
              event={event}
              eventID={eventId}
              matchUrl={match.url}
              setGuestSelected={setGuestSelected}
            />
          )}
        />
        <Route
          exact
          path={`${match.url}/createmessage`}
          render={() => (
            <CreateMessage
              event={event}
              eventID={eventId}
              matchUrl={match.url}
              selection={guestSelected}
            />
          )}
        />

        <Route
          exact
          path={`${match.url}/importar-excel`}
          render={() => (
            <ImportUsers
              extraFields={userProperties}
              eventId={eventId}
              event={event}
              matchUrl={match.url}
              locationParams={location}
            />
          )}
        />
      </Switch>
    </>
  )
}

export default withRouter(ListaInvitados)
