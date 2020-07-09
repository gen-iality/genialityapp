import React, { Component } from 'react';
import { Route, Redirect, withRouter, Switch } from "react-router-dom";
import Event from "../components/events/event";
import * as Cookie from "js-cookie";
import { ApiUrl } from "../helpers/constants";
import asyncComponent from "./AsyncComponent";

//Code splitting
const Home = asyncComponent(() => import("../components/home"));
const HomeProfile = asyncComponent(() => import("../components/home/profile"));
const Landing = asyncComponent(() => import("../components/events/landing"));
const Events = asyncComponent(() => import("../components/events"));
const NewEvent = asyncComponent(() => import("../components/events/newEvent"));
const Organization = asyncComponent(() => import("../components/organization"));
const MyProfile = asyncComponent(() => import("../components/profile"));
const Purchase = asyncComponent(() => import("../components/profile/purchase"));
const EventEdit = asyncComponent(() => import("../components/profile/events"));
const Terms = asyncComponent(() => import("../components/policies/termsService"));
const Privacy = asyncComponent(() => import("../components/policies/privacyPolicy"));
const Policies = asyncComponent(() => import("../components/policies/policies"));
const About = asyncComponent(() => import("../components/policies/about"));
const Faqs = asyncComponent(() => import("../components/faqs/index"));
const SinginTest = asyncComponent(() => import("../components/signintest"));
const Tickets = asyncComponent(() => import("../components/tickets"))


class ContentContainer extends Component {
    componentDidMount() {
        this.props.history.index = 0
    }
    render() {
        return (
            <main className="main">
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/page/:id" component={HomeProfile} />
                    <Route exact path="/landing/:event" component={Landing} />


                    {/* Arreglo temporal mastercard para que tenga una url bonita, evius aún no soporta esto*/}
                    <Route exact path='/mentoriamastercard' render={() => (
                        <Redirect to="/landing/5ef49fd9c6c89039a14c6412" />
                    )} />
                    <PrivateRoute path="/my_events" component={Events} />
                    <PrivateRoute path="/event/:event" component={Event} />
                    <PrivateRoute path="/create-event" component={NewEvent} />
                    <PrivateRoute path="/profile/:id" component={MyProfile} />
                    <PrivateRoute path="/organization/:id" component={Organization} />
                    <PrivateRoute path="/purchase/:id" component={Purchase} />
                    <PrivateRoute path="/eventEdit/:id" component={EventEdit} />
                    <PrivateRoute path="/tickets/:id" component={Tickets} />
                    <Route exact path="/terms" component={Terms} />
                    <Route exact path="/privacy" component={Privacy} />
                    <Route exact path="/policies" component={Policies} />
                    <Route exact path="/about" component={About} />
                    <Route exact path="/faqs" component={Faqs} />
                    <Route exact path="/singintest" component={SinginTest} />
                    <Route exact path="/api/generatorQr/:id" component={QRedirect} />
                </Switch>
            </main>
        );
    }
}

function QRedirect({ match }) {
    window.location.replace(`${ApiUrl}/api/generatorQr/${match.params.id}`);
    return <p>Redirecting...</p>;
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