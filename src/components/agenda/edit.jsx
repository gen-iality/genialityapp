import React, { Component, Fragment } from 'react';
import { Redirect, withRouter, Link } from 'react-router-dom';
import Moment from 'moment';
import EviusReactQuill from '../shared/eviusReactQuill';
import { DateTimePicker } from 'react-widgets';
import Select from 'react-select';
import Creatable from 'react-select';
import { FaWhmcs } from 'react-icons/fa';
import EventContent from '../events/shared/content';
import Loading from '../loaders/loading';
import { Tabs, message, Row, Col, Checkbox, Space } from 'antd';
import RoomManager from './roomManager';
import SurveyManager from './surveyManager';
import { DeleteOutlined } from '@ant-design/icons';
// En revision vista previa
//import ZoomComponent from '../events/zoomComponent';

import {
  AgendaApi,
  CategoriesAgendaApi,
  RolAttApi,
  SpacesApi,
  SpeakersApi,
  TypesAgendaApi,
  DocumentsApi,
  eventTicketsApi,
  getCurrentUser,
} from '../../helpers/request';
import { fieldsSelect, handleRequestError, handleSelect, sweetAlert, uploadImage } from '../../helpers/utils';
import Dropzone from 'react-dropzone';
import { Select as SelectAntd } from 'antd';
import 'react-tabs/style/react-tabs.css';
import AgendaLanguaje from './language/index';
import { firestore } from '../../helpers/firebase';
import SurveyExternal from './surveyExternal';
import Service from './roomManager/service';
import { Button } from 'antd';
const { TabPane } = Tabs;

class AgendaEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      // Estado para la redireccion de navegacion interna al eliminar actividad o volver al listado de actividades.
      redirect: false,
      // El id de la actividad se inicializa al crear la actividad
      activity_id: false,
      isLoading: { types: true, categories: true },
      name: '',
      subtitle: '',
      bigmaker_meeting_id: null,
      has_date: '',
      description: '',
      registration_message: '',
      date: '',
      hour_start: new Date(),
      hour_end: new Date(),
      key: new Date(),
      image: '',
      locale: 'en',
      capacity: 0,
      type_id: '',
      space_id: '',
      access_restriction_type: 'OPEN',
      selectedCategories: [],
      selectedHosts: [],
      selectedType: '',
      selectedRol: [],
      days: [],
      spaces: [],
      categories: [],
      start_url: '',
      join_url: '',
      meeting_id: '',
      documents: [],
      types: [],
      roles: [],
      hosts: [],
      selected_document: [],
      nameDocuments: [],
      tickets: [],
      selectedTicket: [],
      platform: '',
      vimeo_id: '',
      name_host: '',
      isExternal: false,
      service: new Service(firestore),
      externalSurveyID: '',

      //Estado para detectar cambios en la fecha/hora de la actividad sin guardar
      pendingChangesSave: false,

      // Fechas de la actividad con formato para la creacion de sala en zoom
      date_start_zoom: null,
      date_end_zoom: null,

      //Estado para determinar si una actividad requiere registro para ser accedida
      requires_registration: false,
    };
    this.name = React.createRef();
    this.selectTickets = this.selectTickets.bind(this);
  }

  // VALIDAR SI TIENE ENCUESTAS EXTERNAS
  validateRoom = async () => {
    const { service } = this.state;
    const hasVideoconference = await service.validateHasVideoconference(this.props.event._id, this.state.activity_id);
    if (hasVideoconference) {
      const configuration = await service.getConfiguration(this.props.event._id, this.state.activity_id);
      this.setState({
        isExternal: configuration.platform && configuration.platform === 'zoomExterno' ? true : false,
        externalSurveyID: configuration.meeting_id ? configuration.meeting_id : null,
      });
    }
  };

  toggleConference = (isVisible) => {
    this.setState({ conferenceVisible: isVisible });
  };

  async componentDidMount() {
    const {
      event,
      location: { state },
    } = this.props;
    let days = [];
    const ticketEvent = [];
    let vimeo_id = '';
    try {
      const tickets = await eventTicketsApi.getAll(event._id);
      for (let i = 0; tickets.length > i; i++) {
        ticketEvent.push({
          item: tickets[i],
          label: tickets[i].title,
          value: tickets[i]._id,
        });
      }

      vimeo_id = event.vimeo_id ? event.vimeo_id : '';
      this.setState({ tickets: ticketEvent, platform: event.event_platform, vimeo_id: vimeo_id });

      //Si existe dates, itera sobre el array de fechas especificas, dandole el formato especifico
      if (event.dates && event.dates.length > 0) {
        let date = event.dates;
        Date.parse(date);

        for (var i = 0; i < date.length; i++) {
          let formatDate = Moment(date[i], ['YYYY-MM-DD']).format('YYYY-MM-DD');
          days.push({ value: formatDate, label: formatDate });
        }
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
          days.push({ value: formatDate, label: formatDate });
        }
      }
    } catch (e) {
      console.error(e);
    }

    let documents = await DocumentsApi.byEvent(event._id);

    let nameDocuments = [];
    for (let i = 0; i < documents.length; i += 1) {
      nameDocuments.push({ ...documents[i], value: documents[i].title, label: documents[i].title });
    }
    this.setState({ nameDocuments });

    let spaces = await SpacesApi.byEvent(this.props.event._id);
    let hosts = await SpeakersApi.byEvent(this.props.event._id);

    let roles = await RolAttApi.byEvent(this.props.event._id);
    let categories = await CategoriesAgendaApi.byEvent(this.props.event._id);
    let types = await TypesAgendaApi.byEvent(this.props.event._id);

    //La información se neceista de tipo [{label,value}] para los select
    spaces = handleSelect(spaces);
    hosts = handleSelect(hosts);
    roles = handleSelect(roles);
    categories = handleSelect(categories);
    types = handleSelect(types);

    if (state.edit) {
      const info = await AgendaApi.getOne(state.edit, event._id);

      this.setState({
        selected_document: info.selected_document,
        start_url: info.start_url,
        join_url: info.join_url,
        platform: info.platform || event.event_platform,
        info: info,
        video: info.video,
        name_host: info.name_host,
        date_start_zoom: info.date_start_zoom,
        date_end_zoom: info.date_end_zoom,
        requires_registration: info.requires_registration || false,
      });

      Object.keys(this.state).map((key) => (info[key] ? this.setState({ [key]: info[key] }) : ''));
      const { date, hour_start, hour_end } = handleDate(info);

      let currentUser = await getCurrentUser();
      this.setState({
        activity_id: state.edit,
        date,
        hour_start,
        hour_end,
        selectedHosts: fieldsSelect(info.host_ids, hosts),
        selectedTickets: info.selectedTicket ? info.selectedTicket : [],
        selectedRol: fieldsSelect(info.access_restriction_rol_ids, roles),
        selectedType: fieldsSelect(info.type_id, types),
        selectedCategories: fieldsSelect(info.activity_categories_ids, categories),
        currentUser: currentUser,
      });
    } else {
      this.setState({ days });
    }

    const isLoading = { types: false, categories: false };
    this.setState({
      days,
      spaces,
      hosts,
      categories,
      types,
      roles,
      loading: false,
      isLoading,
    });

    this.name?.current?.focus();
    this.validateRoom();
  }

  //FN general para cambio en input
  handleChange = async (e) => {
    let { name, value } = e.target;

    if (name === 'requires_registration') {
      value = e.target.checked;
    }

    // BACKLOG -> porque host_id se setea siempre que se setea un estado
    this.setState({ [name]: value });
  };
  //FN para cambio en campo de fecha
  handleChangeDate = (value, name) => {
    this.setState({ [name]: value, pendingChangesSave: true });
  };
  //Cada select tiene su propia función para evitar errores y asegurar la información correcta
  selectType = (value) => {
    this.setState({ selectedType: value });
  };
  selectCategory = (selectedCategories) => {
    this.setState({ selectedCategories });
  };
  selectHost = (selectedHosts) => {
    this.setState({ selectedHosts });
  };
  selectRol = (selectedRol) => {
    this.setState({ selectedRol });
  };

  selectDocuments = (selected_document) => {
    this.setState({ selected_document });
  };
  //FN para los select que permiten crear opción
  handleCreate = async (value, name) => {
    try {
      this.setState({ isLoading: { ...this.isLoading, [name]: true } });
      //Se revisa a que ruta apuntar
      const item =
        name === 'types'
          ? await TypesAgendaApi.create(this.props.event._id, { name: value })
          : await CategoriesAgendaApi.create(this.props.event._id, { name: value });
      const newOption = { label: value, value: item._id, item };
      this.setState(
        (prevState) => ({
          isLoading: { ...prevState.isLoading, [name]: false },
          [name]: [...prevState[name], newOption],
        }),
        () => {
          if (name === 'types') this.setState({ selectedType: newOption });
          else this.setState((state) => ({ selectedCategories: [...state.selectedCategories, newOption] }));
        }
      );
    } catch (e) {
      this.setState((prevState) => ({ isLoading: { ...prevState.isLoading, [name]: false } }));
      sweetAlert.showError(handleRequestError(e));
    }
  };
  //FN manejo de imagen input, la carga al sistema y la guarda en base64
  changeImg = async (files) => {
    try {
      const file = files[0];
      if (file) {
        const image = await uploadImage(file);
        this.setState({ image });
      } else {
        this.setState({ errImg: 'Only images files allowed. Please try again :)' });
      }
    } catch (e) {
      sweetAlert.showError(handleRequestError(e));
    }
  };

  //FN para el editor enriquecido
  chgTxt = (content) => this.setState({ description: content });

  // registrationMessage = (content) => {
  //   this.setState({ registration_message: content })
  // }

  //Envío de información

  submit = async () => {
    const validation = this.validForm();
    if (validation) {
      try {
        const info = this.buildInfo();

        sweetAlert.showLoading('Espera (:', 'Guardando...');
        const {
          event,
          location: { state },
        } = this.props;
        const { selected_document } = this.state;
        this.setState({ isLoading: true });

        if (state.edit) {
          const data = {
            activity_id: state.edit,
          };
          const result = await AgendaApi.editOne(info, state.edit, event._id);

          //Se actualizan los estados date_start_zoom y date_end_zoom para que componente de administracion actualice el valor pasado por props
          this.setState({
            date_start_zoom: result.date_start_zoom,
            date_end_zoom: result.date_end_zoom,
          });

          for (let i = 0; i < selected_document.length; i++) {
            await DocumentsApi.editOne(event._id, data, selected_document[i]._id);
          }
        } else {
          const agenda = await AgendaApi.create(event._id, info);
          // Al crear una actividad de la agenda se inicializa el id de la actividad y las fechas de inicio y finalizacion como requisito del componente de administrador de salas
          this.setState({
            activity_id: agenda._id,
            date_start_zoom: agenda.date_start_zoom,
            date_end_zoom: agenda.date_end_zoom,
          });
        }

        //Se cambia el estado a pendingChangesSave encargado de detectar cambios pendientes en la fecha/hora sin guardar
        this.setState({ pendingChangesSave: false });

        sweetAlert.hideLoading();
        sweetAlert.showSuccess('Información guardada');
      } catch (e) {
        sweetAlert.showError(handleRequestError(e));
      }
    }
  };

  submit2 = async () => {
    if (this.validForm()) {
      try {
        const info = this.buildInfoLanguage();

        sweetAlert.showLoading('Espera (:', 'Guardando...');
        const {
          event,
          location: { state },
        } = this.props;
        this.setState({ isLoading: true });
        if (state.edit) await AgendaApi.editOne(info, state.edit, event._id);
        else {
          const agenda = await AgendaApi.create(event._id, info);
          this.setState({ activity_id: agenda._id });
        }
        sweetAlert.hideLoading();
        sweetAlert.showSuccess('Información guardada');
      } catch (e) {
        sweetAlert.showError(handleRequestError(e));
      }
    }
  };

  buildInfoLanguage = () => {
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
      requires_registration,
      selectedType,
      selectedRol,
      description,
      registration_message,
      selected_document,
      image,
    } = this.state;
    const datetime_start = date + ' ' + Moment(hour_start).format('HH:mm');
    const datetime_end = date + ' ' + Moment(hour_end).format('HH:mm');
    const activity_categories_ids = selectedCategories.length > 0 ? selectedCategories.map(({ value }) => value) : [];
    const access_restriction_rol_ids = access_restriction_type !== 'OPEN' ? selectedRol.map(({ value }) => value) : [];

    const type_id = selectedType.value;
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
      type_id,
      has_date,
      selected_document,
      requires_registration,
    };
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
      selectedType,
      selectedRol,
      description,
      registration_message,
      selected_document,
      image,
      meeting_id,
      video,
      selectedTicket,
      vimeo_id,
      platform,
      start_url,
      join_url,
      name_host,
      key,
      requires_registration,
    } = this.state;

    //const registration_message_storage = window.sessionStorage.getItem('registration_message');
    //const description_storage = window.sessionStorage.getItem('description');

    const datetime_start = date + ' ' + Moment(hour_start).format('HH:mm');
    const datetime_end = date + ' ' + Moment(hour_end).format('HH:mm');

    const activity_categories_ids =
      selectedCategories[0] === undefined ? [] : selectedCategories.map(({ value }) => value);

    const access_restriction_rol_ids = access_restriction_type !== 'OPEN' ? selectedRol.map(({ value }) => value) : [];
    const host_ids = selectedHosts >= 0 ? [] : selectedHosts.map(({ value }) => value);
    const type_id = selectedType === undefined ? '' : selectedType.value;
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
      type_id,
      has_date,
      timeConference: '',
      selected_document,
      meeting_id: meeting_id,
      vimeo_id: vimeo_id,
      video,
      selectedTicket,
      platform,
      start_url,
      join_url,
      name_host,
      key,
      requires_registration,
      host_ids,
    };
  };

  //FN para eliminar la actividad
  remove = async () => {
    if (this.state.activity_id) {
      if (await AgendaApi.deleteOne(this.state.activity_id, this.props.event._id)) {
        this.setState({ redirect: true });
        sweetAlert.showSuccess('Correcto', 'Actividad eliminada');
      }
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

    if (title.length > 0) {
      //   sweetAlert.twoButton(title, "warning", false, "OK", () => { });
      title.map((item) => {
        message.warning(item);
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
    this.setState({ selectedTicket: tickets });
  }

  handleChangeReactQuill = (e, label) => {
    if (label === 'description') {
      this.setState({ description: e });
    } else if (label === 'registration_message') {
      this.setState({ registration_message: e });
    }
  };

  handleVideoConference = () => {
    //Verificar si existe el campo si no se crea
  };

  render() {
    const {
      info,
      loading,
      name,
      subtitle,
      nameDocuments,
      selected_document,
      date,
      hour_start,
      hour_end,
      image,
      access_restriction_type,
      capacity,
      space_id,
      selectedRol,
      selectedHosts,
      selectedType,
      selectedCategories,
      video,
      hosts,
      spaces,
      categories,
      types,
      roles,
      isLoading,
      platform,
      date_start_zoom,
      date_end_zoom,
    } = this.state;
    const { matchUrl } = this.props;
    if (!this.props.location.state || this.state.redirect) return <Redirect to={matchUrl} />;
    return (
      <Tabs defaultActiveKey='1'>
        <TabPane tab='Agenda' key='1'>
          <EventContent title='Actividad' closeAction={this.goBack}>
            {loading ? (
              <Loading />
            ) : (
              <div className='columns'>
                <div className='column is-7'>
                  <div className='field'>
                    <label className='label required'>Nombre</label>
                    <div className='control'>
                      <input
                        ref={this.name}
                        autoFocus
                        className='input'
                        type='text'
                        name={'name'}
                        value={name}
                        onChange={this.handleChange}
                        placeholder='Nombre de handleChangela actividad'
                      />
                    </div>
                  </div>

                  <div className='field'>
                    <label className='label'>Subtítulo</label>
                    <div className='control'>
                      <input
                        className='input'
                        type='text'
                        name={'subtitle'}
                        value={subtitle}
                        onChange={this.handleChange}
                        placeholder='Ej: Salón 1, Zona Norte, Área de juegos'
                      />
                    </div>
                  </div>
                  <div className='field'>
                    <label className='label'>Día</label>

                    <SelectAntd
                      name='date'
                      options={this.state.days}
                      style={{ width: '100%' }}
                      defaultValue={date}
                      onChange={(value) => this.handleChangeDate(value, 'date')}
                    />
                  </div>
                  <div className='columns'>
                    <div className='column'>
                      <div className='field'>
                        <label className='label'>Hora Inicio</label>
                        <DateTimePicker
                          value={hour_start}
                          dropUp
                          step={15}
                          date={false}
                          onChange={(value) => this.handleChangeDate(value, 'hour_start')}
                        />
                      </div>
                    </div>

                    <div className='column'>
                      <div className='field'>
                        <label className='label'>Hora Fin</label>
                        <DateTimePicker
                          value={hour_end}
                          dropUp
                          step={15}
                          date={false}
                          onChange={(value) => this.handleChangeDate(value, 'hour_end')}
                        />
                      </div>
                    </div>
                  </div>
                  <label className='label'>Conferencista</label>
                  <div className='columns'>
                    <div className='column is-10'>
                      <Select
                        isClearable
                        isMulti
                        styles={creatableStyles}
                        onChange={this.selectHost}
                        options={hosts}
                        value={selectedHosts}
                      />
                    </div>
                    <div className='column is-2'>
                      <button
                        onClick={() => this.goSection(matchUrl.replace('agenda', 'speakers'), { child: true })}
                        className='button'>
                        <FaWhmcs />
                      </button>
                    </div>
                  </div>
                  <label className='label'>Espacio</label>
                  <div className='field has-addons'>
                    <div className='control'>
                      <div className='select'>
                        <select name={'space_id'} value={space_id} onChange={this.handleChange}>
                          <option value={''}>Seleccione un lugar/salón ...</option>
                          {spaces.map((space) => {
                            return (
                              <option key={space.value} value={space.value}>
                                {space.label}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <div className='control'>
                      <Link to={matchUrl.replace('agenda', 'espacios')}>
                        <button className='button'>
                          <FaWhmcs />
                        </button>
                      </Link>
                    </div>
                  </div>
                  <div className='field'>
                    <label className={`label`}>Clasificar actividad como:</label>
                    <div className='control'>
                      <input
                        type='radio'
                        id={'radioOpen'}
                        name='access_restriction_type'
                        checked={access_restriction_type === 'OPEN'}
                        className='is-checkradio'
                        value={'OPEN'}
                        onChange={this.handleChange}
                      />
                      <label htmlFor={'radioOpen'}>
                        <strong>ABIERTA</strong>: Todos los asistentes (roles) pueden participar en la actividad
                      </label>
                    </div>
                    <div className='control'>
                      <input
                        type='radio'
                        id={'radioSuggested'}
                        name='access_restriction_type'
                        checked={access_restriction_type === 'SUGGESTED'}
                        className='is-checkradio'
                        value={'SUGGESTED'}
                        onChange={this.handleChange}
                      />
                      <label htmlFor={'radioSuggested'}>
                        <strong>RECOMENDADA</strong>: Actividad sugerida para algunos asistentes (roles)
                      </label>
                    </div>
                    <div className='control'>
                      <input
                        type='radio'
                        id={'radioExclusive'}
                        name='access_restriction_type'
                        checked={access_restriction_type === 'EXCLUSIVE'}
                        className='is-checkradio'
                        value={'EXCLUSIVE'}
                        onChange={this.handleChange}
                      />
                      <label htmlFor={'radioExclusive'}>
                        <strong>EXCLUSIVA</strong>: Solo algunos asistentes (roles) pueden participar en la actividad
                      </label>
                    </div>
                  </div>
                  {access_restriction_type !== 'OPEN' && (
                    <Fragment>
                      <div style={{ display: 'flex' }}>
                        <label className='label required'>Asginar a :</label>
                        <button className='button is-text is-small' onClick={this.addRoles}>
                          todos los roles
                        </button>
                      </div>
                      <div className='columns'>
                        <div className='column is-10'>
                          <Select
                            isClearable
                            isMulti
                            styles={creatableStyles}
                            onChange={this.selectRol}
                            options={roles}
                            placeholder={'Seleccione al menos un rol...'}
                            value={selectedRol}
                          />
                        </div>
                        <div className='column is-2'>
                          <button
                            onClick={() => this.goSection(matchUrl.replace('agenda', 'tipo-asistentes'))}
                            className='button'>
                            <FaWhmcs />
                          </button>
                        </div>
                      </div>
                    </Fragment>
                  )}
                  <div className='field'>
                    <label className='label'>Documentos</label>
                    <Select
                      isClearable
                      isMulti
                      styles={creatableStyles}
                      onChange={this.selectDocuments}
                      options={nameDocuments}
                      value={selected_document}
                    />
                  </div>
                  {/* <label className="label">Ticket</label>
                  <div>
                    <Select
                      isClearable
                      isMulti
                      styles={creatableStyles}
                      onChange={this.selectTickets}
                      options={tickets}
                      value={selectedTickets}
                    />
                  </div> */}

                  <div className='field'>
                    <label className='label'>Link del video</label>
                    <input className='input' name='video' type='text' value={video} onChange={this.handleChange} />
                  </div>

                  <div className='field'>
                    <label className='label'>Texto de email para confirmación de registro </label>
                    <div className='control'>
                      <EviusReactQuill
                        name='registration_message'
                        data={this.state.registration_message}
                        handleChange={(e) => this.handleChangeReactQuill(e, 'registration_message')}
                      />
                    </div>
                  </div>

                  <div className='field'>
                    <label className='label'>Descripción</label>
                    <div className='control'>
                      <EviusReactQuill
                        name='description'
                        data={this.state.description}
                        handleChange={(e) => this.handleChangeReactQuill(e, 'description')}
                      />
                    </div>
                  </div>
                </div>

                <div className='column is-5 general'>
                  <div className='field is-grouped'>
                    <Space>
                      <Button icon={<DeleteOutlined />} type='danger' dashed onClick={this.remove}>
                        Eliminar actividad
                      </Button>
                      <button onClick={this.submit} className='button is-primary'>
                        Guardar
                      </button>
                    </Space>
                  </div>
                  <div className='field is-grouped'>
                    <button onClick={this.submit2} className='button is-primary'>
                      Duplicar para traducir
                    </button>
                  </div>
                  <div className='section-gray'>
                    <div className='field'>
                      <label className='label has-text-grey-light'>Imagen</label>
                      <p>Dimensiones: 1000px x 278px</p>
                      <Dropzone onDrop={this.changeImg} accept='image/*' className='zone'>
                        <button className='button is-text'>{image ? 'Cambiar imagen' : 'Subir imagen'}</button>
                      </Dropzone>
                      {image && <img src={image} alt={`activity_${name}`} />}
                    </div>
                    <div className='field'>
                      <label className={`label`}>Capacidad</label>
                      <div className='control'>
                        <input
                          className='input'
                          type='number'
                          min={0}
                          name={'capacity'}
                          value={capacity}
                          onChange={this.handleChange}
                          placeholder='Cupo total'
                        />
                      </div>
                    </div>
                    <label className='label'>Categorías</label>
                    <div className='columns'>
                      <div className='column is-10'>
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
                      </div>
                      <div className='column is-2'>
                        <button onClick={() => this.goSection(`${matchUrl}/categorias`)} className='button'>
                          <FaWhmcs />
                        </button>
                      </div>
                    </div>
                    <label className='label'>Tipo de actividad</label>
                    <div className='columns'>
                      <div className='control column is-10'>
                        <Creatable
                          isClearable
                          styles={creatableStyles}
                          className='basic-multi-select'
                          classNamePrefix='select'
                          isDisabled={isLoading.types}
                          isLoading={isLoading.types}
                          onChange={this.selectType}
                          onCreateOption={(value) => this.handleCreate(value, 'types')}
                          options={types}
                          value={selectedType}
                        />
                      </div>
                      <div className='column is-2'>
                        <Link to={`${matchUrl}/tipos`}>
                          <button className='button'>
                            <FaWhmcs />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* componente de vista previa en revision, por firebase se tiene problemas si se deja como un modal y al mismo tiempo si se abre otra ventana para su administracion, se soluciona si se abre en una pestaña nueva */}

                  {/* {(this.state.meeting_id || this.state.vimeo_id) && (
                    <>
                      <button
                        style={{ marginTop: '2%' }}
                        className='button is-primary'
                        onClick={() => {
                          this.toggleConference(true);
                        }}>
                        Ver Conferencia (Vista previa)
                      </button>
                    </>
                  )}

                  {this.state.conferenceVisible && (
                    <ZoomComponent
                      toggleConference={this.toggleConference}
                      meetingId={this.state.meeting_id || this.state.vimeo_id}
                      userEntered={this.state.currentUser}
                      event={this.props.event}
                      activity={this.state.info}
                    />
                  )} */}
                </div>
              </div>
            )}
          </EventContent>
        </TabPane>
        <TabPane tab='Seleccion de lenguaje' key='2'>
          {this.props.location.state.edit ? (
            <AgendaLanguaje
              platform={platform}
              eventId={this.props.event._id}
              activityId={this.props.location.state.edit}
            />
          ) : (
            <p>
              Por favor primero crear la actividad, paso seguido edite la misma para crear las conferencias en
              diferentes idiomas
            </p>
          )}
        </TabPane>
        <TabPane tab='Espacio Virtual' key='3'>
          {loading ? (
            <Loading />
          ) : (
            <>
              <RoomManager
                event_id={this.props.event._id}
                activity_id={this.state.activity_id}
                activity_name={this.state.name}
                firestore={firestore}
                date_start_zoom={date_start_zoom}
                date_end_zoom={date_end_zoom}
                date_activity={this.state.date}
                pendingChangesSave={this.state.pendingChangesSave}
              />
              <SurveyManager event_id={this.props.event._id} activity_id={this.state.activity_id} />
              {this.state.isExternal && (
                <SurveyExternal
                  isExternal={this.state.isExternal}
                  meeting_id={this.state.externalSurveyID}
                  event_id={this.props.event._id}
                  activity_id={this.state.activity_id}
                />
              )}
            </>
          )}
        </TabPane>
        <TabPane tab='Avanzado' key='4'>
          <Row>
            <Col xs={24}>
              <Checkbox
                defaultChecked={info && (info.requires_registration || info.requires_registration === 'true')}
                onChange={this.handleChange}
                name='requires_registration'>
                La actividad requiere registro
              </Checkbox>
            </Col>
          </Row>
          <Row style={{ marginTop: 8 }}>
            <Col xs={24}>
              <button onClick={this.submit} className='button is-primary'>
                Guardar
              </button>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    );
  }
}

//FN manejo/parseo de fechas
function handleDate(info) {
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
