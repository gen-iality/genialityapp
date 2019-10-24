import React, {Component} from 'react';
import { Route, NavLink, Redirect, Switch } from "react-router-dom";
import Moment from "moment"
import momentLocalizer from 'react-widgets-moment';
import Loading from "../loaders/loading";
import {EventsApi} from "../../helpers/request";
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
            userTab:true,
            ticketTab:true,
            contentTab:true,
            certTab:true,
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
        const { match } = this.props;
        const { timeout,menuMobile } = this.state;
        const menu = <React.Fragment>
                <p className="menu-label has-text-centered-mobile">
                    <NavLink className="item" onClick={this.handleClick} activeClassName={"active"} to={`${match.url}/dashboard`}>Dashboard</NavLink>
                </p>
                <p className="menu-label has-text-centered-mobile">
                    <NavLink className="item" onClick={this.handleClick} activeClassName={"active"} to={`${match.url}/main`}>Información General</NavLink>
                </p>
                <p className="menu-label has-text-centered-mobile">
                    <NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${match.url}/roles`}>Staff</NavLink>
                </p>
                <p className="menu-label has-text-centered-mobile">
                    <NavLink className="item" onClick={this.handleClick} activeClassName={"active"} to={`${match.url}/pages`}>Contenido</NavLink>
                </p>
                    <p className="menu-label has-text-centered-mobile" onClick={(e)=>{this.setState({userTab:!this.state.userTab})}}>
                        <span className="item has-text-grey">Invitaciones</span>
                        <span className="icon">
                                                        <i className={`${this.state.userTab?'up':'down'}`}/>
                                                    </span>
                    </p>
                {
                    (this.state.userTab) && (
                        <ul className="menu-list">
                            <li>
                                <NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${match.url}/rsvp`}>Enviar</NavLink>
                            </li>
                            <li>
                                <NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${match.url}/messages`}>Historial</NavLink>
                            </li>
                        </ul>
                    )
                }
                <p className="menu-label has-text-centered-mobile">
                    <NavLink className="item" onClick={this.handleClick} activeClassName={"active"} to={`${match.url}/ticket`}>Tickets</NavLink>
                </p>
                <p className="menu-label has-text-centered-mobile">
                    <NavLink className="item" onClick={this.handleClick} activeClassName={'active'} to={`${match.url}/assistants`}>Asistentes</NavLink>
                </p>
                <ul className="menu-list">
                    <li>
                        <NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${match.url}/badge`}>Escarapela</NavLink>
                    </li>
                </ul>
                <p className="menu-label has-text-centered-mobile">
                    <NavLink className="item" onClick={this.handleClick} activeClassName={"active"} to={`${match.url}/orders`}>Orders</NavLink>
                </p>
                <p className="menu-label has-text-centered-mobile" onClick={(e)=>{this.setState({certTab:!this.state.certTab})}}>
                    <span className="item has-text-grey">Certificados</span>
                    <span className="icon"><i className={`${this.state.certTab?'up':'down'}`}/></span>
                </p>
            {
                (this.state.certTab) && (
                    <ul className="menu-list">
                        <li>
                            <NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${match.url}/certificados`}>Listado</NavLink>
                        </li>
                        <li>
                            <NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${match.url}/reporte-certificados`}>Reportes</NavLink>
                        </li>
                    </ul>
                )
            }
            </React.Fragment>
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
                            <aside className="column menu event-aside is-2 has-text-weight-bold">
                                <div className='is-hidden-mobile'>{menu}</div>
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
                                            <Protected path={`${match.url}/badge`} component={Badge} eventId={this.state.event._id} event={this.state.event} url={match.url}/>
                                            <Protected path={`${match.url}/rsvp`} component={RSVP} event={this.state.event} url={match.url}/>
                                            <Route path={`${match.url}/messages`} render={() => <Invitations event={this.state.event}/>}/>
                                            <Route path={`${match.url}/roles`} render={()=><AdminRol event={this.state.event} />}/>
                                            <Route path={`${match.url}/ticket`} render={()=><TicketInfo eventId={this.state.event._id}/>}/>
                                            <Route path={`${match.url}/pages`} component={Pages}/>
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
    loading: state.rols.loading,
    permissions: state.permissions,
    error: state.rols.error
});

export default connect(mapStateToProps)(Event);
