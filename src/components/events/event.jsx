import React, { Component } from 'react';
import { Route, Redirect, Switch, Link } from 'react-router-dom';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import Loading from '../loaders/loading';
import { EventsApi } from '../../helpers/request';
// import { rolPermissions } from '../../helpers/constants';
import ListEventUser from '../event-users';
import LogOut from '../shared/logOut';
import { fetchRol } from '../../redux/rols/actions';
import { fetchPermissions } from '../../redux/permissions/actions';
import connect from 'react-redux/es/connect/connect';
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
import { Layout, Space, Row, Col } from 'antd';
import { AdminUsers } from 'components/AdminUsers/AdminUsers';
import loadable from '@loadable/component';
import NoMatchPage from '../notFoundPage/noMatchPage';
import ValidateAccessRouteCms from '../roles/hooks/validateAccessRouteCms';

const { Sider, Content } = Layout;
//import Styles from '../App/styles';

//Code Splitting
const General = loadable(() => import('./general'));
/* const Badge = loadable(() => import('../badge')); */
const Informativesection = loadable(() => import('../events/informativeSections/adminInformativeSection'));

//invitations
const InvitedUsers = loadable(() => import('../invitations'));

//Messages
const Messages = loadable(() => import('../messages'));

const TicketInfo = loadable(() => import('../tickets'));
const Styles = loadable(() => import('../App/styles'));
const DashboardEvent = loadable(() => import('../dashboard'));
const OrdersEvent = loadable(() => import('../orders'));
const ListCertificados = loadable(() => import('../certificados'));
/* const ReporteCertificados = loadable(() => import('../certificados/reporte_old')); */
/* const ConfigurationApp = loadable(() => import('../App/configuration')); */
const NotificationsApp = loadable(() => import('../pushNotifications/index'));
const Wall = loadable(() => import('../wall/index'));

const FAQS = loadable(() => import('../faqs'));
const EventsTicket = loadable(() => import('../ticketsEvent'));

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
    }

    var encodedUrl = formatupperorlowercase;
    encodedUrl = encodedUrl.split(/\&+/).join('-and-');
    if (this.isUpper(url)) {
      encodedUrl = encodedUrl.split(/[^A-Z0-9]/).join('-');
    } else if (this.isLowerCase(url.toString())) {
      encodedUrl = encodedUrl.split(/[^a-z0-9]/).join('-');
    } else {
      encodedUrl = encodedUrl.split(/-+/).join('-');
    }

    encodedUrl = encodedUrl.replaceAll(' ', '-');
    encodedUrl = encodedUrl.trim('-');
    return encodedUrl;
  }

  render() {
    const { match, permissions, showMenu } = this.props;
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
          <Row gutter={[16, 16]} wrap>
            <Col>
              <a target='_blank' href={`${window.location.origin}/landing/${this.state.event._id}`}>
                <h2 style={{ fontWeight: 'bold' }} className='name-event  button add'>
                  Ir al evento{/* : (version antigua) */}
                </h2>
              </a>
            </Col>
          </Row>
          <section className='section event-wrapper'>
            <Switch>
              <Route
                exact
                path={`${match.url}/`}
                render={() => <Redirect to={`${match.url}${match.url.substr(-1) === '/' ? 'main' : '/main'}`} />}
              />
              {/* <Protected exact path={`${match.url}/`} component={Redirect} componentKey='/' /> */}
              <Protected
                path={`${match.url}/main`}
                component={General}
                eventId={this.state.event._id}
                event={this.state.event}
                updateEvent={this.updateEvent}
                componentKey='main'
              />
              {/* En esta ruta se pueden crear y ver los post de la seccion muro que hay en la landing */}
              <Protected
                path={`${match.url}/wall`}
                component={Wall}
                eventId={this.state.event._id}
                event={this.state.event}
                componentKey='wall'
              />
              <Protected
                path={`${match.url}/datos`}
                component={Datos}
                eventId={this.state.event._id}
                event={this.state.event}
                componentKey='datos'
              />
              <Protected
                path={`${match.url}/agenda`}
                component={AgendaRoutes}
                eventId={this.state.event._id}
                event={this.state.event}
                updateEvent={this.updateEvent}
                componentKey='agenda'
              />
              <Protected
                path={`${match.url}/adminUsers`}
                component={AdminUsers}
                eventId={this.state.event._id}
                event={this.state.event}
                componentKey='adminUsers'
              />
              <Protected
                path={`${match.url}/empresas`}
                component={EmpresasRoutes}
                event={this.state.event}
                componentKey='empresas'
              />
              <Protected
                path={`${match.url}/trivia`}
                component={TriviaRoutes}
                event={this.state.event}
                componentKey='trivia'
              />
              <Protected
                path={`${match.url}/documents`}
                component={DocumentsRoutes}
                event={this.state.event}
                componentKey='documents'
              />
              {/* esta ruta carga en blanco */}
              <Protected
                path={`${match.url}/conference`}
                component={ConferenceRoute}
                event={this.state.event}
                componentKey='conference'
              />
              <Protected
                path={`${match.url}/menuLanding`}
                component={MenuLanding}
                event={this.state.event}
                componentKey='menuLanding'
              />
              <Protected
                path={`${match.url}/reportNetworking`}
                component={ReportNetworking}
                event={this.state.event}
                componentKey='reportNetworking'
              />
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

              {/* <Protected
                path={`${match.url}/badge`}
                component={Badge}
                eventId={this.state.event._id}
                event={this.state.event}
                url={match.url}
              /> */}

              <Protected
                path={`${match.url}/informativesection`}
                component={Informativesection}
                eventId={this.state.event._id}
                event={this.state.event}
                url={match.url}
              />
              {/** AÚN NO TIENEN PERMISOS */}
              <Protected
                path={`${match.url}/invitados`}
                component={InvitedUsers}
                eventId={this.state.event._id}
                event={this.state.event}
                componentKey='invitados'
              />
              <Protected
                path={`${match.url}/messages`}
                component={Messages}
                event={this.state.event}
                componentKey='messages'
              />
              <Protected
                path={`${match.url}/confirmacion-registro`}
                component={ConfirmacionRegistro}
                event={this.state.event}
                componentKey='tconfirmacion-registro'
              />
              <Protected
                path={`${match.url}/tipo-asistentes`}
                component={TipoAsistentes}
                event={this.state.event}
                componentKey='tipo-asistentes'
              />
              <Protected
                path={`${match.url}/ticket`}
                component={TicketInfo}
                event={this.state.event}
                componentKey='ticket'
              />
              <Protected
                path={`${match.url}/dashboard`}
                component={DashboardEvent}
                eventId={this.state.event._id}
                event={this.state.event}
                componentKey='dashboard'
              />
              <Protected
                path={`${match.url}/orders`}
                component={OrdersEvent}
                event={this.state.event}
                componentKey='orders'
              />
              <Protected
                path={`${match.url}/certificados`}
                component={ListCertificados}
                event={this.state.event}
                componentKey='certificados'
              />
              <Protected
                path={`${match.url}/espacios`}
                component={Espacios}
                matchUrl={match.url}
                event={this.state.event}
                componentKey='espacios'
              />
              {/* <Protected
                path={`${match.url}/reporte-certificados`}
                component={ReporteCertificados}
                event={this.state.event}
                componentKey='reporte-certificados'
              /> */}
              <Protected
                path={`${match.url}/speakers`}
                component={Speakers}
                event={this.state.event}
                eventID={this.state.event._id}
                componentKey='speakers'
              />

              <Protected
                path={`${match.url}/styles`}
                component={Styles}
                eventId={this.state.event._id}
                event={this.state.event}
                componentKey='styles'
              />
              {/* Ruta no usada posiblemente es la version 1 de la ruta /menuLanding */}
              {/* <Protected
                path={`${match.url}/configurationApp`}
                component={ConfigurationApp}
                eventId={this.state.event._id}
                event={this.state.event}
                componentKey='configurationApp'
              /> */}
              <Protected
                path={`${match.url}/notificationsApp`}
                component={NotificationsApp}
                event={this.state.event}
                componentKey='notificationsApp'
              />
              <Protected
                path={`${match.url}/news`}
                component={NewsSectionRoutes}
                eventId={this.state.event._id}
                event={this.state.event}
                componentKey='news'
              />
              <Protected
                path={`${match.url}/product`}
                component={ProductSectionRoutes}
                eventId={this.state.event._id}
                event={this.state.event}
                componentKey='product'
              />
              <Protected
                path={`${match.url}/faqs`}
                matchUrl={match.url}
                component={FAQS}
                event={this.state.event}
                componentKey='faqs'
              />
              <Protected
                path={`${match.url}/ticketsEvent`}
                matchUrl={match.url}
                component={EventsTicket}
                event={this.state.event}
                eventId={this.state.event._id}
                componentKey='ticketsEvent'
              />
              {/* Este componente se muestra si una ruta no coincide */}
              <Protected
                path={`${match.url}`}
                component={NoMatchPage}
                event={this.state.event}
                eventId={this.state.event._id}
                componentKey='NoMatch'
              />
            </Switch>
          </section>
        </Content>
      </Layout>
    );
  }
}

const Protected = ({ component: Component, event, eventId, url, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      event?.user_properties && event?.user_properties?.length > 0 ? (
        <ValidateAccessRouteCms>
          <Component key='cms' {...props} {...rest} event={event} eventId={eventId} url={url} />
        </ValidateAccessRouteCms>
      ) : (
        <Redirect push to={`${url}/agenda`} />
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
