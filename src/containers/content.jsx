import React, {Component} from 'react';
import { Route } from "react-router-dom";
import Home from "../components/home";
import Landing from "../components/events/landing";
import Events from "../components/events";
import Event from "../components/events/event";

class ContentContainer extends Component {
    render() {
        return (
            <main className="main container">
                <Route exact path="/" component={ Home } />
                <Route path="/evento/:event" component={ Landing }/>
                <Route path="/my_events" component={ Events }/>
                <Route path="/edit/:event" component={ Event }/>
            </main>
        );
    }
}

export default ContentContainer;