import React, {Component} from 'react';
import {Route, Redirect, Switch} from "react-router-dom";
import Moment from "moment"
import momentLocalizer from 'react-widgets-moment';
import Loading from "../loaders/loading";
import {EventsApi} from "../../helpers/request";
import {rolPermissions} from "../../helpers/constants";
import ListEventUser from "../event-users";
import LogOut from "../shared/logOut";
import {fetchRol} from "../../redux/rols/actions";
import {fetchPermissions} from "../../redux/permissions/actions";
import connect from "react-redux/es/connect/connect";
import asyncComponent from '../../containers/AsyncComponent';
import Espacios from "../espacios";
import Menu from "./menu";

//Code Splitting
const General = asyncComponent(()=> import("./general"));
const Badge = asyncComponent(()=> import("../badge")) ;
const RSVP = asyncComponent(()=> import("../rsvp")) ;
const Invitations = asyncComponent(()=> import("../invitations")) ;
const AdminRol = asyncComponent(()=> import("../roles")) ;
const TicketInfo = asyncComponent(()=> import("../tickets")) ;
const DashboardEvent = asyncComponent(()=> import("../dashboard")) ;
const OrdersEvent = asyncComponent(()=> import("../orders")) ;
const Pages =  asyncComponent(()=> import('../pages'));
const ListCertificados = asyncComponent( ()=> import("../certificados"));
const ReporteCertificados = asyncComponent( ()=> import("../certificados/reporte"));

Moment.locale('es');
momentLocalizer();

class Event extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            generalTab:true,
            guestTab:true,
            ticketTab:true,
            menuMobile:false
        };
    }

    async componentDidMount() {
        this.props.dispatch(fetchRol());
        let eventId = this.props.match.params.event;
        this.props.dispatch(fetchPermissions(eventId));
        try {
            const event = await EventsApi.getOne(eventId);
            const dateFrom = event.datetime_from.split(' ');
            const dateTo = event.datetime_to.split(' ');
            event.hour_start = Moment(dateFrom[1],'HH:mm').toDate();
            event.hour_end = Moment(dateTo[1],'HH:mm').toDate();
            event.date_start = Moment(dateFrom[0],'YYYY-MM-DD').toDate();
            event.date_end = Moment(dateTo[0],'YYYY-MM-DD').toDate();
            event.properties_group = event.properties_group ? event.properties_group : [];
            this.setState({event,loading:false});
        }catch (e) {
            console.log(e.response);
            this.setState({timeout:true,loading:false});
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        console.log(nextProps);
    }

    componentWillUnmount(){
        this.setState({newEvent:false})
    }

    handleClick = (e) => {
        if(!navigator.onLine) e.preventDefault();
    };

    updateEvent = (event) => {
        this.setState({event})
    };

    render() {
        const { match, permissions, showMenu } = this.props;
        const { timeout } = this.state;
        return (
            <React.Fragment>
                {
                    this.state.loading || this.props.loading ? <Loading/>:
                        <section className="columns">
                            <aside className={`column menu event-aside is-2 is-hidden-mobile ${!showMenu?'is-hidden':""}`}>
                                <Menu match={match}/>
                            </aside>
                            <div className="column event-main">
                                <h3 className='name-event'>{this.state.event.name}</h3>
                                <section className="section event-wrapper">
                                    <Switch>
                                        <Route exact path={`${match.url}/`} render={()=><Redirect to={`${match.url}/main`} />}/>
                                        <Route exact path={`${match.url}/main`} render={()=>
                                            <General event={this.state.event} updateEvent={this.updateEvent}/>}
                                        />
                                        <Protected path={`${match.url}/assistants`} component={ListEventUser} eventId={this.state.event._id} event={this.state.event} url={match.url}/>
                                        {
                                            permissions.items.includes(rolPermissions.admin_badge._id) &&
                                            <Protected path={`${match.url}/badge`} component={Badge} eventId={this.state.event._id} event={this.state.event} url={match.url}/>
                                        }
                                        <Protected path={`${match.url}/rsvp`} component={RSVP} event={this.state.event} url={match.url}/>
                                        {
                                            permissions.items.includes(rolPermissions.history_invitations._id) &&
                                            <Route path={`${match.url}/messages`} render={() => <Invitations event={this.state.event}/>}/>
                                        }
                                        {
                                            permissions.items.includes(rolPermissions.admin_staff._id) &&
                                            <Route path={`${match.url}/roles`} render={()=><AdminRol event={this.state.event} />}/>
                                        }
                                        {
                                            permissions.items.includes(rolPermissions.admin_ticket._id) &&
                                            <Route path={`${match.url}/ticket`} render={()=><TicketInfo eventId={this.state.event._id}/>}/>
                                        }
                                        {
                                            permissions.items.includes(rolPermissions.admin_staff._id) &&
                                            <Route path={`${match.url}/pages`} component={Pages}/>
                                        }
                                        <Route path={`${match.url}/dashboard`} render={()=><DashboardEvent eventId={this.state.event._id} />}/>
                                        <Route path={`${match.url}/orders`} render={()=><OrdersEvent eventId={this.state.event._id}/>}/>
                                        <Route path={`${match.url}/certificados`} render={()=><ListCertificados event={this.state.event}/>}/>
                                        <Route path={`${match.url}/espacios`} render={()=><Espacios eventID={this.state.event._id}/>}/>
                                        <Route path={`${match.url}/reporte-certificados`} render={()=><ReporteCertificados eventId={this.state.event._id}/>}/>
                                        <Route component={NoMatch} />
                                    </Switch>
                                </section>
                            </div>
                        </section>
                }
                {
                    timeout&&(<LogOut/>)
                }
            </React.Fragment>
        );
    }
}

function NoMatch({ location }) {
    return (
        <div>
            <h3>
                No match for <code>{location.pathname}</code>
            </h3>
        </div>
    );
}

const Protected = ({ component: Component, event, eventId, url, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            (event.user_properties && event.user_properties.length>0)?
            (<Component {...props} event={event} eventId={eventId}/>):
            (<Redirect push to={`${url}/main`}/>)
        }
    />
);

const mapStateToProps = state => ({
    loading: state.rols.loading,
    permissions: state.permissions,
    showMenu: state.user.menu,
    error: state.rols.error
});

export default connect(mapStateToProps)(Event);
