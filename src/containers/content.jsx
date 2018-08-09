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
                <Route path="/evento" component={ Landing }/>
                <Route path="/landing/:event" component={ Landing }/>
                <Route path="/mis_eventos" component={ Events }/>
                <Route path="/edit/:event" component={ Event }/>
            </main>
        );
    }
}

export default ContentContainer;