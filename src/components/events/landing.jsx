//external
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import * as eventActions from '../../redux/event/actions';
import * as stageActions from '../../redux/stage/actions';
import * as notificationsActions from '../../redux/notifications/actions';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import firebase from 'firebase';
import app from 'firebase/app';
import ReactPlayer from 'react-player';
import { Layout, Drawer, Button, Col, Row, Menu, Badge, message, notification } from 'antd';
import {
  MenuOutlined,
  CommentOutlined,
  TeamOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  PieChartOutlined,
  MessageTwoTone,
} from '@ant-design/icons';

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
import SocialZone from '../../components/socialZone/socialZone';
import { firestore } from '../../helpers/firebase';
import { AgendaApi } from '../../helpers/request';

import {
  // BrowserView,
  // MobileView,
  // isBrowser,
  isMobile,
} from 'react-device-detect';
import { cosh } from 'core-js/fn/math';

const { setEventData } = eventActions;
const { gotoActivity, setMainStage } = stageActions;
const { setNotification } = notificationsActions;

const { Content, Sider } = Layout;
Moment.locale('es');
momentLocalizer();

const close = () => {
  console.log('Notification was closed. Either the close button was clicked or duration time elapsed.');
};

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

let notify = false;

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
      visibleChat: false,
      placement: 'left',
      placementBottom: 'bottom',
      headerVisible: 'true',
      namesUser: '',
      data: null,
      user: null,
      loader_page: false,
      show_banner_footer: false,
      event: null,
      requireValidation: false,
      currentSurvey: {},
      //Integración con encuestas
      currentActivity: null,
      meeting_id: null,
      platform: null,
      habilitar_ingreso: null,
      chat: false,
      surveys: false,
      games: false,
      attendees: false,
      tabSelected: -1,
      option: 'N/A',
      totalNewMessages: 0,
      activitiesAgenda: [],
      //fin Integración con encuestas
    };
    this.showLanding = this.showLanding.bind(this);
  }

  openNotificationWithIcon = (type) => {
    notification[type]({
      message: 'holap',
      // description: 'Tienes un nuevo mensaje',
    });
  };

  monitorNewChatMessages = (event, user) => {
    var self = this;
    firestore
      .collection('eventchats/' + event._id + '/userchats/' + user.uid + '/' + 'chats/')
      .onSnapshot(function(querySnapshot) {
        console.log('cargando lista de chats');
        let data;
        let totalNewMessages = 0;
        querySnapshot.forEach((doc) => {
          data = doc.data();
          if (data.newMessages) {
            totalNewMessages += !isNaN(parseInt(data.newMessages.length)) ? parseInt(data.newMessages.length) : 0;
          }
        });
        self.setTotalNewMessages(totalNewMessages);
      });
  };

  setTotalNewMessages = (newMessages) => {
    this.setState({
      totalNewMessages: newMessages || 0,
    });
  };

  updateOption = async (optionselected) => {
    this.setState({
      option: optionselected,
    });
    let currentActivity = { ...this.state.currentActivity, option: optionselected };
    this.setState({
      currentActivity: currentActivity,
    });

    await this.mountSections();
  };

  actualizarCurrentActivity = (activity) => {
    this.setState({
      currentActivity: { ...activity, option: 'N/A' },
    });

    firestore
      .collection('events')
      .doc(activity.event_id)
      .collection('activities')
      .doc(activity._id)
      .onSnapshot((response) => {
        let videoConference = response.data();

        this.setState({
          meeting_id: videoConference.meeting_id ? videoConference.meeting_id : this.props.meetingId,
          platform: videoConference.platform ? videoConference.platform : null,
          habilitar_ingreso: videoConference.habilitar_ingreso
            ? videoConference.habilitar_ingreso
            : 'closed_metting_room',
          chat: videoConference.tabs.chat ? videoConference.tabs.chat : false,
          surveys: videoConference.tabs.surveys ? videoConference.tabs.surveys : false,
          games: videoConference.tabs.games ? videoConference.tabs.games : false,
          attendees: videoConference.tabs.attendees ? videoConference.tabs.attendees : false,
        });
      });
  };

  obtenerNombreActivity(activityID) {
    const act = this.state.activitiesAgenda.filter((ac) => ac._id == activityID);
    console.log('ACTIVIDAD SELECTED');
    return act.length > 0 ? act[0].name : null;
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  toggleCollapsed = async (tab) => {
    this.setState({
      collapsed: !this.state.collapsed,
      tabSelected: tab,
    });
    await this.mountSections();
  };

  toggleCollapsedN = async () => {
    this.setState({
      collapsed: !this.state.collapsed,
      tabSelected: 1,
    });
    await this.mountSections();
  };

  hideHeader = () => {
    this.setState({
      headerVisible: false,
    });
  };

  showDrawerMobile = () => {
    this.setState({
      visibleChat: true,
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
      visibleChat: false,
    });
  };

  onChange = (e) => {
    this.setState({
      placement: e.target.value,
      placementBottom: e.target.value,
    });
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

  mountSections = async () => {
    let eventUser = null;
    let eventUsers = null;

    const id = this.props.match.params.event;

    const user = await getCurrentUser();
    this.setState({ user, currentUser: user });

    /* Trae la información del evento con la instancia pública*/
    const event = await EventsApi.landingEvent(id);

    //definiendo un google tag por evento si viene sino utiliza el por defecto
    let googleanlyticsid = event['googleanlyticsid'];
    if (googleanlyticsid) {
      window.gtag('config', googleanlyticsid);
    }

    const sessions = await Actions.getAll(`api/events/${id}/sessions`);
    this.loadDynamicEventStyles(id);

    if (event && user) {
      eventUser = await EventsApi.getcurrentUserEventUser(event._id);
      eventUsers = []; //await EventsApi.getcurrentUserEventUsers( event._id );
      // this.monitorNewChatMessages(event, user);
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

    // Seteando el estado global con la informacion del evento
    this.props.setEventData(event);

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
    let sections = {
      agenda: (
        <AgendaForm
          event={event}
          eventId={event._id}
          toggleConference={this.toggleConference}
          handleOpenRegisterForm={this.handleOpenRegisterForm}
          handleOpenLogin={this.handleOpenLogin}
          userRegistered={this.state.eventUser}
          currentUser={user}
          activity={this.state.currentActivity}
          userEntered={user}
          activeActivity={this.actualizarCurrentActivity}
          option={this.state.currentActivity ? this.state.currentActivity.option : 'N/A'}
          collapsed={this.state.collapsed}
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
                showSection={this.showSection}
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
  };

  async componentDidMount() {
    await this.mountSections();
    const infoAgenda = await AgendaApi.byEvent(this.state.event._id);

    this.setState({
      activitiesAgenda: infoAgenda.data,
    });

    firestore
      .collection('events')
      .doc(this.state.event._id)
      .collection('activities')
      .onSnapshot((querySnapshot) => {
        let change = querySnapshot.docChanges()[0];
        console.log('CHANGE');
        console.log(change);
        if (
          notify &&
          change.doc.data().habilitar_ingreso == 'open_meeting_room' &&
          this.obtenerNombreActivity(change.doc.id) != null
        ) {
          this.props.setNotification({
            message: this.obtenerNombreActivity(change.doc.id) + ' está en vivo..',
            type: 'warning',
          });
          //console.log('NOTIFICAION OPEN');
        } else if (
          notify &&
          change.doc.data().habilitar_ingreso == 'ended_meeting_room' &&
          this.obtenerNombreActivity(change.doc.id) != null
        ) {
          this.props.setNotification({
            message: this.obtenerNombreActivity(change.doc.id) + ' ha terminado..',
            type: 'warning',
          });
          // console.log('NOTIFICAION ENDED');
        } else if (
          notify &&
          change.doc.data().habilitar_ingreso == 'closed_meeting_room' &&
          this.obtenerNombreActivity(change.doc.id) != null
        ) {
          this.props.setNotification({
            message: this.obtenerNombreActivity(change.doc.id) + ' está por iniciar',
            type: 'warning',
          });
        }
        // console.log('NOTIFICAION CLOSED');

        //this.mountSections();
        notify = true;
      });

    //codigo para mensajes nuevos
    let nombreactivouser = this.state.user.names;
    var self = this;
    firestore
      .collection('eventchats/' + this.state.event._id + '/userchats/' + this.state.user.uid + '/' + 'chats/')
      .onSnapshot(function(querySnapshot) {
        let data;
        let totalNewMessages = 0;
        querySnapshot.forEach((doc) => {
          data = doc.data();
          if (data.newMessages) {
            totalNewMessages += !isNaN(parseInt(data.newMessages.length)) ? parseInt(data.newMessages.length) : 0;
          }
        });

        let change = querySnapshot.docChanges()[0];
        console.log('CHANGE');
        console.log(change.doc.data());
        nombreactivouser !== change.doc.data().remitente &&
          change.doc.data().remitente !== null &&
          totalNewMessages > 0 &&
          notification.open({
            description: `Nuevo mensaje de ${change.doc.data().remitente}`,
            icon: <MessageTwoTone />,
          });
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

  showSection = (section, clean = false) => {
    this.setState({ section, visible: false }, () => this.callbackShowSection(section, clean));
  };

  callbackShowSection = (section, clean) => {
    if (section === 'agenda') {
      !clean && this.props.gotoActivity(null);
      this.props.setMainStage(null);
    }
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

  openMessage = () => {
    const key = `open${Date.now()}`;
    const btn = (
      <Button type='primary' size='small' onClick={() => notification.close(key)}>
        Ir a evento
      </Button>
    );
    notification.open({
      message: 'ACTIVIDADES',
      description: this.props.viewNotification.message,
      btn,
      key,
      onClose: close,
    });
    /*  let key = 'updatable';
    if (this.props.viewNotification.type == 'success') {
      message
        .success({ content: this.props.viewNotification.message, key, duration: 5 })
        .then(() => this.props.setNotification({ message: null, type: null }));
    } else if (this.props.viewNotification.type == 'warning') {
      message
        .warning({ content: this.props.viewNotification.message, key, duration: 5 })
        .then(() => this.props.setNotification({ message: null, type: null }));
    }*/

    // message.success({ content: 'Loaded!', key, duration: 2 });
  };

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
        {this.props.viewNotification.message != null && this.openMessage()}
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
                          width={110}>
                          <div className='items-menu_Landing '>
                            {event.styles && <img src={event.styles.event_image} style={imageCenter} />}
                            <MenuEvent
                              itemsMenu={this.state.event.itemsMenu}
                              user={currentUser}
                              eventId={event._id}
                              showSection={this.showSection}
                              collapsed={this.state.collapsed}
                              styleText={event.styles && event.styles.textMenu ? event.styles.textMenu : '#222222'}
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
                              styleText={event.styles && event.styles.textMenu ? event.styles.textMenu : '#222222'}
                            />
                          </Drawer>

                          {event.styles &&
                          event.styles.show_banner &&
                          (event.styles.show_banner === 'true' || event.styles.show_banner === true) &&
                          this.props.currentActivity === null ? (
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
                              {event.styles &&
                                event.styles.show_banner === undefined &&
                                this.state.headerVisible &&
                                this.props.currentActivity === null && (
                                  <BannerEvent
                                    bgImage={
                                      event.styles && event.styles.banner_image
                                        ? event.styles.banner_image
                                        : event.picture
                                        ? event.picture
                                        : 'https://bulma.io/images/placeholders/1280x960.png'
                                    }
                                    bgImageText={
                                      event.styles && event.styles.event_image ? event.styles.event_image : ''
                                    }
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
                          <div id='visualizar' style={{ margin: '40px 6px', overflow: 'initial', textAlign: 'center' }}>
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
                        {/* aqui esta el boton del chat mobile */}
                        <div className='chat-evius_mobile'>
                          <Button
                            shape='circle'
                            icon={<MessageOutlined />}
                            size='large'
                            onClick={this.showDrawerMobile}
                            style={this.state.visibleChat == true ? { display: 'none' } : {}}></Button>
                        </div>
                        <Drawer
                          height={450}
                          placement={this.state.placementBottom}
                          closable={true}
                          onClose={this.onClose}
                          visible={this.state.visibleChat}
                          maskClosable={true}
                          className='drawerMobile'>
                          <SocialZone
                            tcollapse={this.toggleCollapsed}
                            optionselected={this.updateOption}
                            tab={this.state.tabSelected}
                            event_id={event._id}
                            chat={this.state.chat}
                            attendees={this.state.attendees}
                            survey={this.state.surveys}
                            games={this.state.games}
                          />
                        </Drawer>

                        {/* aqui empieza el chat del evento desktop */}
                        <Sider
                          className='collapse-chatEvent'
                          trigger={null}
                          theme='light'
                          collapsible
                          collapsed={this.state.collapsed}
                          width={400}>
                          <div className='Chat-Event'>
                            {this.state.collapsed ? (
                              <>
                                {/* MENU DERECHO */}

                                <div style={{ marginLeft: '2%', marginBottom: '3%' }}>
                                  <Button type='link' onClick={this.toggleCollapsedN}>
                                    <MenuUnfoldOutlined style={{ fontSize: '24px' }} />
                                  </Button>
                                </div>

                                <Menu theme='light'>
                                  {
                                    /* {this.state.currentActivity && this.state.chat &&*/ <Menu.Item
                                      key='1'
                                      icon={
                                        <>
                                          <Badge count={this.state.totalNewMessages}>
                                            <CommentOutlined style={{ fontSize: '24px' }} />
                                          </Badge>
                                        </>
                                      }
                                      style={{ marginTop: '12px', marginBottom: '22px' }}
                                      onClick={() => this.toggleCollapsed(1)}></Menu.Item>
                                  }
                                  {
                                    /* {this.state.currentActivity && this.state.attendees && */ <Menu.Item
                                      key='2'
                                      icon={<TeamOutlined style={{ fontSize: '24px' }} />}
                                      onClick={() => this.toggleCollapsed(2)}></Menu.Item>
                                  }
                                  {this.props.currentActivity !== null && (
                                    <>
                                      <Menu.Item
                                        key='3'
                                        icon={<PieChartOutlined style={{ fontSize: '24px' }} />}
                                        onClick={() => this.toggleCollapsed(3)}></Menu.Item>
                                      <Menu.Item
                                        key='4'
                                        icon={
                                          <img
                                            src='https://cdn0.iconfinder.com/data/icons/gaming-console/128/2-512.png'
                                            style={{ width: '50px', height: '32px' }}
                                            alt='Games'
                                          />
                                        }
                                        onClick={() => {
                                          this.props.setMainStage('game');
                                          this.toggleCollapsed(4);
                                        }}></Menu.Item>
                                    </>
                                  )}
                                </Menu>
                              </>
                            ) : (
                              <>
                                <Button type='link' onClick={this.toggleCollapsed}>
                                  <MenuUnfoldOutlined style={{ fontSize: '24px' }} />
                                </Button>

                                <SocialZone
                                  tcollapse={this.toggleCollapsed}
                                  optionselected={this.updateOption}
                                  tab={this.state.tabSelected}
                                  event={event}
                                  event_id={event._id}
                                  chat={this.state.chat}
                                  attendees={this.state.attendees}
                                  survey={this.state.surveys}
                                  games={this.state.games}
                                />
                              </>
                            )}
                          </div>
                        </Sider>
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

const mapStateToProps = (state) => ({
  loginInfo: state.user.data,
  eventInfo: state.event.data,
  currentActivity: state.stage.data.currentActivity,
  viewNotification: state.notifications.data,
});

const mapDispatchToProps = {
  setEventData,
  gotoActivity,
  setNotification,
  setMainStage,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Landing));
