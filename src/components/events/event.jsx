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
import Menu from "./shared/menu";
import Datos from "./datos";
import TipoAsistentes from "./tipoUsers";
import ErrorServe from "../modal/serverError";
import AgendaRoutes from "../agenda";
import TriviaRoutes from "../trivia"
import DocumentsRoutes from "../documents";
import Speakers from "../speakers";
import Surveys from "../surveys";
import Surveysconsultant from "../surveysconsultant";
import CheckAgenda from "../agenda/checkIn";
import ReportList from "../agenda/report";
import ConferenceRoute from "../zoom/index"
//import Styles from '../App/styles';

//Code Splitting
const General = asyncComponent(()=> import("./general"));
const Badge = asyncComponent(()=> import("../badge")) ;

//invitations
const InvitedUsers = asyncComponent(()=> import("../invitations/invitedUsers"));
const RSVP = asyncComponent(()=> import("../rsvp")) ;
const RSVP_old = asyncComponent(()=> import("../rsvp_old")) ;
const Invitations = asyncComponent(()=> import("../invitations"));
const Invitations_old = asyncComponent(()=> import("../invitations_old"));
const MessageInvitedUsers = asyncComponent(()=> import("../invitations/messageInvitedUsers")) ;


const AdminRol = asyncComponent(()=> import("./staff")) ;
const TicketInfo = asyncComponent(()=> import("../tickets")) ;
const Styles = asyncComponent(()=> import("../App/styles"));
const DashboardEvent = asyncComponent(()=> import("../dashboard")) ;
const OrdersEvent = asyncComponent(()=> import("../orders")) ;
const Pages =  asyncComponent(()=> import('../pages'));
const ListCertificados = asyncComponent( ()=> import("../certificados"));
const ReporteCertificados = asyncComponent( ()=> import("../certificados/reporte"));
const ConfigurationApp = asyncComponent( ()=> import("../App/configuration"));
const NotificationsApp = asyncComponent( ()=>import("../pushNotifications/index") );
const Wall = asyncComponent( ()=>import("../wall/index") )
const NewsApp = asyncComponent( ()=>import("../news/news"));
const SurveysCreate = asyncComponent( ()=>import("../surveys/index"));
const FAQS = asyncComponent( ()=>import("../news/news"));
const Trivia = asyncComponent( ()=>import("../trivia/trivia") );

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
            styleTab:true,
            menuMobile:false,
            ConfigurationApp:true,
            NotificationsApp:true,
            CreateSuervey: true,
            NewsApp:true,
            SurveysCreate:true,
            FAQS:true,
            Trivia: true,
        };
    }

    async componentDidMount() {
        try {
            await this.props.dispatch(fetchRol());
            let eventId = this.props.match.params.event;
            await this.props.dispatch(fetchPermissions(eventId));
            const event = await EventsApi.getOne(eventId);
            const dateFrom = event.datetime_from.split(' ');
            const dateTo = event.datetime_to.split(' ');
            event.hour_start = Moment(dateFrom[1],'HH:mm').toDate();
            event.hour_end = Moment(dateTo[1],'HH:mm').toDate();
            event.date_start = Moment(dateFrom[0],'YYYY-MM-DD').toDate();
            event.date_end = Moment(dateTo[0],'YYYY-MM-DD').toDate();
            event.address = event.address ? event.address : "";
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

    render() {
        const { match, permissions, showMenu } = this.props;
        const { timeout } = this.state;
        if(this.state.loading || this.props.loading || permissions.loading) return <Loading/>;
        if(this.props.error || permissions.error) return <ErrorServe errorData={permissions.error}/>;
        if(timeout) return <LogOut/>;
        return (
            <section className="columns">
                <aside className={`column menu event-aside is-2 is-hidden-touch ${!showMenu?'is-hidden':""}`}>
                    <Menu match={match}/>
                </aside>
                <div className="column event-main">
                    <h3 className='name-event'>{this.state.event.name}</h3>
                    <section className="section event-wrapper">
                        <Switch>
                            <Route exact path={`${match.url}/`} render={()=><Redirect to={`${match.url}/main`} />}/>
                            <Route exact path={`${match.url}/main`} render={()=><General event={this.state.event} eventId={this.state.event._id} updateEvent={this.updateEvent}/>}/>
                            <Route exact path={`${match.url}/wall`} render={()=><Wall event={this.state.event} eventId={this.state.event._id}/>}/>
                            <Route path={`${match.url}/datos`} render={()=><Datos eventID={this.state.event._id}/>}/>
                            <Route path={`${match.url}/agenda`} render={()=><AgendaRoutes event={this.state.event}/>}/>
                            <Route path={`${match.url}/trivia`} render={()=><TriviaRoutes event={this.state.event}/>}/>
                            <Route path={`${match.url}/documents`} render={()=><DocumentsRoutes event={this.state.event}/>}/>    
                            <Route path={`${match.url}/conference`} render={()=><ConferenceRoute event={this.state.event}/>}/>    

                            <Protected path={`${match.url}/assistants`} component={ListEventUser} eventId={this.state.event._id} event={this.state.event} url={match.url}/>
                            <Protected path={`${match.url}/checkin/:id`} component={CheckAgenda} event={this.state.event} url={match.url}/>
                            <Protected path={`${match.url}/checkin-actividad`} component={ReportList} event={this.state.event} url={match.url}/>
                            {
                                //permissions.data.ids.includes(rolPermissions.admin_badge._id) &&
                                <Protected path={`${match.url}/badge`} component={Badge} eventId={this.state.event._id} event={this.state.event} url={match.url}/>
                            }

                            <Route path={`${match.url}/invitados`}  render={() => <InvitedUsers  event={this.state.event}/>}/>
                            <Protected path={`${match.url}/invitar`} component={RSVP} eventId={this.state.event._id} event={this.state.event}/>
                            <Protected path={`${match.url}/invitar_old`} component={RSVP_old} eventId={this.state.event._id} event={this.state.event}/>    
                            <Route path={`${match.url}/mensajesainvitados`} render={() => <MessageInvitedUsers event={this.state.event}/>}/>
                            <Route path={`${match.url}/invitaciones`} render={() => <Invitations event={this.state.event}/>}/>
                            <Route path={`${match.url}/invitaciones_old`} render={() => <Invitations_old event={this.state.event}/>}/>

                            {
                                permissions.data.ids.includes(rolPermissions.admin_staff._id) &&
                                <Route path={`${match.url}/staff`} render={()=><AdminRol event={this.state.event} />}/>
                            }
                            <Route path={`${match.url}/tipo-asistentes`} render={()=><TipoAsistentes eventID={this.state.event._id} />}/>
                            {
                                permissions.data.ids.includes(rolPermissions.admin_ticket._id) &&
                                <Route path={`${match.url}/ticket`} render={()=><TicketInfo eventId={this.state.event._id}/>}/>
                            }

                            {
                                permissions.data.ids.includes(rolPermissions._id) &&
                                <Route path={`${match.url}/styles`} render={()=><Styles eventId={this.state.event._id}/>}/>
                            }

                            {
                                permissions.data.ids.includes(rolPermissions._id) &&
                                <Route path={`${match.url}/configurationApp`} render={()=><ConfigurationApp eventId={this.state.event._id}/>}/>
                            }

                            {
                                permissions.data.ids.includes(rolPermissions._id) &&
                                <Route path={`${match.url}/notifications`} render={()=><NotificationsApp eventId={this.state.event._id}/>}/>
                            }

                            {
                                permissions.data.ids.includes(rolPermissions._id) &&
                                <Route path={`${match.url}/surveys`} render={()=><SurveysCreate eventId={this.state.event._id}/>}/>
                            }

                            {   
                                permissions.data.ids.includes(rolPermissions._id) &&
                                <Route path={`${match.url}/news`} render={()=><NewsApp eventId={this.state.event._id}/>}/>
                            }

                            {   
                                permissions.data.ids.includes(rolPermissions._id) &&
                                <Route path={`${match.url}/falqs`} render={()=><FAQS eventId={this.state.event._id}/>}/>
                            }

                            {
                                permissions.data.ids.includes(rolPermissions.admin_staff._id) &&
                                <Route path={`${match.url}/pages`} component={Pages}/>
                            }
                            
                            <Route path={`${match.url}/dashboard`} render={()=><DashboardEvent eventId={this.state.event._id} />}/>
                            <Route path={`${match.url}/orders`} render={()=><OrdersEvent eventId={this.state.event._id}/>}/>
                            <Route path={`${match.url}/certificados`} render={()=><ListCertificados event={this.state.event}/>}/>
                            <Route path={`${match.url}/espacios`} render={()=><Espacios eventID={this.state.event._id}/>}/>
                            <Route path={`${match.url}/reporte-certificados`} render={()=><ReporteCertificados eventId={this.state.event._id}/>}/>
                            <Route path={`${match.url}/speakers`} render={()=><Speakers eventID={this.state.event._id}/>}/>
                            <Route path={`${match.url}/encuestas`} render={()=><Surveys eventID={this.state.event._id}/>}/>
                            <Route path={`${match.url}/encuestasasesores`} render={()=><Surveysconsultant eventID={this.state.event._id}/>}/>
                            <Route path={`${match.url}/styles`} render={()=><Styles eventId={this.state.event._id}/>}/>
                            <Route path={`${match.url}/configurationApp`} render={()=><ConfigurationApp eventId={this.state.event._id}/>}/>
                            <Route path={`${match.url}/notificationsApp`} render={()=><NotificationsApp eventId={this.state.event._id}/>}/>
                            <Route path={`${match.url}/surveys`} render={()=><SurveysCreate eventId={this.state.event._id}/>}/>
                            <Route path={`${match.url}/news`} render={()=><NewsApp eventId={this.state.event._id}/>}/>
                            <Route path={`${match.url}/faqs`} render={()=><FAQS eventId={this.state.event._id}/>}/>
                            {/* <Route path={`${match.url}/trivia`} render={()=><Trivia eventId={this.state.event._id}/>}/> */}
                            <Route component={NoMatch} />
                        </Switch>
                    </section>
                </div>
            </section>
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
    <Route {...rest} render={props =>
            (event.user_properties && event.user_properties.length>0)?
            (<Component {...props} event={event} eventId={eventId} url={url}/>):
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
