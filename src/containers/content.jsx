import React, {Component} from 'react';
import { Route, Redirect } from "react-router-dom";
import Home from "../components/home";
import Landing from "../components/events/landing";
import Events from "../components/events";
import Event from "../components/events/event";
import * as Cookie from "js-cookie";
import OrgProfile from "../components/organizations/profile";

class ContentContainer extends Component {
    render() {
        return (
            <main className="main">
                <Route exact path="/" component={ Home } />
                <Route path="/landing/:event" component={ Landing }/>
                <PrivateRoute path="/my_events" component={ Events }/>
                <PrivateRoute path="/event/:event" component={ Event }/>
                <PrivateRoute path="/org/:org" component={ OrgProfile }/>
            </main>
        );
    }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            (Cookie.get('evius_token')) ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: "/",
                        state: { from: props.location }
                    }}
                />
            )
        }
    />
);

export default ContentContainer;