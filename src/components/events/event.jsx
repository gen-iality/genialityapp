import React, {Component} from 'react';
import { Route, NavLink, Redirect } from "react-router-dom";
import Moment from "moment"
import momentLocalizer from 'react-widgets-moment';
import Loading from "../loaders/loading";
import { EventsApi } from "../../helpers/request";
import General from "./general";
import RSVP from "../rsvp";
import ListEventUser from "../event-users";
import Agenda from "../agenda";
import AgendaEdit from "../agenda/edit";
import Invitations from "../invitations";
import LogOut from "../shared/logOut";
Moment.locale('es');
momentLocalizer();

class Event extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            userTab:true,
            contentTab:true
        }
    }

    async componentDidMount() {
        let eventId = this.props.match.params.event;
        if(eventId === 'new_event'){
            const event = {name:'New event',location:{}, description: '', categories: [], hour_start : Moment().toDate(), date_start : Moment().toDate(), hour_end : Moment().toDate(), date_end : Moment().toDate()};
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
                this.setState({timeout:true,loader:false});
            }
        }
    }

    componentWillUnmount(){
        this.setState({newEvent:false})
    }

    render() {
        const { match, timeout } = this.props;
        return (
            <React.Fragment>
                {
                    this.state.loading ? <Loading/>:
                        <section className="section columns">
                            <aside className="column is-2 is-narrow-mobile is-fullheight menu is-hidden-mobile aside">
                                <p className="subtitle event-name">{this.state.event.name}</p>
                                {
                                    !this.state.newEvent && (
                                        <React.Fragment>
                                            <p className="menu-label">
                                                <NavLink className="item" activeClassName={"active"} to={`${match.url}/main`}>General</NavLink>
                                            </p>
                                            <p className="menu-label">
                                                <NavLink className="item" activeClassName={"active"} to={`${match.url}/main`}>Tickets</NavLink>
                                            </p>
                                            <p className="menu-label">
                                                <NavLink className="item" activeClassName={'active'} to={`${match.url}/rsvp`}>Invitaciones</NavLink>
                                            </p>
                                            {
                                                this.state.userTab && (
                                                    <ul className="menu-list">
                                                        <li>
                                                            <NavLink activeClassName={'active'} to={`${match.url}/invitations`}>Historial</NavLink>
                                                        </li>
                                                    </ul>
                                                )
                                            }
                                            <p className="menu-label">
                                                <NavLink className="item" activeClassName={'active'} to={`${match.url}/users`}>Asistentes</NavLink>
                                            </p>
                                            <p className="menu-label item" onClick={(e)=>{this.setState({contentTab:!this.state.contentTab})}}>
                                                <span>Contenido</span>
                                                <span className="icon">
                                        <i className={`${this.state.contentTab?'up':'down'}`}/>
                                    </span>
                                            </p>
                                            {
                                                this.state.contentTab && (
                                                    <ul className="menu-list">
                                                        <li>
                                                            <NavLink activeClassName={'active'} to={`${match.url}/agenda`}>Agenda</NavLink>
                                                            <NavLink activeClassName={'active'} to={`${match.url}/agenda`}>Speakers</NavLink>
                                                        </li>
                                                    </ul>
                                                )
                                            }
                                        </React.Fragment>
                                    )
                                }
                            </aside>
                            <div className="column is-10">
                                <section className="section">
                                    <Route exact path={`${match.url}/main`} render={()=><General event={this.state.event} />}/>
                                    <Route path={`${match.url}/users`} render={()=><ListEventUser eventId={this.state.event._id} event={this.state.event}/>}/>
                                    <Route path={`${match.url}/invitations`} render={()=><Invitations event={this.state.event} />}/>
                                    <Route path={`${match.url}/rsvp`} render={()=><RSVP event={this.state.event} />}/>
                                    <Route exact strict path={`${match.url}/agenda`} render={()=><Agenda event={this.state.event} />}/>
                                    <Route path={`${match.url}/agenda/:item`} render={()=><AgendaEdit event={this.state.event}/>}/>
                                    <Route exact path={`${match.url}/`} render={()=><Redirect to={`${match.url}/main`} />}/>
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

export default Event;