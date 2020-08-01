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
import { Button, Card, Row, Col, Space, Spin, Result } from "antd";
import { DesktopOutlined } from "@ant-design/icons";

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
      generalTab: true,
      loading:false,
    };
    this.returnList = this.returnList.bind(this);
    this.selectionSpace = this.selectionSpace.bind(this);
    this.survey = this.survey.bind(this);
  }

  async componentDidMount() {
    //Se carga esta funcion para cargar los datos

    this.setState({ loading:true});
    await this.fetchAgenda();

    // Se obtiene informacion del usuario actual
    this.getCurrentUser();

    this.setState({ loading:false});

    const { event } = this.props;
    console.log("datos del evento", event)

    if (!event.dates || event.dates.length === 0) {
      let days = [];
      const init = Moment(event.date_start);
      const end = Moment(event.date_end);
      const diff = end.diff(init, "days");
      //Se hace un for para sacar los días desde el inicio hasta el fin, inclusivos
      for (let i = 0; i < diff + 1; i++) {
        days.push(Moment(init).add(i, "d"));
      }

      this.setState({ days, day: days[0] }, this.fetchAgenda);
      //Si existe dates, entonces envia al array push las fechas del array dates del evento
    } else {
      const days = [];
      let date = event.dates;
      Date.parse(date);

      for (var i = 0; i < date.length; i++) {
        days.push(Moment(date[i]).format("YYYY-MM-DD"));
      }
      this.setState({ days, day: days[0] }, this.fetchAgenda);
      
    }
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
    console.log("dia---", day);
    console.log("agenda-----", agenda)
    //Se trae el filtro de dia para poder filtar por fecha y mostrar los datos
    const list = agenda
    .filter((a) => day && day.format && a.datetime_start && a.datetime_start.includes(day.format("YYYY-MM-DD")))
    .sort(
      (a, b) =>
        Moment(a.datetime_start, "h:mm:ss a").format("dddd, MMMM DD YYYY") -
        Moment(b.datetime_start, "h:mm:ss a").format("dddd, MMMM DD YYYY")
    );
    this.setState({ listDay: list });

    //Se mapea la lista para poder retornar los datos ya filtrados
    list.map((item) => {
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
  selectDay = (day) => {
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
    const list = this.state.listDay.filter((a) => a.space.name === space);

    this.setState({ nameSpace: space });

    //Se mapea la lista para poder retornar la lista filtrada por espacio
    list.map((item) => {
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
  searchResult = (data) => this.setState({ toShow: !data ? [] : data });

  // Funcion para registrar usuario en la actividad
  registerInActivity = (activityKey) => {
    const { eventId } = this.props;
    let { uid } = this.state;
    Activity.Register(eventId, uid, activityKey)
      .then((result) => {
        console.log("result:", result);
      })
      .catch((err) => {
        console.log("err:", err);
      });
  };

  //Fn para el resultado de la búsqueda
  searchResult = (data) => this.setState({ toShow: !data ? [] : data });

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
      visible: true,
    });
  };

  handleOk = (e) => {
    this.setState({ visible: false });
  };

  onClose = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  capitalizeDate(val) {
    val = val.format("MMMM DD").toUpperCase();
    return val
      .toLowerCase()
      .trim()
      .split(" ")
      .map((v) => v[0].toUpperCase() + v.substr(1))
      .join(" ");
  }

  render() {
    const { toggleConference } = this.props;
    const { days, day, nameSpace, spaces, toShow, generalTab, currentActivity, survey,loading } = this.state;
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
            toggleConference={toggleConference}
          />
        )}

        {/* FINALIZA EL DETALLE DE LA AGENDA */}
        {!currentActivity && loading &&(
          <div className="container-calendar-section">
          <div className="columns is-centered">
           <Card >
              <Spin tip="Cargando..."></Spin>
         </Card>
         </div>
         </div>
        )}

        {!currentActivity && !loading && (
          <div className="container-calendar-section">
            <div className="columns is-centered">
              <div className="container-calendar is-three-fifths">
                {spaces && spaces.length > 1 && (
                  <>
                    <p className="is-size-5">Seleccióne el espacio</p>
                    <div
                      className="select is-fullwidth is-three-fifths has-margin-bottom-20"
                      style={{ height: "3rem" }}>
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
                )}

                {/* Contenedor donde se iteran los tabs de las fechas */}
                <div className="container-day_calendar tabs is-toggle is-centered is-fullwidth is-medium has-margin-bottom-60">
                  {days.map((date, key) => (
                    <li onClick={() => this.selectDay(date)} key={key} className="is-active tab-day_calendar">
                      <a className={`${date === day ? " select-day" : " unselect-day"}`}>
                        <span className="level-item date">
                          {this.capitalizeDate(Moment(date).format("MMMM DD"))}
                        </span>
                      </a>
                    </li>
                  ))}
                </div>

                {/* Contenedor donde se pinta la información de la agenda */}

                {toShow.map((item) => (
                  <div
                    className="container_agenda-information"
                    onClick={(e) => {
                      this.gotoActivity(item);
                    }}>
                    <div className="card agenda_information">
                      <Row align="middle">
                        <Col className="has-text-left" xs={24} sm={12} md={12} lg={12} xl={16}>
                          <span className="text-align-card">
                            {Moment(item.datetime_start).format("h:mm a")} -{" "}
                            {Moment(item.datetime_end).format("h:mm a")}
                          </span>
                          <p>
                            <span className="card-header-title text-align-card">{item.name}</span>
                          </p>
                          <p className="text-align-card">
                            <b>Conferencista: </b>
                            {item.hosts.map((speaker, key) => (
                              <span key={key}>{speaker.name}, &nbsp;</span>
                            ))}
                          </p>
                          <Row className="text-align-card">
                            <div className="space-align-container">
                              <Button type="primary" className="space-align-block">
                                Detalle del Evento
                              </Button>
                              <Button type="primary" className="space-align-block">
                                Documentos
                              </Button>
                              <Button type="primary" className="space-align-block">
                                Encuestas
                              </Button>
                            </div>
                          </Row>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                          <div>
                            <img src={item.image} />
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Agenda;
