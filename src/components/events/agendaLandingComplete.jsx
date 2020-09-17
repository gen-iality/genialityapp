import React, { Component, Fragment } from "react";
import API, { AgendaApi, SpacesApi, SurveysApi, DocumentsApi, Activity } from "../../helpers/request";
import * as Cookie from "js-cookie";
import { Button, Row, Col, Tag, Avatar, Alert, notification } from "antd";
import ReactPlayer from "react-player";
import Moment from "moment";
import AgendaActividadDetalle from "./agendaActividadDetalle";
import { firestore } from "../../helpers/firebase";

class AgendaLandingComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      showButtonDocuments: false,
      showButtonSurvey: false,
      spaces: [],
      currentActivity: null,
      survey: [],
      loading: false
    }
  }

  componentDidMount() {
    this.getCurrentUser()
    this.getDataAgenda()
  }

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
          this.setState({ uid: data._id })
        }
      } catch (error) {
        const { status } = error.response;
      }
    }
  };

  async getDataAgenda() {
    const { eventId } = this.props
    // Se consulta a la api de agenda
    const { data } = await AgendaApi.byEvent(eventId);
    this.listeningStateMeetingRoom(data)
    //se consulta la api de espacios para
    let space = await SpacesApi.byEvent(eventId);

    let surveysData = await SurveysApi.getAll(eventId);
    let documentsData = await DocumentsApi.getAll(eventId)

    if (surveysData.data.length >= 1) {
      this.setState({ showButtonSurvey: true })
    }
    if (documentsData.data.length >= 1) {
      this.setState({ showButtonDocuments: true })
    }

    this.setState({ data, spaces: space });
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
          this.setState({ data: arr });
        });
    });

  }

  gotoActivity(activity) {
    this.setState({ currentActivity: activity });

    //Se trae la funcion survey para pasarle el objeto activity y asi retornar los datos que consulta la funcion survey
    this.survey(activity);
  }
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

  gotoActivityList = () => {
    this.setState({ currentActivity: null });
  };

  //Funcion para ejecutar el filtro por espacio y mandar el espacio a filtrar
  selectSpace(space) {
    const filtered = this.filterBySpace(space, this.state.list);
    this.setState({ filtered, toShow: filtered, space });
  }

  // Funcion para registrar usuario en la actividad
  registerInActivity = (activityKey) => {
    const { eventId } = this.props;
    let { uid } = this.state;

    console.log(uid)

    Activity.Register(eventId, uid, activityKey)
      .then(() => {
        notification.open({
          message: 'Inscripción realizada',
        });
      })
      .catch((err) => {
        notification.open({
          message: err,
        });
      });
  };
  render() {
    const { toggleConference } = this.props;
    const { data, showButtonSurvey, showButtonDocuments, spaces, currentActivity, survey, visible, loading } = this.state
    return (
      <Fragment>
        {currentActivity && (
          <AgendaActividadDetalle
            visible={visible}
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
        {
          !currentActivity && !loading && (
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

                  {/* Contenedor donde se pinta la información de la agenda */}

                  {data.map((item, llave) => (
                    console.log(item),
                    <div key={llave} className="container_agenda-information">
                      <div className="card agenda_information">
                        <Row align="middle">
                          <Row>
                            <span className="date-activity">
                              {
                                Moment(item.datetime_start).format("DD MMMM YYYY") === Moment(item.datetime_end).format("DD MMMM YYYY") ? (
                                  <>
                                    {Moment(item.datetime_start).format("DD MMMM YYYY h:mm a")} -{" "}
                                    {Moment(item.datetime_end).format("h:mm a")}
                                  </>
                                ) : (
                                    Moment(item.datetime_start).format("DD MMMM YYYY hh:mm") - Moment(item.datetime_end).format("DD MMMM YYYY hh:mm")
                                  )
                              }
                            </span>
                            <p>
                              <span className="card-header-title text-align-card">{item.name}</span>
                            </p>
                          </Row>
                          <hr className="line-head" />
                          <Col className="has-text-left" xs={24} sm={12} md={12} lg={12} xl={16}>
                            <div onClick={(e) => { this.gotoActivity(item) }} className="text-align-card" style={{ marginBottom: "5%" }}>
                              {
                                item.activity_categories.length > 0 && (
                                  <>
                                    <b>Tags: </b>
                                    {
                                      item.activity_categories.map((item) => (
                                        <>
                                          <Tag color={item.color ? item.color : "#ffffff"}>{item.name}</Tag>
                                        </>
                                      ))
                                    }
                                  </>
                                )
                              }
                            </div>
                            <div className="text-align-card">
                              {
                                item.hosts.length > 0 && (
                                  <>
                                    <b>Presenta: </b>
                                    <br />
                                    <br />
                                    <Row>
                                      {item.hosts.map((speaker, key) => (
                                        <Col lg={24} xl={12} xxl={12} style={{ marginBottom: 13 }}>
                                          <span key={key} style={{ fontSize: 20, fontWeight: 500 }}>
                                            <Avatar
                                              size={50}
                                              src={speaker.image
                                              } /> {speaker.name} &nbsp;</span>
                                        </Col>
                                      ))}
                                    </Row>
                                  </>
                                )
                              }
                            </div>
                            <div className="text-align-card">
                              {
                                <>
                                  <Row>
                                    <div
                                      className="is-size-5-desktop has-margin-top-10 has-margin-bottom-10"
                                      dangerouslySetInnerHTML={{ __html: item.description }}
                                    />
                                  </Row>
                                </>
                              }
                            </div>
                            <Row>
                              <Col span={12}>
                                {/* <Row>
                                  <Button type="primary" onClick={(e) => { this.gotoActivity(item) }} className="space-align-block" >
                                    Detalle del Evento
                                  </Button>
                                </Row> */}
                                <Row>
                                  <Button type="primary" onClick={() => this.registerInActivity(item._id)} className="space-align-block">
                                    Inscribirme
                                  </Button>
                                </Row>
                              </Col>

                              <Col span={12}>
                                <Row>
                                  {
                                    showButtonDocuments && (
                                      <Button type="primary" onClick={(e) => { this.gotoActivity(item) }} className="space-align-block">
                                        Documentos
                                      </Button>
                                    )
                                  }
                                </Row>
                                <Row>
                                  {
                                    showButtonSurvey && (
                                      <Button type="primary" onClick={() => { this.gotoActivity(item) }} className="space-align-block">
                                        Encuestas
                                      </Button>
                                    )
                                  }
                                </Row>
                              </Col>
                            </Row>
                          </Col>
                          <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                            {
                              !item.habilitar_ingreso && (
                                <img src={item.image ? item.image : this.props.event.styles.event_image} />
                              )
                            }
                            <div>
                              {
                                item.habilitar_ingreso === "closed_meeting_room" && (
                                  <>
                                    <img src={item.image ? item.image : this.props.event.styles.event_image} />
                                    <Alert message="La Conferencia iniciará pronto" type="warning" />
                                  </>
                                )
                              }

                              {
                                item.habilitar_ingreso === "ended_meeting_room" && (
                                  <>
                                    {item.video ? item.video && (
                                      <>
                                        <Alert message="Conferencia Terminada. Observa el video Aquí" type="success" />
                                        <ReactPlayer
                                          width={"100%"}
                                          style={{
                                            display: "block",
                                            margin: "0 auto",
                                          }}
                                          url={item.video}
                                          //url="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/eviuswebassets%2FLa%20asamblea%20de%20copropietarios_%20una%20pesadilla%20para%20muchos.mp4?alt=media&token=b622ad2a-2d7d-4816-a53a-7f743d6ebb5f"
                                          controls
                                        />
                                      </>
                                    ) :
                                      (
                                        <>
                                          <img src={item.image ? item.image : this.props.event.styles.event_image} />
                                          <Alert message="Conferencia Terminada. Observa el video Mas tarde" type="info" />
                                        </>
                                      )}

                                  </>
                                )
                              }
                              {
                                item.habilitar_ingreso === "open_meeting_room" && (
                                  <>
                                    <img onClick={() =>
                                      item.meeting_id && toggleConference(
                                        true,
                                        item.meeting_id,
                                        item
                                      )
                                    } src={item.image ? item.image : this.props.event.styles.event_image} />
                                    <div>
                                      <Button
                                        block
                                        type="primary"
                                        disabled={item.meeting_id ? false : true}
                                        onClick={() =>
                                          toggleConference(
                                            true,
                                            item.meeting_id,
                                            item
                                          )
                                        }
                                      >
                                        {item.meeting_id ? "Observa aquí la Conferencia en Vivo" : "Aún no empieza Conferencia Virtual"}
                                      </Button>
                                    </div>
                                  </>
                                )
                              }
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        }
      </Fragment>
    )
  }
}

export default AgendaLandingComplete