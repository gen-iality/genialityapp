import React, {Component} from 'react';
import { Route, Redirect, withRouter, Switch } from "react-router-dom";
import Event from "../components/events/event";
import * as Cookie from "js-cookie";
import {ApiUrl} from "../helpers/constants";
import ContainerCrud from '../components/shared/crud/containers';
import asyncComponent from "./AsyncComponent";

//Code splitting
const AsyncHome = asyncComponent(() => import("../components/home"));
const AsyncHomeProfile = asyncComponent(() => import("../components/home/profile"));
const AsyncLanding = asyncComponent(() => import("../components/events/landing"));
const AsyncEvents = asyncComponent(() => import("../components/events"));
const AsyncOrganization = asyncComponent(()=> import("../components/organization"));
const AsyncMyProfile = asyncComponent(()=> import("../components/profile"));
const AsyncTerms = asyncComponent(()=> import("../components/policies/termsService"));
const AsyncPrivacy = asyncComponent(()=> import("../components/policies/privacyPolicy"));
const AsyncPolicies = asyncComponent(()=> import("../components/policies/policies"));
const AsyncAbout = asyncComponent(()=> import("../components/policies/about"));
const AsyncFaqs = asyncComponent(()=> import("../components/faqs"));

class ContentContainer extends Component {
    componentWillMount(){
        this.props.history.index=0
    }
    render() {
        return (
            <main className="main">
                <Switch>
                    <Route exact path="/" component={ AsyncHome } />
                    <Route exact path="/page/:id" component={ AsyncHomeProfile } />
                    <Route exact path="/landing/:event" component={ AsyncLanding }/>
                    <PrivateRoute path="/my_events" component={ AsyncEvents }/>
                    <PrivateRoute path="/event/:event" component={ Event }/>
                    <PrivateRoute path="/profile/:id" component={ AsyncMyProfile }/>
                    <PrivateRoute path="/organization/:id" component={ AsyncOrganization }/>
                    <Route exact path="/terms" component={ AsyncTerms } />
                    <Route exact path="/privacy" component={ AsyncPrivacy } />
                    <Route exact path="/policies" component={ AsyncPolicies } />
                    <Route exact path="/about" component={ AsyncAbout } />
                    <Route exact path="/faqs" component={ AsyncFaqs } />
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