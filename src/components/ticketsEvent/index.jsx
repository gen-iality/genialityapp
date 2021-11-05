import React, {Fragment} from 'react';
import {Route, Switch, withRouter} from "react-router-dom";
import Tickets from "./tickets";
import Ticket from "./ticket";

function TicketsRoutes(props){
    const {event, match} = props;
    return (
      <Fragment>
        <Switch>
          <Route exact path={`${match.url}/`} render={()=><Tickets event={event} matchUrl={match.url}/>}/>
          <Route exact path={`${match.url}/ticket`} render={()=><Ticket event={event} matchUrl={match.url} {...props} />}/>
        </Switch>
      </Fragment>
    );
}

export default withRouter(TicketsRoutes);