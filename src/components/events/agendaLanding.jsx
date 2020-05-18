import React, { Component } from "react";
import Moment from "moment";
import * as Cookie from "js-cookie";
import EvenTable from "../events/shared/table";
import SearchComponent from "../shared/searchTable";
import API, { AgendaApi, SpacesApi, Actions, Activity, SurveysApi } from "../../helpers/request";
import { Link, Redirect } from "react-router-dom";
import ReactQuill from "react-quill";
import { toolbarEditor } from "../../helpers/constants";
import ReactPlayer from "react-player";
import AgendaActividadDetalle from "./agendaActividadDetalle";
import { Button } from 'antd';
import { DesktopOutlined } from '@ant-design/icons';

class Agenda extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      listDay: [],
      days: [],
      day: "",
      space: "",
      spaces: [],
      nameSpace: "",
      filtered: [],
      toShow: [],
      value: "",
      currentActivity: null,
      survey: [],
      visible: false,
      visibleModal: false,
      redirect: false,
      disabled: false,
      generalTab: true
    };
    this.returnList = this.returnList.bind(this);
    this.selectionSpace = this.selectionSpace.bind(this);
    this.survey = this.survey.bind(this);
  }

  async componentDidMount() {
    //Se carga esta funcion para cargar los datos
    this.fetchAgenda();

    // Se obtiene informacion del usuario actual
    this.getCurrentUser();

    const { event } = this.props;
    let days = [];
    const init = Moment(event.date_start);
    const end = Moment(event.date_end);
    const diff = end.diff(init, "days");
    //Se hace un for para sacar los días desde el inicio hasta el fin, inclusivos
    for (let i = 0; i < diff + 1; i++) {
      days.push(Moment(init).add(i, "d"));
    }

    this.setState({ days, day: days[0] }, this.fetchAgenda);
  }

  // Funcion para consultar la informacion del actual usuario
  getCurrentUser = async () => {
    let evius_token = Cookie.get("evius_token");

    if (!evius_token) {
      this.setState({ user: false });
    } else {
      try {
        const resp = await API.get(`/auth/currentUser?evius_token=${Cookie.get("evius_token")}`);
        if (resp.status === 200) {
          const data = resp.data;
          // Solo se desea obtener el id del usuario
          this.setState({ uid: data._id });
        }
      } catch (error) {
        const { status } = error.response;
      }
    }
  };

  fetchAgenda = async () => {
    // Se consulta a la api de agenda
    const { data } = await AgendaApi.byEvent(this.props.eventId);

    //se consulta la api de espacios para
    let space = await SpacesApi.byEvent(this.props.event._id);

    //Después de traer la info se filtra por el primer día por defecto y se mandan los espacios al estado
    const filtered = this.filterByDay(this.state.days[0], data);
    this.setState({ list: data, filtered, toShow: filtered, spaces: space });
  };

  returnList() {
    //con la lista previamente cargada en el estado se retorna a la constante toShow Para mostrar la lista completa
    this.setState({ toShow: this.state.listDay, nameSpace: "inicio" });
  }

  filterByDay = (day, agenda) => {
    //Se trae el filtro de dia para poder filtar por fecha y mostrar los datos
    const list = agenda
      .filter(a => a.datetime_start.includes(day.format("YYYY-MM-DD")))
      .sort(
        (a, b) =>
          Moment(a.datetime_start, "h:mm:ss a").format("dddd, MMMM DD YYYY") -
          Moment(b.datetime_start, "h:mm:ss a").format("dddd, MMMM DD YYYY")
      );
    this.setState({ listDay: list });

    //Se mapea la lista para poder retornar los datos ya filtrados
    list.map(item => {
      item.restriction =
        item.access_restriction_type === "EXCLUSIVE"
          ? "Exclusiva para: "
          : item.access_restriction_type === "SUGGESTED"
            ? "Sugerida para: "
            : "Abierta";
      item.roles = item.access_restriction_roles.map(({ name }) => name);
      return item;
    });
    return list;
  };

  //Fn para manejar cuando se selecciona un dia, ejecuta el filtrado
  selectDay = day => {
    const filtered = this.filterByDay(day, this.state.list);
    this.setState({ filtered, toShow: filtered, day });
  };

  //Funcion para ejecutar el filtro por espacio y mandar el espacio a filtrar
  selectSpace(space) {
    const filtered = this.filterBySpace(space, this.state.list);
    this.setState({ filtered, toShow: filtered, space });
  }

  //Se realiza funcion para filtrar mediante dropdown
  selectionSpace() {
    let space = document.getElementById("selectedSpace").value;

    const filtered = this.filterBySpace(space, this.state.list);
    this.setState({ filtered, toShow: filtered, space });
  }

  //Funcion que realiza el filtro por espacio, teniendo en cuenta el dia
  filterBySpace = (space, dates) => {
    //Se filta la lista anterior para esta vez filtrar por espacio
    const list = this.state.listDay.filter(a => a.space.name === space);

    this.setState({ nameSpace: space });

    //Se mapea la lista para poder retornar la lista filtrada por espacio
    list.map(item => {
      item.restriction =
        item.access_restriction_type === "EXCLUSIVE"
          ? "Exclusiva para: "
          : item.access_restriction_type === "SUGGESTED"
            ? "Sugerida para: "
            : "Abierta";
      item.roles = item.access_restriction_roles.map(({ name }) => name);
      return item;
    });
    return list;
  };

  //Fn para el resultado de la búsqueda
  searchResult = data => this.setState({ toShow: !data ? [] : data });

  // Funcion para registrar usuario en la actividad
  registerInActivity = activityKey => {
    const { eventId } = this.props;
    let { uid } = this.state;
    Activity.Register(eventId, uid, activityKey)
      .then(result => {
        console.log("result:", result);
      })
      .catch(err => {
        console.log("err:", err);
      });
  };

  //Fn para el resultado de la búsqueda
  searchResult = data => this.setState({ toShow: !data ? [] : data });

  redirect = () => this.setState({ redirect: true });

  async selected() { }

  gotoActivity(activity) {
    this.setState({ currentActivity: activity });

    //Se trae la funcion survey para pasarle el objeto activity y asi retornar los datos que consulta la funcion survey
    this.survey(activity);
  }

  gotoActivityList = () => {
    this.setState({ currentActivity: null });
  };

  //Funcion survey para traer las encuestas de a actividad
  async survey(activity) {
    //Con el objeto activity se extrae el _id para consultar la api y traer la encuesta de ese evento
    const survey = await SurveysApi.getByActivity(this.props.event._id, activity._id);
    this.setState({ survey: survey });
  }

  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    this.setState({ visible: false });
  };

  onClose = e => {
    console.log(e);
    this.setState({
      visible: false
    })
  };

  capitalizeDate(val) {
    val = val.format("MMMM DD").toUpperCase()
    return val.toLowerCase()
      .trim()
      .split(' ')
      .map(v => v[0].toUpperCase() + v.substr(1))
      .join(' ');
  }

  render() {
    const { showIframe } = this.props;
    const { days, day, nameSpace, spaces, toShow, generalTab, currentActivity, survey } = this.state;
    return (
      <div>
        {currentActivity && (
          <AgendaActividadDetalle
            visible={this.state.visible}
            onClose={this.onClose}
            showDrawer={this.showDrawer}
            matchUrl={this.props.matchUrl}
            survey={survey}
            currentActivity={currentActivity}
            gotoActivityList={this.gotoActivityList}
            showIframe={showIframe}
          />
        )}
        {/* FINALIZA EL DETALLE DE LA AGENDA */}
        {!currentActivity && (
          <div className="container-calendar-section">
            {/* input donde se iteran los espacios del evento */}
            <div className="columns is-centered">


              <div className="container-calendar is-three-fifths">



                {(spaces && spaces.length > 1) && (
                  <>
                    <p className="is-size-5">Seleccióne el espacio</p>
                    <div className="select is-fullwidth is-three-fifths has-margin-bottom-20" style={{ height: "3rem" }}>
                      <select
                        id="selectedSpace"
                        onClick={this.selectionSpace}
                        className="has-text-black  is-pulled-left"
                        style={{ height: "3rem" }}>
                        <option onClick={this.returnList}>Todo</option>
                        {spaces.map((space, key) => (
                          <option
                            onClick={() => this.selectSpace(space.name, space.datetime_start, space.datetime_start)}
                            key={key}>
                            {space.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )
                }

                {/* Contenedor donde se iteran los tabs de las fechas */}
                <div className="container-day_calendar tabs is-toggle is-centered is-fullwidth is-medium has-margin-bottom-60">
                  {days.map((date, key) => (
                    <li onClick={() => this.selectDay(date)} key={key} className="is-active tab-day_calendar">
                      <a className={`${date === day ? " select-day" : " unselect-day"}`}>
                        <span className="level-item date" >{this.capitalizeDate(date)}</span>
                      </a>
                    </li>
                  ))}
                </div>

                {/* Contenedor donde se pinta la información de la agenda */}

                {toShow.map((agenda, key) => (
                  <div
                    key={key}
                    className="container_agenda-information is-three-fifths"
                    onClick={e => {
                      this.gotoActivity(agenda);
                    }}>
                    <div className="card agenda_information ">
                      <header className="card-header columns has-padding-left-7">
                        <div className="is-block is-11 column is-paddingless">
                          {/* Hora del evento */}
                          <span className="card-header-title ">
                            {Moment(agenda.datetime_start).format("h:mm a")} -{" "}
                            {Moment(agenda.datetime_end).format("h:mm a")}
                          </span>

                          {/* Nombre del evento */}
                          <span className="card-header-title has-text-left">{agenda.name}</span>
                          {/* <ReactPlayer style={{maxWidth:"100%"}} url='https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8' controls playing /> */}
                        </div>

                        {agenda.meeting_video && <a className="icon is-flex has-margin-top-30" style={{ flexDirection: "column" }}>
                          <i className="fas fa-play-circle is-size-5"></i>
                          <span className="is-size-6">Video</span>
                        </a>
                        }

                        {/* icono que abre y cierra el card */}
                        {/* <a  className="card-header-icon has-text-white" aria-label="more options" onClick={(e)=>{this.setState({generalTab:!generalTab})}}>
                    <span className="icon is-size-3">
                      <i key={key} className="fas fa-angle-down is-size-3" aria-hidden="true"></i>
                    </span>
                  </a> */}
                      </header>
                      {generalTab && (
                        <div key={key} className="card-content has-text-left container_calendar-description">
                          {/* Descripción del evento */}
                          <div className="columns">
                            <div className="column is-7">


                              {agenda.subtitle && (
                                <div
                                  className="is-size-5-desktop has-margin-bottom-10"
                                  dangerouslySetInnerHTML={{
                                    __html: agenda.subtitle
                                  }}
                                />
                              )}

                              {/* Lugar del evento */}
                              <p className="has-text-left is-size-6-desktop">
                                <b>Lugar:</b> {agenda.space.name}
                              </p>

                              {/* Conferencistas del evento */}
                              <p className="has-text-left is-size-6-desktop">
                                <b>Conferencista:</b> &nbsp;
                            {agenda.hosts.map((speaker, key) => (
                                  <span key={key}>{speaker.name}, &nbsp;</span>
                                ))}
                              </p>

                              <div className="calendar-category has-margin-top-7">
                                {/* Tag que muestra si tiene o no conferencia virtual*/}
                                <p>
                                  <span className="tag category_calendar-tag"><DesktopOutlined />&nbsp;{agenda.meeting_id ? "Tiene espacio virtual" : "No tiene espacio virtual"}</span>
                                  {/* <Button type="primary" dash>
                                       conferencia en vivo
                                    </Button> */}
                                </p>

                                {/* Tags de categorias */}
                                {agenda.activity_categories.map((cat, key) => (
                                  <p
                                    key={key}
                                    style={{
                                      background: cat.color,
                                      color: cat.color ? "white" : ""
                                    }}
                                    className="tag category_calendar-tag">
                                    {cat.name}
                                  </p>
                                ))}

                              </div>

                              <div
                                className="card-footer is-12 is-block"
                                style={{
                                  borderTop: "none",
                                }}>
                                <p>
                                  <br />
                                  <Button type="primary">Más información sobre la actividad.</Button>

                                </p>
                                {/* Boton de para acceder a la conferencia onClick={() =>
                                showIframe(true, agenda.meeting_id)  disabled={agenda.meeting_id ? false : true}
                              } */}

                              </div>

                            </div>
                            {agenda.image && <div className="column is-5"><img src={agenda.image} /></div>}


                            {/* <button
                        className="button button-color-agenda has-text-light is-pulled-right is-medium"
                        onClick={() => this.registerInActivity(agenda._id)}
                      >
                        Inscribirme
                      </button> */}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
        }
      </div>
    );
  }
}

export default Agenda;
