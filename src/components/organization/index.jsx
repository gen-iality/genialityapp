import React, {Component} from 'react';
import { Route, NavLink, Redirect, Switch } from "react-router-dom";
import Loading from "../loaders/loading";
import {CategoriesApi, OrganizationApi} from "../../helpers/request";
import {rolPermissions} from "../../helpers/constants";

class Organization extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    async componentDidMount() {
        let orgId = this.props.match.params.id;
        try {
            const categories = await CategoriesApi.getAll();
            this.setState({categories});
            if(orgId === 'create'){
                const org= {location:{}, doc:{}, network:{facebook:'',twitter:'',instagram:'',linkedIn:''}};
                this.setState({create:true,loading:false,events:[],org})
            }else{
                const org = await OrganizationApi.getOne(orgId);
                const resp = await OrganizationApi.events(orgId);
                org.location = org.location? org.location: {};
                org.doc = org.doc? org.doc: {};
                org.network = org.network ? org.network : {facebook:'',twitter:'',instagram:'',linkedIn:''};
                this.setState({org,loading:false,events:resp.data,valid:false});
            }
        }catch (e) {
            console.log(e.response);
            this.setState({timeout:true,loading:false});
        }
    }

    async componentWillReceiveProps(nextProps) {
        let orgId = nextProps.match.params.id;
        if(orgId === 'create'){
            this.setState({loading:true});
            setTimeout(()=>{
                const org= {location:{}, doc:{}, network:{facebook:'',twitter:'',instagram:'',linkedIn:''}};
                this.setState({create:true,loading:false,events:[],org})
            },1000)
        }else{
            this.setState({loading:true});
            const org = await OrganizationApi.getOne(orgId);
            const resp = await OrganizationApi.events(orgId);
            org.location = org.location? org.location: {};
            org.doc = org.doc? org.doc: {};
            org.network = org.network ? org.network : {facebook:'',twitter:'',instagram:'',linkedIn:''};
            this.setState({org,loading:false,events:resp.data,valid:false});
        }
    }

    render() {
        const { match,permissions } = this.props;
        const { timeout } = this.state;
        console.log(this.state);
        return (
            <React.Fragment>
                <h1>hoLA</h1>
                {/*{
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
                                             <p className="menu-label has-text-centered-mobile" onClick={(e)=>{this.setState({contentTab:!this.state.contentTab})}}>
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
                                            }
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
                }*/}
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

export default Organization;