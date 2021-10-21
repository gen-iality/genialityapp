import React, {Fragment} from 'react';
import {Route, Switch, withRouter} from "react-router-dom";
import Faqs from "./faqs";
import Faq from "./faq";

function FaqsRoutes(props){
    const {event, match} = props;
    return (
      <Fragment>
        <Switch>
          <Route exact path={`${match.url}/`} render={()=><Faqs event={event} matchUrl={match.url}/>}/>
          <Route exact path={`${match.url}/faq`} render={()=><Faq event={event} matchUrl={match.url} {...props} />}/>
        </Switch>
      </Fragment>
    );
}

export default withRouter(FaqsRoutes);
