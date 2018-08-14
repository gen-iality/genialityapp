import React, {Component} from 'react';
import { Route, Link } from "react-router-dom";
import Moment from "moment"
import momentLocalizer from 'react-widgets-moment';
import Loading from "../../containers/loading";
import {Actions} from "../../helpers/request";
import General from "./general";
import RSVP from "../rsvp";
import ListEventUser from "../event-users";
import Agenda from "../agenda";
import AgendaEdit from "../agenda/edit";
import {EventUrl} from "../../helpers/constants";
Moment.locale('es');
momentLocalizer();

class Event extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true
        }
    }

    async componentDidMount() {
        let eventId = this.props.match.params.event;
        const event = await Actions.getOne(EventUrl,eventId);
        event.hour = event.hour ? Moment(event.date_start + ' ' + event.hour).toDate() : Moment(event.date_start).toDate();
        event.date_start = Moment(event.date_start).toDate();
        event.date_end = Moment(event.date_end).toDate();
        this.setState({event,loading:false});
    }

    render() {
        const { match } = this.props;
        return (
            <React.Fragment>
                {
                    this.state.loading ? <Loading/>:
                        <section className="section columns">
                            <aside className="column is-2 is-narrow-mobile is-fullheight menu is-hidden-mobile aside">
                                <p className="menu-label item">
                                    <Link to={`${match.url}/general`}>General</Link>
                                </p>
                                <p className="menu-label item">
                                    <Link to={`${match.url}/users`}>Usuarios</Link>
                                </p>
                                <ul className="menu-list">
                                    <li><Link to={`${match.url}/rsvp`}>RSVP</Link></li>
                                </ul>
                                <p className="menu-label item">
                                    Contenido
                                </p>
                                <ul className="menu-list">
                                    <li><Link to={`${match.url}/agenda`}>Agenda</Link></li>
                                </ul>
                            </aside>
                            <div className="column is-10">
                                <section className="section">
                                    <Route path={`${match.url}/general`} render={()=><General event={this.state.event} />}/>
                                    <Route path={`${match.url}/users`} render={()=><ListEventUser eventId={this.state.event._id} />}/>
                                    <Route path={`${match.url}/rsvp`} render={()=><RSVP event={this.state.event} />}/>
                                    <Route exact strict path={`${match.url}/agenda`} render={()=><Agenda event={this.state.event} />}/>
                                    <Route path={`${match.url}/agenda/:item`} render={()=><AgendaEdit event={this.state.event}/>}/>
                                    <Route
                                        exact
                                        path={match.url}
                                        render={() => <h3>Please select a module.</h3>}
                                    />
                                </section>
                            </div>
                        </section>
                }
            </React.Fragment>
        );
    }
}

export default Event;