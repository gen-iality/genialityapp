import React, {Component} from 'react';
import { Route, Redirect, withRouter } from "react-router-dom";
import Home from "../components/home";
import Landing from "../components/events/landing";
import Events from "../components/events";
import Event from "../components/events/event";
import * as Cookie from "js-cookie";
import HomeProfile from "../components/home/profile";
import MyProfile from "../components/profiles/myProfile";

class ContentContainer extends Component {
    componentWillMount(){
        this.props.history.index=0
    }
    render() {
        return (
            <main className="main">
                <Route exact path="/" component={ Home } />
                <Route exact path="/page/:id" component={ HomeProfile } />
                <Route exact path="/landing/:event" component={ Landing }/>
                <PrivateRoute path="/my_events" component={ Events }/>
                <PrivateRoute path="/event/:event" component={ Event }/>
                <PrivateRoute path="/profile/:id" component={ MyProfile }/>
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

export default withRouter(ContentContainer);