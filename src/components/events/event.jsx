import React, { Component } from 'react';
import { Route, Redirect, Switch, Link } from 'react-router-dom';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import Loading from '../loaders/loading';
import { EventsApi } from '../../helpers/request';
import { rolPermissions } from '../../helpers/constants';
import ListEventUser from '../event-users';
import LogOut from '../shared/logOut';
import { fetchRol } from '../../redux/rols/actions';
import { fetchPermissions } from '../../redux/permissions/actions';
import connect from 'react-redux/es/connect/connect';
import asyncComponent from '../../containers/AsyncComponent';
import ChatExport from './ChatExport/';
import Espacios from '../espacios';
import Menu from './shared/menu';
import Datos from './datos';
import TipoAsistentes from './tipoUsers';
import ConfirmacionRegistro from './registro/confirmacionRegistro';
import ErrorServe from '../modal/serverError';
import AgendaRoutes from '../agenda';
import EmpresasRoutes from '../empresas';
import TriviaRoutes from '../trivia';
import DocumentsRoutes from '../documents';
import Speakers from '../speakers';
import MenuLanding from '../menuLanding';
import CheckAgenda from '../agenda/checkIn';
import ReportList from '../agenda/report';
import ConferenceRoute from '../zoom/index';
import ReportNetworking from '../networking/report';
import NewsSectionRoutes from '../news/newsRoute';
import ProductSectionRoutes from '../products/productsRoute';
import { withRouter } from 'react-router-dom';
import withContext from '../../Context/withContext';

//import Test from "../events/testButton"
import { Layout, Space } from 'antd';

const { Sider, Content } = Layout;
//import Styles from '../App/styles';

//Code Splitting
const General = asyncComponent(() => import('./general'));
const Badge = asyncComponent(() => import('../badge'));

//invitations
const InvitedUsers = asyncComponent(() => import('../invitations'));

//Messages
const Messages = asyncComponent(() => import('../messages'));

const AdminRol = asyncComponent(() => import('./staff'));
const TicketInfo = asyncComponent(() => import('../tickets'));
const Styles = asyncComponent(() => import('../App/styles'));
const DashboardEvent = asyncComponent(() => import('../dashboard'));
const OrdersEvent = asyncComponent(() => import('../orders'));
const Pages = asyncComponent(() => import('../pages'));
const ListCertificados = asyncComponent(() => import('../certificados'));
const ReporteCertificados = asyncComponent(() => import('../certificados/reporte'));
const ConfigurationApp = asyncComponent(() => import('../App/configuration'));
const NotificationsApp = asyncComponent(() => import('../pushNotifications/index'));
const Wall = asyncComponent(() => import('../wall/index'));
const NewsApp = asyncComponent(() => import('../news/news'));

const FAQS = asyncComponent(() => import('../faqs'));
const EventsTicket = asyncComponent(() => import('../ticketsEvent/index'));

Moment.locale('es');
momentLocalizer();

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      generalTab: true,
      guestTab: true,
      ticketTab: true,
      styleTab: true,
      menuMobile: false,
      ConfigurationApp: true,
      NotificationsApp: true,
      CreateSuervey: true,
      NewsApp: true,
      SurveysCreate: true,
      FAQS: true,
      Trivia: true,
      event: null,
    };
    this.addNewFieldsToEvent = this.addNewFieldsToEvent.bind(this);
  }

  async componentDidMount() {
    try {
      await this.props.dispatch(fetchRol());
      let eventId = this.props.match.params.event;
      await this.props.dispatch(fetchPermissions(eventId));
      const event = await EventsApi.getOne(eventId);
      const eventWithExtraFields = this.addNewFieldsToEvent(event);
      this.setState({ event: eventWithExtraFields, loading: false });
    } catch (e) {
      console.error(e.response);
      this.setState({ timeout: true, loading: false });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.event !== this.state.event) {
      const { event } = this.state;
      const eventWithExtraFields = this.addNewFieldsToEvent(event);
      this.setState({ event: eventWithExtraFields });
    }
  }

  addNewFieldsToEvent(event) {
    const dateFrom = event.datetime_from.split(' ');
    const dateTo = event.datetime_to.split(' ');
    event.hour_start = Moment(dateFrom[1], 'HH:mm').toDate();
    event.hour_end = Moment(dateTo[1], 'HH:mm').toDate();
    event.date_start = Moment(dateFrom[0], 'YYYY-MM-DD').toDate();
    event.date_end = Moment(dateTo[0], 'YYYY-MM-DD').toDate();
    event.address = event.address ? event.address : '';

    return event;
  }

  componentWillUnmount() {
    this.setState({ newEvent: false });
  }

  handleClick = (e) => {
    if (!navigator.onLine) e.preventDefault();
  };

  updateEvent = (event) => {
    this.setState({ event });
  };

  isUpper(str) {
    return !/[a-z]/.test(str) && /[A-Z]/.test(str);
  }

  isLowerCase(str) {
    return /[a-z]/.test(str) && !/[A-Z]/.test(str);
  }

  FriendLyUrl(url) {
    let formatupperorlowercase = url.toString().toLowerCase();
    if (this.isUpper(url.toString())) {
      formatupperorlowercase = url.toString().toUpperCase();
    } else if (this.isLowerCase(url.toString())) {
      formatupperorlowercase = url.toString().toLowerCase();
    } else {
      formatupperorlowercase = url.toString();
      console.log("por aca",formatupperorlowercase,"original",url)
    }

    var encodedUrl = formatupperorlowercase;
    encodedUrl = encodedUrl.split(/\&+/).join('-and-');
    if (this.isUpper(url)) {
      encodedUrl = encodedUrl.split(/[^A-Z0-9]/).join('-');
    } else if(this.isLowerCase(url.toString())) {
      encodedUrl = encodedUrl.split(/[^a-z0-9]/).join('-');
    }else{
      encodedUrl = encodedUrl.split(/-+/).join('-');
    }


    encodedUrl = encodedUrl.replaceAll(' ','-')
    encodedUrl = encodedUrl.trim('-');
    return encodedUrl;
  }

  render() {
    const { match, permissions, showMenu } = this.props;
    // console.log("${match.url}",match.url)
    const { timeout } = this.state;
    if (this.state.loading || this.props.loading || permissions.loading) return <Loading />;
    if (this.props.error || permissions.error) return <ErrorServe errorData={permissions.error} />;
    if (timeout) return <LogOut />;
    return (
      <Layout className='columns'>
        <Sider className={` menu event-aside is-hidden-touch ${!showMenu ? 'is-hidden' : ''}`}>
          <Menu match={match} />
        </Sider>
        <Content className='column event-main' style={{ width: 500 }}>
          <Space direction='vertical'>
            <a target='_blank' href={`${window.location.origin}/landing/${this.state.event._id}`}>
              <h2 style={{ fontWeight: 'bold' }} className='name-event  button add'>
                Ir al evento: (version antigua) {this.state.event.name}
              </h2>
            </a>
            {console.log('this.state.event', this.state.event)}
            <a target='_blank' href={`${window.location.origin}/event/${this.FriendLyUrl(this.state.event.name)}`}>
              <h2 style={{ fontWeight: 'bold' }} className='name-event  button add'>
                Ir al evento: (con nombre) {this.state.event.name}
              </h2>
            </a>
          </Space>
          <section className='section event-wrapper'>
            <Switch>
              <Route exact path={`${match.url}/`} render={() => <Redirect to={`${match.url}/agenda`} />} />
              <Route
                exact
                path={`${match.url}/main`}
                render={() => (
                  <General event={this.state.event} eventId={this.state.event._id} updateEvent={this.updateEvent} />
                )}
              />
              <Route
                exact
                path={`${match.url}/wall`}
                render={() => <Wall event={this.state.event} eventId={this.state.event._id} />}
              />
              <Route path={`${match.url}/datos`} render={() => <Datos eventID={this.state.event._id} event={this.state.event} />} />
              <Route
                path={`${match.url}/agenda`}
                render={() => <AgendaRoutes event={this.state.event} updateEvent={this.updateEvent} />}
              />
              <Route path={`${match.url}/empresas`}>
                <EmpresasRoutes event={this.state.event} />
              </Route>
              <Route path={`${match.url}/trivia`} render={() => <TriviaRoutes event={this.state.event} />} />
              <Route path={`${match.url}/documents`} render={() => <DocumentsRoutes event={this.state.event} />} />
              <Route path={`${match.url}/conference`} render={() => <ConferenceRoute event={this.state.event} />} />
              <Route path={`${match.url}/menuLanding`} render={() => <MenuLanding event={this.state.event} />} />
              <Route
                path={`${match.url}/reportNetworking`}
                render={() => <ReportNetworking event={this.state.event} />}
              />
              {/* <Route path={`${match.url}/test`} render={() => <Test event={this.state.event} ></Test>} /> */}
              <Protected
                path={`${match.url}/assistants`}
                component={ListEventUser}
                eventId={this.state.event._id}
                event={this.state.event}
                url={match.url}
              />

              <Protected
                path={`${match.url}/chatexport`}
                component={ChatExport}
                eventId={this.state.event._id}
                event={this.state.event}
                url={match.url}
              />

              <Protected
                path={`${match.url}/checkin/:id`}
                component={CheckAgenda}
                event={this.state.event}
                url={match.url}
              />
              <Protected
                path={`${match.url}/checkin-actividad`}
                component={ReportList}
                event={this.state.event}
                url={match.url}
              />
              {
                //permissions.data.ids.includes(rolPermissions.admin_badge._id) &&
                <Protected
                  path={`${match.url}/badge`}
                  component={Badge}
                  eventId={this.state.event._id}
                  event={this.state.event}
                  url={match.url}
                />
              }
              {/** AÚN NO TIENEN PERMISOS */}
              <Route
                path={`${match.url}/invitados`}
                render={() => <InvitedUsers eventId={this.state.event._id} event={this.state.event} />}
              />
              <Route path={`${match.url}/messages`} render={() => <Messages event={this.state.event} />} />

              {permissions.data.ids.includes(rolPermissions.admin_staff._id) && (
                <Route path={`${match.url}/staff`} render={() => <AdminRol event={this.state.event} />} />
              )}
              <Route
                path={`${match.url}/confirmacion-registro`}
                render={() => <ConfirmacionRegistro eventID={this.state.event._id} event={this.state.event} />}
              />
              <Route
                path={`${match.url}/tipo-asistentes`}
                render={() => <TipoAsistentes eventID={this.state.event._id} />}
              />
              {true && (
                <Route path={`${match.url}/ticket`} render={() => <TicketInfo eventId={this.state.event._id} />} />
              )}

              {permissions.data.ids.includes(rolPermissions._id) && (
                <Route path={`${match.url}/styles`} render={() => <Styles eventId={this.state.event._id} />} />
              )}

              {permissions.data.ids.includes(rolPermissions._id) && (
                <Route
                  path={`${match.url}/configurationApp`}
                  render={() => <ConfigurationApp eventId={this.state.event._id} />}
                />
              )}

              {permissions.data.ids.includes(rolPermissions._id) && (
                <Route
                  path={`${match.url}/notifications`}
                  render={() => <NotificationsApp eventId={this.state.event._id} />}
                />
              )}

              {/*{permissions.data.ids.includes(rolPermissions._id) && (
                <Route path={`${match.url}/news`} render={() => <NewsSectionRoutes eventId={this.state.event._id} event={this.state.event} />} />
              )}*/}

              {permissions.data.ids.includes(rolPermissions._id) && (
                <Route path={`${match.url}/falqs`} render={() => <FAQS eventId={this.state.event._id} />} />
              )}

              {permissions.data.ids.includes(rolPermissions.admin_staff._id) && (
                <Route path={`${match.url}/pages`} component={Pages} />
              )}

              <Route
                path={`${match.url}/dashboard`}
                render={() => <DashboardEvent eventName={this.state.event.name} eventId={this.state.event._id} />}
              />
              <Route path={`${match.url}/orders`} render={() => <OrdersEvent eventId={this.state.event._id} />} />
              <Route path={`${match.url}/certificados`} render={() => <ListCertificados event={this.state.event} />} />
              <Route path={`${match.url}/espacios`} render={() => <Espacios eventID={this.state.event._id} />} />
              <Route
                path={`${match.url}/reporte-certificados`}
                render={() => <ReporteCertificados eventId={this.state.event._id} />}
              />
              <Route path={`${match.url}/speakers`} render={() => <Speakers eventID={this.state.event._id} />} />

              <Route path={`${match.url}/styles`} render={() => <Styles eventId={this.state.event._id} />} />
              <Route
                path={`${match.url}/configurationApp`}
                render={() => <ConfigurationApp eventId={this.state.event._id} />}
              />
              <Route
                path={`${match.url}/notificationsApp`}
                render={() => <NotificationsApp eventId={this.state.event._id} />}
              />
              <Route path={`${match.url}/news`}>
                <NewsSectionRoutes eventId={this.state.event._id} event={this.state.event} />
              </Route>
              <Route path={`${match.url}/product`}>
                <ProductSectionRoutes eventId={this.state.event._id} event={this.state.event} />
              </Route>
              <Route path={`${match.url}/faqs`} render={() => <FAQS eventId={this.state.event._id} />} />
              <Route
                path={`${match.url}/ticketsEvent`}
                render={() => <EventsTicket eventId={this.state.event._id} />}
              />
              {/* <Route path={`${match.url}/trivia`} render={()=><Trivia eventId={this.state.event._id}/>}/> */}
              <Route component={NoMatch} />
            </Switch>
          </section>
        </Content>
      </Layout>
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
    render={(props) =>
      event.user_properties && event.user_properties.length > 0 ? (
        <Component {...props} event={event} eventId={eventId} url={url} />
      ) : (
        <Redirect push to={`${url}/main`} />
      )
    }
  />
);

const mapStateToProps = (state) => ({
  loading: state.rols.loading,
  permissions: state.permissions,
  showMenu: state.user.menu,
  error: state.rols.error,
});

export default connect(mapStateToProps)(withContext(withRouter(Event)));
