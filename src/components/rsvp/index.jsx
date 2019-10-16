import React, {Fragment} from 'react';
import {Route, Switch, withRouter} from "react-router-dom";
import UsersRsvp from "./users";
import ImportUsers from "../import-users/importUser";

function ListaInvitados({...props}) {
    const {eventId, event, match} = props;
    return (
        <Fragment>
            <Switch>
                <Route exact path={`${match.url}/`} render={()=><UsersRsvp event={event} eventID={eventId} matchUrl={match.url}/>}/>
                <Route exact path={`${match.url}/importar-excel`} render={()=><ImportUsers extraFields={event.user_properties} eventId={eventId} matchUrl={match.url}/>}/>
            </Switch>
        </Fragment>
    );
}

export default withRouter(ListaInvitados);
