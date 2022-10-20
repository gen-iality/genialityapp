import { useEffect, useState } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import InvitedUsers from './eventUsersList';
import CreateMessage from './send';
import ImportUsers from '../import-users/importUser';
import { EventsApi } from '@helpers/request';

// function Tabla(props) {
//   const [guests, setGuests] = useState([]);

//   const columns = [
//     {
//       Header: "Email",
//       accessor: "email" // accessor is the "key" in the data
//     },
//     {
//       Header: "Names",
//       accessor: "names"
//     }
//   ];

//   useEffect(() => {
//

//     async function fetchData(props) {
//       const guestsResult = await UsersApi.getAll(
//         props.event._id,
//         "?pageSize=1000"
//       );
//       setGuests(guestsResult.data);
//
//     }
//     fetchData(props);
//   }, []);

//   return <EviusTable columns={columns} data={guests} />;
// }

function ListaInvitados({ ...props }) {
  const { eventId, event, match, location } = props;

  useEffect(() => {
    if (match.path === `/eventAdmin/${eventId}/invitados`) {
      obtenerEvento();
    }

    async function obtenerEvento() {
      const respEvento = await EventsApi.getOne(eventId);
      setUserProperties(respEvento.user_properties);
    }
  }, [match]);

  const [guestSelected, setGuestSelected] = useState([]);
  const [userProperties, setUserProperties] = useState([]);

  return (
    <>
      <Switch>
        <Route
          exact
          path={`${match.url}/`}
          render={() => (
            <InvitedUsers event={event} eventID={eventId} matchUrl={match.url} setGuestSelected={setGuestSelected} />
          )}
        />
        <Route
          exact
          path={`${match.url}/createmessage`}
          render={() => (
            <CreateMessage event={event} eventID={eventId} matchUrl={match.url} selection={guestSelected} />
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
  );
}

export default withRouter(ListaInvitados);
