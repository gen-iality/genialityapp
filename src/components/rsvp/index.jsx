import React, { Fragment, useState, useEffect } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import UsersRsvp from "./users";
import { EventsApi, UsersApi } from "../../helpers/request";
import ImportUsers from "../import-users/importUser";
import EviusTable from "./eviustable";

function Tabla(props) {
  const [guests, setGuests] = useState([]);

  const columns = [
    {
      Header: "Email",
      accessor: "email" // accessor is the "key" in the data
    },
    {
      Header: "Names",
      accessor: "names"
    }
  ];

  useEffect(() => {
    console.log("mounted", props);

    async function fetchData(props) {
      const guestsResult = await UsersApi.getAll(
        props.event._id,
        "?pageSize=1000"
      );
      setGuests(guestsResult.data);
      console.log("resultado", props, guestsResult);
    }
    fetchData(props);
  }, []);

  return <EviusTable columns={columns} data={guests} />;
}

function ListaInvitados({ ...props }) {
  const { eventId, event, match } = props;
  return (
    <Fragment>
      {/* <Tabla {...props} /> */}

      <Switch>
        <Route
          exact
          path={`${match.url}/`}
          render={() => (
            <UsersRsvp event={event} eventID={eventId} matchUrl={match.url} />
          )}
        />
        <Route
          exact
          path={`${match.url}/importar-excel`}
          render={() => (
            <ImportUsers
              extraFields={event.user_properties}
              eventId={eventId}
              matchUrl={match.url}
            />
          )}
        />
      </Switch>
    </Fragment>
  );
}

export default withRouter(ListaInvitados);
