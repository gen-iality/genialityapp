import React, { Component, Fragment } from "react";
import axios from "axios";
import { ApiEviusZoomServer } from "../../helpers/constants";
import { Redirect, withRouter, Link } from "react-router-dom";
import Moment from "moment";
import ReactQuill from "react-quill";
import { DateTimePicker } from "react-widgets";
import Select from "react-select";
import Creatable from "react-select";
import { FaWhmcs } from "react-icons/fa";
import EventContent from "../events/shared/content";
import Loading from "../loaders/loading";
import { notification } from 'antd';
import { createOrUpdateActivity, getConfiguration } from './services'
import {
  AgendaApi,
  CategoriesAgendaApi,
  RolAttApi,
  SpacesApi,
  SpeakersApi,
  TypesAgendaApi,
  DocumentsApi,
  EventsApi,
  eventTicketsApi
} from "../../helpers/request";
import { toolbarEditor } from "../../helpers/constants";
import { fieldsSelect, handleRequestError, handleSelect, sweetAlert, uploadImage } from "../../helpers/utils";
import Dropzone from "react-dropzone";
import { Spin, Card } from "antd";
import "react-tabs/style/react-tabs.css";
import { toast } from "react-toastify";
import getHostList, { setHostState, getAllHost } from "./fireHost";

class AgendaEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      redirect: false,
      deleteID: false,
      isLoading: { types: true, categories: true },
      name: "",
      subtitle: "",
      bigmaker_meeting_id: null,
      has_date: "",
      description: "",
      registration_message: "",
      hour_start: new Date(),
      hour_end: new Date(),
      key: new Date(),
      date: "",
      image: "",
      locale: "en",
      capacity: 0,
      type_id: "",
      space_id: "",
      access_restriction_type: "OPEN",
      selectedCategories: [],
      selectedHosts: [],
      selectedType: "",
      selectedRol: [],
      days: [],
      spaces: [],
      categories: [],
      start_url: "",
      join_url: "",
      meeting_id: "",
      documents: [],
      types: [],
      roles: [],
      hosts: [],
      selected_document: [],
      nameDocuments: [],
      hostAvailable: [],
      availableText: "ended_meeting_room",
      tickets: [],
      selectedTicket: [],
      platform: "",
      vimeo_id: ""
    };
    this.createConference = this.createConference.bind(this);
    this.removeConference = this.removeConference.bind(this);
    this.onChange = this.onChange.bind(this);
    this.selectTickets = this.selectTickets.bind(this)
    this.removeVimeoId = this.removeVimeoId.bind(this)
  }

  async componentDidMount() {
    const {
      event,
      location: { state },
    } = this.props;
    let days = [];
    const ticketEvent = []
    let vimeo_id = ""
    try {
      const info = await EventsApi.getOne(event._id)
      const tickets = await eventTicketsApi.getAll(event._id)
      for (i = 0; tickets.length > i; i++) {
        ticketEvent.push({
          item: tickets[i],
          label: tickets[i].title,
          value: tickets[i]._id
        })
      }

      vimeo_id = info.vimeo_id ? info.vimeo_id : ""
      this.setState({ tickets: ticketEvent, platform: info.event_platform, vimeo_id: vimeo_id })   

      //Si existe dates, itera sobre el array de fechas especificas, dandole el formato especifico
      if (info.dates && info.dates.length > 0) {
        let date = info.dates
        Date.parse(date)

        for (var i = 0; i < date.length; i++) {
          days.push(Moment(date[i], ["YYYY-MM-DD"]).format("YYYY-MM-DD"))
        }
        //Si no, recibe la fecha inicio y la fecha fin y le da el formato especifico a mostrar
      } else {
        const init = Moment(event.date_start);
        const end = Moment(event.date_end);
        const diff = end.diff(init, "days");
        //Se hace un for para sacar los días desde el inicio hasta el fin, inclusivos
        for (let i = 0; i < diff + 1; i++) {
          days.push(
            Moment(init)
              .add(i, "d")
              .format("YYYY-MM-DD")
          );
        }
      }
    } catch (e) {
      console.log(e)
    }


    let documents = await DocumentsApi.byEvent(this.props.event._id);
    let hostAvailable = await EventsApi.hostAvailable();    
    let nameDocuments = [];
    for (var i = 0; i < documents.length; i += 1) {
      nameDocuments.push({ ...documents[i], value: documents[i].title, label: documents[i].title });
    }
    this.setState({ nameDocuments, hostAvailable });

    // getHostList(this.loadHostAvailable);

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
      const videoConferenceState = await getConfiguration(event._id, state.edit)


      this.setState({
        selected_document: info.selected_document,
        start_url: info.start_url,
        join_url: info.join_url,
        availableText: videoConferenceState ? videoConferenceState.habilitar_ingreso : "ended_meeting_room"
      });
      Object.keys(this.state).map((key) => (info[key] ? this.setState({ [key]: info[key] }) : ""));
      const { date, hour_start, hour_end } = handleDate(info);
      this.setState({
        deleteID: state.edit,
        date,
        hour_start,
        hour_end,
        selectedHosts: fieldsSelect(info.host_ids, hosts),
        selectedTickets: info.selectedTicket ? info.selectedTicket : [],
        selectedRol: fieldsSelect(info.access_restriction_rol_ids, roles),
        selectedType: fieldsSelect(info.type_id, types),
        selectedCategories: fieldsSelect(info.activity_categories_ids, categories),
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
  }

  loadHostAvailable = (list) => {
    this.setState({ hostAvailable: list });
  };

  //FN general para cambio en input
  handleChange = (e) => {
    const { name } = e.target;
    const { value } = e.target;  
    this.setState({ [name]: value, host_id: e.target.value });
  };
  //FN para cambio en campo de fecha
  handleDate = (value, name) => {
    this.setState({ [name]: value });
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
        name === "types"
          ? await TypesAgendaApi.create(this.props.event._id, { name: value })
          : await CategoriesAgendaApi.create(this.props.event._id, { name: value });
      const newOption = { label: value, value: item._id, item };
      this.setState(
        (prevState) => ({
          isLoading: { ...prevState.isLoading, [name]: false },
          [name]: [...prevState[name], newOption],
        }),
        () => {
          if (name === "types") this.setState({ selectedType: newOption });
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
        this.setState({ errImg: "Only images files allowed. Please try again :)" });
      }
    } catch (e) {
      sweetAlert.showError(handleRequestError(e));
    }
  };

  //FN para el editor enriquecido
  chgTxt = (content) => this.setState({ description: content });

  registrationMessage = (content) => {
    this.setState({ registration_message: content })
  }
  //Envío de información
  submit = async () => {
    if (this.validForm()) {
      try {
        const info = this.buildInfo();
        sweetAlert.showLoading("Espera (:", "Guardando...");
        const {
          event,
          location: { state },
        } = this.props;
        const {
          selected_document
        } = this.state
        this.setState({ isLoading: true });        

        if (state.edit) {
          const data = {
            activity_id: state.edit
          }      
          await AgendaApi.editOne(info, state.edit, event._id);

          for (let i = 0; i < selected_document.length; i++) {
            const documentsUpdate = await DocumentsApi.editOne(event._id, data, selected_document[i]._id)         
          }
        }
        else {
          const agenda = await AgendaApi.create(event._id, info);
          this.setState({ deleteID: agenda._id });
        }
        //if (this.state.hostSelected) await setHostState(this.state.hostSelected, false);
        //if (this.state.host_id) await setHostState(this.state.host_id, false);

        sweetAlert.hideLoading();
        sweetAlert.showSuccess("Información guardada");
      } catch (e) {
        sweetAlert.showError(handleRequestError(e));
        console.log(e);
      }
    }
  };

  submit2 = async () => {
    if (this.validForm()) {
      try {
        const info = this.buildInfoLanguage();

        sweetAlert.showLoading("Espera (:", "Guardando...");
        const {
          event,
          location: { state },
        } = this.props;
        this.setState({ isLoading: true });
        if (state.edit) await AgendaApi.editOne(info, state.edit, event._id);
        else {
          const agenda = await AgendaApi.create(event._id, info);
          this.setState({ deleteID: agenda._id });
        }
        sweetAlert.hideLoading();
        sweetAlert.showSuccess("Información guardada");
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
      selectedHosts,
      selectedType,
      selectedRol,
      description,
      registration_message,
      selected_document,
      image,
    } = this.state;
    const datetime_start = date + " " + Moment(hour_start).format("HH:mm");
    const datetime_end = date + " " + Moment(hour_end).format("HH:mm");
    const activity_categories_ids = selectedCategories.length > 0 ? selectedCategories.map(({ value }) => value) : [];
    const access_restriction_rol_ids = access_restriction_type !== "OPEN" ? selectedRol.map(({ value }) => value) : [];
    const host_ids = selectedHosts >= 0 ? [] : selectedHosts.map(({ value }) => value);

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
      host_ids,
      type_id,
      has_date,
      selected_document,
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
      vimeo_id
    } = this.state;
    const datetime_start = date + " " + Moment(hour_start).format("HH:mm");
    const datetime_end = date + " " + Moment(hour_end).format("HH:mm");

    const activity_categories_ids = selectedCategories[0] === undefined ? [] : selectedCategories.map(({ value }) => value);

    const access_restriction_rol_ids = access_restriction_type !== "OPEN" ? selectedRol.map(({ value }) => value) : [];
    const host_ids = selectedHosts >= 0 ? [] : selectedHosts.map(({ value }) => value);

    const type_id = selectedType === undefined ? "" : selectedType.value;
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
      host_ids,
      type_id,
      has_date,
      timeConference: "",
      selected_document,
      meeting_id: meeting_id,
      vimeo_id: vimeo_id,
      video,
      selectedTicket
    };
  };

  async removeVimeoId() {
    if (window.confirm("Esta seguro?")) {
      this.setState({ vimeo_id: null }, function () {
        this.submit();
      });
    }
  }

  async removeConference() {
    if (window.confirm("Esta seguro?")) {
      this.setState({ meeting_id: null }, function () {
        this.submit();
      });
    }
  }

  async createConference() {
    const { hostAvailable } = this.state
    const host_name = []

    for (let i = 0; hostAvailable.length > i; i++) {
      if (this.state.host_id === hostAvailable[i].id) {
        host_name.push(hostAvailable[i].first_name)
      }
    }

    this.setState({ creatingConference: true });
    const zoomData = {
      activity_id: this.props.location.state.edit,
      activity_name: this.state.name,
      event_id: this.props.event._id,
      agenda: this.state.name,//this.props.event.description,
      host_id: this.state.host_id,
      host_name: host_name[0]
    };

    const options = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      data: zoomData,
      url: ApiEviusZoomServer,
    };
    let response = null;

    axios.defaults.timeout = 10000;
    try {
      response = await axios(options);
      toast.success("Conferencia Creada");     
      let result = await setHostState(this.state.host_id, true);

      const {
        location: { state },
      } = this.props;

      const info = await AgendaApi.getOne(state.edit, this.props.event._id);
      this.setState({
        meeting_id: info.meeting_id,
        start_url: info.start_url,
        join_url: info.join_url,
        name_host: info.name_host,
        key: new Date(),
      });
    } catch (error) {      
      if (error.response) {
        response = JSON.stringify(error.response.data);
      }
      console.log(error);
      this.setState({ creatingConference: false });
    }
    this.setState({ creatingConference: false });
  }

  //FN para eliminar la actividad
  remove = () => {
    if (this.state.deleteID) {
      sweetAlert.twoButton(`Está seguro de borrar esta actividad`, "warning", true, "Borrar", async (result) => {
        try {
          if (result.value) {
            sweetAlert.showLoading("Espera (:", "Borrando...");
            await AgendaApi.deleteOne(this.state.deleteID, this.props.event._id);
            this.setState({ redirect: true });
            sweetAlert.hideLoading();
          }
        } catch (e) {
          sweetAlert.showError(handleRequestError(e));
        }
      });
    } else this.setState({ redirect: true });
  };

  //Validación de campos

  validForm = () => {
    let title = "";
    if (this.state.name.length <= 0) title = "El Nombre es requerido";

    if (title.length > 0) {
      //   sweetAlert.twoButton(title, "warning", false, "OK", () => { });
      //   return false;
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

  async onChange(e) {
    this.setState({ availableText: e.target.value })

    let result = await createOrUpdateActivity(this.props.location.state.edit, this.props.event._id, e.target.value)    

    notification.open({
      message: result.message
    });
  };

  selectTickets(tickets) {
    this.setState({ selectedTicket: tickets })
  }
  render() {
    const {
      loading,
      name,
      subtitle,
      bigmaker_meeting_id,
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
      documents,
      isLoading,
      start_url,
      join_url,
      availableText,
      vimeo_id,
      selectedTickets,
      platform } = this.state;
    const { matchUrl } = this.props;
    if (!this.props.location.state || this.state.redirect) return <Redirect to={matchUrl} />;
    return (
      <EventContent title="Actividad" closeAction={this.goBack}>
        {loading ? (
          <Loading />
        ) : (
            <div className="columns">
              <div className="column is-8">
                <div className="field">
                  <label className="label required">Nombre</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      name={"name"}
                      value={name}
                      onChange={this.handleChange}
                      placeholder="Nombre de la actividad"
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Subtítulo</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      name={"subtitle"}
                      value={subtitle}
                      onChange={this.handleChange}
                      placeholder="Ej: Salón 1, Zona Norte, Área de juegos"
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Día</label>
                  <div className="columns">                
                    {this.state.days.map((day, key) => {
                      return (
                        <div key={key} className="column">
                          <input
                            type="radio"
                            name="date"
                            id={`radioDay${key}`}
                            className="is-checkradio"
                            checked={day === date}
                            value={day}
                            onChange={this.handleChange}
                          />                       
                          <label htmlFor={`radioDay${key}`}>{Moment(day, ["YYYY-MM-DD"]).format("MMMM-DD")}</label>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="columns">

                  <div className="column">
                    <div className="field">
                      <label className="label">Hora Inicio</label>
                      <DateTimePicker
                        value={hour_start}
                        dropUp
                        step={15}
                        date={false}
                        onChange={(value) => this.handleDate(value, "hour_start")}
                      />
                    </div>
                  </div>

                  <div className="column">
                    <div className="field">
                      <label className="label">Hora Fin</label>
                      <DateTimePicker
                        value={hour_end}
                        dropUp
                        step={15}
                        date={false}
                        onChange={(value) => this.handleDate(value, "hour_end")}
                      />
                    </div>
                  </div>
                </div>
                <label className="label">Conferencista</label>
                <div className="columns">
                  <div className="column is-10">
                    <Select
                      isClearable
                      isMulti
                      styles={creatableStyles}
                      onChange={this.selectHost}
                      options={hosts}
                      value={selectedHosts}
                    />
                  </div>
                  <div className="column is-2">
                    <button
                      onClick={() => this.goSection(matchUrl.replace("agenda", "speakers"), { child: true })}
                      className="button">
                      <FaWhmcs />
                    </button>
                  </div>
                </div>
                <label className="label required">Espacio</label>
                <div className="field has-addons">
                  <div className="control">
                    <div className="select">
                      <select name={"space_id"} value={space_id} onChange={this.handleChange}>
                        <option value={""}>Seleccione un lugar/salón ...</option>
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
                  <div className="control">
                    <Link to={matchUrl.replace("agenda", "espacios")}>
                      <button className="button">
                        <FaWhmcs />
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="field">
                  <label className={`label`}>Clasificar actividad como:</label>
                  <div className="control">
                    <input
                      type="radio"
                      id={"radioOpen"}
                      name="access_restriction_type"
                      checked={access_restriction_type === "OPEN"}
                      className="is-checkradio"
                      value={"OPEN"}
                      onChange={this.handleChange}
                    />
                    <label htmlFor={"radioOpen"}>
                      <strong>ABIERTA</strong>: Todos los asistentes (roles) pueden participar en la actividad
                  </label>
                  </div>
                  <div className="control">
                    <input
                      type="radio"
                      id={"radioSuggested"}
                      name="access_restriction_type"
                      checked={access_restriction_type === "SUGGESTED"}
                      className="is-checkradio"
                      value={"SUGGESTED"}
                      onChange={this.handleChange}
                    />
                    <label htmlFor={"radioSuggested"}>
                      <strong>RECOMENDADA</strong>: Actividad sugerida para algunos asistentes (roles)
                  </label>
                  </div>
                  <div className="control">
                    <input
                      type="radio"
                      id={"radioExclusive"}
                      name="access_restriction_type"
                      checked={access_restriction_type === "EXCLUSIVE"}
                      className="is-checkradio"
                      value={"EXCLUSIVE"}
                      onChange={this.handleChange}
                    />
                    <label htmlFor={"radioExclusive"}>
                      <strong>EXCLUSIVA</strong>: Solo algunos asistentes (roles) pueden participar en la actividad
                  </label>
                  </div>
                </div>
                {access_restriction_type !== "OPEN" && (
                  <Fragment>
                    <div style={{ display: "flex" }}>
                      <label className="label required">Asginar a :</label>
                      <button className="button is-text is-small" onClick={this.addRoles}>
                        todos los roles
                    </button>
                    </div>
                    <div className="columns">
                      <div className="column is-10">
                        <Select
                          isClearable
                          isMulti
                          styles={creatableStyles}
                          onChange={this.selectRol}
                          options={roles}
                          placeholder={"Seleccione al menos un rol..."}
                          value={selectedRol}
                        />
                      </div>
                      <div className="column is-2">
                        <button
                          onClick={() => this.goSection(matchUrl.replace("agenda", "tipo-asistentes"))}
                          className="button">
                          <FaWhmcs />
                        </button>
                      </div>
                    </div>
                  </Fragment>
                )}
                <div className="field">
                  <label className="label">Documentos</label>
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

                <div className="field">
                  <label className="label">Link del video</label>
                  <input className="input" name="video" type="text" value={video} onChange={this.handleChange} />
                </div>

                <div className="field">
                  <label className="label">Texto de email para confirmación de registro </label>
                  <div className="control">
                    <ReactQuill value={this.state.registration_message} modules={toolbarEditor} onChange={this.registrationMessage} />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Descripción</label>
                  <div className="control">
                    <ReactQuill value={this.state.description} modules={toolbarEditor} onChange={this.chgTxt} />
                  </div>
                </div>                
              </div>
              <div className="column is-4 general">
                <div className="field is-grouped">
                  <button className="button is-text" onClick={this.remove}>
                    x Eliminar actividad
                </button>
                  <button onClick={this.submit} className="button is-primary">
                    Guardar
                </button>
                </div>
                <div className="field is-grouped">
                  <button onClick={this.submit2} className="button is-primary">
                    Duplicar para traducir
                </button>
                </div>

                <div className="section-gray">
                  <div className="field">
                    <label className="label has-text-grey-light">Imagen</label>
                    <p>Dimensiones: 1000px x 278px</p>
                    <Dropzone onDrop={this.changeImg} accept="image/*" className="zone">
                      <button className="button is-text">{image ? "Cambiar imagen" : "Subir imagen"}</button>
                    </Dropzone>
                    {image && <img src={image} alt={`activity_${name}`} />}
                  </div>
                  <div className="field">
                    <label className={`label`}>Capacidad</label>
                    <div className="control">
                      <input
                        className="input"
                        type="number"
                        min={0}
                        name={"capacity"}
                        value={capacity}
                        onChange={this.handleChange}
                        placeholder="Cupo total"
                      />
                    </div>
                  </div>
                  <label className="label">Categorías</label>
                  <div className="columns">
                    <div className="column is-10">
                      <Creatable
                        isClearable
                        styles={catStyles}
                        onChange={this.selectCategory}
                        onCreateOption={(value) => this.handleCreate(value, "categories")}
                        isDisabled={isLoading.categories}
                        isLoading={isLoading.categories}
                        isMulti
                        options={categories}
                        placeholder={"Sin categoría...."}
                        value={selectedCategories}
                      />
                    </div>
                    <div className="column is-2">
                      <button onClick={() => this.goSection(`${matchUrl}/categorias`)} className="button">
                        <FaWhmcs />
                      </button>
                    </div>
                  </div>
                  <label className="label">Tipo de actividad</label>
                  <div className="columns">
                    <div className="control column is-10">
                      <Creatable
                        isClearable
                        styles={creatableStyles}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        isDisabled={isLoading.types}
                        isLoading={isLoading.types}
                        onChange={this.selectType}
                        onCreateOption={(value) => this.handleCreate(value, "types")}
                        options={types}
                        value={selectedType}
                      />                      
                    </div>
                    <div className="column is-2">
                      <Link to={`${matchUrl}/tipos`}>
                        <button className="button">
                          <FaWhmcs />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>

                <Card style={{ marginTop: "4%" }} title="Conferencia virtual">
                  {!this.props.location.state.edit && (
                    <div>Primero cree la actividad y luego podrá crear una conferencia virtual asociada</div>
                  )}

                  {platform === "zoom" && (
                    <>
                      {this.props.location.state.edit && (
                        <>
                          {!this.state.meeting_id && (
                            <Fragment>
                              <div className="control">
                                <div className="select">
                                  <select name={"host_id"} value={this.state.host_id} onChange={this.handleChange}>
                                    <option>Seleccione host</option>
                                    {this.state.hostAvailable.length > 0 &&
                                      this.state.hostAvailable.map((host) => {
                                        return (
                                          host.state &&
                                          host.state === "available" && (
                                            <option value={host.id} key={host.id}>
                                              {host.email}
                                            </option>
                                          )
                                        );
                                      })}
                                  </select>
                                </div>
                              </div>
                              <div>
                                {!this.state.creatingConference && (
                                  <button
                                    style={{ marginTop: "2%" }}
                                    className="button is-primary"
                                    disabled={!this.state.host_id}
                                    onClick={this.createConference}>
                                    Crear espacio virtual
                                  </button>
                                )}
                                {this.state.creatingConference && <Spin tip="Creando..." />}
                              </div>
                            </Fragment>
                          )}
                          <div className="field">
                            <label className="label">bigmaker_meeting_id</label>
                            <div className="control">
                              <input
                                className="input"
                                type="text"
                                name={"bigmaker_meeting_id"}
                                value={bigmaker_meeting_id}
                                onChange={this.handleChange}
                                placeholder=""
                              />
                            </div>
                          </div>


                          {this.state.meeting_id && (
                            <div>
                              <div style={{ marginTop: "2%" }}>
                                <div>
                                  <p>El id de la conferencia virtual es:</p>
                                  <p>{this.state.meeting_id}</p>
                                </div>

                                <div>
                                  <p>El host encargado es:</p>
                                  <p>{this.state.name_host}</p>
                                </div>
                                <div key={this.state.key}>
                                  <p>
                                    <b>Accessos</b>
                                  </p>
                                  <hr />
                                  <p>
                                    <a target="_blank" href={start_url}>
                                      Acceso para hosts
                              </a>
                                  </p>
                                  <p>
                                    <a target="_blank" href={join_url}>
                                      Acceso para asistentes
                              </a>
                                  </p>
                                </div>
                              </div>
                              <div>
                                <label className="label">Estado de videoconferencia</label>
                                <div className="select">
                                  <select defaultValue={availableText} styles={creatableStyles} onChange={this.onChange}>
                                    <option value="open_meeting_room">Conferencia Abierta</option>
                                    <option value="closed_meeting_room">Conferencia no Iniciada</option>
                                    <option value="ended_meeting_room">Conferencia Terminada</option>
                                  </select>
                                </div>
                              </div>
                              <button
                                style={{ marginTop: "2%" }}
                                className="button is-primary"
                                onClick={this.removeConference}>
                                Eliminar espacio virtual
                        </button>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                  {
                    platform === "vimeo" && (
                      <>
                        {
                          vimeo_id === "" ? (
                            <div className="control">
                              <label>Ingrese id de videoconferencia Vimeo</label>
                              <input
                                type="number"
                                name="vimeo_id"
                                onChange={(e) => this.setState({ vimeo_id: e.target.value })}
                              />
                            </div>
                          ) : (
                              <>
                                <div className="control">
                                  <label>id de videoconferencia Vimeo</label>
                                  <p>{vimeo_id}</p>
                                </div>
                                <div>
                                  <label className="label">Estado de videoconferencia</label>
                                  <div className="select">
                                    <select defaultValue={availableText} styles={creatableStyles} onChange={this.onChange}>
                                      <option value="open_meeting_room">Conferencia Abierta</option>
                                      <option value="closed_meeting_room">Conferencia no Iniciada</option>
                                      <option value="ended_meeting_room">Conferencia Terminada</option>
                                    </select>
                                  </div>
                                  <button
                                    style={{ marginTop: "2%" }}
                                    className="button is-primary"
                                    onClick={this.removeVimeoId}>
                                    Eliminar espacio virtual
                                  </button>
                                </div>
                              </>
                            )
                        }
                      </>
                    )
                  }
                </Card>
              </div>
            </div>
          )}
      </EventContent>
    );
  }
}

//FN manejo/parseo de fechas
function handleDate(info) {
  let date, hour_start, hour_end;
  hour_start = Moment(info.datetime_start, "YYYY-MM-DD HH:mm").toDate();
  hour_end = Moment(info.datetime_end, "YYYY-MM-DD HH:mm").toDate();
  date = Moment(info.datetime_end, "YYYY-MM-DD HH:mm").format("YYYY-MM-DD");
  return { date, hour_start, hour_end };
}

//Estilos de algunos select
const creatableStyles = {
  menu: (styles) => ({ ...styles, maxHeight: "inherit" }),
};

//Estilos para el tipo
const dot = (color = "transparent") => ({
  alignItems: "center",
  display: "flex",
  ":before": {
    backgroundColor: color,
    content: '" "',
    display: "block",
    margin: 8,
    height: 10,
    width: 10,
  },
});

//Estilos de algunos otros select
const catStyles = {
  menu: (styles) => ({ ...styles, maxHeight: "inherit" }),
  multiValue: (styles, { data }) => ({ ...styles, ...dot(data.item.color) }),
};

export default withRouter(AgendaEdit);
