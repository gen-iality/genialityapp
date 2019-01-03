import React, {Component} from 'react';
import { Route, NavLink, Redirect, Switch } from "react-router-dom";
import Moment from "moment"
import momentLocalizer from 'react-widgets-moment';
import Loading from "../loaders/loading";
import {EventsApi} from "../../helpers/request";
import {rolPermissions} from "../../helpers/constants";
import General from "./general";
import RSVP from "../rsvp";
import ListEventUser from "../event-users";
import Agenda from "../agenda";
import AgendaEdit from "../agenda/edit";
import Invitations from "../invitations";
import LogOut from "../shared/logOut";
import {fetchState} from "../../redux/states/actions";
import {fetchRol} from "../../redux/rols/actions";
import {fetchPermissions} from "../../redux/permissions/actions";
import connect from "react-redux/es/connect/connect";
import Badge from "../badge";
import AdminRol from "../roles";
import TicketInfo from "../tickets";
import TicketConfig from "../tickets/config";
Moment.locale('es');
momentLocalizer();

class Event extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            userTab:true,
            ticketTab:true,
            contentTab:true
        }
    }

    async componentDidMount() {
        this.props.dispatch(fetchState());
        this.props.dispatch(fetchRol());
        let eventId = this.props.match.params.event;
        this.props.dispatch(fetchPermissions(eventId));
        if(eventId === 'new_event'){
            const event = {name:'',location:{}, description: '', categories: [], hour_start : Moment().toDate(), date_start : Moment().toDate(), hour_end : Moment().toDate(), date_end : Moment().toDate()};
            this.setState({newEvent:true,loading:false,event})
        }else{
            try {
                const event = await EventsApi.getOne(eventId);
                const dateFrom = event.datetime_from.split(' ');
                const dateTo = event.datetime_to.split(' ');
                event.hour_start = Moment(dateFrom[1],'HH:mm').toDate();
                event.hour_end = Moment(dateTo[1],'HH:mm').toDate();
                event.date_start = Moment(dateFrom[0],'YYYY-MM-DD').toDate();
                event.date_end = Moment(dateTo[0],'YYYY-MM-DD').toDate();
                this.setState({event,loading:false});
            }catch (e) {
                console.log(e.response);
                this.setState({timeout:true,loading:false});
            }
        }
    }

    async componentWillReceiveProps(nextProps) {
        let eventId = nextProps.match.params.event;
        if(eventId === 'new_event'){
            const event = {name:'',location:{}, description: '', categories: [], hour_start : Moment().toDate(), date_start : Moment().toDate(), hour_end : Moment().toDate(), date_end : Moment().toDate(), user_properties:[]};
            this.setState({newEvent:true,loading:false,event})
        }else{
            try {
                const event = await EventsApi.getOne(eventId);
                const dateFrom = event.datetime_from.split(' ');
                const dateTo = event.datetime_to.split(' ');
                event.hour_start = Moment(dateFrom[1],'HH:mm').toDate();
                event.hour_end = Moment(dateTo[1],'HH:mm').toDate();
                event.date_start = Moment(dateFrom[0],'YYYY-MM-DD').toDate();
                event.date_end = Moment(dateTo[0],'YYYY-MM-DD').toDate();
                this.setState({event,loading:false});
            }catch (e) {
                console.log(e.response);
                this.setState({timeout:true,loading:false});
            }
        }
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
        const { match,permissions } = this.props;
        const { timeout } = this.state;
        return (
            <React.Fragment>
                {
                    this.state.loading ? <Loading/>:
                        <section className="columns">
                            <aside className="column menu event-aside is-2 has-text-weight-bold">
                                <p className="subtitle has-text-weight-bold">
                                    {this.state.newEvent?'Nuevo evento':this.state.event.name}
                                </p>
                                {
                                    (!this.state.newEvent) && (
                                        <div className={`is-hidden-mobile`}>
                                            <p className="menu-label has-text-centered-mobile">
                                                <NavLink className="item" onClick={this.handleClick} activeClassName={"active"} to={`${match.url}/main`}>General</NavLink>
                                            </p>
                                            {
                                                permissions.items.includes(rolPermissions.admin_staff) &&
                                                    <ul className="menu-list">
                                                        <li>
                                                            <NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${match.url}/roles`}>Staff</NavLink>
                                                        </li>
                                                    </ul>
                                            }
                                            {
                                                (permissions.items.includes(rolPermissions.admin_invitations) || permissions.items.includes(rolPermissions.history_invitations)) &&
                                                    <p className="menu-label has-text-centered-mobile" onClick={(e)=>{this.setState({userTab:!this.state.userTab})}}>
                                                        <span className="item has-text-grey">Invitaciones</span>
                                                        <span className="icon">
                                                        <i className={`${this.state.userTab?'up':'down'}`}/>
                                                    </span>
                                                    </p>
                                            }
                                            {
                                                (this.state.userTab && permissions.items.includes(rolPermissions.admin_invitations)) && (
                                                    <ul className="menu-list">
                                                        <li>
                                                            <NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${match.url}/rsvp`}>Enviar</NavLink>
                                                        </li>
                                                        {
                                                            permissions.items.includes(rolPermissions.history_invitations) &&
                                                            <li>
                                                                <NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${match.url}/messages`}>Historial</NavLink>
                                                            </li>
                                                        }
                                                    </ul>
                                                )
                                            }
                                            {
                                                permissions.items.includes(rolPermissions.admin_ticket) &&
                                                    <p className="menu-label has-text-centered-mobile" onClick={(e)=>{this.setState({ticketTab:!this.state.ticketTab})}}>
                                                    <span className="item has-text-grey">Ticketes</span>
                                                    <span className="icon">
                                                    <i className={`${this.state.ticketTab?'up':'down'}`}/>
                                                </span>
                                                </p>
                                            }
                                            {
                                                (this.state.ticketTab && permissions.items.includes(rolPermissions.admin_ticket)) && (
                                                    <ul className="menu-list">
                                                        <li>
                                                            <NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${match.url}/ticket`}>Informativa</NavLink>
                                                        </li>
                                                        <li>
                                                            <NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${match.url}/configuration_ticket`}>Configuración</NavLink>
                                                        </li>
                                                    </ul>
                                                )
                                            }
                                            <p className="menu-label has-text-centered-mobile">
                                                <NavLink className="item" onClick={this.handleClick} activeClassName={'active'} to={`${match.url}/assistants`}>Asistentes</NavLink>
                                            </p>
                                            {
                                                permissions.items.includes(rolPermissions.admin_badge) &&
                                                <ul className="menu-list">
                                                    <li>
                                                        <NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${match.url}/badge`}>Escarapela</NavLink>
                                                    </li>
                                                </ul>
                                            }
                                            {/* <p className="menu-label has-text-centered-mobile" onClick={(e)=>{this.setState({contentTab:!this.state.contentTab})}}>
                                                <span className="item has-text-grey">Contenido</span>
                                                <span className="icon">
                                                    <i className={`${this.state.contentTab?'up':'down'}`}/>
                                                </span>
                                            </p>
                                            {
                                                this.state.contentTab && (
                                                    <ul className="menu-list">
                                                        <li>
                                                            <NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${match.url}/agenda`}>Agenda</NavLink>
                                                        </li>
                                                        <li>
                                                            <NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${match.url}/speakers`}>Speakers</NavLink>
                                                        </li>
                                                    </ul>
                                                )
                                            } */}
                                        </div>
                                    )
                                }
                            </aside>
                            <div className="column event-main is-10">
                                {
                                    this.props.loading?<p>Cargando</p>:<section className="section event-wrapper">
                                        <Switch>
                                            <Route exact path={`${match.url}/`} render={()=><Redirect to={`${match.url}/main`} />}/>
                                            <Route exact path={`${match.url}/main`} render={()=><General event={this.state.event} updateEvent={this.updateEvent} />}/>
                                            <Protected path={`${match.url}/assistants`} component={ListEventUser} eventId={this.state.event._id} event={this.state.event} url={match.url}/>
                                            {
                                                permissions.items.includes(rolPermissions.admin_badge) &&
                                                <Protected path={`${match.url}/badge`} component={Badge} eventId={this.state.event._id} event={this.state.event} url={match.url}/>
                                            }
                                            <Protected path={`${match.url}/rsvp`} component={RSVP} event={this.state.event} url={match.url}/>
                                            {
                                                permissions.items.includes(rolPermissions.history_invitations) &&
                                                <Route path={`${match.url}/messages`} render={() => <Invitations event={this.state.event}/>}/>
                                            }
                                            {
                                                permissions.items.includes(rolPermissions.admin_staff) &&
                                                <Route path={`${match.url}/roles`} render={()=><AdminRol event={this.state.event} />}/>
                                            }
                                            {
                                                permissions.items.includes(rolPermissions.admin_ticket) &&
                                                    <React.Fragment>
                                                        <Route path={`${match.url}/ticket`} render={()=><TicketInfo eventId={this.state.event._id}/>}/>
                                                        <Route path={`${match.url}/configuration_ticket`} render={()=><TicketConfig eventId={this.state.event._id}/>}/>
                                                    </React.Fragment>
                                            }
                                            <Route exact strict path={`${match.url}/agenda`} render={()=><Agenda event={this.state.event} />}/>
                                            <Route path={`${match.url}/agenda/:item`} render={()=><AgendaEdit event={this.state.event}/>}/>
                                            <Route component={NoMatch} />
                                        </Switch>
                                    </section>
                                }
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
    loading: state.states.loading,
    permissions: state.permissions,
    error: state.states.error
});

export default connect(mapStateToProps)(Event);