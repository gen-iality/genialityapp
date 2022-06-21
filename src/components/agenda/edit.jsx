import { Component, Fragment } from 'react';
import { Redirect, withRouter, Link } from 'react-router-dom';
import Moment from 'moment';
import EviusReactQuill from '../shared/eviusReactQuill';
import Select from 'react-select';
import Creatable from 'react-select';
import Loading from '../profile/loading';
import {
  Tabs,
  Row,
  Col,
  Checkbox,
  Space,
  Typography,
  Button,
  Form,
  Input,
  Switch,
  Empty,
  Card,
  Image,
  Modal,
  TimePicker,
} from 'antd';
import RoomManager from './roomManager';
import SurveyManager from './surveyManager';
import { DeleteOutlined, ExclamationCircleOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import Header from '../../antdComponents/Header';
import BackTop from '../../antdComponents/BackTop';
import RoomController from '../agenda/roomManager/controller';
import { RouterPrompt } from '../../antdComponents/RoutePrompt';
// En revision vista previa
//import ZoomComponent from '../events/zoomComponent';

import {
  AgendaApi,
  CategoriesAgendaApi,
  RolAttApi,
  SpacesApi,
  SpeakersApi,
  DocumentsApi,
  eventTicketsApi,
  // getCurrentUser,
} from '../../helpers/request';
import { fieldsSelect, handleRequestError, handleSelect, sweetAlert, uploadImage } from '../../helpers/utils';
import { Select as SelectAntd } from 'antd';
import 'react-tabs/style/react-tabs.css';
import { firestore, fireRealtime } from '../../helpers/firebase';
import SurveyExternal from './surveyExternal';
import Service from './roomManager/service';
import AgendaContext from '../../context/AgendaContext';
import { DispatchMessageService } from '../../context/MessageService';
import TipeOfActivity from './typeActivity';
import SmartTipeOfActivity from './typeActivity/SmartTipeOfActivity';
import { deleteLiveStream, deleteAllVideos } from '@/adaptors/gcoreStreamingApi';
import ImageUploaderDragAndDrop from '../imageUploaderDragAndDrop/imageUploaderDragAndDrop';

const { TabPane } = Tabs;
const { confirm } = Modal;
const { Text } = Typography;

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const { Option } = SelectAntd;

const formatLessonType = (typeString) => {
  let typeName = 'genérico';
  switch (typeString) {
    case 'cargarvideo':
      typeName = 'Vídeo cargado';
      break;
    case 'meeting':
      typeName = 'Reunión';
      break;
    case 'url':
      typeName = 'Vídeo desde URL';
      break;
    case 'vimeo':
      typeName = 'Transmisión de Vimeo';
      break;
    case 'youTube':
      typeName = 'Transmisión de YouTube';
      break;
    case 'RTMP':
      typeName = 'Transmisión de RTMP';
      break;
    case 'eviusMeet':
      typeName = 'Transmisión de GEN Connect';
      break;
    case 'eviusStreaming':
      typeName = 'GEN.iality Streaming'
      break;
    default:
      typeName = typeString;
  }
  return typeName;
}

class AgendaEdit extends Component {
  constructor(props) {
    super(props);
    const rightNow = new Date();
    const beforeNow = new Date();
    beforeNow.setMinutes(beforeNow.getMinutes() + 10);
    this.state = {
      loading: true,
      // Estado para la redireccion de navegacion interna al eliminar lección o volver al listado de lecciones.
      redirect: false,
      isLoading: { categories: true },
      name: '',
      subtitle: '',
      bigmaker_meeting_id: null,
      has_date: '',
      description: '<p><br></p>',
      registration_message: '',
      date: Moment(new Date()).format('YYYY-MM-DD'),
      hour_start: Moment(rightNow, 'HH:mm:ss'),
      hour_end: Moment(beforeNow, 'HH:mm:ss'),
      key: new Date(),
      image: '',
      locale: 'en',
      capacity: 0,
      type_id: '',
      space_id: '',
      access_restriction_type: 'OPEN',
      selectedCategories: [],
      selectedHosts: [],
      selectedType: null,
      selectedRol: [],
      days: [],
      spaces: [],
      categories: [],
      start_url: null,
      join_url: null,
      meeting_id: '',
      documents: [],
      roles: [],
      hosts: [],
      selected_document: [],
      nameDocuments: [],
      tickets: [],
      selectedTicket: [],
      vimeo_id: '',
      isExternal: false,
      service: new Service(firestore),
      externalSurveyID: '',
      length: '',
      latitude: '',
      isPhysical: false,
      transmition: null,
      //Estado para detectar cambios en la fecha/hora de la lección sin guardar
      pendingChangesSave: false,

      // Fechas de la lección con formato para la creacion de sala en zoom
      date_start_zoom: null,
      date_end_zoom: null,

      //Estado para determinar si una lección requiere registro para ser accedida
      requires_registration: false,
      isPublished: this.context?.isPublished,
      avalibleGames: [],
      roomStatus: null,
      /* platform,
      meeting_id, */
      chat: false,
      surveys: false,
      games: false,
      attendees: false,
      host_id: null,
      host_name: null,
      habilitar_ingreso: '',
      isEditingAgenda: false,
      idNewlyCreatedActivity: null,
      activityEdit: false,
      reloadActivity: false,
      initialActivityStates: null,
      showPendingChangesModal: false,
      creatingBeforeNamed: false,
      typeString: null,
      activity_id: this.props.location?.state?.edit,
      showFormPopup: false,
    };
    this.name = React.createRef();
    this.selectTickets = this.selectTickets.bind(this);
  }
  static contextType = AgendaContext;

  // VALIDAR SI TIENE ENCUESTAS EXTERNAS
  validateRoom = async () => {
    const { service } = this.state;
    const activity_id = this.context.activityEdit;
    const hasVideoconference = await service.validateHasVideoconference(this.props.event._id, activity_id);
    if (hasVideoconference) {
      const configuration = await service.getConfiguration(this.props.event._id, activity_id);
      // console.log('GET CONFIGURATION===>', configuration);
      // console.log('2. activityEdit==>', activity_id);
      this.setState({
        isExternal: configuration.platform && configuration.platform === 'zoomExterno' ? true : false,
        externalSurveyID: configuration.meeting_id ? configuration.meeting_id : null,
        isPublished: typeof configuration.isPublished !== 'undefined' ? configuration.isPublished : true,
        platform: configuration.platform ? configuration.platform : null,
        meeting_id: configuration.meeting_id ? configuration.meeting_id : null,
        roomStatus: configuration.roomStatus || null,
        transmition: configuration.transmition || null,
        avalibleGames: configuration.avalibleGames || [],
        chat: configuration.tabs && configuration.tabs.chat ? configuration.tabs.chat : false,
        surveys: configuration.tabs && configuration.tabs.surveys ? configuration.tabs.surveys : false,
        games: configuration.tabs && configuration.tabs.games ? configuration.tabs.games : false,
        attendees: configuration.tabs && configuration.tabs.attendees ? configuration.tabs.attendees : false,
        host_id: typeof configuration.host_id !== 'undefined' ? configuration.host_id : null,
        host_name: typeof configuration.host_name !== 'undefined' ? configuration.host_name : null,
        habilitar_ingreso: configuration.habilitar_ingreso ? configuration.habilitar_ingreso : '',
      });
    }
  };

  toggleConference = (isVisible) => {
    this.setState({ conferenceVisible: isVisible });
  };

  async updateTypeFromSituation (activity_id) {
    const agenda = await AgendaApi.getOne(activity_id, this.props.event._id);
    if (agenda?.type) {
      this.setState({
        typeString: formatLessonType(agenda.type.name),
      })
    }
  }

  async componentWillReceiveProps (nextProps, nextStates) {
    // let agenda;
    if (nextStates.activity_id && nextStates.activity_id !== this.state.activity_id) {
      // agenda = await AgendaApi.getOne(nextStates.activity_id, this.props.event._id);
      await this.updateTypeFromSituation(nextStates.activity_id)
    } else if (this.props.location.state.edit) {
      // agenda = await AgendaApi.getOne(this.props.location.state.edit, this.props.event._id);
      await this.updateTypeFromSituation(this.props.location.state.edit)
    }
    // if (agenda?.type) {
    //   this.setState({
    //     typeString: formatLessonType(agenda.type.name),
    //   })
    // }
  }

  async componentDidMount() {
    const {
      event,
      location: { state },
    } = this.props;
    let days = [];
    const ticketEvent = [];
    let vimeo_id = '';
    try {
      const tickets = await eventTicketsApi.getAll(event?._id);
      for (let i = 0; tickets.length > i; i++) {
        ticketEvent.push({
          item: tickets[i],
          label: tickets[i].title,
          value: tickets[i]._id,
        });
      }

      vimeo_id = event.vimeo_id ? event.vimeo_id : '';
      this.setState({
        tickets: ticketEvent,
        /* platform: event.event_platform, */
        vimeo_id: vimeo_id,
      });

      //Si existe dates, itera sobre el array de fechas especificas, dandole el formato especifico
      if (event.dates && event.dates.length > 0) {
        let date = event.dates;
        Date.parse(date);

        for (var i = 0; i < date.length; i++) {
          let formatDate = Moment(date[i], ['YYYY-MM-DD']).format('YYYY-MM-DD');
          /* if (Date.parse(formatDate) >= Date.parse(Moment(new Date()).format('YYYY-MM-DD'))) {
            days.push({ value: formatDate, label: formatDate });
          } */
          days.push({ value: formatDate, label: formatDate });
        }
        this.setState({ days: days });
        //Si no, recibe la fecha inicio y la fecha fin y le da el formato especifico a mostrar
      } else {
        const init = Moment(event.date_start);
        const end = Moment(event.date_end);
        const diff = end.diff(init, 'days');
        //Se hace un for para sacar los días desde el inicio hasta el fin, inclusivos
        for (let i = 0; i < diff + 1; i++) {
          let formatDate = Moment(init)
            .add(i, 'd')
            .format('YYYY-MM-DD');
          /* if (Date.parse(formatDate) >= Date.parse(Moment(new Date()).format('YYYY-MM-DD'))) {
            days.push({ value: formatDate, label: formatDate });
          } */
          days.push({ value: formatDate, label: formatDate });
        }
        this.setState({ days: days });
      }
    } catch (e) {
      console.error(e);
    }

    let documents = await DocumentsApi.byEvent(event._id);

    let nameDocuments = [];
    for (let i = 0; i < documents.length; i += 1) {
      nameDocuments.push({
        ...documents[i],
        value: documents[i]._id,
        label: documents[i].title,
      });
    }
    this.setState({ nameDocuments });

    let spaces = await SpacesApi.byEvent(this.props.event._id);
    let hosts = await SpeakersApi.byEvent(this.props.event._id);

    let roles = await RolAttApi.byEvent(this.props.event._id);
    let categories = await CategoriesAgendaApi.byEvent(this.props.event._id);

    //La información se neceista de tipo [{label,value}] para los select
    spaces = handleSelect(spaces);
    hosts = handleSelect(hosts);
    roles = handleSelect(roles);
    categories = handleSelect(categories);

    if (state?.edit) {
      this.setState({
        isEditingAgenda: true,
      });
      this.context.setActivityEdit(state?.edit);
      const info = await AgendaApi.getOne(state.edit, event._id);
      this.setState({
        selected_document: info.selected_document,
        start_url: info.start_url,
        join_url: info.join_url,
        platform: info.platform /*  || event.event_platform */,
        info: info,
        space_id: info.space_id || '',
        name_host: info.name_host,
        date_start_zoom: info.date_start_zoom,
        date_end_zoom: info.date_end_zoom,
        requires_registration: info.requires_registration || false,
      });

      Object.keys(this.state).map((key) => (info[key] ? this.setState({ [key]: info[key] }) : ''));
      /* console.log(
        Object.keys(this.state).map((key) => info[key]),
        'ObjectKey'
      ); */
      const { date, hour_start, hour_end } = handleDate(info);

      // let currentUser = await getCurrentUser();
      this.setState({
        activity_id: state.edit,
        date,
        hour_start,
        hour_end,
        selectedHosts: fieldsSelect(info.host_ids, hosts),
        selectedTickets: info.selectedTicket ? info.selectedTicket : [],
        selectedRol: fieldsSelect(info.access_restriction_rol_ids, roles),
        selectedCategories: fieldsSelect(info.activity_categories_ids, categories),
        // currentUser: currentUser,
      });
    } else {
      this.setState({ days });
      //SE SETEA EN EL CONTEXTO LA LECCIÓN PARA QUE NO QUEDE CON UN ID ANTERIOR
      //this.context.setActivityEdit(null);
    }

    const isLoading = { categories: false };
    this.setState({
      days,
      spaces,
      hosts,
      categories,
      roles,
      loading: false,
      isLoading,
    });

    this.name?.current?.focus();
    this.validateRoom();
  }

  async componentDidUpdate(prevProps) {
    /** a copy of the initial states is captured to be able to validate after any change */

    if (!this.state.initialActivityStates && this.state.name !== '') {
      const {
        name,
        hour_start,
        hour_end,
        date,
        space_id,
        selectedCategories,
        description,
        image,
        // isPublished,
        length,
        latitude,
        selectedHosts,
        isPhysical,
      } = this.state;

      const initialHour = typeof hour_start === 'string' ? hour_start : Moment(hour_start).format('HH:mm');
      const finalHour = typeof hour_end === 'string' ? hour_end : Moment(hour_end).format('HH:mm');

      const initialActivityStates = {
        name,
        hour_start: initialHour,
        hour_end: finalHour,
        date,
        space_id,
        selectedCategories,
        description,
        image,
        isPublished: this.context?.isPublished,
        length,
        latitude,
        selectedHosts,
        isPhysical,
      };

      if (hour_start === '' && hour_end === '') return;

      this.setState({
        initialActivityStates,
      });
    }

    const {
      event,
      location: { state },
    } = this.props;

    /** Se renderiza de nuevo el componente para mostrar los tabs Transmision, Juegos, Encuestas y Documentos */
    const idNewlyCreatedActivity = this.state.idNewlyCreatedActivity;
    const reloadActivity = this.state.reloadActivity;
    // console.log('state', this.props.location.state)

    if (reloadActivity) {
      this.setState({
        reloadActivity: false,
      });
      let spaces = await SpacesApi.byEvent(this.props.event._id);
      let hosts = await SpeakersApi.byEvent(this.props.event._id);

      let roles = await RolAttApi.byEvent(this.props.event._id);
      let categories = await CategoriesAgendaApi.byEvent(this.props.event._id);

      //La información se neceista de tipo [{label,value}] para los select
      spaces = handleSelect(spaces);
      hosts = handleSelect(hosts);
      roles = handleSelect(roles);
      categories = handleSelect(categories);

      this.context.setActivityEdit(idNewlyCreatedActivity);
      const info = await AgendaApi.getOne(idNewlyCreatedActivity, event._id);

      this.setState({
        selected_document: info.selected_document,
        start_url: info.start_url,
        join_url: info.join_url,
        platform: info.platform /*  || event.event_platform */,
        info: info,
        space_id: info.space_id || '',
        name_host: info.name_host,
        date_start_zoom: info.date_start_zoom,
        date_end_zoom: info.date_end_zoom,
        requires_registration: info.requires_registration || false,
      });

      Object.keys(this.state).map((key) => (info[key] ? this.setState({ [key]: info[key] }) : ''));
      /* console.log(
          Object.keys(this.state).map((key) => info[key]),
          'ObjectKey'
        ); */
      const { date, hour_start, hour_end } = handleDate(info);

      // let currentUser = await getCurrentUser();
      this.setState({
        activity_id: idNewlyCreatedActivity,
        date,
        hour_start,
        hour_end,
        selectedHosts: fieldsSelect(info.host_ids, hosts),
        selectedTickets: info.selectedTicket ? info.selectedTicket : [],
        selectedRol: fieldsSelect(info.access_restriction_rol_ids, roles),
        selectedCategories: fieldsSelect(info.activity_categories_ids, categories),
        // currentUser: currentUser,
        isEditingAgenda: true,
      });
    }
  }

  /** we validate if the passed parameter is an object */
  isObject = (object) => {
    return object != null && typeof object === 'object';
  };

  /** we validate if the keys of the objects are the same as well as their internal data*/
  deepStateEqualityValidation = (object1, object2) => {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      const val1 = object1[key];
      const val2 = object2[key];
      const areObjects = this.isObject(val1) && this.isObject(val2);
      if ((areObjects && !this.deepStateEqualityValidation(val1, val2)) || (!areObjects && val1 !== val2)) {
        return false;
      }
    }
    return true;
  };

  /** we validate if any parameter in the data of the activity changed */
  valideChangesInActivityData = () => {
    let initialActivityStates = this.state.initialActivityStates;
    if (!initialActivityStates) return;
    const {
      name,
      hour_start,
      hour_end,
      date,
      space_id,
      selectedCategories,
      description,
      image,
      // isPublished,
      length,
      latitude,
      selectedHosts,
      isPhysical,
    } = this.state;

    const initialHour = Moment(hour_start).format('HH:mm');
    const finalHour = Moment(hour_end).format('HH:mm');

    let actualActivityStates = {
      name,
      hour_start: initialHour,
      hour_end: finalHour,
      date,
      space_id,
      selectedCategories,
      description,
      image,
      isPublished: this.context?.isPublished,
      length,
      latitude,
      selectedHosts,
      isPhysical,
    };

    let equalityValidation = this.deepStateEqualityValidation(initialActivityStates, actualActivityStates);

    if (equalityValidation) {
      this.setState({
        showPendingChangesModal: false,
      });
    } else {
      this.setState({
        showPendingChangesModal: true,
      });
    }
  };

  handlePhysical = () => {
    let isPhysical = this.state.isPhysical;
    this.setState({ isPhysical: !isPhysical }, async () => this.valideChangesInActivityData());
  };

  //FN general para cambio en input
  handleChange = async (value, name) => {
    if (!name) {
      name = value.target.name;
      value = value.target.value;
    }
    if (name === 'requires_registration') {
      value = value.target.checked;
    } else if (name === 'isPublished') {
      this.context.setIsPublished(value);
      this.setState({ isPublished: value }, async () => await this.saveConfig());
    } else {
      this.setState({ [name]: value }, async () => this.valideChangesInActivityData());
    }
  };

  //FN para cambio en campo de fecha
  handleChangeDate = (value, name) => {
    this.setState({ [name]: value, pendingChangesSave: true }, async () => this.valideChangesInActivityData());
  };
  //Cada select tiene su propia función para evitar errores y asegurar la información correcta

  selectCategory = (selectedCategories) => {
    this.setState({ selectedCategories }, async () => this.valideChangesInActivityData());
  };
  selectHost = (selectedHosts) => {
    this.setState({ selectedHosts }, async () => this.valideChangesInActivityData());
  };
  selectRol = (selectedRol) => {
    this.setState({ selectedRol }, async () => this.valideChangesInActivityData());
  };

  selectDocuments = (selected_document) => {
    this.setState({ selected_document }, async () => this.valideChangesInActivityData());
  };
  //FN para los select que permiten crear opción
  handleCreate = async (value, name) => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras guarda la información...',
      action: 'show',
    });
    try {
      this.setState({ isLoading: { ...this.isLoading, [name]: true } }, async () => this.valideChangesInActivityData());
      //Se revisa a que ruta apuntar
      const item =
        name === 'categories' &&
        (await CategoriesAgendaApi.create(this.props.event._id, {
          name: value,
        }));
      const newOption = { label: value, value: item._id, item };
      this.setState(
        (prevState) => (
          {
            isLoading: { ...prevState.isLoading, [name]: false },
            [name]: [...prevState[name], newOption],
          },
          async () => this.valideChangesInActivityData()
        ),
        () => {
          this.setState(
            (state) => (
              {
                selectedCategories: [...state.selectedCategories, newOption],
              },
              async () => this.valideChangesInActivityData()
            )
          );
        }
      );
      DispatchMessageService({
        key: 'loading',
        action: 'destroy',
      });
      DispatchMessageService({
        type: 'success',
        msj: 'Información guardada correctamente!',
        action: 'show',
      });
    } catch (e) {
      this.setState(
        (prevState) => (
          {
            isLoading: { ...prevState.isLoading, [name]: false },
          },
          async () => this.valideChangesInActivityData()
        )
      );
      DispatchMessageService({
        key: 'loading',
        action: 'destroy',
      });
      DispatchMessageService({
        type: 'error',
        msj: handleRequestError(e).message,
        action: 'show',
      });
    }
  };
  //FN manejo de imagen input, la carga al sistema y la guarda en base64
  changeImg = async (files) => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras carga la imagen...',
      action: 'show',
    });
    this.setState({
      image: files,
    });
    // try {
    //   const file = files[0];
    //   if (file) {
    //     const image = await uploadImage(file);
    //     this.setState({ image }, async () => this.valideChangesInActivityData());
    //   } else {
    //     this.setState(
    //       {
    //         errImg: 'Only images files allowed. Please try again :)',
    //       },
    //       async () => this.valideChangesInActivityData()
    //     );
    //   }
    //   DispatchMessageService({
    //     key: 'loading',
    //     action: 'destroy',
    //   });
    //   DispatchMessageService({
    //     type: 'success',
    //     msj: 'Imagen cargada correctamente!',
    //     action: 'show',
    //   });
    // } catch (e) {
    //   DispatchMessageService({
    //     key: 'loading',
    //     action: 'destroy',
    //   });
    //   DispatchMessageService({
    //     type: 'error',
    //     msj: handleRequestError(e).message,
    //     action: 'show',
    //   });
    // }
  };

  //FN para el editor enriquecido
  chgTxt = (content) => this.setState({ description: content }, async () => this.valideChangesInActivityData());

  //Envío de información
  submit = async (changePathWithoutSaving) => {
    // if (this.state.typeString) {
    //   this.setState({reloadActivity: true, creatingBeforeNamed: false,})
    //   return;
    // }
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras se guarda la información...',
      action: 'show',
    });
    const validation = this.validForm();

    if (validation) {
      try {
        const info = this.buildInfo();

        const {
          event,
          location: { state },
        } = this.props;
        const { selected_document } = this.state;
        this.setState({ isLoading: true });
        let agenda;
        let result;
        if (state.edit || this.state.activityEdit) {
          const data = {
            activity_id: state.edit || this.state.idNewlyCreatedActivity,
          };
          let edit = state.edit || this.state.idNewlyCreatedActivity;
          result = await AgendaApi.editOne(info, edit, event._id);

          //Se actualizan los estados date_start_zoom y date_end_zoom para que componente de administracion actualice el valor pasado por props
          this.setState({
            date_start_zoom: result.date_start_zoom,
            date_end_zoom: result.date_end_zoom,
          });

          for (let i = 0; i < selected_document?.length; i++) {
            await DocumentsApi.editOne(data, selected_document[i], event._id);
          }
        } else {
          agenda = await AgendaApi.create(event._id, info);

          // Al crear una lección de la agenda se inicializa el id de la lección y las fechas de inicio y finalizacion como requisito del componente de administrador de salas
          this.setState({
            activity_id: agenda._id,
            date_start_zoom: agenda.date_start_zoom,
            date_end_zoom: agenda.date_end_zoom,
          });
        }
        if (changePathWithoutSaving)
          this.setState({
            showPendingChangesModal: false,
          });

        //Se cambia el estado a pendingChangesSave encargado de detectar cambios pendientes en la fecha/hora sin guardar
        this.setState({ pendingChangesSave: false });

        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });

        if (agenda?._id) {
          /** Si es un curso recien creado se envia a la misma ruta con el estado edit el cual tiene el id de la lección para poder editar */
          this.context.setActivityEdit(agenda._id);
          this.setState({
            idNewlyCreatedActivity: agenda._id,
            activityEdit: true,
            reloadActivity: true,
            creatingBeforeNamed: true,
            isPublished: false,
          });
          this.saveConfig();
        } else {
          if (changePathWithoutSaving) this.props.history.push(`/eventadmin/${event._id}/agenda`);
        }
        DispatchMessageService({
          type: 'success',
          msj: 'Información guardada correctamente!',
          action: 'show',
        });
      } catch (e) {
        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });
        DispatchMessageService({
          type: 'error',
          msj: handleRequestError(e).message,
          action: 'show',
        });
      }
    }
  };

  //FN para construir la información a enviar al api
  buildInfo = () => {
    const {
      name,
      subtitle,
      bigmaker_meeting_id,
      has_date,
      hour_start,
      hour_end,
      date,
      space_id,
      capacity,
      access_restriction_type,
      selectedCategories,
      selectedHosts,
      selectedRol,
      description,
      registration_message,
      selected_document,
      image,
      meeting_id,
      selectedTicket,
      vimeo_id,
      platform,
      start_url,
      join_url,
      name_host,
      key,
      requires_registration,
      isPublished,
      length,
      latitude,
    } = this.state;

    //const registration_message_storage = window.sessionStorage.getItem('registration_message');
    //const description_storage = window.sessionStorage.getItem('description');
    /* console.log(date, '========================== date'); */
    const datetime_start = date + ' ' + Moment(hour_start).format('HH:mm');
    const datetime_end = date + ' ' + Moment(hour_end).format('HH:mm');

    const activity_categories_ids =
      selectedCategories !== undefined && selectedCategories !== null
        ? selectedCategories[0] === undefined
          ? []
          : selectedCategories.map(({ value }) => value)
        : [];

    const access_restriction_rol_ids = access_restriction_type !== 'OPEN' ? selectedRol.map(({ value }) => value) : [];
    const host_ids = selectedHosts >= 0 ? [] : selectedHosts?.filter((host) => host != null).map(({ value }) => value);
    return {
      name,
      subtitle,
      bigmaker_meeting_id,
      datetime_start,
      datetime_end,
      space_id,
      image,
      description,
      registration_message,
      capacity: parseInt(capacity, 10),
      activity_categories_ids,
      access_restriction_type,
      access_restriction_rol_ids,
      has_date,
      timeConference: '',
      selected_document,
      meeting_id: meeting_id,
      vimeo_id: vimeo_id,
      selectedTicket,
      platform,
      start_url,
      join_url,
      name_host,
      key,
      requires_registration,
      isPublished,
      host_ids,
      length,
      latitude,
    };
  };

  //FN para eliminar la lección
  remove = async () => {
    let self = this;
    const { service } = this.state;
    const { removeAllRequest } = this.context;
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras borra la información...',
      action: 'show',
    });
    if (self.state.activity_id) {
      confirm({
        title: `¿Está seguro de eliminar la información?`,
        icon: <ExclamationCircleOutlined />,
        content: 'Una vez eliminado, no lo podrá recuperar',
        okText: 'Borrar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk() {
          const onHandlerRemove = async () => {
            try {
              const refActivity = `request/${self.props.event._id}/activities/${self.state.activity_id}`;
              const configuration = await service.getConfiguration(self.props.event._id, self.state.activity_id);
              if (configuration && configuration.typeActivity === 'eviusMeet') {
                await deleteAllVideos(self.state.name, configuration.meeting_id),
                  await deleteLiveStream(configuration.meeting_id);
              }
              await fireRealtime.ref(refActivity).remove();
              await service.deleteActivity(self.props.event._id, self.state.activity_id);
              await AgendaApi.deleteOne(self.state.activity_id, self.props.event._id);
              DispatchMessageService({
                key: 'loading',
                action: 'destroy',
              });
              DispatchMessageService({
                type: 'success',
                msj: 'Se eliminó la información correctamente!',
                action: 'show',
              });
              self.setState({ redirect: true });
              self.props.history.push(`${self.props.matchUrl}`);
            } catch (e) {
              DispatchMessageService({
                key: 'loading',
                action: 'destroy',
              });
              DispatchMessageService({
                type: 'error',
                msj: handleRequestError(e).message,
                action: 'show',
              });
            }
          };
          onHandlerRemove();
        },
      });
    }
  };

  //Validación de campos

  validForm = () => {
    let title = [];
    if (this.state.name.length <= 0) title.push('El nombre es requerido');

    if (this.state.date === '' || this.state.date === 'Invalid date') title.push('Seleccione el día');

    if (this.state.hour_start === '' || this.state.hour_start === 'Invalid date')
      title.push('Seleccione una hora de inicio valida');

    if (this.state.hour_end === '' || this.state.hour_end === 'Invalid date')
      title.push('Seleccione una hora de finalización valida');

    /* if (this.state.hour_start > this.state.hour_end)
      title.push('La hora de inicio no puede ser mayor a la hora fin');
  
    if ((this.state.hour_start < new Date()) && (this.state.date <= Moment(new Date()).format('YYYY-MM-DD')))
      title.push('La hora no puede ser menor a la hora actual');
       */
    if (title.length > 0) {
      //   sweetAlert.twoButton(title, "warning", false, "OK", () => { });
      title.map((item) => {
        DispatchMessageService({
          type: 'warning',
          msj: item,
          action: 'show',
        });
      });
    } else return true;
  };

  //FN para ir a una ruta específica (ruedas en los select)
  goSection = (path, state) => {
    this.props.history.push(path, state);
  };

  //FN agrega todos los roles
  addRoles = () => {
    if (this.state.roles.length !== this.state.selectedRol)
      this.setState((prevState) => ({ selectedRol: prevState.roles }));
  };

  goBack = () => this.setState({ redirect: true });

  selectTickets(tickets) {
    this.setState({ selectedTicket: tickets }, async () => this.valideChangesInActivityData());
  }

  handleChangeReactQuill = (e, label) => {
    if (label === 'description') {
      this.setState({ description: e }, async () => this.valideChangesInActivityData());
    } else if (label === 'registration_message') {
      this.setState({ registration_message: e }, async () => this.valideChangesInActivityData());
    }
  };

  handleVideoConference = () => {
    //Verificar si existe el campo si no se crea
  };

  prepareData = () => {
    const {
      roomStatus,
      platform,
      meeting_id,
      chat,
      surveys,
      games,
      attendees,
      host_id,
      host_name,
      avalibleGames,
      transmition,
      isPublished,
      typeActivity,
    } = this.context;

    const roomInfo = {
      platform,
      meeting_id,
      isPublished: isPublished ? isPublished : false,
      host_id,
      host_name,
      avalibleGames,
      habilitar_ingreso: roomStatus,
      transmition: transmition || null,
      typeActivity,
    };
    const tabs = { chat, surveys, games, attendees };
    return { roomInfo, tabs };
  };

  // Método para guarda la información de la configuración
  saveConfig = async () => {
    const { roomInfo, tabs } = this.prepareData();
    const { service } = this.state;
    const activity_id = this.context.activityEdit || this.state.idNewlyCreatedActivity;
    try {
      const result = await service.createOrUpdateActivity(this.props.event._id, activity_id, roomInfo, tabs);
      if (result) {
        DispatchMessageService({
          type: 'success',
          msj: result.message,
          action: 'show',
        });
      }
      return result;
    } catch (err) {
      DispatchMessageService({
        type: 'error',
        msj: 'Error en la configuración!',
        action: 'show',
      });
    }
  };

  handleGamesSelected = async (status, itemId, listOfGames) => {
    if (status === 'newOrUpdate') {
      this.setState({ avalibleGames: listOfGames }, async () => await this.saveConfig());
    } else {
      const newData = [];
      listOfGames.forEach((items) => {
        if (items.id === itemId) {
          newData.push({ ...items, showGame: status });
        } else {
          newData.push({ ...items });
        }
      });
      this.context.setAvailableGames(newData);
      this.setState({ avalibleGames: newData }, async () => await this.saveConfig());
    }
  };

  // Encargado de gestionar los tabs de la video conferencia
  handleTabsController = (e, tab) => {
    const valueTab = e;
    const { chat, surveys, games, attendees } = this.context;
    const tabs = { chat, surveys, games, attendees };

    //
    // return true;

    if (tab === 'chat') {
      tabs.chat = valueTab;
      this.context.setChat(valueTab);
      this.setState({ chat: valueTab }, async () => await this.saveConfig());
    } else if (tab === 'surveys') {
      tabs.surveys = valueTab;
      this.context.setSurveys(valueTab);
      this.setState({ surveys: valueTab }, async () => await this.saveConfig());
    } else if (tab === 'games') {
      tabs.games = valueTab;
      this.context.setGames(valueTab);
      this.setState({ games: valueTab }, async () => await this.saveConfig());
    } else if (tab === 'attendees') {
      tabs.attendees = valueTab;
      this.context.setAttendees(valueTab);
      this.setState({ attendees: valueTab }, async () => await this.saveConfig());
    }
  };

  handleRoomState = (e) => {
    this.setState({ roomStatus: e }, async () => await this.saveConfig());
  };

  async componentWillUnmount() {
    this.context.setActivityEdit(null);
  }

  startOrEndHourWithAdditionalMinutes = (minutes, isStart) => {
    const fecha = new Date();
    fecha.setMinutes(fecha.getMinutes() + minutes);

    if (isStart) {
      this.setState({ hour_start: Moment(fecha, 'HH:mm:ss') });
    } else {
      this.setState({ hour_end: Moment(fecha, 'HH:mm:ss') });
    }

    return Moment(fecha, 'HH:mm:ss');
  };

  render() {
    const {
      name,
      nameDocuments,
      selected_document,
      date,
      hour_start,
      hour_end,
      image,
      space_id,
      selectedHosts,
      selectedCategories,
      //meeting_id,
      hosts,
      spaces,
      categories,
      isLoading,
      date_start_zoom,
      date_end_zoom,
      length,
      isPublished,
      latitude,
      loading,
      isEditingAgenda,
      showPendingChangesModal,
    } = this.state;

    const { matchUrl } = this.props;
    if (!this.props.location.state || this.state.redirect) return <Redirect to={matchUrl} />;
    return (
      <>
        <Form onFinish={() => this.submit(true)} {...formLayout}>
          <RouterPrompt
            when={showPendingChangesModal}
            title='Tienes cambios sin guardar.'
            description='¿Qué deseas hacer?'
            okText='No guardar'
            okSaveText='Guardar'
            cancelText='Cancelar'
            onOK={() => true}
            onOKSave={this.submit}
            onCancel={() => false}
            save
          />

          <Header
            title={this.state.name ? `Lección - ${this.state.name}` : 'Lección'}
            back
            customBack={this.props.matchUrl}
            save
            form
            remove={this.remove}
            saveName={this.props.location.state.edit || this.state.activityEdit ? '' : 'Crear'}
            saveNameIcon
            edit={this.props.location.state.edit || this.state.activityEdit}
            extra={
              isEditingAgenda && (
                <Form.Item label={'Publicar'} labelCol={{ span: 14 }}>
                  <Switch
                    checkedChildren='Sí'
                    unCheckedChildren='No'
                    name={'isPublished'}
                    checked={this.context?.isPublished}
                    onChange={(e) => this.handleChange(e, 'isPublished')}
                  />
                </Form.Item>
              )
            }
          />
          {loading ? (
            <Loading />
          ) : (
            <Tabs activeKey={this.state.tabs} onChange={(key) => this.setState({ tabs: key })}>
              <TabPane tab='Agenda' key='1'>
                <Row justify='center' wrap gutter={12}>
                  <Button
                    onClick={() => {
                      this.setState({showFormPopup: !this.state.showFormPopup})
                    }}
                  >
                    Seleccionar tipo: {this.state.showFormPopup ? 'on':'off'}
                  </Button>
                  <Col span={20}>
                    <SmartTipeOfActivity
                      eventId={this.props.event._id}
                      activityId={this.state.activity_id}
                      activityName={this.state.name}
                      hasActivityName={this.state.creatingBeforeNamed}
                      onSetType={(typeString) => {
                        // Rewrite the type
                        this.setState({
                          // reloadActivity: true,
                          // creatingBeforeNamed: false,
                          // tabs: '2',
                          typeString: formatLessonType(typeString),
                        });
                        console.log('listoooooooooooooooooooo');
                      }}
                      showForm={this.state.showFormPopup}
                    />
                  </Col>
                </Row>
                <Row justify='center' wrap gutter={12}>
                  <Col span={20}>
                    <Text strong>Tipo de contenido</Text>: {(this.state.typeString ? formatLessonType(this.state.typeString) : null) || 'indefinido'}
                  </Col>
                </Row>
                <Row justify='center' wrap gutter={12}>
                  <Col span={20}>
                    <Form.Item
                      label={
                        <label style={{ marginTop: '2%' }}>
                          Nombre <label style={{ color: 'red' }}>*</label>
                        </label>
                      }
                      rules={[
                        {
                          required: true,
                          message: 'Nombre de la lección requerida',
                        },
                      ]}>
                      <Input
                        ref={this.name}
                        disabled={this.state.creatingBeforeNamed}
                        autoFocus
                        type='text'
                        name={'name'}
                        value={name}
                        onChange={(e) => this.handleChange(e)}
                        placeholder={'Nombre de la lección'}
                      />
                    </Form.Item>
                    {isEditingAgenda && <Form.Item
                      label={
                        <label style={{ marginTop: '2%' }}>
                          Día <label style={{ color: 'red' }}>*</label>
                        </label>
                      }
                      rules={[{ required: true, message: 'La fecha es requerida' }]}>
                      <SelectAntd
                        name='date'
                        options={this.state.days}
                        defaultValue={date}
                        value={date}
                        onChange={(value) => this.handleChangeDate(value, 'date')}
                      />
                    </Form.Item>}
                    {isEditingAgenda && <Row wrap justify='center' gutter={[8, 8]}>
                      <Col span={12}>
                        <Form.Item
                          style={{ width: '100%' }}
                          label={
                            <label style={{ marginTop: '2%' }}>
                              Hora inicio <label style={{ color: 'red' }}>*</label>
                            </label>
                          }
                          rules={[
                            {
                              required: true,
                              message: 'La hora de inicio es requerida',
                            },
                          ]}>
                          {/* <DateTimePicker
                            value={hour_start}
                            dropUp
                            step={15}
                            date={false}
                            onChange={(value) =>
                              this.handleChangeDate(value, 'hour_start')
                            }
                          /> */}
                          <TimePicker
                            style={{ width: '100%' }}
                            allowClear={false}
                            value={
                              hour_start !== '' ? Moment(hour_start) : this.startOrEndHourWithAdditionalMinutes(1, true)
                            }
                            use12Hours
                            format='h:mm a'
                            onChange={(value) => this.handleChangeDate(value, 'hour_start')}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          style={{ width: '100%' }}
                          label={
                            <label style={{ marginTop: '2%' }}>
                              Hora fin <label style={{ color: 'red' }}>*</label>
                            </label>
                          }
                          rules={[
                            {
                              required: true,
                              message: 'La hora final es requerida',
                            },
                          ]}>
                          {/* <DateTimePicker
                            value={hour_end}
                            dropUp
                            step={15}
                            date={false}
                            onChange={(value) =>
                              this.handleChangeDate(value, 'hour_end')
                            }
                          /> */}
                          <TimePicker
                            style={{ width: '100%' }}
                            allowClear={false}
                            value={
                              hour_end !== '' ? Moment(hour_end) : this.startOrEndHourWithAdditionalMinutes(5, false)
                            }
                            use12Hours
                            format='h:mm a'
                            onChange={(value) => this.handleChangeDate(value, 'hour_end')}
                          />
                        </Form.Item>
                      </Col>
                    </Row>}
                    {isEditingAgenda && <Form.Item label={'Conferencista'}>
                      <Row wrap gutter={[8, 8]}>
                        <Col span={23}>
                          <Select
                            id={'hosts'}
                            isClearable
                            isMulti
                            styles={creatableStyles}
                            onChange={this.selectHost}
                            options={hosts}
                            value={selectedHosts}
                          />
                        </Col>
                        <Col span={1}>
                          <Button
                            onClick={() => this.goSection(matchUrl.replace('agenda', 'speakers'), { child: true })}
                            icon={<SettingOutlined />}
                          />
                        </Col>
                      </Row>
                    </Form.Item>}
                    {isEditingAgenda && <Form.Item label={'Espacio'}>
                      <Row wrap gutter={[8, 8]}>
                        <Col span={23}>
                          <SelectAntd
                            name={'space_id'}
                            value={space_id}
                            onChange={(e) => this.handleChange(e, 'space_id')}>
                            <Option value={''}>Seleccione un lugar/salón ...</Option>
                            {spaces.map((space) => (
                              <Option key={space.value} value={space.value}>
                                {space.label}
                              </Option>
                            ))}
                          </SelectAntd>
                        </Col>
                        <Col span={1}>
                          <Link to={matchUrl.replace('agenda', 'espacios')}>
                            <Button icon={<SettingOutlined />} />
                          </Link>
                        </Col>
                      </Row>
                    </Form.Item>}
                    {isEditingAgenda && <Form.Item label={'Categorías'}>
                      <Row wrap gutter={[8, 8]}>
                        <Col span={23}>
                          <Creatable
                            isClearable
                            styles={catStyles}
                            onChange={this.selectCategory}
                            onCreateOption={(value) => this.handleCreate(value, 'categories')}
                            isDisabled={isLoading.categories}
                            isLoading={isLoading.categories}
                            isMulti
                            options={categories}
                            placeholder={'Sin categoría....'}
                            value={selectedCategories}
                          />
                        </Col>
                        <Col span={1}>
                          <Button onClick={() => this.goSection(`${matchUrl}/categorias`)} icon={<SettingOutlined />} />
                        </Col>
                      </Row>
                    </Form.Item>}
                    {isEditingAgenda && <Form.Item label={'¿Tiene espacio físico?'}>
                      <Switch
                        checked={this.state.isPhysical}
                        checkedChildren='Si'
                        unCheckedChildren='No'
                        onChange={this.handlePhysical}
                      />
                    </Form.Item>}
                    {this.state.isPhysical && isEditingAgenda && (
                      <>
                        <Form.Item label={'Longitud'}>
                          <Input
                            ref={this.longitud}
                            autoFocus
                            type='number'
                            name={'length'}
                            value={length}
                            onChange={(e) => this.handleChange(e)}
                            placeholder={'Ej. 4.677027'}
                          />
                        </Form.Item>
                        <Form.Item label={'Latitud'}>
                          <Input
                            ref={this.latitud}
                            autoFocus
                            type='number'
                            name={'latitude'}
                            value={latitude}
                            onChange={(e) => this.handleChange(e)}
                            placeholder={'Ej. -74.094086'}
                          />
                        </Form.Item>
                      </>
                    )}
                    {/* <Form.Item label={'Documentos'}>
                      <Select
                        id={'nameDocuments'}
                        isClearable
                        isMulti
                        styles={creatableStyles}
                        onChange={this.selectDocuments}
                        options={nameDocuments}
                        value={selected_document}
                      />
                    </Form.Item>
                    <Form.Item label={'Link del vídeo'}>
                      <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                      <Text type='secondary'>Este video solo se vera cuando la transmisión no está en vivo.</Text>
                      <Input name='video' type='text' value={video} onChange={this.handleChange} />
                    </Form.Item> */}
                    {isEditingAgenda && <Form.Item label={'Descripción'}>
                      <Space>
                        <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                        <Text type='secondary'>
                          Esta información no es visible en la Agenda/Lección en versión Mobile.
                        </Text>
                      </Space>
                      <EviusReactQuill
                        name='description'
                        data={this.state.description}
                        handleChange={(e) => this.handleChangeReactQuill(e, 'description')}
                      />
                    </Form.Item>}
                    {isEditingAgenda && <Form.Item label={'Imagen'}>
                      <Card style={{ textAlign: 'center', borderRadius: '20px' }}>
                        <Form.Item noStyle>
                          <p>
                            Dimensiones:{' '}
                            <b>
                              <small>600px X 400px, 400px X 600px, 200px X 200px, 400px X 400px ...</small>
                            </b>{' '}
                          </p>
                          <p>
                            <small>
                              Se recomienda que la imagen debe tener dimensiones iguales (cuadradas) para su mejor
                              funcionamiento
                            </small>
                          </p>
                          <p>
                            <small>La imagen tarda unos segundos en cargar</small>
                          </p>
                          <ImageUploaderDragAndDrop
                            imageDataCallBack={(file) => this.changeImg(file)}
                            imageUrl={image}
                            width='1080'
                            height='1080'
                          />
                        </Form.Item>
                      </Card>
                    </Form.Item>}
                    <BackTop />
                  </Col>
                </Row>
              </TabPane>
              {isEditingAgenda && (
                <>
                  <TabPane tab='Contenido' key='2'>
                    <Row /* justify='center' */ wrap gutter={12}>
                      <Col span={24}>
                        <TipeOfActivity
                          eventId={this.props.event._id}
                          activityId={this.state.activity_id}
                          activityName={this.state.name}
                          tab={this.state.tabs}
                          onDelete={() => {
                            this.setState({
                              typeString: formatLessonType(null),
                            })
                          }}
                        />

                        {/* <RoomManager
                          event_id={this.props.event._id}
                          activity_id={this.state.activity_id}
                          activity_name={this.state.name}
                          firestore={firestore}
                          date_start_zoom={date_start_zoom}
                          date_end_zoom={date_end_zoom}
                          date_activity={this.state.date}
                          pendingChangesSave={this.state.pendingChangesSave}
                          updateRoomManager={this.updateRoomManager}
                        /> */}

                        <BackTop />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab='Juegos' key='3'>
                    <Row justify='center' wrap gutter={12}>
                      <Col span={20}>
                        <RoomController
                          handleGamesSelected={this.handleGamesSelected}
                          handleTabsController={this.handleTabsController}
                        />
                        <BackTop />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab='Evaluaciones' key='4'>
                    <Row justify='center' wrap gutter={12}>
                      <Col span={20}>
                        <SurveyManager event_id={this.props.event._id} activity_id={this.state.activity_id} />
                        {this.state.isExternal && (
                          <SurveyExternal
                            isExternal={this.state.isExternal}
                            meeting_id={this.state.externalSurveyID}
                            event_id={this.props.event._id}
                            activity_id={this.state.activity_id}
                            roomStatus={this.state.roomStatus}
                          />
                        )}
                        <BackTop />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab='Documentos' key='5'>
                    <Row justify='center' wrap gutter={12}>
                      <Col span={20}>
                        {/* <Form.Item label={'Documentos'}>
                      <Select
                        id={'nameDocuments'}
                        isClearable
                        isMulti
                        styles={creatableStyles}
                        onChange={this.selectDocuments}
                        options={nameDocuments}
                        value={selected_document}
                      />
                    </Form.Item> */}
                        <Form.Item>
                          <SelectAntd
                            id={'nameDocuments'}
                            showArrow
                            mode='multiple'
                            onChange={(e) => this.selectDocuments(e)}
                            options={nameDocuments}
                            defaultValue={selected_document}
                          />
                        </Form.Item>
                        <BackTop />
                      </Col>
                    </Row>
                  </TabPane>
                </>
              )}
            </Tabs>
          )}
        </Form>
      </>
    );
  }
}

//FN manejo/parseo de fechas
function handleDate(info) {
  /* console.log(info, 'entro en handleDate'); */
  let date, hour_start, hour_end;
  hour_start = Moment(info.datetime_start, 'YYYY-MM-DD HH:mm').toDate();
  hour_end = Moment(info.datetime_end, 'YYYY-MM-DD HH:mm').toDate();
  date = Moment(info.datetime_end, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD');
  return { date, hour_start, hour_end };
}

//Estilos de algunos select
const creatableStyles = {
  menu: (styles) => ({ ...styles, maxHeight: 'inherit' }),
};

//Estilos para el tipo
const dot = (color = 'transparent') => ({
  alignItems: 'center',
  display: 'flex',
  ':before': {
    backgroundColor: color,
    content: '" "',
    display: 'block',
    margin: 8,
    height: 10,
    width: 10,
  },
});

//Estilos de algunos otros select
const catStyles = {
  menu: (styles) => ({ ...styles, maxHeight: 'inherit' }),
  multiValue: (styles, { data }) => ({ ...styles, ...dot(data.item.color) }),
};

export default withRouter(AgendaEdit);
