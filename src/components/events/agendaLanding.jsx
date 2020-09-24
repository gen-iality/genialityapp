import React, { Component } from "react";
import Moment from "moment";
import * as Cookie from "js-cookie";
import API, { AgendaApi, SpacesApi, Activity, SurveysApi, DocumentsApi } from "../../helpers/request";
import AgendaActividadDetalle from "./agendaActividadDetalle";
import { Button, Card, Row, Col, Tag, Spin, Avatar, Alert, Tabs, notification } from "antd";
import { firestore } from "../../helpers/firebase";
import ReactPlayer from "react-player";
import AgendaActivityItem from './AgendaActivityItem'

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
      userAgenda: [],
      data: [],
      value: "",
      currentActivity: null,
      survey: [],
      visible: false,
      visibleModal: false,
      redirect: false,
      disabled: false,
      generalTab: true,
      loading: false,
      survey: [],
      documents: [],
      show_inscription: false,
      status: "in_progress",
      hideBtnDetailAgenda: true,
      userId: null
    };
    this.returnList = this.returnList.bind(this);
    this.selectionSpace = this.selectionSpace.bind(this);
    this.survey = this.survey.bind(this);
    this.gotoActivity = this.gotoActivity.bind(this);
    this.gotoActivityList = this.gotoActivityList.bind(this)
  }

  async componentDidUpdate(prevProps) {
    const { data } = this.state
    //Cargamos solamente los espacios virtuales de la agenda

    //Si aún no ha cargado el evento no podemos hacer nada más
    if (!this.props.event) return;

    //Revisamos si el evento sigue siendo el mismo, no toca cargar nada 
    if (prevProps.event && this.props.event._id === prevProps.event._id) return;

    this.listeningStateMeetingRoom(data);
    //Después de traer la info se filtra por el primer día por defecto y se mandan los espacios al estado
    const filtered = this.filterByDay(this.state.days[0], this.state.list);

    this.setState({ data, filtered, toShow: filtered });

  }

  async componentDidMount() {
    //Se carga esta funcion para cargar los datos    
    this.setState({ loading: true });
    await this.fetchAgenda();

    // Se obtiene informacion del usuario actual
    this.getCurrentUser();    

    this.setState({ loading: false });

    const { event } = this.props;

    this.setState({
      show_inscription: event.styles && event.styles.show_inscription ? event.styles.show_inscription : false,
      hideBtnDetailAgenda: event.styles && event.styles.hideBtnDetailAgenda ? event.styles.hideBtnDetailAgenda : true
    })

    let surveysData = await SurveysApi.getAll(event._id);
    let documentsData = await DocumentsApi.getAll(event._id)

    if (surveysData.data.length >= 1) {      
      console.log("Encuestas", surveysData.data)
      this.setState({ survey: surveysData.data})
    }
    if (documentsData.data.length >= 1) {
      this.setState({ documents: documentsData.data })
    }

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
    this.getAgendaUser()
  }

  async listeningStateMeetingRoom(list) {
    list.forEach((activity, index, arr) => {
      firestore
        .collection("events")
        .doc(this.props.event._id)
        .collection("activities")
        .doc(activity._id)
        .onSnapshot((infoActivity) => {
          if (!infoActivity.exists) return;
          let { habilitar_ingreso } = infoActivity.data();
          let updatedActivityInfo = { ...arr[index], habilitar_ingreso };

          arr[index] = updatedActivityInfo;
          const filtered = this.filterByDay(this.state.days[0], arr);
          this.setState({ list: arr, filtered, toShow: filtered });
        });
    });

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
          this.setState({ userId: data._id })
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
    this.listeningStateMeetingRoom(data);

    this.setState({ data, filtered, toShow: filtered, spaces: space });
  };

  returnList() {
    //con la lista previamente cargada en el estado se retorna a la constante toShow Para mostrar la lista completa
    this.setState({ toShow: this.state.listDay, nameSpace: "inicio" });
  }

  filterByDay = (day, agenda) => {
    //Se trae el filtro de dia para poder filtar por fecha y mostrar los datos
    const list = agenda
      .filter((a) => day && day.format && a.datetime_start && a.datetime_start.includes(day.format("YYYY-MM-DD")))
      .sort(
        (a, b) =>
          Moment(a.datetime_start, "h:mm:ss a").format("dddd, MMMM DD YYYY") -
          Moment(b.datetime_start, "h:mm:ss a").format("dddd, MMMM DD YYYY")
      );
    this.setState({ listDay: list });

    for (let i = 0; list.length > i; i++) {
      list[i].hosts.sort((a, b) => {
        return a.order - b.order
      })
    }

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
    const filtered = this.filterByDay(day, this.state.data);
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
  registerInActivity = async (activityId, eventId, userId, callback) => {
    Activity.Register(eventId, userId, activityId)
    .then(() => {
      notification.open({
        message: 'Inscripción realizada',
      });
      callback(true)
    })
    .catch((err) => {
      notification.open({
        message: err,
      });
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

  async getAgendaUser() {
    const { event } = this.props
    const { uid } = this.state    
    try {

      const infoUserAgenda = await Activity.GetUserActivity(event._id, uid)    
      this.setState({ userAgenda: infoUserAgenda.data })
    } catch (e) {
      console.error(e)
    }
  }


  checkInscriptionStatus(activityId = '') {
    const { userAgenda } = this.state
    if (!userAgenda) return false;
    const checkInscription = userAgenda.filter((activity) => activity.activity_id === activityId)
    const statusInscription = checkInscription.length ? true : false
    return statusInscription
  }
  render() {
    const { toggleConference, eventId, event } = this.props;
    const { days, day, hideBtnDetailAgenda, show_inscription, spaces, toShow, data, currentActivity, loading, survey, documents } = this.state;
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
            image_event={this.props.event.styles.event_image}
            gotoActivityList={this.gotoActivityList}
            toggleConference={toggleConference}
          />
        )}

        {/* FINALIZA EL DETALLE DE LA AGENDA */}
        {!currentActivity && loading && (
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
                {
                  event.styles && event.styles.hideDatesAgenda && event.styles.hideDatesAgenda === "false" && (
                    <div className="container-day_calendar tabs is-toggle is-centered is-fullwidth is-medium has-margin-bottom-60">
                      {days.map((date, key) => (
                        <Button key={key} onClick={() => this.selectDay(date)} size={"large"} type={`${date === day ? "primary" : ""}`}>
                          {this.capitalizeDate(Moment(date).format("MMMM DD"))}
                        </Button>

                      ))}
                    </div>
                  )
                }

                {/* Contenedor donde se pinta la información de la agenda */}
                {(event.styles && event.styles.hideDatesAgenda && event.styles.hideDatesAgenda === "true" ? data : toShow).map((item, llave) => {
                  const isRegistered = this.checkInscriptionStatus(item._id)
                  return (
                    <div key={llave} className="container_agenda-information" >
                      <AgendaActivityItem
                        item={item}
                        key={llave}
                        Documents={documents}
                        Surveys={survey}
                        toggleConference={toggleConference}
                        event_image={this.props.event.styles.event_image}
                        gotoActivity={this.gotoActivity}
                        registerInActivity={this.registerInActivity}
                        registerStatus={isRegistered}
                        eventId={this.props.eventId}
                        userId={this.state.userId}
                        btnDetailAgenda={hideBtnDetailAgenda}
                        show_inscription={show_inscription}                        
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Agenda;
