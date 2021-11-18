import React, {Fragment} from 'react';
import {Route, Switch, withRouter} from "react-router-dom";
import TipoAsistentes from "./TipoAsistentes";
import TipoAsistente from "./TipoAsistente";

function TipoUsersRoutes(props){
  const {event, match} = props;
  return (
    <Fragment>
      <Switch>
        <Route exact path={`${match.url}/`} render={()=><TipoAsistentes event={event} matchUrl={match.url}/>}/>
        <Route exact path={`${match.url}/tipoAsistente`} render={()=><TipoAsistente event={event} matchUrl={match.url} {...props} />}/>
      </Switch>
    </Fragment>
  );
}

export default withRouter(TipoUsersRoutes);