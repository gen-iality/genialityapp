import React, { Component } from 'react';
import { Link, Route, Redirect, withRouter, Switch, useRouteMatch } from 'react-router-dom';
import { connect } from 'react-redux';
import * as eventActions from '../../../redux/event/actions';
import * as stageActions from '../../../redux/stage/actions';
import * as notificationsActions from '../../../redux/notifications/actions';
import * as notifyNetworking from '../../../redux/notifyNetworking/actions';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import firebase from 'firebase';
import app from 'firebase/app';
import ReactPlayer from 'react-player';
import { Layout, Drawer, Button, Col, Row, Badge, notification, message } from 'antd';
import * as Cookie from 'js-cookie';
import {
  MenuOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  WifiOutlined,
  PlayCircleOutlined,
  LoadingOutlined,
  DiffOutlined,
  SmileOutlined,
} from '@ant-design/icons';

//custom
import { Actions, EventsApi, TicketsApi, fireStoreApi, Activity } from '../../../helpers/request';
import Loading from '../../loaders/loading';
import { BaseUrl } from '../../../helpers/constants';
import Dialog from '../../modal/twoAction';
import TicketsForm from '../../tickets/formTicket';
import CertificadoLanding from '../../certificados/cerLanding';
import AgendaForm from '../agendaLanding';
import SpeakersForm from '../speakers';
import SurveyForm from '../surveys';
import DocumentsForm from '../../documents/front/documentsLanding';
import AgendaInscriptions from '../agendaInscriptions';
import FaqsForm from '../../faqsLanding';
import NetworkingForm from '../../networking';
import MyAgendaIndepend from '../../networking/myAgendaIndepend';
import MySection from '../newSection/index';
import Companies from '../companies/index';
import WallForm from '../../wall/index';
import ZoomComponent from '../zoomComponent';
import MenuEvent from '../menuEvent';
import BannerEvent from '../bannerEvent';
import VirtualConference from '../virtualConference';
import MapComponent from '../mapComponet';
import EventLanding from '../eventLanding';
import { toast } from 'react-toastify';
import { handleRequestError } from '../../../helpers/utils';
import Robapagina from '../../shared/Animate_Img/index';
import Trophies from '../trophies';
import InformativeSection from '../informativeSections/informativeSection';
import InformativeSection2 from '../informativeSections/informativeSection2';
import UserLogin from '../UserLoginContainer';
import Partners from '../Partners';
import SocialZone from '../../socialZone/socialZone';
import { firestore } from '../../../helpers/firebase';
import { AgendaApi } from '../../../helpers/request';
import * as SurveyActions from '../../../redux/survey/actions';
import { setGeneralTabs, getGeneralTabs } from '../../../redux/tabs/actions';
import { isMobile } from 'react-device-detect';
import { getCurrentEventUser, getUserByEmail } from '../../networking/services';
import AppointmentModal from '../../networking/appointmentModal';
import initUserPresence from '../../../containers/userPresenceInEvent';
import WithEviusContext from '../../../Context/withContext';
import { listenSurveysData, publishedSurveysByActivity, monitorNewChatMessages } from '../../../helpers/helperEvent';
import MenuRigth from './Menus/oldMenuRigth';
import DrawerProfile from './DrawerProfile';
import MenuDevices from './Menus/MenuDevices';
import MenuTablets from './Menus/MenuTablets';

const { setEventData } = eventActions;
const { gotoActivity, setMainStage } = stageActions;
const { setNotification } = notificationsActions;
const { setCurrentSurvey, setSurveyVisible } = SurveyActions;
const { setNotificationN } = notifyNetworking;

const { Content, Sider } = Layout;
Moment.locale('es');
momentLocalizer();

const html = document.querySelector('html');

let notify = false;
let notifySurvey = false;

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
      collapsed: true,
      visible: true,
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
      //Visibilidad drawer perfil
      visiblePerfil: false,
      //usuario seleccionado para obtener su perfil
      userPerfil: null,
      //properties user perfil
      propertiesUserPerfil: null,
      //Integración con encuestas
      currentActivity: null,
      //Variable para cambiar de estado y actualizar chat
      updateChat: {},
      platform: null,
      habilitar_ingreso: null,
      // chat: false,
      // surveys: false,
      // games: false,
      // attendees: false,
      tabSelected: -1,
      option: 'N/A',
      totalNewMessages: 0,
      activitiesAgenda: [],
      publishedSurveys: [],
      eventSurveys: [],
      containNetWorking: false,
      //fin Integración con encuestas
      // notificacionesNetworking
      notifyNetworkingAg: [],
      notifyNetworkingAm: [],
      totalNotficationsN: 0,
      //modal Agenda
      eventUserIdToMakeAppointment: null,
      eventUserToMakeAppointment: null,
      // Tabs generales
      generalTabs: {
        publicChat: true,
        privateChat: true,
        attendees: true,
      },
    };
  }

  //METODO PARA SETEAR NEW MESSAGE
  notNewMessage = () => {
    this.setState({
      totalNewMessages: 0,
    });
  };

  //función que abre el modal para agendar citas
  AgendarCita = (id, targetEventUser) => {
    this.setState({ eventUserIdToMakeAppointment: id, eventUserToMakeAppointment: targetEventUser });
  };

  //Función para actualizar chat desde el drawer del perfil
  UpdateChat = (idCurentUser, currentName, idOtherUser, otherUserName) => {
    this.setState({
      updateChat: { idCurentUser, currentName, idOtherUser, otherUserName },
    });
  };

  //METODO QUE PERMITE  VALIDAR SI UN EVENTO TIENE HABILITADA LA SECTION DE NETWORKING
  containsNetWorking = () => {
    if (this.state.sections != undefined) {
      if (this.props.cEvent.itemsMenu && this.props.cEvent.itemsMenu['networking'] !== undefined) {
        this.setState({ containNetWorking: true });
      } else {
        this.setState({ containNetWorking: false });
      }
    }
  };

  //Enviar invitación de contacto
  async SendFriendship({ eventUserIdReceiver, userName }) {
    let eventUserId = this.props.cUserEvent._id;
    let currentUserName = this.props.cUser.names || this.props.cUser.email;
    let currentUser = Cookie.get('evius_token');

    message.loading('Enviando solicitud');
    if (currentUser) {
      // Se valida si el usuario esta suscrito al evento
      if (eventUserId) {
        // Se usan los EventUserId
        const data = {
          id_user_requested: eventUserId,
          id_user_requesting: eventUserIdReceiver,
          user_name_requested: currentUserName,
          user_name_requesting: userName,
          event_id: this.props.cEvent._id,
          state: 'send',
        };

        // Se ejecuta el servicio del api de evius
        try {
          var respInvitation = await EventsApi.sendInvitation(this.props.cEvent._id, data);
          notification.open({
            message: 'Solicitud enviada',
            description:
              'Le llegará un correo a la persona notificandole la solicitud, quién la aceptara o recharaza. Una vez la haya aceptado te llegará un correo confirmando y podrás regresar a esta misma sección en mis contactos a ver la información completa del nuevo contacto.',
            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
            duration: 30,
          });
          return respInvitation;
        } catch (err) {
          let { data } = err.response;
          message.warning(data.message);
        }
      } else {
        message.warning('No es posible enviar solicitudes. No se encuentra suscrito al evento');
      }
    } else {
      message.warning('Para enviar la solicitud es necesario iniciar sesión');
    }
  }

  listenConfigurationEvent = () => {
    const self = this;
    if (self.props.cEvent && self.props.cEvent._id) {
      firestore
        .collection('events')
        .doc(self.props.cEvent._id)
        .onSnapshot(function(eventSnapshot) {
          if (eventSnapshot.exists) {
            if (eventSnapshot.data().tabs !== undefined) {
              const generalTabs = eventSnapshot.data().tabs;
              self.setState({ generalTabs });
            }
          }
        });
    }
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
        });
      });
  };

  // OBTIENE EL NOMBRE DE LA ACTIVIDAD// SE CAMBIO PARA OBTENER LA ACTIVIDAD Y PODER REDIRIGIR CUANDO LA ACTIVIDAD ESTA EN VIVO(NOTIFICATIONS)
  obtenerNombreActivity(activityID) {
    const act = this.state.activitiesAgenda.filter((ac) => ac._id == activityID);
    return act.length > 0 ? act[0] : null;
  }

  toggleCollapsed = async (tab) => {
    this.setState({
      updateChat: {},
      collapsed: !this.state.collapsed,
      tabSelected: tab,
    });
    await this.mountSections();
  };

  //PETICION PARA TRAER LOS DATOS COMPLETOS DE UN USUARIO ESPECIFICO
  loadDataUser = async (user) => {
    const resp = await getUserByEmail(user, this.props.cEvent._id);
    return resp;
  };

  //OBTENER DATOS DEL USUARIO LOGUEADO
  async obtenerUserPerfil(id) {
    let userp = await getCurrentEventUser(this.props.cEvent._id, id);
    return userp;
  }

  //METODO QUE PERMITE CARGAR LOS DATOS DINAMICOS DEL USUARIO EN LA SECCION DE PERFIL
  collapsePerfil = async (userPerfil) => {
    this.setState({
      visiblePerfil: !this.state.visiblePerfil,
    });
    if (userPerfil != null) {
      var data = await this.loadDataUser(userPerfil);
      this.setState({ userPerfil: { ...data.properties, iduser: userPerfil.iduser || data._id } });
    } else {
      //
    }
  };

  toggleCollapsedN = async () => {
    this.setState({
      updateChat: {},
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

    this.props.setNotification({
      message: null,
      type: null,
    });

    /* Trae la información del evento con la instancia pública*/
    let event = {};

    try {
      event = await EventsApi.landingEvent(this.props.cEvent._id);
    } catch (err) {
      console.error('Landing error:', err);
    }

    //Detenemos el hilo de ejecución si el id no retorna un evento de la base de datos
    if (!Object.keys(event).length) return;

    //definiendo un google tag por evento si viene sino utiliza el por defecto
    let googleanlyticsid = event['googleanlyticsid'];
    if (googleanlyticsid) {
      window.gtag('config', googleanlyticsid);
    }

    const sessions = await Actions.getAll(`api/events/${this.props.cEvent._id}/sessions`);
    this.loadDynamicEventStyles(this.props.cEvent._id);

    if (this.props.cEvent && this.props.cUser) {
      eventUser = await EventsApi.getcurrentUserEventUser(this.props.cEvent._id);
      eventUsers = [];
      this.setState({ totalNewMessages: monitorNewChatMessages(this.props.cEvent, this.props.cUser) });
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
    let namesUser = this.props.cUser ? this.props.cUser.names || this.props.cUser.displayName || 'Anónimo' : 'Anónimo';

    // Seteando el estado global con la informacion del evento
    this.props.setEventData(event);

    this.setState({
      show_banner_footer: event.show_banner_footer ? event.show_banner_footer : false,
      namesUser: namesUser,
      loader_page:
        this.props.cEvent.styles &&
        this.props.cEvent.styles.data_loader_page &&
        this.props.cEvent.styles.loader_page !== 'no'
          ? true
          : false,
    });

    //default section is firstone
    this.setState({ loading: false }, () => {
      this.firebaseUI();
      this.handleScroll();
      this.containsNetWorking();
    });
  };

  componentDidUpdate(prevProps, prevState) {
    //saber si se seteo bien las surveys
    // console.log('surveys didmount', this.state.eventSurveys);
    // console.log('publishedSurveys', this.state.generalTabs);

    if (prevState.generalTabs !== this.state.generalTabs) {
      this.props.setGeneralTabs(this.state.generalTabs);
    }

    if (prevState.event && prevState.event._id !== this.props.cEvent._id) {
      this.setState({ eventSurveys: listenSurveysData(this.props.cEvent._id) });
    }

    if (
      prevState.eventSurveys !== this.state.eventSurveys ||
      prevProps.currentActivity !== this.props.currentActivity
    ) {
      this.setState({
        publishedSurveys: publishedSurveysByActivity(
          this.props.currentActivity,
          this.state.eventSurveys,
          this.props.cUser
        ),
      });
    }

    if (prevState.publishedSurveys !== this.state.publishedSurveys) {
      if (
        this.state.publishedSurveys &&
        this.state.publishedSurveys.length === 1 &&
        (this.state.publishedSurveys[0].isOpened === true || this.state.publishedSurveys[0].isOpened === 'true')
      ) {
        this.props.setCurrentSurvey(this.state.publishedSurveys[0]);
        this.props.setMainStage('surveyDetalle');
      }
    }

    //Por si despublicaron la encuesta actualmente visible
    if (
      prevProps.currentSurvey !== this.props.currentSurvey ||
      prevState.publishedSurveys !== this.state.publishedSurveys
    ) {
      if (this.props.currentSurvey) {
        //si la encuesta que estoy viendo no esta en el listado de publicadas es que ya se despublico y toca quitarla
        let stillActive = this.state.publishedSurveys.filter((survey) => survey._id === this.props.currentSurvey._id);

        if (!(stillActive && stillActive.length)) {
          this.props.setMainStage(null);
          this.props.setCurrentSurvey(null);
        }
      }
    }
  }

  async addNotification(notification) {
    if (notification.emailEmited != null) {
      firestore
        .collection('notificationUser')
        .doc(notification.idReceive)
        .collection('events')
        .doc(this.props.cEvent._id)
        .collection('notifications')
        .doc(notification.idEmited)
        .set({
          emailEmited: notification.emailEmited,
          message: notification.message,
          name: notification.name,
          state: notification.state,
          type: notification.type,
        });
    } else {
      firestore
        .collection('notificationUser')
        .doc(this.props.cUser?._id)
        .collection('events')
        .doc(this.props.cEvent._id)
        .collection('notifications')
        .doc(notification.idEmited)
        .set(
          {
            state: notification.state,
          },
          { merge: true }
        );
    }
  }
  async componentDidMount() {
    //props generales contexto
    console.log('CONTEXTOEVENTO props', this.props);
    if (!this.props.cEvent) return;
    //seteo de las surveys
    this.setState({ eventSurveys: await listenSurveysData(this.props.cEvent._id) });

    //seteo de publishedSurveys
    this.setState({
      publishedSurveys: publishedSurveysByActivity(
        this.props.currentActivity,
        this.state.eventSurveys,
        this.props.cUser
      ),
    });

    await this.mountSections();

    //Registra la presencia cuando se ingresa al landing del evento
    await initUserPresence(this.props.cEvent._id);
    if (this.props.cEvent === null) {
      this.props.history.push('/notfound');
      return;
    }
    const infoAgenda = await AgendaApi.byEvent(this.props.cEvent._id);

    await listenSurveysData(this.props.cEvent._id);

    this.setState({
      activitiesAgenda: infoAgenda.data,
    });

    // Se escucha la configuracion  de los tabs del evento
    this.listenConfigurationEvent();

    if (this.props.cUser && this.props.cUser._id && this.props.cEvent && this.props.cEvent._id) {
      firestore
        .collection('notificationUser')
        .doc(this.props.cUser._id)
        .collection('events')
        .doc(this.props.cEvent._id)
        .collection('notifications')
        .onSnapshot((querySnapshot) => {
          let contNotifications = 0;
          let notAg = [];
          let notAm = [];
          //
          querySnapshot.docs.forEach((doc) => {
            let notification = doc.data();

            if (notification.state === '0') {
              contNotifications++;
            }

            //Notificacion tipo agenda
            if (notification.type == 'agenda' && notification.state === '0') {
              notAg.push(doc.data());
            }
            //Notificacion otra
            if (notification.type == 'amistad' && notification.state === '0') {
              notAm.push(doc.data());
            }
          });
          this.setState({
            notifyNetworkingAg: notAg,
            notifyNetworkingAm: notAm,
            totalNotficationsN: contNotifications,
          });
          this.props.setNotificationN({ total: contNotifications });
          this.mountSections();
        });
    }

    //LISTENER DE ACTIVITIES  STATUS  NOTIFICATIONS POR EVENT
    if (this.props.cEvent && this.props.cEvent._id) {
      firestore
        .collection('events')
        .doc(this.props.cEvent._id)
        .collection('activities')
        .onSnapshot((querySnapshot) => {
          if (querySnapshot.empty) return;
          let change = querySnapshot.docChanges()[0];
          if (
            notify &&
            change.doc.data().habilitar_ingreso == 'open_meeting_room' &&
            this.obtenerNombreActivity(change.doc.id)?.name != null
          ) {
            this.props.setNotification({
              message: this.obtenerNombreActivity(change.doc.id)?.name + ' está en vivo..',
              type: 'open',
              activity: this.obtenerNombreActivity(change.doc.id),
            });
            //
          } else if (
            notify &&
            change.doc.data().habilitar_ingreso == 'ended_meeting_room' &&
            this.obtenerNombreActivity(change.doc.id).name != null
          ) {
            this.props.setNotification({
              message: this.obtenerNombreActivity(change.doc.id).name + ' ha terminado..',
              type: 'ended',
            });
            //
          } else if (
            notify &&
            change.doc.data().habilitar_ingreso == 'closed_meeting_room' &&
            this.obtenerNombreActivity(change.doc.id) &&
            this.obtenerNombreActivity(change.doc.id).name != null
          ) {
            this.props.setNotification({
              message: this.obtenerNombreActivity(change.doc.id).name + ' está por iniciar',
              type: 'close',
            });
          }
          //

          //this.mountSections();
          notify = true;
        });
    }

    //codigo para mensajes nuevos
    let nombreactivouser = this.props.cUser?.names;
    var self = this;
    firestore
      .collection('eventchats/' + this.props.cEvent._id + '/userchats/' + this.props.cUser?.uid + '/' + 'chats/')
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
        if (change) {
          nombreactivouser !== change.doc.data().remitente &&
            change.doc.data().remitente !== null &&
            change.doc.data().remitente !== undefined &&
            totalNewMessages > 0 &&
            self.setTotalNewMessages(totalNewMessages);
        }
      });

    //LISTENER ENCUESTAS POR EVENTO NOTIFICATIONS
    let $query = firestore.collection('surveys');

    //Le agregamos el filtro por evento
    if (this.props.cEvent && this.props.cEvent._id) {
      $query = $query.where('eventId', '==', this.props.cEvent._id);
    }

    $query.onSnapshot((surveySnapShot) => {
      let change = surveySnapShot.docChanges()[0];
      if (!change) return;
      if (
        (change?.doc.data().isPublished == true || change?.doc.data().isPublished == 'true') &&
        (change?.doc.data().isOpened == 'true' || change?.doc.data().isOpened == true) &&
        notifySurvey
      ) {
        this.props.setNotification({
          message: change?.doc.data().name + ' está abierta',
          type: 'survey',
          //survey: change.doc.data(),
          //activity: this.obtenerNombreActivity(change.doc.data().activity_id)
        });
      }

      notifySurvey = true;
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
    //const hash = this.props.location.hash;
    //if (hash) {
    //document.getElementById(hash.substring(1)).scrollIntoView();
    //}
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
    this.props.setNotification({
      message: null,
      type: null,
    });
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
    fireStoreApi
      .createOrUpdate(this.props.cEvent._id, activity_id, this.props.cUserEvent)
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
        this.props.cUserEvent && this.props.cUserEvent.properties && this.props.cUserEvent.properties.names
          ? this.props.cUserEvent.properties.names
          : 'Anónimo';
      let urlMeeting = null;
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
      if (this.props.cUserEvent) {
        TicketsApi.checkInAttendee(this.props.cEvent._id, this.props.cUserEvent._id);
        Activity.checkInAttendeeActivity(this.props.cEvent._id, activity._id, this.props.cUserEvent.account_id);
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
    notification.open({
      description: `${this.props.viewNotification.message}`,
      icon:
        this.props.viewNotification.type == 'open' ? (
          <WifiOutlined />
        ) : this.props.viewNotification.type == 'closed' ? (
          <LoadingOutlined />
        ) : this.props.viewNotification.type == 'ended' ? (
          <PlayCircleOutlined />
        ) : (
          <DiffOutlined />
        ),
      duration: this.props.viewNotification.type == 'open' ? 6 : 3,
      onClick:
        this.props.viewNotification.type == 'open'
          ? () => {
              if (this.props.viewNotification.type == 'open') {
                this.props.gotoActivity(this.props.viewNotification.activity);
                this.props.setNotification({
                  message: null,
                  type: null,
                });
              }

              //this.showSection('adenda', true);
              //alert('CLICK A EN VIVO');
            }
          : this.props.viewNotification.type == 'survey'
          ? () => {
              //
              //this.props.gotoActivity(this.props.viewNotification.activity);
              //this.props.setCurrentSurvey(this.props.viewNotification.survey)
              // alert("CLICK SURVEY")
            }
          : null,
      onClose: () => {
        this.props.setNotification({
          message: null,
          type: null,
        });
      },
    });
  };
  //Cerrar modal agenda
  closeAppointmentModal = () => {
    this.setState({ eventUserIdToMakeAppointment: null, eventUserToMakeAppointment: null });
  };

  zoomExternoHandleOpen = (activity, eventUser) => {
    let name = eventUser && eventUser.properties && eventUser.properties.names ? eventUser.properties.names : 'Anónimo';
    let urlMeeting = null;

    name =
      eventUser && eventUser.properties.casa && eventUser.properties.casa
        ? '(' + eventUser.properties.casa + ')' + name
        : name;

    if (isMobile) {
      urlMeeting = 'zoomus://zoom.us/join?confno=' + activity.meeting_id + '&uname=' + name;
    } else {
      urlMeeting = 'zoommtg://zoom.us/join?confno=' + activity.meeting_id + '&uname=' + name;
    }

    if (activity.zoomPassword) {
      urlMeeting += '&password=' + activity.zoomPassword;
    }
    window.location.href = urlMeeting;

    try {
      if (eventUser) {
        TicketsApi.checkInAttendee(this.props.cEvent._id, eventUser._id);
        //Activity.checkInAttendeeActivity(this.props.cEvent._id, props.currentActivity._id, eventUser.account_id);
      }
    } catch (e) {
      console.error('fallo el checkin:', e);
    }
  };

  render() {
    const { activity, modal, modalTicket, toggleConferenceZoom, meeting_id, loader_page } = this.state;
    const me = true;
    if (me === true) return <h1>evento</h1>;

    return (
      <section className='section landing' style={{ backgroundColor: this.state.color, height: '100%' }}>
        <AppointmentModal
          notificacion={this.addNotification}
          event={this.props.cEvent}
          currentEventUserId={this.props.cUserEvent._id}
          eventUser={this.props.cUserEvent}
          targetEventUserId={this.state.eventUserIdToMakeAppointment}
          targetEventUser={this.state.eventUserToMakeAppointment}
          closeModal={this.closeAppointmentModal}
        />
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
                  userEntered={this.props.cUser}
                  event={this.props.cUserEvent}
                  activity={activity}
                />
              )}

              {toggleConferenceZoom}

              {loader_page ? (
                <Robapagina event={this.props.cEvent} eventId={this.props.cEvent._id} showLanding={this.showLanding} />
              ) : (
                <>
                  <Content>
                    <Layout className='site-layout'>
                      {/*Aqui empieza el menu para dispositivos >  */}
                      <MenuDevices
                        cEvent={this.props.cEvent}
                        cUser={this.props.cUser}
                        collapsed={this.state.collapsed}
                        showSection={this.showSection}
                      />
                      {/*Aqui termina el menu para dispositivos >  */}

                      <Layout className='site-layout'>
                        <Content className='site-layout-background'>
                          <MenuTablets
                            showDrawer={this.showDrawer}
                            cEvent={this.props.cEvent}
                            placement={this.state.placement}
                            onClose={this.onClose}
                            visible={this.state.visible}
                            cUser={this.props.cUser}
                            showSection={this.showSection}
                            totalNotficationsN={this.state.totalNotficationsN}
                          />

                          {/*Aqui empieza el drawer del perfil*/}
                          <DrawerProfile
                            visiblePerfil={this.state.visiblePerfil}
                            collapsePerfil={this.collapsePerfil}
                            SendFriendship={this.SendFriendship}
                            addNotification={this.addNotification}
                            AgendarCita={this.AgendarCita}
                            UpdateChat={this.UpdateChat}
                            propertiesUserPerfil={this.state.propertiesUserPerfil}
                            cUser={this.props.cUser}
                          />

                          <Row justify='center'>
                            <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                              {!(this.state.section && this.state.section === 'agenda') && (
                                <VirtualConference
                                  event={this.props.cEvent}
                                  eventUser={this.props.cUserEvent}
                                  currentUser={this.props.cUser}
                                  usuarioRegistrado={this.props.cUserEvent}
                                  toggleConference={this.toggleConference}
                                  showSection={this.showSection}
                                  zoomExternoHandleOpen={this.zoomExternoHandleOpen}
                                />
                              )}
                              <MapComponent event={this.props.cEvent} />
                            </Col>
                          </Row>
                          <div id='visualizar' style={{ margin: '0px 2px', overflow: 'initial', textAlign: 'center' }}>
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
                          {this.props.cEvent.styles && this.props.cEvent.styles.banner_footer && (
                            <div style={{ textAlign: 'center' }}>
                              <img alt='image-dialog' src={this.props.cEvent.styles.banner_footer} />
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

const mapStateToProps = (state) => ({
  loginInfo: state.user.data,
  eventInfo: state.event.data,
  currentActivity: state.stage.data.currentActivity,
  viewNotification: state.notifications.data,
  hasOpenSurveys: state.survey.data.hasOpenSurveys,
  tabs: state.stage.data.tabs,
  currentSurvey: state.survey.data.currentSurvey,
});

const mapDispatchToProps = {
  setEventData,
  gotoActivity,
  setNotification,
  setMainStage,
  setCurrentSurvey,
  setSurveyVisible,
  setGeneralTabs,
  getGeneralTabs,
  setNotificationN,
};

const LandingWithContext = WithEviusContext(Landing);
export default connect(mapStateToProps, mapDispatchToProps)(LandingWithContext);
