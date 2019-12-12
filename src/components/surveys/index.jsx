import React from "react";
import {Route, Switch, withRouter} from "react-router-dom";
import SpeakersList from "./list";

import surveys from "./surveys";

function Speakers({...props}) {
    const {eventID, match} = props;
   
}

export default withRouter(surveys)
