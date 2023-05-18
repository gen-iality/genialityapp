import { useEffect, useState } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import InvitedUsers from './eventUsersList'
import CreateMessage from './send'
import ImportUsers from '../import-users/importUser'
import { EventsApi } from '@helpers/request'

function ListaInvitados({ ...props }) {
  const { eventId, event, matchUrl, location } = props

  useEffect(() => {
    if (matchUrl === `/eventAdmin/${eventId}/invitados`) {
      obtenerEvento()
    }

    async function obtenerEvento() {
      const respEvento = await EventsApi.getOne(eventId)
      setUserProperties(respEvento.user_properties)
    }
  }, [matchUrl])

  const [guestSelected, setGuestSelected] = useState([])
  const [userProperties, setUserProperties] = useState([])

  return (
    <>
      <Switch>
        <Route
          exact
          path={`${matchUrl}/`}
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
          path={`${matchUrl}/createmessage`}
          render={() => (
            <CreateMessage event={event} eventID={eventId} selection={guestSelected} />
          )}
        />

        <Route
          exact
          path={`${matchUrl}/importar-excel`}
          render={() => (
            <ImportUsers
              extraFields={userProperties}
              eventId={eventId}
              event={event}
              parentUrl={matchUrl}
              locationParams={location}
            />
          )}
        />
      </Switch>
    </>
  )
}

export default withRouter(ListaInvitados)
