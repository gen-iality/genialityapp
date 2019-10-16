import React, {Fragment} from 'react';
import {Route, Switch, withRouter} from "react-router-dom";
import Importacion from "../import-users/importacion";
import UsersRsvp from "./users";

function ListaInvitados({...props}) {
    const {eventId, event, match} = props;
    return (
        <Fragment>
            <Switch>
                <Route exact path={`${match.url}/`} render={()=><UsersRsvp event={event} eventID={eventId} matchUrl={match.url}/>}/>
                <Route exact path={`${match.url}/importar-excel`} render={()=><Importacion eventID={eventId} matchUrl={match.url}/>}/>
            </Switch>
        </Fragment>
    );
}

export default withRouter(ListaInvitados);
