import React, {Component, Fragment} from 'react';
import { Route, NavLink, Redirect, Switch } from "react-router-dom";
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
        this.props.history.listen((location, action) => {
            this.setState({menuMobile:false})
        });
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

    openMenu = (e) => {
        this.setState((prevState)=>{return {menuMobile:!prevState.menuMobile}})
    }

    render() {
        const { match,permissions } = this.props;
        const { timeout,menuMobile } = this.state;
        const menu = <Fragment>
            <p className="menu-label has-text-centered-mobile" onClick={(e)=>{this.setState({generalTab:!this.state.generalTab})}}>
                <span className="item has-text-grey">Configuración General</span>
                <span className="icon"><i className={`${this.state.generalTab?'up':'down'}`}/></span>
            </p>
            {
                this.state.generalTab && (
                    <ul className="menu-list">
                        <li>
                            <NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${match.url}/main`}>Datos del evento</NavLink>
                        </li>
                        {
                            permissions.items.includes(rolPermissions.admin_staff._id) &&
                            <li>
                                <NavLink className="item" onClick={this.handleClick} activeClassName={"active"} to={`${match.url}/pages`}>Contenido</NavLink>
                            </li>
                        }
                        <li>
                            <NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${match.url}/datos`}>Recopilación de datos</NavLink>
                        </li>
                        {
                            permissions.items.includes(rolPermissions.admin_staff._id) &&
                            <Fragment>
                                <li><NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${match.url}/espacios`}>Programa y salas</NavLink></li>
                                <li><NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${match.url}/roles`}>Organizadores</NavLink></li>
                            </Fragment>
                        }
                        {
                            permissions.items.includes(rolPermissions.admin_badge._id) &&
                            <Fragment>
                                <li>
                                    <NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${match.url}/badge`}>Escarapela</NavLink>
                                </li>
                                <li>
                                    <NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${match.url}/certificados`}>Certificados</NavLink>
                                </li>
                            </Fragment>
                        }
                    </ul>
                )
            }
            <p className="menu-label has-text-centered-mobile" onClick={(e)=>{this.setState({guestTab:!this.state.guestTab})}}>
                <span className="item has-text-grey">Invitados</span>
                <span className="icon"><i className={`${this.state.guestTab?'up':'down'}`}/></span>
            </p>
            {
                this.state.guestTab && (
                    <ul className="menu-list">
                        {
                            permissions.items.includes(rolPermissions.admin_invitations._id) &&
                                <Fragment>
                                    <li>
                                        <NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${match.url}/rsvp`}>Lista de invitados</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${match.url}/invitaciones`}>Invitaciones</NavLink>
                                    </li>
                                </Fragment>
                        }
                        <li>
                            <NavLink className="item" onClick={this.handleClick} activeClassName={'active'} to={`${match.url}/assistants`}>Check In</NavLink>
                        </li>
                    </ul>
                )
            }
            {
                permissions.items.includes(rolPermissions.admin_ticket._id) &&
                    <Fragment>
                        <p className="menu-label has-text-centered-mobile" onClick={(e)=>{this.setState({ticketTab:!this.state.ticketTab})}}>
                            <span className="item has-text-grey">Entradas</span>
                            <span className="icon"><i className={`${this.state.ticketTab?'up':'down'}`}/></span>
                        </p>
                        {
                            this.state.ticketTab && (
                                <ul className="menu-list">
                                    <li>
                                        <NavLink className="item" onClick={this.handleClick} activeClassName={"active"} to={`${match.url}/ticket`}>Administrar entradas</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className="item" onClick={this.handleClick} activeClassName={"active"} to={`${match.url}/orders`}>Pedidos</NavLink>
                                    </li>
                                </ul>
                            )
                        }
                    </Fragment>
            }
            <p className="menu-label has-text-centered-mobile">
                <NavLink className="item" onClick={this.handleClick} activeClassName={"active"} to={`${match.url}/dashboard`}>Estadísticas del evento</NavLink>
            </p>
            </Fragment>
        return (
            <React.Fragment>
                {
                    this.state.loading ? <Loading/>:
                        <section className="columns">
                            <div className='name-event'>
                                <p className="subtitle">Evento</p>
                                <div className={`dropdown ${menuMobile?'is-active':''}`}>
                                    <div className='dropdown-trigger'>
                                        <p className="title">
                                            {this.state.event.name}
                                            <span className='icon is-small is-hidden-desktop is-hidden-tablet icon-menu' onClick={this.openMenu} aria-haspopup='true' aria-controls={'dropdown-menuevent'}>
                                                {
                                                    menuMobile? <i className="fas fa-times" aria-hidden="true"/>:<i className="fas fa-bars"></i>
                                                }
                                            </span>
                                        </p>
                                    </div>
                                    <div className='dropdown-menu' id='dropdown-menuevent' role={"menu"}>
                                        <div className='dropdown-content'>
                                            {menu}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <aside className="column menu event-aside is-2 is-hidden-mobile">
                                {menu}
                            </aside>
                            <div className="column event-main is-10">
                                {
                                    this.props.loading?<p>Cargando</p>:<section className="section event-wrapper">
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
