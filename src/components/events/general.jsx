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
import Dialog from '../modal/twoAction';
import { FormattedMessage, injectIntl } from 'react-intl';
import LogOut from '../shared/logOut';
import axios from 'axios/index';
import { DateTimePicker } from 'react-widgets';
import SelectInput from '../shared/selectInput';
import Loading from '../loaders/loading';
import DateEvent from './dateEvent';
import { Switch, Card, Row, Col, message, Tabs, Checkbox, Typography, Input, Select, Modal, Form, InputNumber } from 'antd';
import { firestore } from '../../helpers/firebase';
import Header from '../../antdComponents/Header';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { handleRequestError } from '../../helpers/utils';

Moment.locale('es');
const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

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
  handleChange = (e, name) => {
    console.log(e, e.target, '1')
    let value = e;
    if(e.target) {
      value = e.target;
      if(e.target.value) {
        value = e.target.value;
      }
    }
    console.log(name, value, '2');

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
  async submit() {
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
    const loading = message.open({
      key: 'loading',
      type: 'loading',
      content: <> Por favor espere miestras borra la información..</>,
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
            /* await EventsApi.deleteOne(this.state.event._id); */
            message.destroy(loading.key);
            message.open({
              type: 'success',
              content: <> Se eliminó la información correctamente!</>,
            });
            window.location.replace(`${BaseUrl}/myprofile`);
          } catch (e) {
            message.destroy(loading.key);
            message.open({
              type: 'error',
              content: handleRequestError(e).message,
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
        <Form
          onFinish={this.submit}
          {...formLayout}
        >
          <Header title={'Datos del evento'} save form remove={this.deleteEvent} edit={this.state.event._id} />
          <Tabs defaultActiveKey='1'>
            <Tabs.TabPane tab='General' key='1'>
              <Row justify='center' wrap gutter={[8, 8]}>
                <Col span={16}>
                  <Form.Item label={'Nombre'} >
                    <Input
                      name={'name'}
                      placeholder={'Nombre del evento'}
                      value={event.name}
                      onChange={(e) => this.handleChange(e, 'name')}
                    />
                  </Form.Item>

                  {event.app_configuration && (
                    <Form.Item label={'Que modulo desea observar en el inicio'}>
                      <Select name={'homeSelectedScreen'} value={event.homeSelectedScreen} onChange={(e) => this.handleChange(e, 'homeSelectedScreen')}>
                        <Option value={null}>Banner de inicio</Option>
                        <Option
                          value={
                            event.app_configuration.ProfileScreen ? event.app_configuration.ProfileScreen.name : ''
                          }>
                          {event.app_configuration.ProfileScreen
                            ? event.app_configuration.ProfileScreen.title
                            : 'Favor Seleccionar items del menu para la '}
                        </Option>
                        <Option
                          value={
                            event.app_configuration.CalendarScreen ? event.app_configuration.CalendarScreen.name : ''
                          }>
                          {event.app_configuration.CalendarScreen
                            ? event.app_configuration.CalendarScreen.title
                            : 'Favor Seleccionar items del menu para la '}
                        </Option>
                        <Option
                          value={event.app_configuration.NewsScreen ? event.app_configuration.NewsScreen.name : ''}>
                          {event.app_configuration.NewsScreen
                            ? event.app_configuration.NewsScreen.title
                            : 'Favor Seleccionar items del menu para la '}
                        </Option>
                        <Option
                          value={
                            event.app_configuration.EventPlaceScreen
                              ? event.app_configuration.EventPlaceScreen.name
                              : ''
                          }>
                          {event.app_configuration.EventPlaceScreen
                            ? event.app_configuration.EventPlaceScreen.title
                            : 'Favor Seleccionar items del menu para la '}
                        </Option>
                        <Option
                          value={
                            event.app_configuration.SpeakerScreen ? event.app_configuration.SpeakerScreen.name : ''
                          }>
                          {event.app_configuration.SpeakerScreen
                            ? event.app_configuration.SpeakerScreen.title
                            : 'Favor Seleccionar items del menu para la '}
                        </Option>
                        <Option
                          value={event.app_configuration.SurveyScreen ? event.app_configuration.SurveyScreen.name : ''}>
                          {event.app_configuration.SurveyScreen
                            ? event.app_configuration.SurveyScreen.title
                            : 'Favor Seleccionar items del menu para la '}
                        </Option>
                        <Option
                          value={
                            event.app_configuration.DocumentsScreen ? event.app_configuration.DocumentsScreen.name : ''
                          }>
                          {event.app_configuration.DocumentsScreen
                            ? event.app_configuration.DocumentsScreen.title
                            : 'Favor Seleccionar items del menu para la '}
                        </Option>
                        <Option
                          value={event.app_configuration.WallScreen ? event.app_configuration.WallScreen.name : ''}>
                          {event.app_configuration.WallScreen
                            ? event.app_configuration.WallScreen.title
                            : 'Favor Seleccionar items del menu para la '}
                        </Option>
                        <Option value={event.app_configuration.WebScreen ? event.app_configuration.WebScreen.name : ''}>
                          {event.app_configuration.WebScreen
                            ? event.app_configuration.WebScreen.title
                            : 'Favor Seleccionar items del menu para la '}
                        </Option>
                        <Option
                          value={event.app_configuration.FaqsScreen ? event.app_configuration.FaqsScreen.name : ''}>
                          {event.app_configuration.FaqsScreen
                            ? event.app_configuration.FaqsScreen.title
                            : 'Favor Seleccionar items del menu para la '}
                        </Option>
                      </Select>
                    </Form.Item>
                  )}

                  <Form.Item label={'Tipo de evento'}>
                    <Select value={event.type_event} name={'type_event'} onChange={(e) => this.handleChange(e, 'type_event')}>
                      <Option value=''>Seleccionar...</Option>
                      <Option value='physicalEvent'>Evento Fisico</Option>
                      <Option value='onlineEvent'>Evento Virtual</Option>
                    </Select>
                  </Form.Item>

                  {event.type_event === 'onlineEvent' && (
                    <Form.Item label={'Plataforma Streaming del evento'}>
                      <Select defaultValue={event.event_platform} name={'event_platform'} onChange={(e) => this.handleChange(e, 'event_platform')}>
                        {/* <Option value="">Seleccionar...</Option> */}
                        <Option value='zoom'>Zoom</Option>
                        <Option value='zoomExterno'>ZoomExterno</Option>
                        <Option value='vimeo'>Vimeo</Option>
                        <Option value='bigmarker'>BigMaker</Option>
                      </Select>
                    </Form.Item>
                  )}

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

                  <Form.Item label={'Idioma del evento'}>
                    <Select value={event.language} name={'language'} onChange={(e) => this.handleChange(e, 'language')}>
                      <option value='es'>Español</option>
                      <option value='en'>English</option>
                      <option value='pt'>Portuguese</option>
                    </Select>
                  </Form.Item>

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
                    <label style={{ marginTop: '2%' }} className='label'>
                      Imagen General (para el listado)
                    </label>
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
                      required={true}
                    />
                  </Form.Item>

                  <Form.Item>
                    <SelectInput
                      name={'Tipo'}
                      isMulti={false}
                      selectedOptions={selectedType}
                      selectOption={this.selectType}
                      options={types}
                      required={true}
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
            </Tabs.TabPane>
            <Tabs.TabPane tab='Avanzado' key='2'>
              <Row justify='center' wrap gutter={[8, 8]}>
                <Col span={16}>
                  <Form.Item label={'Habilitar formulario de registro'}>
                    <Checkbox
                      defaultChecked={event.allow_register || event.allow_register === 'true'}
                      onChange={(e) => this.handleChange(e, 'allow_register')}
                      name={'allow_register'}
                    />
                  </Form.Item>
                  {(event.allow_register || event.allow_register === 'true') && (
                    <div>
                      <Card
                        title={<Title level={4}>{registerForm.name}</Title>}
                        bordered={true}
                        /* style={{ width: 300, marginTop: '2%' }} */>
                        {/* <div style={{ marginBottom: '3%' }}></div> */}

                        <Form.Item label={'Cambiar nombre de la sección'}>
                          <Input
                            defaultValue={registerForm.name}
                            onChange={(e) => {
                              this.setState({ registerForm: { ...registerForm, name: e.target.value } });
                            }}
                          />
                        </Form.Item>
                        
                        <Form.Item label={'Posición en el menú'}>
                          <InputNumber
                            /* type='number' */
                            defaultValue={registerForm.position}
                            onChange={(e) => {
                              this.setState({ registerForm: { ...registerForm, position: e.target } });
                            }}
                          />
                        </Form.Item>
                      </Card>
                    </div>
                  )}

                  <Form.Item label={'Mostrar el evento en la página principal de Evius'}>
                    <Checkbox
                      defaultChecked={event.visibility === 'PUBLIC'}
                      onChange={(e) => this.handleChange(e, 'visibility')}
                      name={'visibility'} />
                  </Form.Item>
                  
                  <Form.Item label={'El evento requiere pago'}>
                    <Checkbox
                      defaultChecked={event.has_payment || event.has_payment === 'true'}
                      onChange={(e) => this.handleChange(e, 'has_payment')}
                      name={'has_payment'} />
                  </Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>
          </Tabs>
          {timeout && <LogOut />}
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
