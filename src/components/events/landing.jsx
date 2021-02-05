//external
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import firebase from 'firebase';
import app from 'firebase/app';
import ReactPlayer from 'react-player';
import { Layout, Drawer, Button, Col, Row } from 'antd';
import { MenuOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';

//custom
import { Actions, EventsApi, TicketsApi, fireStoreApi, Activity, getCurrentUser } from '../../helpers/request';
import Loading from '../loaders/loading';
import { BaseUrl } from '../../helpers/constants';
import Dialog from '../modal/twoAction';
import TicketsForm from '../tickets/formTicket';
import CertificadoLanding from '../certificados/cerLanding';
import AgendaForm from './agendaLanding';
import SpeakersForm from './speakers';
import SurveyForm from './surveys';
import DocumentsForm from '../documents/front/documentsLanding';
import AgendaInscriptions from './agendaInscriptions';

import FaqsForm from '../faqsLanding';
import NetworkingForm from '../networking';
import MyAgendaIndepend from '../networking/myAgendaIndepend';
import MySection from './newSection/index';
import Companies from './companies/index';
import WallForm from '../wall/index';
import ZoomComponent from './zoomComponent';
import MenuEvent from './menuEvent';
import BannerEvent from './bannerEvent';
import VirtualConference from './virtualConference';
import MapComponent from './mapComponet';
import EventLanding from './eventLanding';
import { toast } from 'react-toastify';
import { handleRequestError } from '../../helpers/utils';
import Robapagina from '../shared/Animate_Img/index';
import Trophies from './trophies';
import InformativeSection from './informativeSections/informativeSection';
import InformativeSection2 from './informativeSections/informativeSection2';
import UserLogin from './UserLoginContainer';
import Partners from './Partners';

import {
  // BrowserView,
  // MobileView,
  // isBrowser,
  isMobile,
} from 'react-device-detect';

const { Content, Sider } = Layout;

Moment.locale('es');
momentLocalizer();

const html = document.querySelector('html');

const drawerButton = {
  height: '46px',
  padding: '7px 10px',
  fontSize: '10px',
};

const imageCenter = {
  maxWidth: '100%',
  minWidth: '66.6667%',
  margin: '0 auto',
  display: 'block',
};

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      modalTicket: false,
      modal: false,
      editorState: '',
      sections: {},
      section: 'evento',
      toggleConferenceZoom: false,
      meeting_id: null,
      color: '',
      collapsed: false,
      visible: false,
      placement: 'left',
      headerVisible: 'true',
      namesUser: '',
      data: null,
      user: null,
      loader_page: false,
      show_banner_footer: false,
      event: null,
      requireValidation: false,
      currentSurvey: {},
    };
    this.showLanding = this.showLanding.bind(this);
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  hideHeader = () => {
    this.setState({
      headerVisible: false,
    });
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
    this.hideHeader();
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onChange = (e) => {
    this.setState({
      placement: e.target.value,
    });
  };

  showEvent = () => {
    this.setState({ section: 'evento' });
  };

  /* Carga  dinamicamente los colores base para el evento */
  async loadDynamicEventStyles(eventId) {
    const eventStyles = await EventsApi.getStyles(eventId);

    var oldStyle = document.getElementById('eviusDynamicStyle');
    if (oldStyle) oldStyle.parentNode.removeChild(oldStyle);

    var head = document.getElementsByTagName('head')[0];
    var styleElement = document.createElement('style');
    styleElement.innerHTML = eventStyles;
    styleElement.type = 'text/css';
    styleElement.id = 'eviusDynamicStyle';
    document.body.appendChild(styleElement);
    head.append(styleElement);
    /* Fin Carga */
  }

  async componentDidMount() {
    let eventUser = null;
    let eventUsers = null;

    const id = this.props.match.params.event;

    const user = await getCurrentUser();
    this.setState({ user, currentUser: user });

    /* Trae la información del evento con la instancia pública*/
    const event = await EventsApi.landingEvent(id);
    const sessions = await Actions.getAll(`api/events/${id}/sessions`);
    this.loadDynamicEventStyles(id);

    if (event && user) {
      eventUser = await EventsApi.getcurrentUserEventUser(event._id);
      eventUsers = []; //await EventsApi.getcurrentUserEventUsers( event._id );
    }

    const dateFrom = event.datetime_from.split(' ');
    const dateTo = event.datetime_to.split(' ');
    event.hour_start = Moment(dateFrom[1], 'HH:mm').toDate();
    event.hour_end = Moment(dateTo[1], 'HH:mm').toDate();
    event.date_start = dateFrom[0];
    event.date_end = dateTo[0];
    event.sessions = sessions;
    event.organizer = event.organizer ? event.organizer : event.author;
    event.event_stages = event.event_stages ? event.event_stages : [];
    let namesUser = user ? user.names || user.displayName || 'Anónimo' : 'Anónimo';

    this.setState({
      event,
      eventUser,
      show_banner_footer: event.show_banner_footer ? event.show_banner_footer : false,
      eventUsers,
      data: user,
      currentUser: user,
      namesUser: namesUser,
      loader_page: event.styles && event.styles.data_loader_page && event.styles.loader_page !== 'no' ? true : false,
    });
    const sections = {
      agenda: (
        <AgendaForm
          event={event}
          eventId={event._id}
          toggleConference={this.toggleConference}
          handleOpenRegisterForm={this.handleOpenRegisterForm}
          handleOpenLogin={this.handleOpenLogin}
          userRegistered={this.state.eventUser}
          currentUser={user}
        />
      ),
      tickets: (
        <>
          <div className='columns is-centered'>
            <TicketsForm
              stages={event.event_stages}
              experience={event.is_experience}
              fees={event.fees}
              tickets={event.tickets}
              eventId={event._id}
              event={this.state.event}
              seatsConfig={event.seats_configuration}
              handleModal={this.handleModal}
              showSection={this.showSection}
            />
          </div>
        </>
      ),
      survey: (
        <SurveyForm
          event={event}
          currentUser={this.state.currentUser}
          mountCurrentSurvey={this.mountCurrentSurvey}
          unMountCurrentSurvey={this.unMountCurrentSurvey}
        />
      ),
      certs: (
        <CertificadoLanding
          event={event}
          tickets={event.tickets}
          currentUser={this.state.currentUser}
          eventUser={this.state.eventUser}
        />
      ),
      speakers: <SpeakersForm eventId={event._id} event={event} />,
      wall: <WallForm event={event} eventId={event._id} currentUser={user} />,
      documents: <DocumentsForm event={event} eventId={event._id} />,
      faqs: <FaqsForm event={event} eventId={event._id} />,
      networking: (
        <NetworkingForm
          event={event}
          eventId={event._id}
          currentUser={this.state.currentUser}
          section={this.state.section}
        />
      ),
      my_section: <MySection event={event} eventId={event._id} />,
      companies: (
        <Companies event={event} eventId={event._id} goBack={this.showEvent} eventUser={this.state.eventUser} />
      ),
      interviews: <MyAgendaIndepend event={event} />,
      trophies: <Trophies event={event} />,
      my_sesions: (
        <AgendaInscriptions
          event={event}
          eventId={event._id}
          toggleConference={this.toggleConference}
          userId={this.state.user ? this.state.user._id : null}
        />
      ),
      informativeSection: <InformativeSection event={event} />,
      informativeSection1: <InformativeSection2 event={event} />,
      login: <UserLogin eventId={event._id} />,
      partners: <Partners eventId={event._id} />,
      evento: (
        <>
          <Row justify='center'>
            <Col sm={24} md={16} lg={18} xl={18}>
              <VirtualConference
                event={event}
                currentUser={this.state.currentUser}
                usuarioRegistrado={this.state.eventUser}
                toggleConference={this.toggleConference}
              />
              <MapComponent event={event} />
            </Col>
          </Row>
          <Row justify='center'>
            <Col sm={24} md={16} lg={18} xl={18}>
              {this.state.event && this.state.event._id !== '5f0b95ca34c8116f9b21ebd6' && (
                <EventLanding
                  event={event}
                  currentUser={this.state.currentUser}
                  usuarioRegistrado={this.state.eventUser}
                  toggleConference={this.toggleConference}
                  showSection={this.showSection}
                />
              )}
              {this.state.event && this.state.event._id === '5f0b95ca34c8116f9b21ebd6' && (
                <>
                  <ReactPlayer
                    width={'100%'}
                    style={{
                      display: 'block',
                      margin: '0 auto',
                    }}
                    url={event.video}
                    //url="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/eviuswebassets%2FLa%20asamblea%20de%20copropietarios_%20una%20pesadilla%20para%20muchos.mp4?alt=media&token=b622ad2a-2d7d-4816-a53a-7f743d6ebb5f"
                    controls
                  />
                  <div className='the-lobby-video-column'>
                    <div className='the-lobby-video'>
                      <div className='the-lobby-video-wrap-holder'>
                        <div className='the-lobby-video-holder'>
                          <img src='/lobby/TIRA_PANTALLA.png' alt='' />
                        </div>
                        <div className='the-lobby-video-holder'>
                          <img src='/lobby/TIRA_PANTALLA.png' alt='' />
                        </div>
                      </div>
                      <div className='the-lobby-video-wrap'>
                        <div className='the-lobby-video-container'>
                          <ReactPlayer
                            url={
                              'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/WhatsApp%20Video%202020-07-26%20at%2018.57.30.mp4?alt=media&token=d304d8b9-530d-4972-9a00-373bd19b0158'
                            }
                            //url="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/eviuswebassets%2FLa%20asamblea%20de%20copropietarios_%20una%20pesadilla%20para%20muchos.mp4?alt=media&token=b622ad2a-2d7d-4816-a53a-7f743d6ebb5f"
                            controls
                          />
                        </div>
                      </div>
                    </div>
                    {
                      // Todo: Poner link a listado de empresas
                    }
                    {/*
              <Button onClick={this.showSection('companies')} className="the-lobby-exhibitors-btn">
              <img src="/lobby/BOTON_STANDS.png" alt=""/>
              </Button>
            */}
                  </div>
                </>
              )}
            </Col>
          </Row>
        </>
      ),
    };
    //default section is firstone
    this.setState({ loading: false, sections }, () => {
      this.firebaseUI();
      this.handleScroll();
    });
  }

  firebaseUI = () => {
    //FIREBSAE UI
    const firebaseui = global.firebaseui;
    let ui = firebaseui.auth.AuthUI.getInstance();
    if (!ui) {
      ui = new firebaseui.auth.AuthUI(firebase.auth());
    }
    const uiConfig = {
      //POPUP Facebook/Google
      signInFlow: 'popup',
      //The list of providers enabled for signing
      signInOptions: [app.auth.EmailAuthProvider.PROVIDER_ID],
      //Allow redirect
      callbacks: {
        signInSuccessWithAuthResult: (authResult) => {
          const user = authResult.user;
          this.closeLogin(user);
          return false;
        },
      },
      //Disabled accountchooser
      credentialHelper: 'none',
      // Terms of service url.
      tosUrl: `${BaseUrl}/terms`,
      // Privacy policy url.
      privacyPolicyUrl: `${BaseUrl}/privacy`,
    };
    ui.start('#firebaseui-auth-container', uiConfig);
  };

  openLogin = () => {
    html.classList.add('is-clipped');
    this.setState({ modal: true, modalTicket: false });
  };

  closeLogin = (user) => {
    html.classList.remove('is-clipped');
    this.setState({ modal: false });
    if (user) {
      const { event, stage, ticket } = this.state;
      localStorage.setItem('stage', stage);
      localStorage.setItem('ticket', ticket);
      window.location.replace(
        `https://api.evius.co/api/users/loginorcreatefromtoken?evius_token=${user.ra}&refresh_token=${user.refreshToken}&destination=${BaseUrl}/landing/${event._id}`
      );
    }
  };

  handleScroll = () => {
    const hash = this.props.location.hash;
    if (hash) {
      document.getElementById(hash.substring(1)).scrollIntoView();
    }
  };

  handleModal = () => {
    html.classList.add('is-clipped');
    this.setState({ modal: false, modalTicket: true });
  };

  closeModal = () => {
    html.classList.remove('is-clipped');
    this.setState({ modal: false, modalTicket: false });
  };

  showSection = (section) => {
    this.setState({ section });
    this.setState({ visible: false });
  };

  addUser = (activity) => {
    let activity_id = activity._id;
    let eventUser = this.state.eventUser;
    let event_id = this.state.event._id;

    fireStoreApi
      .createOrUpdate(event_id, activity_id, eventUser)
      .then(() => {
        toast.success('Asistente agregado a actividad');
        this.setState({ qrData: {} });
      })
      .catch((error) => {
        console.error('Error updating document: ', error);
        toast.error(handleRequestError(error));
      });
  };

  toggleConference = async (state, meeting_id, activity) => {
    if (meeting_id != undefined) {
      this.setState({ meeting_id });
    }

    //Se usa para pasarle al componente de ZOOM la actividad actual que a su vez se la pasa a las SURVEYs
    if (activity !== undefined) {
      this.setState({ activity });
    }

    if (activity && activity.platform && activity.platform == 'zoomExterno') {
      //Este link activa a zoom externo para  hacer la conferencia fuera de EVIUS
      let name =
        this.state.eventUser && this.state.eventUser.properties && this.state.eventUser.properties.names
          ? this.state.eventUser.properties.names
          : 'Anónimo';
      let urlMeeting = null;
      //let urlMeeting = 'zoommtg://zoom.us/join?confno=' + meeting_id + '&uname=' + name;
      //let urlMeeting = 'https://zoom.us/j/' + meeting_id + '&uname=' + name;
      if (isMobile) {
        urlMeeting = 'zoomus://zoom.us/join?confno=' + meeting_id + '&uname=' + name;
      } else {
        urlMeeting = 'zoommtg://zoom.us/join?confno=' + meeting_id + '&uname=' + name;
      }

      if (activity.zoomPassword) {
        urlMeeting += '&password=' + activity.zoomPassword;
      }
      window.location.href = urlMeeting;
    } else {
      //Esta instrucción activa la conferencia interna en EVIUS
      this.setState({ toggleConferenceZoom: state });
    }

    try {
      if (this.state.eventUser) {
        TicketsApi.checkInAttendee(this.state.event._id, this.state.eventUser._id);
        Activity.checkInAttendeeActivity(this.state.event._id, activity._id, this.state.eventUser.account_id);
      }
    } catch (e) {
      //alert( "fallo el checkin" )
    }
  };

  showLanding() {
    this.setState({ loader_page: false });
  }

  // Start methods for modal private activities

  handleOpenRegisterForm = () => {
    this.setState({ section: 'tickets' });
  };

  handleOpenLogin = () => {
    this.setState({ section: 'login' });
  };

  mountCurrentSurvey = (survey) => {
    this.setState({ currentSurvey: survey });
  };
  unMountCurrentSurvey = () => {
    this.setState({ currentSurvey: null });
  };

  // End methods for modal private activities

  render() {
    const {
      event,
      activity,
      modal,
      modalTicket,
      toggleConferenceZoom,
      meeting_id,
      currentUser,
      loader_page,
    } = this.state;

    return (
      <section className='section landing' style={{ backgroundColor: this.state.color, height: '100%' }}>
        {this.state.showConfirm && (
          <div className='notification is-success'>
            <button
              className='delete'
              onClick={() => {
                this.setState({ showConfirm: false });
              }}
            />
            Tu asistencia ha sido confirmada
          </div>
        )}
        {this.state.loading ? (
          <Loading />
        ) : (
          <React.Fragment>
            <div className='hero-head'>
              {/* Condicion para mostrar el componente de zoom */}
              {toggleConferenceZoom && (
                <ZoomComponent
                  toggleConference={this.toggleConference}
                  meetingId={meeting_id}
                  userEntered={currentUser}
                  event={event}
                  activity={activity}
                />
              )}

              {/* ESTO ES UNA PRUEBA PARA LA ENCUESTA EN VIVO */}

              {/* <SurveyNotification /> */}
              {loader_page ? (
                <Robapagina event={event} eventId={event._id} showLanding={this.showLanding} />
              ) : (
                <>
                  {/* {event.styles &&
                  event.styles.show_banner &&
                  (event.styles.show_banner === 'true' || event.styles.show_banner === true) ? (
                    <BannerEvent
                      bgImage={
                        event.styles && event.styles.banner_image
                          ? event.styles.banner_image
                          : event.picture
                          ? event.picture
                          : 'https://bulma.io/images/placeholders/1280x960.png'
                      }
                      mobileBanner={event.styles && event.styles.mobile_banner && event.styles.mobile_banner}
                      bgImageText={event.styles && event.styles.event_image ? event.styles.event_image : ''}
                      title={event.name}
                      eventId={event._id}
                      styles={event.styles}
                      organizado={
                        <Link to={`/page/${event.organizer_id}?type=${event.organizer_type}`}>
                          {event.organizer.name ? event.organizer.name : event.organizer.email}
                        </Link>
                      }
                      place={
                        <span>
                          {event.venue} {event.location.FormattedAddress}
                        </span>
                      }
                      dateStart={event.date_start}
                      dateEnd={event.date_end}
                      dates={event.dates}
                      type_event={event.type_event}
                    />
                  ) : (
                    <div>
                      {event.styles && event.styles.show_banner === undefined && this.state.headerVisible && (
                        <BannerEvent
                          bgImage={
                            event.styles && event.styles.banner_image
                              ? event.styles.banner_image
                              : event.picture
                              ? event.picture
                              : 'https://bulma.io/images/placeholders/1280x960.png'
                          }
                          bgImageText={event.styles && event.styles.event_image ? event.styles.event_image : ''}
                          title={event.name}
                          organizado={
                            <Link to={`/page/${event.organizer_id}?type=${event.organizer_type}`}>
                              {event.organizer.name ? event.organizer.name : event.organizer.email}
                            </Link>
                          }
                          place={
                            <span>
                              {event.venue} {event.location.FormattedAddress}
                            </span>
                          }
                          dateStart={event.date_start}
                          dateEnd={event.date_end}
                          dates={event.dates}
                          type_event={event.type_event}
                        />
                      )}
                    </div>
                  )} */}
                  <Content>
                    <Layout className='site-layout'>
                      {/*Aqui empieza el menu para dispositivos >  */}
                      <div className='hiddenMenu_Landing'>
                        <Sider
                          className='containerMenu_Landing'
                          style={{
                            backgroundColor:
                              event.styles && event.styles.toolbarDefaultBg ? event.styles.toolbarDefaultBg : 'white',
                          }}
                          trigger={null}
                          collapsible
                          collapsed={this.state.collapsed}
                          width={110}>
                          <div className='items-menu_Landing '>
                            {event.styles && <img src={event.styles.event_image} style={imageCenter} />}
                            <MenuEvent
                              itemsMenu={this.state.event.itemsMenu}
                              user={currentUser}
                              eventId={event._id}
                              showSection={this.showSection}
                              collapsed={this.state.collapsed}
                            />
                          </div>
                        </Sider>
                      </div>
                      {/*Aqui termina el menu para dispositivos >  */}

                      <Layout className='site-layout'>
                        <Content className='site-layout-background'>
                          {/* Boton que abre el menu para dispositivos > tablet  */}
                          <div className='hiddenMenu_Landing'>
                            {/* <Button onClick={this.toggle}>
                              {React.createElement(this.state.collapsed ? RightOutlined : LeftOutlined, {
                                className: 'trigger',
                                onClick: this.toggle,
                              })}
                            </Button> */}
                          </div>

                          {/*Aqui empieza el menu para dispositivos < tablet*/}

                          <div className='hiddenMenuMobile_Landing'>
                            <Button block style={drawerButton} onClick={this.showDrawer}>
                              <MenuOutlined style={{ fontSize: '15px' }} />
                              <div>Menu</div>
                            </Button>
                          </div>

                          <Drawer
                            title={event.name}
                            placement={this.state.placement}
                            closable={true}
                            onClose={this.onClose}
                            visible={this.state.visible}
                            maskClosable={true}
                            bodyStyle={{
                              padding: '0px',
                              backgroundColor:
                                event.styles && event.styles.toolbarDefaultBg ? event.styles.toolbarDefaultBg : 'white',
                            }}>
                            {event.styles && <img src={event.styles.event_image} style={imageCenter} />}
                            <MenuEvent
                              eventId={event._id}
                              user={currentUser}
                              itemsMenu={this.state.event.itemsMenu}
                              showSection={this.showSection}
                              collapsed={this.state.collapsed}
                            />
                          </Drawer>

                          {event.styles &&
                          event.styles.show_banner &&
                          (event.styles.show_banner === 'true' || event.styles.show_banner === true) ? (
                            <BannerEvent
                              bgImage={
                                event.styles && event.styles.banner_image
                                  ? event.styles.banner_image
                                  : event.picture
                                  ? event.picture
                                  : 'https://bulma.io/images/placeholders/1280x960.png'
                              }
                              mobileBanner={event.styles && event.styles.mobile_banner && event.styles.mobile_banner}
                              bgImageText={event.styles && event.styles.event_image ? event.styles.event_image : ''}
                              title={event.name}
                              eventId={event._id}
                              styles={event.styles}
                              organizado={
                                <Link to={`/page/${event.organizer_id}?type=${event.organizer_type}`}>
                                  {event.organizer.name ? event.organizer.name : event.organizer.email}
                                </Link>
                              }
                              place={
                                <span>
                                  {event.venue} {event.location.FormattedAddress}
                                </span>
                              }
                              dateStart={event.date_start}
                              dateEnd={event.date_end}
                              dates={event.dates}
                              type_event={event.type_event}
                            />
                          ) : (
                            <div>
                              {event.styles && event.styles.show_banner === undefined && this.state.headerVisible && (
                                <BannerEvent
                                  bgImage={
                                    event.styles && event.styles.banner_image
                                      ? event.styles.banner_image
                                      : event.picture
                                      ? event.picture
                                      : 'https://bulma.io/images/placeholders/1280x960.png'
                                  }
                                  bgImageText={event.styles && event.styles.event_image ? event.styles.event_image : ''}
                                  title={event.name}
                                  organizado={
                                    <Link to={`/page/${event.organizer_id}?type=${event.organizer_type}`}>
                                      {event.organizer.name ? event.organizer.name : event.organizer.email}
                                    </Link>
                                  }
                                  place={
                                    <span>
                                      {event.venue} {event.location.FormattedAddress}
                                    </span>
                                  }
                                  dateStart={event.date_start}
                                  dateEnd={event.date_end}
                                  dates={event.dates}
                                  type_event={event.type_event}
                                />
                              )}
                            </div>
                          )}
                          <div style={{ margin: '40px 6px', overflow: 'initial', textAlign: 'center' }}>
                            {this.state.sections[this.state.section]}
                          </div>
                          <div className={`modal ${modal ? 'is-active' : ''}`}>
                            <div className='modal-background'></div>
                            <div className='modal-content'>
                              <div id='firebaseui-auth-container' />
                            </div>
                            <button
                              className='modal-close is-large'
                              aria-label='close'
                              onClick={() => {
                                this.closeLogin();
                              }}
                            />
                          </div>
                          <Dialog
                            modal={modalTicket}
                            title={'Atención!!'}
                            content={
                              <p className='has-text-weight-bold'>
                                Para seleccionar tiquetes debes iniciar sesión o registrarse !!
                              </p>
                            }
                            first={{
                              title: 'Iniciar Sesión o Registrarse',
                              class: 'is-info',
                              action: this.openLogin,
                            }}
                            second={{ title: 'Cancelar', class: '', action: this.closeModal }}
                          />
                          {event.styles && event.styles.banner_footer && (
                            <div style={{ textAlign: 'center' }}>
                              <img alt='image-dialog' src={event.styles.banner_footer} />
                            </div>
                          )}
                        </Content>
                      </Layout>
                    </Layout>
                  </Content>
                </>
              )}
            </div>
          </React.Fragment>
        )}
      </section>
    );
  }
}

export default withRouter(Landing);
