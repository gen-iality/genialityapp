import React, { Component } from 'react';
import Moment from 'moment';

import ImageInput from '../shared/imageInput';
import EviusReactQuill from '../shared/eviusReactQuill';
import { Actions, CategoriesApi, EventsApi, OrganizationApi, TypesApi } from '../../helpers/request';
import { BaseUrl } from '../../helpers/constants';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-widgets/lib/scss/react-widgets.scss';
import ErrorServe from '../modal/serverError';
import Dialog from '../modal/twoAction_old';
import { FormattedMessage, injectIntl } from 'react-intl';
import LogOut from '../shared/logOut';
import axios from 'axios/index';
import { DateTimePicker } from 'react-widgets';
import SelectInput from '../shared/selectInput';
import Loading from '../loaders/loading';
import DateEvent from './dateEvent';
import { Switch, Card, Row, Col, message, Tabs, Checkbox, Typography, Input } from 'antd';
import { firestore } from '../../helpers/firebase';

Moment.locale('es');
const { Title } = Typography;

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
        position: '',
        section: 'tickets',
        icon: 'CreditCardOutlined',
        checked: true,
        permissions: 'public',
      },
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
        const { status } = error.response;
        if (status === 401) this.setState({ timeout: true, loader: false });
        else this.setState({ serverError: true, loader: false });
      } else {
        this.setState({ serverError: true, loader: false, errorData: { status: 400, message: JSON.stringify(error) } });
      }
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
  handleChange = (e) => {
    let { name, value } = e.target;

    if (name === 'visibility') {
      value = e.target.checked ? 'PUBLIC' : 'ORGANIZATION';
    } else if (name === 'allow_register' || name === 'has_payment') {
      value = e.target.checked;
    }

    this.setState({ event: { ...this.state.event, [name]: value } }, this.valid);
  };
  //Validación
  valid = () => {
    const error = {};
    const { event, selectedOrganizer, selectedType, selectedCategories } = this.state;
    const valid =
      event.name !== null &&
      event.name.length > 0 &&
      !!selectedOrganizer &&
      !!selectedType &&
      selectedCategories &&
      selectedCategories.length > 0;
    if (valid) {
      this.setState({ valid: !valid, error });
    } else {
      toast.error('Hubo un error, completa los datos Obligatorios');
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

        toast.success(<FormattedMessage id='toast.img' defaultMessage='Ok!' />);
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

        toast.success(<FormattedMessage id='toast.img' defaultMessage='Ok!' />);
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
            message.success(msg);
            resolve({
              error: '',
              message: msg,
            });
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        firestore
          .collection('events')
          .doc(event._id)
          .set({ tabs: { ...tabs } })
          .then(() => {
            const msg = 'Tabs de la zona social inicializados';
            message.success(msg);
            resolve({
              error: '',
              message: msg,
            });
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
  };

  //*********** FIN FUNCIONES DEL FORMULARIO

  //Envío de datos
  async submit(e) {
    e.preventDefault();
    e.stopPropagation();

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
      allow_register: event.allow_register === 'true' || event.allow_register === true ? true : false,
      allow_detail_calendar:
        event.allow_detail_calendar === 'true' || event.allow_detail_calendar === true ? true : false,
      enable_language: event.enable_language === 'true' || event.enable_language === true ? true : false,
      homeSelectedScreen: event.homeSelectedScreen,
      visibility: event.visibility ? event.visibility : 'ORGANIZATION',
      description: event.description,
      category_ids: categories,
      organizer_id:
        this.state.selectedOrganizer && this.state.selectedOrganizer.value ? this.state.selectedOrganizer.value : null,
      event_type_id: this.state.selectedType.value,
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
      itemsMenu:
        event.allow_register === 'true' || event.allow_register === true
          ? { ...this.state.itemsMenu, tickets: this.state.registerForm }
          : { ...this.state.itemsMenu },
    };

    try {
      if (event._id) {
        const info = await EventsApi.editOne(data, event._id);
        this.props.updateEvent(info);
        self.setState({ loading: false });
        toast.success(<FormattedMessage id='toast.success' defaultMessage='Ok!' />);
      } else {
        const result = await Actions.create('/api/events', data);
        this.setState({ loading: false });
        if (result._id) {
          window.location.replace(`${BaseUrl}/event/${result._id}`);
        } else {
          toast.warn(<FormattedMessage id='toast.warning' defaultMessage='Idk' />);
          this.setState({ msg: 'Cant Create', create: false });
        }
      }
    } catch (error) {
      toast.error(<FormattedMessage id='toast.error' defaultMessage='Sry :(' />);
      if (error.response) {
        console.error(error.response);
        const { status, data } = error.response;
        console.error('STATUS', status, status === 401);
        if (status === 401) this.setState({ timeout: true, loader: false });
        else this.setState({ serverError: true, loader: false, errorData: data });
      } else {
        let errorData = error.message;
        console.error('Error', error.message);
        if (error.request) {
          console.error(error.request);
          errorData = error.request;
        }
        errorData.status = 708;
        this.setState({ serverError: true, loader: false, errorData });
      }
      console.error(error.config);
    }
  }
  //Delete event
  async deleteEvent() {
    this.setState({ isLoading: 'Cargando....' });
    try {
      await EventsApi.deleteOne(this.state.event._id);
      this.setState({
        message: { ...this.state.message, class: 'msg_success', content: 'Evento borrado' },
        isLoading: false,
      });
      setTimeout(() => {
        this.setState({ message: {}, modal: false });
        window.location.replace(`${BaseUrl}/myprofile`);
      }, 500);
    } catch (error) {
      if (error.response) {
        console.error(error.response);
        this.setState({
          message: { ...this.state.message, class: 'msg_error', content: JSON.stringify(error.response) },
          isLoading: false,
        });
      } else if (error.request) {
        console.error(error.request);
        this.setState({ serverError: true, errorData: { message: error.request, status: 708 } });
      } else {
        console.error('Error', error.message);
        this.setState({ serverError: true, errorData: { message: error.message, status: 708 } });
      }
    }
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
      timeout,
      errorData,
      serverError,
      specificDates,
      registerForm,
    } = this.state;
    return (
      <React.Fragment>
        <div className='columns general'>
          <div className='column is-8'>
            <Tabs defaultActiveKey='1'>
              <Tabs.TabPane tab='General' key='1'>
                <h2 className='title-section'>Datos del evento</h2>
                <div className='field'>
                  <label className='label required has-text-grey-light'>Nombre</label>
                  <div className='control'>
                    <input
                      className='input'
                      name={'name'}
                      type='text'
                      placeholder='Nombre del evento'
                      value={event.name}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>

                {/* <div className="field">
                            <label className="label required has-text-grey-light">Contenido de administrador</label>
                            <div className="control">
                                <input className="input" name={"adminContenido"} type="text"
                                    placeholder="Contenido Administrador" value={event.adminContenido}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div> */}

                {/* <div className="field">
                            <label className="label required">Desea mantener activa las fechas ?</label>
                            <div className="select is-primary">
                                <select name={"has_date"} value={event.has_date} defaultValue={event.has_date} onChange={this.handleChange}>
                                    <option>Seleccionar...</option>
                                    <option value={true}>Si</option>
                                    <option value={false}>No</option>
                                </select>
                            </div>
                        </div> */}

                {/* <div className="field">
                            <label className="label required">Desea observar el detalle de la agenda ?</label>
                            <div className="select is-primary">
                                <select name={"allow_detail_calendar"} defaultValue={event.allow_detail_calendar} value={event.allow_detail_calendar} onChange={this.handleChange}>
                                    <option>Seleccionar...</option>
                                    <option value={true}>Si</option>
                                    <option value={false}>No</option>
                                </select>
                            </div>
                        </div> */}

                {/* <div className="field">
                            <label className="label required">Desea Habilitar la traducción del lenguaje en el aplicativo</label>
                            <div className="select is-primary">
                                <select name={"enable_language"} defaultValue={event.enable_language} value={event.enable_language} onChange={this.handleChange}>
                                    <option>Seleccionar...</option>
                                    <option value={true}>Si</option>
                                    <option value={false}>No</option>
                                </select>
                            </div>
                        </div> */}
                {event.app_configuration ? (
                  <div className='field'>
                    <label className='label'>Que modulo desea observar en el inicio</label>
                    <div className='select is-primary'>
                      <select name='homeSelectedScreen' value={event.homeSelectedScreen} onChange={this.handleChange}>
                        <option value={null}>Banner de inicio</option>
                        <option
                          value={
                            event.app_configuration.ProfileScreen ? event.app_configuration.ProfileScreen.name : ''
                          }>
                          {event.app_configuration.ProfileScreen
                            ? event.app_configuration.ProfileScreen.title
                            : 'Favor Seleccionar items del menu para la '}
                        </option>
                        <option
                          value={
                            event.app_configuration.CalendarScreen ? event.app_configuration.CalendarScreen.name : ''
                          }>
                          {event.app_configuration.CalendarScreen
                            ? event.app_configuration.CalendarScreen.title
                            : 'Favor Seleccionar items del menu para la '}
                        </option>
                        <option
                          value={event.app_configuration.NewsScreen ? event.app_configuration.NewsScreen.name : ''}>
                          {event.app_configuration.NewsScreen
                            ? event.app_configuration.NewsScreen.title
                            : 'Favor Seleccionar items del menu para la '}
                        </option>
                        <option
                          value={
                            event.app_configuration.EventPlaceScreen
                              ? event.app_configuration.EventPlaceScreen.name
                              : ''
                          }>
                          {event.app_configuration.EventPlaceScreen
                            ? event.app_configuration.EventPlaceScreen.title
                            : 'Favor Seleccionar items del menu para la '}
                        </option>
                        <option
                          value={
                            event.app_configuration.SpeakerScreen ? event.app_configuration.SpeakerScreen.name : ''
                          }>
                          {event.app_configuration.SpeakerScreen
                            ? event.app_configuration.SpeakerScreen.title
                            : 'Favor Seleccionar items del menu para la '}
                        </option>
                        <option
                          value={event.app_configuration.SurveyScreen ? event.app_configuration.SurveyScreen.name : ''}>
                          {event.app_configuration.SurveyScreen
                            ? event.app_configuration.SurveyScreen.title
                            : 'Favor Seleccionar items del menu para la '}
                        </option>
                        <option
                          value={
                            event.app_configuration.DocumentsScreen ? event.app_configuration.DocumentsScreen.name : ''
                          }>
                          {event.app_configuration.DocumentsScreen
                            ? event.app_configuration.DocumentsScreen.title
                            : 'Favor Seleccionar items del menu para la '}
                        </option>
                        <option
                          value={event.app_configuration.WallScreen ? event.app_configuration.WallScreen.name : ''}>
                          {event.app_configuration.WallScreen
                            ? event.app_configuration.WallScreen.title
                            : 'Favor Seleccionar items del menu para la '}
                        </option>
                        <option value={event.app_configuration.WebScreen ? event.app_configuration.WebScreen.name : ''}>
                          {event.app_configuration.WebScreen
                            ? event.app_configuration.WebScreen.title
                            : 'Favor Seleccionar items del menu para la '}
                        </option>
                        <option
                          value={event.app_configuration.FaqsScreen ? event.app_configuration.FaqsScreen.name : ''}>
                          {event.app_configuration.FaqsScreen
                            ? event.app_configuration.FaqsScreen.title
                            : 'Favor Seleccionar items del menu para la '}
                        </option>
                      </select>
                    </div>
                  </div>
                ) : (
                  '   '
                )}
                <div>
                  <label className='label'>Tipo de evento</label>
                  <div className='select is-primary'>
                    <select value={event.type_event} name='type_event' onChange={this.handleChange}>
                      <option value=''>Seleccionar...</option>
                      <option value='physicalEvent'>Evento Fisico</option>
                      <option value='onlineEvent'>Evento Virtual</option>
                    </select>
                  </div>
                </div>

                {event.type_event === 'onlineEvent' && (
                  <div>
                    <label className='label'>Plataforma Streaming del evento</label>
                    <div className='select is-primary'>
                      <select defaultValue={event.event_platform} name='event_platform' onChange={this.handleChange}>
                        {/* <option value="">Seleccionar...</option> */}
                        <option value='zoom'>Zoom</option>
                        <option value='zoomExterno'>ZoomExterno</option>
                        <option value='vimeo'>Vimeo</option>
                        <option value='bigmarker'>BigMaker</option>
                      </select>
                    </div>
                  </div>
                )}
                {event.type_event === 'physicalEvent' && (
                  <>
                    <div className='field'>
                      <label className='label has-text-grey-light'>Dirección</label>
                      <div className='control'>
                        <input
                          className='input'
                          name={'address'}
                          type='text'
                          placeholder='¿Cuál es la dirección del evento?'
                          value={event.address}
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>

                    <div className='field'>
                      <label className='label has-text-grey-light'>Lugar</label>
                      <div className='control'>
                        <input
                          className='input'
                          name={'venue'}
                          type='text'
                          placeholder='Nombre del lugar del evento'
                          value={event.venue}
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* <div className="field">
                            <label className="label required has-text-grey-light">Id Analiticas</label>
                            <div className="control">
                                <input className="input" name={"analytics"} type="text"
                                    placeholder="Id analiticas" value={event.analytics}
                                    onChange={this.handleChange} />
                            </div>
                        </div> */}

                {/* <div className="field">
                            <label className="label required has-text-grey-light">link de banner externo</label>
                            <div className="control">
                                <input className="input" name={"banner_image_link"} type="text"
                                    placeholder="Link de banner externo" value={event.banner_image_link}
                                    onChange={this.handleChange} />
                            </div>
                        </div> */}
                <div>
                  <label className='label has-text-grey-light' style={{ marginRight: '3%' }}>
                    Especificar fechas
                  </label>
                  <Switch defaultChecked onChange={this.specificDates} checked={specificDates} />
                </div>

                {specificDates === false ? (
                  <div>
                    <div className='field'>
                      <div className='columns is-mobile'>
                        <div className='column inner-column'>
                          <div className='field'>
                            <label className='label has-text-grey-light'>Fecha Inicio</label>
                            <div className='control'>
                              <DateTimePicker
                                value={event.date_start}
                                format={'DD/MM/YYYY'}
                                time={false}
                                onChange={(value) => this.changeDate(value, 'date_start')}
                              />
                            </div>
                          </div>
                        </div>
                        <div className='column inner-column'>
                          <div className='field'>
                            <label className='label has-text-grey-light'>Hora Inicio</label>
                            <div className='control'>
                              <DateTimePicker
                                value={event.hour_start}
                                step={60}
                                date={false}
                                onChange={(value) => this.changeDate(value, 'hour_start')}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='field'>
                      <div className='columns is-mobile'>
                        <div className='column inner-column'>
                          <div className='field'>
                            <label className='label has-text-grey-light'>Fecha Fin</label>
                            <div className='control'>
                              <DateTimePicker
                                value={event.date_end}
                                min={this.minDate}
                                format={'DD/MM/YYYY'}
                                time={false}
                                onChange={(value) => this.changeDate(value, 'date_end')}
                              />
                            </div>
                          </div>
                        </div>
                        <div className='column inner-column'>
                          <div className='field'>
                            <label className='label has-text-grey-light'>Hora Fin</label>
                            <div className='control'>
                              <DateTimePicker
                                value={event.hour_end}
                                step={60}
                                date={false}
                                onChange={(value) => this.changeDate(value, 'hour_end')}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <DateEvent eventId={this.props.event._id} updateEvent={this.props.updateEvent} />
                )}

                <div className='field'>
                  <label className='label'>Idioma del evento</label>
                  <div className='select is-primary'>
                    <select value={event.language} name='language' onChange={this.handleChange}>
                      <option value='es'>Español</option>
                      <option value='en'>English</option>
                      <option value='pt'>Portuguese</option>
                    </select>
                  </div>
                </div>

                <div className='field'>
                  <label className='label has-text-grey-light'>Descripción</label>
                  <EviusReactQuill name='description' data={event.description} handleChange={this.chgTxt} />
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab='Avanzado' key='2'>
                <Row>
                  <Col xs={24}>
                    <Checkbox
                      defaultChecked={event.allow_register || event.allow_register === 'true'}
                      onChange={this.handleChange}
                      name='allow_register'>
                      Habilitar formulario de registro
                    </Checkbox>
                  </Col>
                </Row>
                {(event.allow_register || event.allow_register === 'true') && (
                  <Row>
                    <Col xs={24}>
                      <Card
                        title={<Title level={4}>{registerForm.name}</Title>}
                        bordered={true}
                        style={{ width: 300, marginTop: '2%' }}>
                        <div style={{ marginBottom: '3%' }}></div>

                        <div style={{ marginTop: '4%' }}>
                          <label>Cambiar nombre de la sección</label>
                          <Input
                            defaultValue={registerForm.name}
                            onChange={(e) => {
                              this.setState({ registerForm: { ...registerForm, name: e.target.value } });
                            }}
                          />
                        </div>

                        <div>
                          <label>Posición en el menú</label>
                          <Input
                            type='number'
                            defaultValue={registerForm.position}
                            onChange={(e) => {
                              this.setState({ registerForm: { ...registerForm, position: e.target.value } });
                            }}
                          />
                        </div>
                      </Card>
                    </Col>
                  </Row>
                )}

                <Row>
                  <Col xs={24}>
                    <Checkbox
                      defaultChecked={event.visibility === 'PUBLIC'}
                      onChange={this.handleChange}
                      name='visibility'>
                      Mostrar el evento en la página principal de Evius
                    </Checkbox>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24}>
                    <Checkbox
                      defaultChecked={event.has_payment || event.has_payment === 'true'}
                      onChange={this.handleChange}
                      name={'has_payment'}>
                      El evento requiere pago
                    </Checkbox>
                  </Col>
                </Row>
              </Tabs.TabPane>
            </Tabs>
          </div>
          <div className='column is-4'>
            <div className='field is-grouped'>
              {event._id && (
                <button className='button is-text' onClick={this.modalEvent}>
                  x Eliminar evento
                </button>
              )}
              <button
                onClick={this.submit}
                className={`${this.state.loading ? 'is-loading' : ''}button is-primary`}
                disabled={valid}>
                Guardar
              </button>
            </div>
            <div className='section-gray'>
              <SelectInput
                name={'Organizado por:'}
                isMulti={false}
                selectedOptions={selectedOrganizer}
                selectOption={this.selectOrganizer}
                options={organizers}
                required={true}
              />
              <div className='field picture'>
                <label className='label has-text-grey-light'>Imagen General (para el listado) </label>
                <div className='control'>
                  <ImageInput
                    picture={event.picture}
                    imageFile={this.state.imageFile}
                    divClass={'drop-img'}
                    content={<img src={event.picture} alt={'Imagen Perfil'} />}
                    classDrop={'dropzone'}
                    contentDrop={
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                        className={`button is-primary is-inverted is-outlined ${
                          this.state.imageFile ? 'is-loading' : ''
                        }`}>
                        Cambiar foto
                      </button>
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
                </div>
                {this.state.fileMsg && <p className='help is-success'>{this.state.fileMsg}</p>}
              </div>
              <div className='field'>
                <label className='label has-text-grey-light'>Video</label>
                <div className='control'>
                  <input
                    className='input'
                    name={'video'}
                    type='text'
                    placeholder='¿El evento tiene video promocional?'
                    value={event.video}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className='field'>
                <label style={{ marginTop: '3%' }} className='label has-text-grey-light'>
                  Posición del video
                </label>
                <Switch
                  name={'video_position'}
                  checked={event.video_position === true || event.video_position === 'true'}
                  checkedChildren='Arriba'
                  unCheckedChildren='Abajo'
                  onChange={(checked) =>
                    this.setState({ event: { ...this.state.event, video_position: checked ? 'true' : 'false' } })
                  }
                />
              </div>

              <SelectInput
                name={'Categorías:'}
                isMulti={true}
                max_options={2}
                selectedOptions={selectedCategories}
                selectOption={this.selectCategory}
                options={categories}
                required={true}
              />
              <SelectInput
                name={'Tipo'}
                isMulti={false}
                selectedOptions={selectedType}
                selectOption={this.selectType}
                options={types}
                required={true}
              />
              <div className='field'>
                <label className='label has-text-grey-light'>Id Google Analytics</label>
                <div className='control'>
                  <input
                    className='input'
                    name={'googleanlyticsid'}
                    type='text'
                    placeholder='UA-XXXXXX-X | G-XXXXXX'
                    value={event.googleanlyticsid}
                    onChange={this.googleanlyticsid}
                  />
                </div>
              </div>
              <div className='field'>
                <label className='label has-text-grey-light'>Id Google Tag Manager</label>
                <div className='control'>
                  <input
                    className='input'
                    name={'googletagmanagerid'}
                    type='text'
                    placeholder='GTM-XXXXXX'
                    value={event.googletagmanagerid}
                    onChange={this.googletagmanagerid}
                  />
                </div>
              </div>
              <div className='field'>
                <label className='label has-text-grey-light'>Id Facebook Pixel</label>
                <div className='control'>
                  <input
                    className='input'
                    name={'facebookpixelid'}
                    type='text'
                    placeholder='014180041516129'
                    value={event.facebookpixelid}
                    onChange={this.facebookpixelid}
                  />
                </div>
              </div>

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
            </div>
          </div>
        </div>
        {timeout && <LogOut />}
        {serverError && <ErrorServe errorData={errorData} />}
        <Dialog
          modal={this.state.modal}
          title={'Borrar Evento'}
          content={<p>¿Estas seguro de eliminar este evento?</p>}
          first={{ title: 'Borrar', class: 'is-dark has-text-danger', action: this.deleteEvent }}
          message={this.state.message}
          isLoading={this.state.isLoading}
          second={{ title: 'Cancelar', class: '', action: this.closeModal }}
        />

        {this.state.fileMsgBanner && <p className='help is-success'>{this.state.fileMsgBanner}</p>}
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
