import React, {Component} from 'react';
import { Route, Redirect, withRouter, Switch } from "react-router-dom";
import Event from "../components/events/event";
import * as Cookie from "js-cookie";
import {ApiUrl} from "../helpers/constants";
import asyncComponent from "./AsyncComponent";

//Code splitting
const Home = asyncComponent(() => import("../components/home"));
const HomeProfile = asyncComponent(() => import("../components/home/profile"));
const Landing = asyncComponent(() => import("../components/events/landing"));
const Events = asyncComponent(() => import("../components/events"));
const Organization = asyncComponent(()=> import("../components/organization"));
const MyProfile = asyncComponent(()=> import("../components/profile"));
const Terms = asyncComponent(()=> import("../components/policies/termsService"));
const Privacy = asyncComponent(()=> import("../components/policies/privacyPolicy"));
const Policies = asyncComponent(()=> import("../components/policies/policies"));
const About = asyncComponent(()=> import("../components/policies/about"));
const Faqs = asyncComponent(()=> import("../components/faqs"));


class ContentContainer extends Component {
    componentWillMount(){
        this.props.history.index=0
    }
    render() {
        return (
            <main className="main">
                <Switch>
                    <Route exact path="/" component={ Home } />
                    <Route exact path="/page/:id" component={ HomeProfile } />
                    <Route exact path="/landing/:event" component={ Landing }/>
                    <PrivateRoute path="/my_events" component={ Events }/>
                    <PrivateRoute path="/event/:event" component={ Event }/>
                    <PrivateRoute path="/profile/:id" component={ MyProfile }/>
                    <PrivateRoute path="/organization/:id" component={ Organization }/>
                    <Route exact path="/terms" component={ Terms } />
                    <Route exact path="/privacy" component={ Privacy } />
                    <Route exact path="/policies" component={ Policies } />
                    <Route exact path="/about" component={ About } />
                    <Route exact path="/faqs" component={ Faqs } />
                    <Route exact path="/api/generatorQr/:id" component={QRedirect}/>
                    {/* Enviamos el id de el modelo, de el crud al con el que queremos trabajar  Ejemplo: Speaker, Agenda, Sponsor Etc..*/}
                    <Route exact path="/crud/:idModel" component={ ContainerCrud } />
                </Switch>
            </main>
        );
    }
}

function QRedirect({ match }) {
    window.location.replace(`${ApiUrl}/api/generatorQr/${match.params.id}`);
    return  <p>Redirecting...</p>;
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