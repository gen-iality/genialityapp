import { Component, createRef } from 'react';
/**
 * This solution is distributed as is:
 * https://github.com/react-component/picker/issues/123#issuecomment-728755491
 */
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
import EviusReactQuill from '../shared/eviusReactQuill';
import { Actions, CategoriesApi, EventsApi, OrganizationApi, PlansApi, TypesApi } from '@helpers/request';
import ErrorServe from '../modal/serverError';
import { injectIntl } from 'react-intl';
import axios from 'axios/index';
import SelectInput from '../shared/selectInput';
import Loading from '../loaders/loading';
import DateEvent from './dateEvent';
import {
  Switch,
  Card,
  Row,
  Col,
  Tabs,
  Checkbox,
  Typography,
  Input,
  Select,
  Modal,
  Form,
  InputNumber,
  Badge,
  Space,
  Grid,
  Divider,
  Button,
  TimePicker,
  DatePicker,
} from 'antd';
import { firestore } from '@helpers/firebase';
import Header from '@antdComponents/Header';
import BackTop from '@antdComponents/BackTop';
import { ExclamationCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
import { handleRequestError } from '@helpers/utils';
import { DispatchMessageService } from '@context/MessageService';
import ImageUploaderDragAndDrop from '../imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import { ValidateEventStart } from '@/hooks/validateEventStartAndEnd';
import {
  disabledEndDateTime,
  disabledEndDate,
  disabledStartDateTime,
  disabledStartDate,
} from '@Utilities/disableTimeAndDatePickerInEventDate';
import { CurrentUserContext } from '@context/userContext';
import { CardSelector } from './CardSelector';

dayjs.locale('es');
const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;
const { useBreakpoint } = Grid;

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
class General extends Component {
  constructor(props) {
    super(props);
    this.nameInputRef = createRef();
    this.state = {
      event: this.props.event,
      possiblePositions: [],
      optionForm: [],
      selectedOption: [],
      selectedOrganizer: {},
      selectedType: {},
      error: {},
      fields: [],
      path: [],
      inputValue: '',
      listValue: '',
      option: [],
      minDate: new Date(),
      valid: !this.props.event._id,
      groups: [],
      errorData: {},
      serverError: false,
      loading: true,
      info: {},
      specificDates: false,
      dates: [],
      data_loader_page: '',
      checked: false,
      has_payment: false,
      tabs: {
        publicChat: true,
        privateChat: true,
        attendees: true,
      },
      is_socialzone_opened: true,
      itemsMenu: [],
      // Estado inicial de la seccion de formulario de registro
      registerForm: {
        name: 'Registro',
        position: 0,
        section: 'tickets',
        icon: 'CreditCardOutlined',
        checked: false,
        permissions: 'public',
      },
      typeEventPermit: 0,
      image: this.props.event.picture,
      iMustBlockAFunctionality: false,
      iMustValidate: true,
    };
    this.specificDates = this.specificDates.bind(this);
    this.submit = this.submit.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.getInitialPage = this.getInitialPage.bind(this);
  }
  static contextType = CurrentUserContext;

  getCurrentConsumptionPlanByUsers = async () => {
    const userContext = this.context;
    const cUser = userContext?.value;
    if (!cUser?._id) return;
    const consumption = await PlansApi.getCurrentConsumptionPlanByUsers(cUser?._id);
    this.setState({ consumption });
  };

  async componentDidMount() {
    this.getCurrentConsumptionPlanByUsers();
    //inicializacion del estado de menu
    if (this.state.event.itemsMenu) {
      const { itemsMenu } = this.state.event;
      const { registerForm } = this.state;

      const registerSection = registerForm;

      if (Object.keys(itemsMenu).length > 0) {
        Object.keys(itemsMenu).forEach((index) => {
          if (index === 'tickets') {
            registerSection.name = itemsMenu[index].name;
            registerSection.position = itemsMenu[index].position;
          }
        });
      }
      delete itemsMenu.tickets;
      this.setState({ itemsMenu, registerForm: registerSection });
    }

    const validate = await this.validateTabs();
    if (validate) {
      if (validate.tabs !== undefined) {
        this.setState({ tabs: { ...validate.tabs } });
      } else {
        await this.upsertTabs();
      }
    } else {
      await this.upsertTabs();
    }

    const info = this.props.event;
    this.setState({ info });
    this.setState({ checked: !!info.initial_page });
    try {
      const { event } = this.props;
      // event.picture = (typeof event.picture === 'object') ? event.picture[0] : "";
      const categories = await CategoriesApi.getAll();
      const types = await TypesApi.getAll();
      let organizers = await OrganizationApi.mine();
      organizers = organizers.map((item) => {
        return { value: item.id, label: item.name };
      });
      const { selectedCategories, selectedOrganizer, selectedType } = handleFields(
        organizers,
        types,
        categories,
        event,
      );
      const currentOrganization = await OrganizationApi.getOne(event.organizer_id);
      this.setState({
        categories,
        organizers,
        types,
        selectedCategories,
        selectedOrganizer,
        selectedType,
        loading: false,
        possiblePositions: currentOrganization.positions,
      });
      if (info.dates && info.dates.length > 0) {
        this.setState({ specificDates: true });
      } else {
        this.setState({ specificDates: false });
      }
    } catch (error) {
      // Error
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          DispatchMessageService({
            type: 'error',
            msj: `Error: ${data?.message || status}`,
            action: 'show',
          });
        } else this.setState({ serverError: true, loader: false });
      } else {
        this.setState({
          serverError: true,
          loader: false,
          errorData: { status: 400, message: JSON.stringify(error) },
        });
      }
    }

    //Esto es para la configuración de autenticación. Nuevo flujo de Login
    if (
      (this.state.event.visibility === 'PUBLIC' || this.state.event.visibility === 'ANONYMOUS') &&
      this.state.event.allow_register
    ) {
      //Evento Público con Registro
      this.setState({ typeEventPermit: 0 });
    } else if (this.state.event.visibility === 'PUBLIC' && !this.state.event.allow_register) {
      //Cursos Público sin Registro
      this.setState({ typeEventPermit: 1 });
    } else {
      //Cursos privado con Invitación
      this.setState({ typeEventPermit: 2 });
    }

    if (this.nameInputRef.current) this.nameInputRef.current.focus();
    window.scrollTo(0, 0);
  }

  //*********** FUNCIONES DEL FORMULARIO

  googleanlyticsid = (e) => {
    const { name, value } = e.target;
    this.setState({ event: { ...this.state.event, [name]: value } });
  };

  googletagmanagerid = (e) => {
    const { name, value } = e.target;
    this.setState({ event: { ...this.state.event, [name]: value } });
  };
  facebookpixelid = (e) => {
    const { name, value } = e.target;
    this.setState({ event: { ...this.state.event, [name]: value } });
  };

  //Cambio en los input
  handleChange = (e, name) => {
    const valueData = e?.target?.value;

    const targetData = e?.target;
    if (targetData !== null || targetData !== undefined || targetData !== '') {
      let value = e;
      if (typeof valueData === 'string') {
        value = valueData;
      }

      if (name === 'visibility') {
        value = targetData.checked ? 'PUBLIC' : 'PRIVATE';
      } else if (name === 'allow_register' || name === 'has_payment') {
        value = targetData.checked;
      }

      this.setState({ event: { ...this.state.event, [name]: value } }, this.valid);
    }
    // if (targetData != null) {
    //   // value = targetData;
    //   if (valueData) {
    //     value = valueData;
    //   }
    // }

    /* console.log(name, value, '2'); */
  };
  //Validación
  valid = () => {
    const error = {};
    const { event, selectedOrganizer, selectedType, selectedCategories } = this.state;
    const valid = event.name !== null && event.name !== '' && event.name.length > 0 && !!selectedOrganizer;
    /* 
      &&
      !!selectedType &&
      selectedCategories &&
      selectedCategories.length > 0 */
    if (valid) {
      this.setState({ valid: !valid, error });
    } else {
      DispatchMessageService({
        type: 'error',
        msj: this.props.intl.formatMessage({
          id: 'message.error.complete.requerid.data',
          defaultMessage: 'Hubo un error, por favor completa los datos obligatorios!',
        }),
        action: 'show',
      });
    }
  };
  //Cambio descripción
  chgTxt = (content) => {
    this.setState({ event: { ...this.state.event, description: content } });
  };
  //Funciones para manejar el cambio en listas desplegables
  selectCategory = (selectedCategories) => {
    this.setState({ selectedCategories }, this.valid);
  };

  selectOrganizer = (selectedOrganizer) => {
    if (!selectedOrganizer.value) selectedOrganizer = undefined;
    this.setState({ selectedOrganizer }, this.valid);
  };
  selectType = (selectedType) => {
    if (!selectedType.value) selectedType = undefined;
    this.setState({ selectedType }, this.valid);
  };
  //Cambio en los input de fechas
  changeDate = (value, name) => {
    let {
      event: { date_end },
    } = this.state;
    if (name === 'date_start') {
      const diff = dayjs(value).diff(dayjs(date_end), 'days');
      if (diff >= 0)
        date_end = dayjs(date_end)
          .add(diff, 'days')
          .toDate();
      this.setState({
        minDate: value,
        event: { ...this.state.event, date_start: value, date_end: value },
      });
    } else if (name === 'hour_start') {
      this.setState({
        minDate: value,
        event: { ...this.state.event, hour_start: value, hour_end: value },
      });
    } else this.setState({ event: { ...this.state.event, [name]: value } });
  };

  /* ZONA SOCIAL */

  validateTabs = () => {
    const { event } = this.props;
    return new Promise(function(resolve, reject) {
      firestore
        .collection('events')
        .doc(event._id)
        .get()
        .then((result) => {
          if (result?.exists) {
            const data = result.data();
            data ? resolve(data) : resolve(false);
          } else {
            resolve(false);
          }
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  };

  upsertTabs = async () => {
    const { event, intl } = this.props;
    const { tabs } = this.state;
    const response = await this.validateTabs();

    return new Promise(function(resolve) {
      if (response) {
        const updateData = { ...response, tabs: { ...tabs } };

        firestore
          .collection('events')
          .doc(event._id)
          .update(updateData)
          .then(() => {
            const msg = intl.formatMessage({
              id: 'message.success.updated.tabs',
              defaultMessage: 'Tabs de la zona social actualizados!',
            });
            DispatchMessageService({
              type: 'success',
              msj: msg,
              action: 'show',
            });
            resolve({
              error: '',
              message: msg,
            });
          })
          .catch((err) => {
            console.error(err);
            DispatchMessageService({
              type: 'error',
              msj: intl.formatMessage({
                id: 'message.error.updated.tabs',
                defaultMessage: 'Ha ocurrido un error actualizando las tabs de la zona social',
              }),
              action: 'show',
            });
          });
      } else {
        firestore
          .collection('events')
          .doc(event._id)
          .set({ tabs: { ...tabs } })
          .then(() => {
            const msg = intl.formatMessage({
              id: 'message.success.initialized.tabs',
              defaultMessage: 'Tabs de la zona social inicializados',
            });
            DispatchMessageService({
              type: 'success',
              msj: msg,
              action: 'show',
            });
            resolve({
              error: '',
              message: msg,
            });
          })
          .catch((err) => {
            console.error(err);
            DispatchMessageService({
              type: 'error',
              msj: intl.formatMessage({
                id: 'message.error.updated.tabs',
                defaultMessage: 'Ha ocurrido un error actualizando las tabs de la zona social',
              }),
              action: 'show',
            });
          });
      }
    });
  };

  handleImage(imageUrl) {
    this.setState({ image: imageUrl });
  }

  //*********** FIN FUNCIONES DEL FORMULARIO

  //Envío de datos
  async submit() {
    const { intl } = this.props;
    /* e.preventDefault();
    e.stopPropagation(); */
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras se guarda la información...',
      action: 'show',
    });

    // creacion o actualizacion de estado en firebase de los tabs de la zona social
    await this.upsertTabs();

    const { event, path, image } = this.state;
    const self = this;
    //this.setState({loading:true});
    const hour_start = dayjs(event.hour_start).format('HH:mm');
    const date_start = dayjs(event.date_start).format('YYYY-MM-DD');
    const hour_end = dayjs(event.hour_end).format('HH:mm');
    const date_end = dayjs(event.date_end).format('YYYY-MM-DD');
    const datetime_from = dayjs(date_start + ' ' + hour_start, 'YYYY-MM-DD HH:mm');
    const datetime_to = dayjs(date_end + ' ' + hour_end, 'YYYY-MM-DD HH:mm');
    const categories = this.state.selectedCategories.map((item) => {
      return item.value;
    });

    /* console.log(event.visibility, event.allow_register, 'hola') */

    const data = {
      name: event.name,
      datetime_from: datetime_from.format('YYYY-MM-DD HH:mm:ss'),
      datetime_to: datetime_to.format('YYYY-MM-DD HH:mm:ss'),
      picture: image,
      video: event.video || null,
      video_position: event.video_position === 'true' || event.video_position ? 'true' : 'false',
      venue: event.venue,
      analytics: event.analytics,
      address: event.address,
      has_date: event.has_date === 'true' || !!event.has_date,
      allow_register: event.allow_register,
      allow_detail_calendar: event.allow_detail_calendar === 'true' || !!event.allow_detail_calendar,
      enable_language: event.enable_language === 'true' || !!event.enable_language,
      homeSelectedScreen: event.homeSelectedScreen,
      visibility: event.visibility ? event.visibility : 'PRIVATE',
      description: event.description,
      category_ids: categories,
      organizer_id:
        this.state.selectedOrganizer && this.state.selectedOrganizer.value ? this.state.selectedOrganizer.value : null,
      event_type_id: this.state.selectedType?.value,
      app_configuration: this.state.info.app_configuration,
      banner_image_link: this.state.banner_image_link,
      adminContenido: event.adminContenido,
      type_event: this.state.event.type_event,
      event_platform: event.event_platform || 'zoom',
      loader_page: event.loader_page || 'no',
      initial_page: event.initial_page || '',
      data_loader_page: this.state.data_loader_page || '',
      show_banner: event.show_banner || true,
      show_banner_footer: event.show_banner_footer || false,
      has_payment: event.has_payment ? event.has_payment : false,
      language: event.language ? event.language : 'es',
      googleanlyticsid: event.googleanlyticsid || null,
      googletagmanagerid: event.googletagmanagerid || null,
      facebookpixelid: event.facebookpixelid || null,
      is_certification: event.is_certification,
      validity_days: event.validity_days,
      default_certification_description: event.default_certification_description,
      default_certification_hours: event.default_certification_hours,
      default_certification_entity: event.default_certification_entity,
      default_certification_last_hours: event.default_certification_last_hours,
      is_socialzone_opened: event.is_socialzone_opened,
    };

    try {
      if (event._id) {
        const info = await EventsApi.editOne(data, event._id);
        this.props.updateEvent(info);
        self.setState({ loading: false });
        DispatchMessageService({
          type: 'success',
          msj: intl.formatMessage({
            id: 'toast.success',
            defaultMessage: 'Ok!',
          }),
          action: 'show',
        });
      } else {
        const result = await Actions.create('/api/events', data);
        this.setState({ loading: false });
        if (result._id) {
          window.location.replace(`${window.location.origin}/event/${result._id}`);
        } else {
          DispatchMessageService({
            type: 'warning',
            msj: intl.formatMessage({
              id: 'toast.warning',
              defaultMessage: 'Idk',
            }),
            action: 'show',
          });
          this.setState({ msg: "Can't create", create: false });
        }
      }
    } catch (error) {
      DispatchMessageService({
        type: 'error',
        msj: intl.formatMessage({
          id: 'toast.error',
          defaultMessage: 'Sry :(',
        }),
        action: 'show',
      });
      if (error?.response) {
        /* console.error(error.response); */
        const { status, data } = error.response;

        /* console.error('STATUS', status, status === 401); */
        if (status === 401) {
          DispatchMessageService({
            type: 'error',
            msj: `Error : ${data?.message || status}`,
            action: 'show',
          });
        } else this.setState({ serverError: true, loader: false, errorData: data });
      } else {
        let errorData = error.message;
        /* console.error('Error', error.message); */
        if (error.request) {
          /* console.error(error.request); */
          errorData = error.request;
        }
        errorData.status = 708;
        this.setState({ serverError: true, loader: false, errorData });
      }
      /*  console.error(error.config); */
    }
  }
  //Delete event
  async deleteEvent() {
    const self = this;
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: self.props.intl.formatMessage({ id: 'toast.success', defaultMessage: 'Ok!' }),
      action: 'show',
    });
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
            await EventsApi.deleteOne(self.state.event._id);
            DispatchMessageService({
              key: 'loading',
              action: 'destroy',
            });
            DispatchMessageService({
              type: 'success',
              msj: 'Se eliminó la información correctamente!',
              action: 'show',
            });
            window.location.replace(`${window.location.origin}/myprofile`);
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
  closeModal = () => {
    this.setState({ modal: false, message: {} });
  };
  modalEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ modal: true });
  };

  async specificDates(checked) {
    this.setState({ specificDates: checked });

    if (!checked) {
      const properties = {
        dates: {},
      };

      await EventsApi.editOne(properties, this.props.eventId);
    }
  }

  getInitialPage(data) {
    this.setState({ event: { ...this.state.event, initial_page: data } });
  }

  onChangeCheck = (e) => {
    this.setState({
      checked: e.target.checked,
    });
  };

  handleChangeReactQuill = (e) => {
    this.setState({ description: e });
  };

  //Esto es para la configuración de autenticación. Nuevo flujo de Login, cambiar los campos internamente
  changetypeEvent = (value) => {
    this.setState({ typeEventPermit: value });
    if (value === 0) {
      //Cursos Público con Registro
      this.setState({
        event: {
          ...this.state.event,
          visibility: 'PUBLIC',
          allow_register: true,
        },
      });
    } else if (value === 1) {
      //Cursos Público sin Registro
      this.setState({
        event: {
          ...this.state.event,
          visibility: 'PUBLIC',
          allow_register: false,
        },
      });
    } else {
      // Cursos privado con Invitación
      this.setState({
        event: {
          ...this.state.event,
          visibility: 'PRIVATE',
          allow_register: false,
        },
      });
    }
  };
  /** RESTRICIONES */
  theEventIsActive = (state) => {
    this.setState({
      iMustBlockAFunctionality: state,
      iMustValidate: false,
    });
  };

  render() {
    if (this.state.loading) return <Loading />;
    const {
      event,
      possiblePositions,
      categories,
      organizers,
      types,
      selectedCategories,
      selectedOrganizer,
      selectedType,
      valid,
      errorData,
      serverError,
      specificDates,
      registerForm,
      image,
      iMustBlockAFunctionality,
      iMustValidate,
      consumption,
    } = this.state;
    const userContext = this.context;
    /** RESTRICIONES */
    const cUser = userContext?.value;
    const userPlan = userContext.value?.plan;
    const streamingHours = userPlan?.availables?.streaming_hours;

    if (!dayjs(event.hour_start).isValid()) {
      event.hour_start = dayjs(new Date());
    }

    if (!dayjs(event.hour_end).isValid()) {
      event.hour_end = dayjs(new Date());
    }

    return (
      <>
        {/* RESTRICIONES */}
        {console.log('event', event)}
        <Form onFinish={this.submit} {...formLayout}>
          <Header title="Datos del curso" save form remove={this.deleteEvent} edit={this.state.event._id} />
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="General" key="1">
              <Row justify="center" wrap gutter={[8, 8]}>
                <Col span={16}>
                  <Form.Item
                    label={
                      <label style={{ marginTop: '2%' }}>
                        Nombre <label style={{ color: 'red' }}>*</label>
                      </label>
                    }
                    rules={[{ required: true, message: 'El nombre es requerido' }]}
                  >
                    <Input
                      ref={this.nameInputRef}
                      autoFocus
                      name="name"
                      placeholder="Nombre del curso"
                      value={event.name}
                      onChange={(e) => this.handleChange(e, 'name')}
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <label style={{ marginTop: '2%' }}>
                        Cargo <label style={{ color: 'gray' }}>(opcional)</label>
                      </label>
                    }
                  >
                    <Select
                      mode="multiple"
                      placeholder="Asigna un cargo para excluir"
                      onChange={(values) => {
                        console.log(values);
                        EventsApi.editItsPositions(event._id, values);
                      }}
                      defaultValue={event.position_ids || []}
                      options={(possiblePositions || []).map((position) => ({
                        value: position._id,
                        label: position.position_name,
                      }))}
                    />
                  </Form.Item>

                  {event.app_configuration && (
                    <Form.Item label="¿Qué módulo desea observar en el inicio?">
                      <Select
                        name="homeSelectedScreen"
                        value={event.homeSelectedScreen}
                        onChange={(e) => this.handleChange(e, 'homeSelectedScreen')}
                      >
                        <Option value={null}>Banner de inicio</Option>
                        <Option
                          value={
                            event.app_configuration.ProfileScreen ? event.app_configuration.ProfileScreen.name : ''
                          }
                        >
                          {event.app_configuration.ProfileScreen
                            ? event.app_configuration.ProfileScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                        <Option
                          value={
                            event.app_configuration.CalendarScreen ? event.app_configuration.CalendarScreen.name : ''
                          }
                        >
                          {event.app_configuration.CalendarScreen
                            ? event.app_configuration.CalendarScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                        <Option
                          value={event.app_configuration.NewsScreen ? event.app_configuration.NewsScreen.name : ''}
                        >
                          {event.app_configuration.NewsScreen
                            ? event.app_configuration.NewsScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                        <Option
                          value={
                            event.app_configuration.EventPlaceScreen
                              ? event.app_configuration.EventPlaceScreen.name
                              : ''
                          }
                        >
                          {event.app_configuration.EventPlaceScreen
                            ? event.app_configuration.EventPlaceScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                        <Option
                          value={
                            event.app_configuration.SpeakerScreen ? event.app_configuration.SpeakerScreen.name : ''
                          }
                        >
                          {event.app_configuration.SpeakerScreen
                            ? event.app_configuration.SpeakerScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                        <Option
                          value={event.app_configuration.SurveyScreen ? event.app_configuration.SurveyScreen.name : ''}
                        >
                          {event.app_configuration.SurveyScreen
                            ? event.app_configuration.SurveyScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                        <Option
                          value={
                            event.app_configuration.DocumentsScreen ? event.app_configuration.DocumentsScreen.name : ''
                          }
                        >
                          {event.app_configuration.DocumentsScreen
                            ? event.app_configuration.DocumentsScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                        <Option
                          value={event.app_configuration.WallScreen ? event.app_configuration.WallScreen.name : ''}
                        >
                          {event.app_configuration.WallScreen
                            ? event.app_configuration.WallScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                        <Option value={event.app_configuration.WebScreen ? event.app_configuration.WebScreen.name : ''}>
                          {event.app_configuration.WebScreen
                            ? event.app_configuration.WebScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                        <Option
                          value={event.app_configuration.FaqsScreen ? event.app_configuration.FaqsScreen.name : ''}
                        >
                          {event.app_configuration.FaqsScreen
                            ? event.app_configuration.FaqsScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                      </Select>
                    </Form.Item>
                  )}

                  {/* <Form.Item label="Tipo de curso">
                    <Select
                      defaultValue={event.type_event}
                      name="type_event"
                      onChange={(e) => this.handleChange(e, 'type_event')}
                    >
                      <Option value="">Seleccionar...</Option>
                      <Option value="physicalEvent">Afianzamiento de capacidades</Option> {/* TODO * /}
                      <Option value="onlineEvent">Actualización </Option> {/* TODO * / }
                      <Option value="hybridEvent">Curso híbrido</Option>
                    </Select>
                  </Form.Item> */}

                  {/* {event.type_event === 'onlineEvent' && (
                    <Form.Item label="Plataforma streaming del curso">
                      <Select
                        defaultValue={event.event_platform}
                        name="event_platform"
                        onChange={(e) => this.handleChange(e, 'event_platform')}
                      >
                        <Option value="">Seleccionar...</Option>
                        <Option value="zoom">Zoom</Option>
                        <Option value="zoomExterno">ZoomExterno</Option>
                        <Option value="vimeo">Vimeo</Option>
                        <Option value="bigmarker">BigMaker</Option>
                      </Select>
                    </Form.Item>
                  )} */}

                  {/* {event.type_event !== 'onlineEvent' && (
                    <>
                      <Form.Item label="Dirección">
                        <Input
                          name="address"
                          placeholder="¿Cuál es la dirección del curso?"
                          value={event.address}
                          onChange={(e) => this.handleChange(e, 'address')}
                        />
                      </Form.Item>

                      <Form.Item label="Lugar">
                        <Input
                          name="venue"
                          placeholder="Nombre del lugar del curso"
                          value={event.venue}
                          onChange={(e) => this.handleChange(e, 'venue')}
                        />
                      </Form.Item>
                    </>
                  )} */}

                  {!cUser?.plan && (
                    <Form.Item label="Especificar fechas">
                      {/* <Switch defaultChecked onChange={this.specificDates} checked={specificDates} /> */}
                    </Form.Item>
                  )}

                  {!specificDates ? (
                    <div>
                      <Row gutter={[8, 8]}>
                        <Col span={12}>
                          <Form.Item label="Fecha inicio">
                            <DatePicker
                              inputReadOnly
                              // Restriciones
                              // disabledDate={(date) => disabledStartDate(date, streamingHours, consumption)}
                              disabled={iMustBlockAFunctionality}
                              style={{ width: '100%' }}
                              allowClear={false}
                              value={dayjs(event.date_start)}
                              format="DD/MM/YYYY"
                              onChange={(value) => this.changeDate(value, 'date_start')}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="Hora inicio">
                            <TimePicker
                              showNow={false}
                              inputReadOnly={true}
                              disabled={iMustBlockAFunctionality}
                              style={{ width: '100%' }}
                              allowClear={false}
                              value={dayjs(event.hour_start)}
                              use12Hours
                              format="h:mm a"
                              onChange={(value) => this.changeDate(value, 'hour_start')}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={[8, 8]}>
                        <Col span={12}>
                          <Form.Item label="Fecha fin">
                            <DatePicker
                              inputReadOnly
                              disabled={iMustBlockAFunctionality}
                              style={{ width: '100%' }}
                              allowClear={false}
                              value={dayjs(event.date_end)}
                              format="DD/MM/YYYY"
                              onChange={(value) => this.changeDate(value, 'date_end')}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="Hora fin">
                            <TimePicker
                              showNow={false}
                              inputReadOnly={true}
                              disabled={iMustBlockAFunctionality}
                              style={{ width: '100%' }}
                              allowClear={false}
                              value={dayjs(event.hour_end)}
                              use12Hours
                              format="h:mm a"
                              onChange={(value) => this.changeDate(value, 'hour_end')}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  ) : (
                    <DateEvent eventId={this.props.event._id} updateEvent={this.props.updateEvent} />
                  )}

                  <Form.Item label="Descripción">
                    <EviusReactQuill name="description" data={event.description} handleChange={this.chgTxt} />
                  </Form.Item>

                  <Form.Item>
                    <SelectInput
                      name="Organizado por:"
                      isMulti={false}
                      selectedOptions={selectedOrganizer}
                      selectOption={this.selectOrganizer}
                      options={organizers}
                      required
                    />
                  </Form.Item>

                  <Form.Item label={<label style={{ marginTop: '2%' }}>Imagen general - miniatura del curso</label>}>
                    <ImageUploaderDragAndDrop
                      imageDataCallBack={(imageUrl) => this.handleImage(imageUrl)}
                      imageUrl={image}
                      width="1080"
                      height="1080"
                    />
                  </Form.Item>

                  <Form.Item label="Vídeo promocional">
                    <Input
                      name="video"
                      placeholder="www.ejemplo.com/watch?v=oK88Stdw0DI"
                      value={event.video}
                      onChange={(e) => this.handleChange(e, 'video')}
                    />
                  </Form.Item>

                  <Form.Item label="Posición del video">
                    <Switch
                      name="video_position"
                      checked={event.video_position || event.video_position === 'true'}
                      checkedChildren="Arriba"
                      unCheckedChildren="Abajo"
                      onChange={(checked) =>
                        this.setState({
                          event: {
                            ...this.state.event,
                            video_position: checked ? 'true' : 'false',
                          },
                        })
                      }
                    />
                  </Form.Item>

                  <Card title="Zona social">
                    <Row style={{ padding: '8px 0px' }}>
                      <Col xs={18}>Habilitar chat general</Col>
                      <Col xs={6}>
                        <Switch
                          checked={this.state?.tabs?.publicChat}
                          onChange={(checked) =>
                            this.setState(
                              {
                                tabs: {
                                  ...this.state.tabs,
                                  publicChat: checked,
                                },
                              },
                              async () => await this.upsertTabs(),
                            )
                          }
                        />
                      </Col>
                    </Row>
                    <Row style={{ padding: '8px 0px' }}>
                      <Col xs={18}>Habilitar chat privado</Col>
                      <Col xs={6}>
                        <Switch
                          checked={this.state?.tabs?.privateChat}
                          onChange={(checked) =>
                            this.setState(
                              {
                                tabs: {
                                  ...this.state.tabs,
                                  privateChat: checked,
                                },
                              },
                              async () => await this.upsertTabs(),
                            )
                          }
                        />
                      </Col>
                    </Row>
                    <Row style={{ padding: '8px 0px' }}>
                      <Col xs={18}>Habilitar lista de asistentes</Col>
                      <Col xs={6}>
                        <Switch
                          checked={this.state?.tabs?.attendees}
                          onChange={(checked) =>
                            this.setState(
                              {
                                tabs: {
                                  ...this.state.tabs,
                                  attendees: checked,
                                },
                              },
                              async () => await this.upsertTabs(),
                            )
                          }
                        />
                      </Col>
                    </Row>
                    <Row style={{ padding: '8px 0px' }}>
                      <Col xs={18}>Mantener la zona social desplegada cada vez que se ingresa a una actividad</Col>
                      <Col xs={6}>
                        <Switch
                          checked={event.is_socialzone_opened}
                          onChange={(checked) => {
                            this.handleChange(checked, 'is_socialzone_opened');
                          }}
                        />
                      </Col>
                    </Row>
                  </Card>

                  <Form.Item label="¿Es curso de certificación?">
                    <Switch
                      checkedChildren="Certificación"
                      unCheckedChildren="GEN.iality"
                      checked={event.is_certification}
                      onChange={(checked) => {
                        this.handleChange(checked, 'is_certification');
                      }}
                    />
                  </Form.Item>

                  {event.is_certification && (
                    <>
                      <Form.Item label="Descripción de la certificación (valor por defecto)">
                        <Input
                          value={event.default_certification_description}
                          onChange={(e) => {
                            this.handleChange(e, 'default_certification_description');
                          }}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Días de vigencia (valor por defecto)"
                        rules={[
                          {
                            required: true,
                            message: 'Necesario',
                          },
                        ]}
                      >
                        <InputNumber
                          min={1}
                          value={event.validity_days || 1}
                          onChange={(e) => {
                            this.handleChange(e, 'validity_days');
                          }}
                        />
                      </Form.Item>

                      <Form.Item label="Horas de la certificación (valor por defecto)">
                        <InputNumber
                          min={1}
                          value={event.default_certification_hours || 1}
                          onChange={(e) => {
                            this.handleChange(e, 'default_certification_hours');
                          }}
                        />
                      </Form.Item>

                      <Form.Item label="Entidad de la certificación (valor por defecto)">
                        <Input
                          value={event.default_certification_entity}
                          onChange={(e) => {
                            this.handleChange(e, 'default_certification_entity');
                          }}
                        />
                      </Form.Item>

                      {/* // <Form.Item
                      //   label="Última horas de la certificación (valor por defecto)"
                      //   >
                      //   <InputNumber
                      //     min={0}
                      //     value={event.default_certification_last_hours || 0}
                      //     onChange={(e) => {
                      //       this.handleChange(e, 'default_certification_last_hours')
                      //     }}
                      //   />
                      // </Form.Item> */}
                    </>
                  )}
                </Col>
              </Row>
              <BackTop />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Tipos de acceso" key="2">
              <CardSelector
                selected={this.state.typeEventPermit.toString()}
                options={[
                  {
                    id: '0',
                    title: 'Curso Público con Registro',
                    body: (
                      <ul>
                        <li>Tiene registro para todos.</li>
                        <br />
                        <li>Tiene inicio de sesión para todos.</li>
                      </ul>
                    ),
                    checkbox: {
                      text: 'Registro sin autenticación de usuario (Beta)',
                      onCheck: (checked) => {
                        this.setState({
                          event: {
                            ...this.state.event,
                            visibility: checked ? 'ANONYMOUS' : 'PUBLIC',
                            allow_register: true,
                          },
                        });
                      },
                      initialCheck: this.state.event.visibility === 'ANONYMOUS',
                    },
                  },
                  {
                    id: '1',
                    title: 'Curso Público sin Registro',
                    body: (
                      <ul>
                        <li>Quedará como anónimo.</li>
                        <br />
                        <li>Sólo se mostrará el inicio de sesión.</li>
                      </ul>
                    ),
                  },
                  {
                    id: '2',
                    title: 'Curso privado por invitación',
                    body: (
                      <ul>
                        <li>Sólo se podrá acceder por invitación.</li>
                        <br />
                        <li>Tiene inicio de sesión para todos.</li>
                      </ul>
                    ),
                  },
                ]}
                onSelected={(selected) => this.changetypeEvent(Number.parseInt(selected))}
              />
            </Tabs.TabPane>
          </Tabs>
          {serverError && <ErrorServe errorData={errorData} />}
          {this.state.fileMsgBanner && <p className="help is-success">{this.state.fileMsgBanner}</p>}
        </Form>
      </>
    );
  }
}

//Función para organizar las opciones de las listas desplegables (Organizado,Tipo,Categoría)
function handleFields(organizers, types, categories, event) {
  const selectedCategories = [];
  let selectedType = {};
  const { category_ids, organizer_id, event_type_id } = event;
  if (category_ids) {
    categories.map((item) => {
      const pos = category_ids.indexOf(item.value);
      return pos >= 0 ? selectedCategories.push(item) : '';
    });
  }
  const pos = organizers
    .map((e) => {
      return e.value;
    })
    .indexOf(organizer_id);
  const selectedOrganizer = organizers[pos];
  if (event_type_id) {
    const pos = types
      .map((e) => {
        return e.value;
      })
      .indexOf(event_type_id);
    selectedType = types[pos];
  } else selectedType = undefined;
  return { selectedOrganizer, selectedCategories, selectedType };
}

export default injectIntl(General);
