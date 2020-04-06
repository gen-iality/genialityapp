import React, {Fragment} from 'react';
import {Route, Switch, withRouter} from "react-router-dom";
import Trivia from "./trivia";
import TriviaEdit from "./edit";

function TriviaRoutes({...props}){
    const {event, match} = props;
    return (
        <Fragment>
            <Switch>
                <Route exact path={`${match.url}/`} render={()=><Trivia event={event} matchUrl={match.url}/>}/>
                <Route exact path={`${match.url}/editar`} render={()=><TriviaEdit event={event} matchUrl={match.url}/>}/>
            </Switch>
        </Fragment>
    );
}

export default withRouter(TriviaRoutes);
