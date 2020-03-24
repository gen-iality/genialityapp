import React, { Component } from "react";
import Moment from "moment";
import * as Cookie from "js-cookie";
import EvenTable from "../events/shared/table";
import SearchComponent from "../shared/searchTable";
import API, {
  AgendaApi,
  SpacesApi,
  Actions,
  Activity
} from "../../helpers/request";
import { Link, Redirect } from "react-router-dom";
import ReactQuill from "react-quill";
import { toolbarEditor } from "../../helpers/constants";

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
      redirect: false,
      disabled: false
    };
    this.returnList = this.returnList.bind(this);
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
        const resp = await API.get(
          `/auth/currentUser?evius_token=${Cookie.get("evius_token")}`
        );
        if (resp.status === 200) {
          const data = resp.data;
          // Solo se desea obtener el id del usuario
          this.setState({ uid: data._id });
        }
      } catch (error) {
        const { status } = error.response;
        console.log("STATUS", status, status === 401);
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
          Moment(a.datetime_start, "YYYY-MM-DD HH:mm").format("HHmm") -
          Moment(b.datetime_start, "YYYY-MM-DD HH:mm").format("HHmm")
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

  redirect = () => this.setState({ redirect: true });

  render() {
    const { days, day, nameSpace, spaces, toShow } = this.state;
    return (
      <div className="container-calendar-section">
        <div className="columns is-desktop ">
          <div className="container-calendar-space">
            <div
              className={`${
                nameSpace === "inicio"
                  ? "button is-danger button is-fullwidth"
                  : "button is-fullwidth"
              }`}
              onClick={this.returnList}
            >
              Todos
            </div>
            {spaces.map((space, key) => (
              <div
                onClick={() =>
                  this.selectSpace(
                    space.name,
                    space.datetime_start,
                    space.datetime_start
                  )
                }
                key={key}
              >
                <button
                  disabled={false}
                  style={{ marginTop: "3%", marginBottom: "3%" }}
                  className={`${
                    nameSpace === space.name
                      ? "button is-danger button is-fullwidth"
                      : "button is-fullwidth"
                  }`}
                >
                  {space.name}
                </button>
              </div>
            ))}
          </div>

          {/* Contenedor donde se iteran los tabs de las fechas */}

          <div className="container-calendar">
            <div className="container-day_calendar tabs is-centered is-fullwidth is-boxed is-medium">
              {days.map((date, key) => (
                <li
                  onClick={() => this.selectDay(date)}
                  key={key}
                  className="is-active tab-day_calendar"
                >
                  <a
                    className={`${
                      date === day ? " select-day" : " unselect-day"
                    }`}
                  >
                    <span className="level-item date">
                      {date.format("MMM DD")}
                    </span>
                  </a>
                </li>
              ))}
            </div>

            {/* Contenedor donde se pinta la información de la agenda */}

            {toShow.map((agenda, key) => (
              <div key={key} className="container_agenda-information">
                <div className="card agenda_information">
                  {/* fechas */}
                  <div className="card-header-date card-header-title has-text-left">
                    <p>
                      {agenda.datetime_start} - {agenda.datetime_end}
                    </p>
                  </div>

                  {/* titulo del evento */}
                  <div className="card-header-title">
                    <p>{agenda.name}</p>
                  </div>

                  <div className="card-content has-text-left container_calendar-description">
                    {/* Descripción del evento */}

                    <div className="calendar-description">
                      <div
                        dangerouslySetInnerHTML={{ __html: agenda.description }}
                      ></div>
                      <div style={{ marginTop: "4%" }}>
                        <span className="card-header-subtitle">Lugar : </span>
                        <span>{agenda.space.name}</span>
                      </div>
                    </div>

                    {agenda.hosts.map((speaker, key) => (
                      <div key={key}>
                        <p className="card-header-subtitle">Conferencista</p>
                        <p>{speaker.name}</p>
                      </div>
                    ))}
                    <div className="calendar-category">
                      {/* <br/>
                                            <p className="card-header-subtitle">Categoria</p> */}
                      <br />
                      {agenda.activity_categories.map((cat, key) => (
                        <span
                          key={key}
                          style={{
                            background: cat.color,
                            color: cat.color ? "white" : ""
                          }}
                          className="tag category_calendar-tag"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                    <div>
                      <button
                        className="button"
                        onClick={() => this.registerInActivity(agenda._id)}
                      >
                        Inscribirme
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Agenda;
