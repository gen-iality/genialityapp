import React, { Component } from 'react';
import Moment from 'moment';

import ImageInput from '../shared/imageInput';
import EviusReactQuill from '../shared/eviusReactQuill';
import { Actions, CategoriesApi, EventsApi, OrganizationApi, TypesApi } from '../../helpers/request';
/* import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; */
import 'react-widgets/lib/scss/react-widgets.scss';
import ErrorServe from '../modal/serverError';
import { injectIntl } from 'react-intl';
import axios from 'axios/index';
import { DateTimePicker } from 'react-widgets';
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
} from 'antd';
import { firestore } from '../../helpers/firebase';
import Header from '../../antdComponents/Header';
import BackTop from '../../antdComponents/BackTop';
import { ExclamationCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
import { handleRequestError } from '../../helpers/utils';
import { DispatchMessageService } from '../../context/MessageService';

Moment.locale('es');
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
    this.state = {
      event: this.props.event,
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
      typeEvent: 0,
    };
    this.specificDates = this.specificDates.bind(this);
    this.submit = this.submit.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.getInitialPage = this.getInitialPage.bind(this);
  }

  async componentDidMount() {
    //inicializacion del estado de menu
    if (this.state.event.itemsMenu) {
      const { itemsMenu } = this.state.event;
      const { registerForm } = this.state;

      let registerSection = registerForm;

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
    this.setState({
      checked: info.initial_page ? true : false,
    });
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
        event
      );
      this.setState({
        categories,
        organizers,
        types,
        selectedCategories,
        selectedOrganizer,
        selectedType,
        loading: false,
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
        this.setState({ serverError: true, loader: false, errorData: { status: 400, message: JSON.stringify(error) } });
      }
    }

    //Esto es para la configuración de autenticación. Nuevo flujo de Login
    if (this.state.event.visibility === 'PUBLIC' && this.state.event.allow_register) {
      //Evento Público con Registro
      this.setState({ typeEvent: 0 });
    } else if (this.state.event.visibility === 'PUBLIC' && !this.state.event.allow_register) {
      //Evento Público sin Registro
      this.setState({ typeEvent: 1 });
    } else {
      //Evento Privado con Invitación
      this.setState({ typeEvent: 2 });
    }
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
    // console.log(e.target);
    if (e.target !== null || e.target !== undefined || e.target !== '') {
      let value = e;
      if (e.target.value !== null || e.target.value !== undefined || e.target.value !== '') {
        value = e.target.value;
      }

      if (name === 'visibility') {
        value = e.target.checked ? 'PUBLIC' : 'PRIVATE';
      } else if (name === 'allow_register' || name === 'has_payment') {
        value = e.target.checked;
      }

      this.setState({ event: { ...this.state.event, [name]: value } }, this.valid);
    }
    // if (e.target != null) {
    //   // value = e.target;
    //   if (e.target.value) {
    //     value = e.target.value;
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
        msj: 'Hubo un error, por favor completa los datos obligatorios',
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
      const diff = Moment(value).diff(Moment(date_end), 'days');
      if (diff >= 0)
        date_end = Moment(date_end)
          .add(diff, 'days')
          .toDate();
      this.setState({ minDate: value, event: { ...this.state.event, date_end: date_end, date_start: value } });
    } else this.setState({ event: { ...this.state.event, [name]: value } });
  };
  //Cambio en el input de imagen
  changeImg = (files) => {
    const file = files[0];
    const url = '/api/files/upload',
      path = [],
      self = this;
    if (file) {
      this.setState({
        imageFile: file,
        event: { ...this.state.event, picture: null },
      });

      //envia el archivo de imagen como POST al API
      const uploaders = files.map((file) => {
        let data = new FormData();
        data.append('file', file);
        return Actions.post(url, data).then((image) => {
          if (image) path.push(image);
        });
      });

      //cuando todaslas promesas de envio de imagenes al servidor se completan

      // eslint-disable-next-line no-unused-vars
      axios.all(uploaders).then((data) => {
        self.setState({
          event: {
            ...self.state.event,
            picture: path[0],
          },
          fileMsg: 'Imagen subida con exito',
          imageFile: null,
          path,
        });
        DispatchMessageService({
          type: 'success',
          msj: this.props.intl.formatMessage({ id: 'toast.img', defaultMessage: 'Ok!' }),
          action: 'show',
        });
      });
    } else {
      this.setState({ errImg: 'Solo se permiten imágenes. Intentalo de nuevo' });
    }
  };

  banner_image = (files) => {
    const file = files;
    const url = '/api/files/upload',
      banner_image = [],
      self = this;
    if (file) {
      this.setState({
        imageFileBannerImage: file,
        event: { ...this.state.event, bannerImage: null },
      });

      //envia el archivo de imagen como POST al API
      const uploaders = files.map((file) => {
        let data = new FormData();
        data.append('file', file);
        return Actions.post(url, data).then((image) => {
          if (image) banner_image.push(image);
        });
      });

      //cuando todaslas promesas de envio de imagenes al servidor se completan

      // eslint-disable-next-line no-unused-vars
      axios.all(uploaders).then((data) => {
        self.setState({
          event: {
            ...self.state.event,
            bannerImage: banner_image,
          },
          fileMsgBanner: 'Imagen subida con exito',
          imageFileBannerImage: null,
          banner_image,
        });
        DispatchMessageService({
          type: 'success',
          msj: this.props.intl.formatMessage({ id: 'toast.img', defaultMessage: 'Ok!' }),
          action: 'show',
        });
      });
    } else {
      this.setState({ errImg: 'Solo se permiten imágenes. Intentalo de nuevo' });
    }
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
          if (result.exists) {
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
    const { event } = this.props;
    const { tabs } = this.state;
    let response = await this.validateTabs();

    return new Promise(function(resolve) {
      if (response) {
        let updateData = { ...response, tabs: { ...tabs } };

        firestore
          .collection('events')
          .doc(event._id)
          .update(updateData)
          .then(() => {
            const msg = 'Tabs de la zona social actualizados';
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
              msj: 'Ha ocurrido un error actualizando las tabs de la zona social',
              action: 'show',
            });
          });
      } else {
        firestore
          .collection('events')
          .doc(event._id)
          .set({ tabs: { ...tabs } })
          .then(() => {
            const msg = 'Tabs de la zona social inicializados';
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
              msj: 'Ha ocurrido un error actualizando las tabs de la zona social',
              action: 'show',
            });
          });
      }
    });
  };

  //*********** FIN FUNCIONES DEL FORMULARIO

  //Envío de datos
  async submit() {
    const { intl } = this.props;
    /* e.preventDefault();
    e.stopPropagation(); */

    // creacion o actualizacion de estado en firebase de los tabs de la zona social
    await this.upsertTabs();

    const { event, path } = this.state;
    const self = this;
    //this.setState({loading:true});
    const hour_start = Moment(event.hour_start).format('HH:mm');
    const date_start = Moment(event.date_start).format('YYYY-MM-DD');
    const hour_end = Moment(event.hour_end).format('HH:mm');
    const date_end = Moment(event.date_end).format('YYYY-MM-DD');
    const datetime_from = Moment(date_start + ' ' + hour_start, 'YYYY-MM-DD HH:mm');
    const datetime_to = Moment(date_end + ' ' + hour_end, 'YYYY-MM-DD HH:mm');
    const categories = this.state.selectedCategories.map((item) => {
      return item.value;
    });

    /* console.log(event.visibility, event.allow_register, 'hola') */

    const data = {
      name: event.name,
      datetime_from: datetime_from.format('YYYY-MM-DD HH:mm:ss'),
      datetime_to: datetime_to.format('YYYY-MM-DD HH:mm:ss'),
      picture: path.length > 1 ? path : event.picture,
      video: event.video || null,
      video_position: event.video_position === 'true' || event.video_position === true ? 'true' : 'false',
      venue: event.venue,
      analytics: event.analytics,
      address: event.address,
      has_date: event.has_date === 'true' || event.has_date === true ? true : false,
      allow_register: event.allow_register,
      allow_detail_calendar:
        event.allow_detail_calendar === 'true' || event.allow_detail_calendar === true ? true : false,
      enable_language: event.enable_language === 'true' || event.enable_language === true ? true : false,
      homeSelectedScreen: event.homeSelectedScreen,
      visibility: event.visibility ? event.visibility : 'PRIVATE',
      description: event.description,
      category_ids: categories,
      organizer_id:
        this.state.selectedOrganizer && this.state.selectedOrganizer.value ? this.state.selectedOrganizer.value : null,
      event_type_id: this.state.selectedType?.value,
      app_configuration: this.state.info.app_configuration,
      banner_image: this.state.banner_image,
      banner_image_link: this.state.banner_image_link,
      adminContenido: event.adminContenido,
      type_event: event.type_event,
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
    };

    try {
      if (event._id) {
        const info = await EventsApi.editOne(data, event._id);
        this.props.updateEvent(info);
        self.setState({ loading: false });
        DispatchMessageService({
          type: 'success',
          msj: intl.formatMessage({ id: 'toast.success', defaultMessage: 'Ok!' }),
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
            msj: intl.formatMessage({ id: 'toast.warning', defaultMessage: 'Idk' }),
            action: 'show',
          });
          this.setState({ msg: 'Cant Create', create: false });
        }
      }
    } catch (error) {
      DispatchMessageService({
        type: 'error',
        msj: intl.formatMessage({ id: 'toast.error', defaultMessage: 'Sry :(' }),
        action: 'show',
      });
      if (error?.response) {
        console.log('ERROR ACA==>', error);
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
        console.log('ERROR DATA===>', errorData);
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
      msj: intl.formatMessage({ id: 'toast.success', defaultMessage: 'Ok!' }),
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

    if (checked === false) {
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
    this.setState({ typeEvent: value });
    if (value === 0) {
      //Evento Público con Registro
      this.setState({ event: { ...this.state.event, visibility: 'PUBLIC', allow_register: true } });
    } else if (value === 1) {
      //Evento Público sin Registro
      this.setState({ event: { ...this.state.event, visibility: 'PUBLIC', allow_register: false } });
    } else {
      //Evento Privado con Invitación
      this.setState({ event: { ...this.state.event, visibility: 'PRIVATE', allow_register: false } });
    }
  };

  render() {
    if (this.state.loading) return <Loading />;
    const {
      event,
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
    } = this.state;
    return (
      <React.Fragment>
        <Form onFinish={this.submit} {...formLayout}>
          <Header title={'Datos del evento'} save form remove={this.deleteEvent} edit={this.state.event._id} />
          <Tabs defaultActiveKey='1'>
            <Tabs.TabPane tab='General' key='1'>
              <Row justify='center' wrap gutter={[8, 8]}>
                <Col span={16}>
                  <Form.Item
                    label={
                      <label style={{ marginTop: '2%' }}>
                        Nombre <label style={{ color: 'red' }}>*</label>
                      </label>
                    }
                    rules={[{ required: true, message: 'El nombre es requerido' }]}>
                    <Input
                      name={'name'}
                      placeholder={'Nombre del evento'}
                      value={event.name}
                      onChange={(e) => this.handleChange(e, 'name')}
                    />
                  </Form.Item>

                  {event.app_configuration && (
                    <Form.Item label={'¿Qué módulo desea observar en el inicio?'}>
                      <Select
                        name={'homeSelectedScreen'}
                        value={event.homeSelectedScreen}
                        onChange={(e) => this.handleChange(e, 'homeSelectedScreen')}>
                        <Option value={null}>Banner de inicio</Option>
                        <Option
                          value={
                            event.app_configuration.ProfileScreen ? event.app_configuration.ProfileScreen.name : ''
                          }>
                          {event.app_configuration.ProfileScreen
                            ? event.app_configuration.ProfileScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                        <Option
                          value={
                            event.app_configuration.CalendarScreen ? event.app_configuration.CalendarScreen.name : ''
                          }>
                          {event.app_configuration.CalendarScreen
                            ? event.app_configuration.CalendarScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                        <Option
                          value={event.app_configuration.NewsScreen ? event.app_configuration.NewsScreen.name : ''}>
                          {event.app_configuration.NewsScreen
                            ? event.app_configuration.NewsScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                        <Option
                          value={
                            event.app_configuration.EventPlaceScreen
                              ? event.app_configuration.EventPlaceScreen.name
                              : ''
                          }>
                          {event.app_configuration.EventPlaceScreen
                            ? event.app_configuration.EventPlaceScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                        <Option
                          value={
                            event.app_configuration.SpeakerScreen ? event.app_configuration.SpeakerScreen.name : ''
                          }>
                          {event.app_configuration.SpeakerScreen
                            ? event.app_configuration.SpeakerScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                        <Option
                          value={event.app_configuration.SurveyScreen ? event.app_configuration.SurveyScreen.name : ''}>
                          {event.app_configuration.SurveyScreen
                            ? event.app_configuration.SurveyScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                        <Option
                          value={
                            event.app_configuration.DocumentsScreen ? event.app_configuration.DocumentsScreen.name : ''
                          }>
                          {event.app_configuration.DocumentsScreen
                            ? event.app_configuration.DocumentsScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                        <Option
                          value={event.app_configuration.WallScreen ? event.app_configuration.WallScreen.name : ''}>
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
                          value={event.app_configuration.FaqsScreen ? event.app_configuration.FaqsScreen.name : ''}>
                          {event.app_configuration.FaqsScreen
                            ? event.app_configuration.FaqsScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                      </Select>
                    </Form.Item>
                  )}

                  <Form.Item label={'Tipo de evento'}>
                    <Select
                      value={event.type_event}
                      name={'type_event'}
                      onChange={(e) => this.handleChange(e, 'type_event')}>
                      <Option value=''>Seleccionar...</Option>
                      <Option value='physicalEvent'>Evento físico</Option>
                      <Option value='onlineEvent'>Evento virtual</Option>
                    </Select>
                  </Form.Item>

                  {/* {event.type_event === 'onlineEvent' && (
                    <Form.Item label={'Plataforma Streaming del evento'}>
                      <Select
                        defaultValue={event.event_platform}
                        name={'event_platform'}
                        onChange={(e) => this.handleChange(e, 'event_platform')}>
                        <Option value="">Seleccionar...</Option>
                        <Option value='zoom'>Zoom</Option>
                        <Option value='zoomExterno'>ZoomExterno</Option>
                        <Option value='vimeo'>Vimeo</Option>
                        <Option value='bigmarker'>BigMaker</Option>
                      </Select>
                    </Form.Item>
                  )} */}

                  {event.type_event === 'physicalEvent' && (
                    <>
                      <Form.Item label={'Dirección'}>
                        <Input
                          name={'address'}
                          placeholder={'¿Cuál es la dirección del evento?'}
                          value={event.address}
                          onChange={(e) => this.handleChange(e, 'address')}
                        />
                      </Form.Item>

                      <Form.Item label={'Lugar'}>
                        <Input
                          name={'venue'}
                          placeholder={'Nombre del lugar del evento'}
                          value={event.venue}
                          onChange={(e) => this.handleChange(e, 'venue')}
                        />
                      </Form.Item>
                    </>
                  )}

                  <Form.Item label={'Especificar fechas'}>
                    <Switch defaultChecked onChange={this.specificDates} checked={specificDates} />
                  </Form.Item>

                  {specificDates === false ? (
                    <div>
                      <Row gutter={[8, 8]}>
                        <Col span={12}>
                          <Form.Item label={'Fecha Inicio'}>
                            <DateTimePicker
                              value={event.date_start}
                              format={'DD/MM/YYYY'}
                              time={false}
                              onChange={(value) => this.changeDate(value, 'date_start')}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label={'Hora Inicio'}>
                            <DateTimePicker
                              value={event.hour_start}
                              step={60}
                              date={false}
                              onChange={(value) => this.changeDate(value, 'hour_start')}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={[8, 8]}>
                        <Col span={12}>
                          <Form.Item label={'Fecha Fin'}>
                            <DateTimePicker
                              value={event.date_end}
                              min={this.minDate}
                              format={'DD/MM/YYYY'}
                              time={false}
                              onChange={(value) => this.changeDate(value, 'date_end')}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label={'Hora Fin'}>
                            <DateTimePicker
                              value={event.hour_end}
                              step={60}
                              date={false}
                              onChange={(value) => this.changeDate(value, 'hour_end')}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  ) : (
                    <DateEvent eventId={this.props.event._id} updateEvent={this.props.updateEvent} />
                  )}

                  {/* <Form.Item label={'Idioma del evento'}>
                    <Select value={event.language} name={'language'} onChange={(e) => this.handleChange(e, 'language')}>
                      <option value='es'>Español</option>
                      <option value='en'>English</option>
                      <option value='pt'>Portuguese</option>
                    </Select>
                  </Form.Item> */}

                  <Form.Item label={'Descripción'}>
                    <EviusReactQuill name={'description'} data={event.description} handleChange={this.chgTxt} />
                  </Form.Item>

                  <Form.Item>
                    <SelectInput
                      name={'Organizado por:'}
                      isMulti={false}
                      selectedOptions={selectedOrganizer}
                      selectOption={this.selectOrganizer}
                      options={organizers}
                      required={true}
                    />
                  </Form.Item>

                  <div>
                    <label style={{ marginTop: '2%' }}>Imagen General (para el listado)</label>
                    <ImageInput
                      picture={event.picture}
                      imageFile={this.state.imageFile}
                      divClass={'drop-img'}
                      content={<img src={event.picture} alt={'Imagen Perfil'} />}
                      classDrop={'dropzone'}
                      contentDrop={
                        <Button
                          type='primary'
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                          /* loading={this.state.imageFile} */
                        >
                          Cambiar foto
                        </Button>
                      }
                      contentZone={
                        <div className='has-text-grey has-text-weight-bold has-text-centered'>
                          <span>Subir foto</span>
                          <br />
                          <small>(Tamaño recomendado: 1280px x 960px)</small>
                        </div>
                      }
                      changeImg={this.changeImg}
                      errImg={this.state.errImg}
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        height: 250,
                        width: '100%',
                        borderWidth: 2,
                        borderColor: '#b5b5b5',
                        borderStyle: 'dashed',
                        borderRadius: 10,
                      }}
                    />
                    {this.state.fileMsg && <p className='help is-success'>{this.state.fileMsg}</p>}
                  </div>

                  <Form.Item label={'Vídeo'}>
                    <Input
                      name={'video'}
                      placeholder={'¿El evento tiene video promocional?'}
                      value={event.video}
                      onChange={(e) => this.handleChange(e, 'video')}
                    />
                  </Form.Item>

                  <Form.Item label={'Posición del video'}>
                    <Switch
                      name={'video_position'}
                      checked={event.video_position === true || event.video_position === 'true'}
                      checkedChildren='Arriba'
                      unCheckedChildren='Abajo'
                      onChange={(checked) =>
                        this.setState({ event: { ...this.state.event, video_position: checked ? 'true' : 'false' } })
                      }
                    />
                  </Form.Item>

                  <Form.Item>
                    <SelectInput
                      name={'Categorías:'}
                      isMulti={true}
                      max_options={2}
                      selectedOptions={selectedCategories}
                      selectOption={this.selectCategory}
                      options={categories}
                      /* required={true} */
                    />
                  </Form.Item>

                  <Form.Item>
                    <SelectInput
                      name={'Tipo'}
                      isMulti={false}
                      selectedOptions={selectedType}
                      selectOption={this.selectType}
                      options={types}
                      /* required={true} */
                    />
                  </Form.Item>

                  <Form.Item label={'Id Google Analytics'}>
                    <Input
                      name={'googleanlyticsid'}
                      placeholder={'UA-XXXXXX-X | G-XXXXXX'}
                      value={event.googleanlyticsid}
                      onChange={this.googleanlyticsid}
                    />
                  </Form.Item>

                  <Form.Item label={'Id Google Tag Manager'}>
                    <Input
                      name={'googletagmanagerid'}
                      placeholder={'GTM-XXXXXX'}
                      value={event.googletagmanagerid}
                      onChange={this.googletagmanagerid}
                    />
                  </Form.Item>

                  <Form.Item label={'Id Facebook Pixel'}>
                    <Input
                      name={'facebookpixelid'}
                      placeholder='014180041516129'
                      value={event.facebookpixelid}
                      onChange={this.facebookpixelid}
                    />
                  </Form.Item>

                  <Card title='Zona Social'>
                    <Row style={{ padding: '8px 0px' }}>
                      <Col xs={18}>Chat General</Col>
                      <Col xs={6}>
                        <Switch
                          checked={this.state?.tabs?.publicChat}
                          onChange={(checked) =>
                            this.setState(
                              { tabs: { ...this.state.tabs, publicChat: checked } },
                              async () => await this.upsertTabs()
                            )
                          }
                        />
                      </Col>
                    </Row>
                    <Row style={{ padding: '8px 0px' }}>
                      <Col xs={18}>Chat Privado</Col>
                      <Col xs={6}>
                        <Switch
                          checked={this.state?.tabs?.privateChat}
                          onChange={(checked) =>
                            this.setState(
                              { tabs: { ...this.state.tabs, privateChat: checked } },
                              async () => await this.upsertTabs()
                            )
                          }
                        />
                      </Col>
                    </Row>
                    <Row style={{ padding: '8px 0px' }}>
                      <Col xs={18}>Asistentes</Col>
                      <Col xs={6}>
                        <Switch
                          checked={this.state?.tabs?.attendees}
                          onChange={(checked) =>
                            this.setState(
                              { tabs: { ...this.state.tabs, attendees: checked } },
                              async () => await this.upsertTabs()
                            )
                          }
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <BackTop />
            </Tabs.TabPane>
            <Tabs.TabPane tab='Tipos de acceso' key='2'>
              <Row justify='center' wrap gutter={[8, 8]}>
                <Col span={16}>
                  <Form.Item label={''}>
                    <Row gutter={[16, 16]} wrap>
                      <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                        <Badge
                          count={
                            this.state.typeEvent === 0 ? (
                              <CheckCircleFilled style={{ fontSize: '25px', color: '#3CC4B9' }} />
                            ) : (
                              ''
                            )
                          }>
                          <div
                            onClick={() => this.changetypeEvent(0)}
                            style={{
                              border: '1px solid #D3D3D3',
                              borderRadius: '5px',
                              padding: '10px',
                              cursor: 'pointer',
                              minHeight: '170px',
                            }}>
                            <Space direction='vertical'>
                              <Text strong>Evento Público con Registro</Text>
                              <Divider />
                              <Text type='secondary'>
                                <ul>
                                  <li>Tiene registro para todos.</li>
                                  <br />
                                  <li>Tiene inicio de sesión para todos.</li>
                                </ul>
                              </Text>
                            </Space>
                          </div>
                        </Badge>
                      </Col>
                      <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                        <Badge
                          count={
                            this.state.typeEvent === 1 ? (
                              <CheckCircleFilled style={{ fontSize: '25px', color: '#3CC4B9' }} />
                            ) : (
                              ''
                            )
                          }>
                          <div
                            /* className='cards-type-information'  */
                            onClick={() => this.changetypeEvent(1)}
                            style={{
                              border: '1px solid #D3D3D3',
                              borderRadius: '5px',
                              padding: '10px',
                              cursor: 'pointer',
                              minHeight: '170px',
                            }}>
                            <Space direction='vertical'>
                              <Text strong>Evento Público sin Registro</Text>
                              <Divider />
                              <Text type='secondary'>
                                {/* Solo se mostrará el inicio de sesión. Quedará como anónimo */}
                                <ul>
                                  <li>Quedará como anónimo.</li>
                                  <br />
                                  <li>No tendrá inicio de sesión ni registro.</li>
                                </ul>
                              </Text>
                            </Space>
                          </div>
                        </Badge>
                      </Col>
                      <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                        <Badge
                          count={
                            this.state.typeEvent === 2 ? (
                              <CheckCircleFilled style={{ fontSize: '25px', color: '#3CC4B9' }} />
                            ) : (
                              ''
                            )
                          }>
                          <div
                            /* className='cards-type-information'  */
                            onClick={() => this.changetypeEvent(2)}
                            style={{
                              border: '1px solid #D3D3D3',
                              borderRadius: '5px',
                              padding: '10px',
                              cursor: 'pointer',
                              minHeight: '170px',
                            }}>
                            <Space direction='vertical'>
                              <Text strong>Evento Privado por invitación</Text>
                              <Divider />
                              <Text type='secondary'>
                                {/* Solo se podra acceder por invitación. No tendra inicio de sesión ni registro */}
                                <ul>
                                  <li>Sólo se podrá acceder por invitación.</li>
                                  <br />
                                  <li>Sólo se mostrará el inicio de sesión.</li>
                                </ul>
                              </Text>
                            </Space>
                          </div>
                        </Badge>
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>
          </Tabs>
          {serverError && <ErrorServe errorData={errorData} />}
          {this.state.fileMsgBanner && <p className='help is-success'>{this.state.fileMsgBanner}</p>}
        </Form>
      </React.Fragment>
    );
  }
}

//Función para organizar las opciones de las listas desplegables (Organizado,Tipo,Categoría)
function handleFields(organizers, types, categories, event) {
  let selectedCategories = [];
  let selectedType = {};
  const { category_ids, organizer_id, event_type_id } = event;
  if (category_ids) {
    categories.map((item) => {
      let pos = category_ids.indexOf(item.value);
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
