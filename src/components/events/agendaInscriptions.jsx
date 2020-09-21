import React, { Component, Fragment } from "react";
import API, { Activity, AgendaApi, SpacesApi, SurveysApi, DocumentsApi } from "../../helpers/request";
import * as Cookie from "js-cookie";
import { Button, Card, Row, Col, Tag, Spin, Avatar, Alert, notification } from "antd";
import AgendaActividadDetalle from "./agendaActividadDetalle";
import Moment from "moment";
import ReactPlayer from "react-player";
import { firestore } from "../../helpers/firebase";

class AgendaInscriptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: null,
      agendaData: []
    }
    this.survey = this.survey.bind(this);
  }

  async componentDidMount() {
    this.getData()
  }

  async getData() {
    const { event } = this.props;
    this.getAgendaByUser()

    let surveysData = await SurveysApi.getAll(event._id);
    let documentsData = await DocumentsApi.getAll(event._id)

    if (surveysData.data.length >= 1) {
      this.setState({ showButtonSurvey: true })
    }
    if (documentsData.data.length >= 1) {
      this.setState({ showButtonDocuments: true })
    }
  }

  async componentDidUpdate(prevProps) {
    const { agendaData } = this.state
    //Cargamos solamente los espacios virtuales de la agenda

    //Si aún no ha cargado el evento no podemos hacer nada más
    if (!this.props.event) return;

    //Revisamos si el evento sigue siendo el mismo, no toca cargar nada 
    if (prevProps.event && this.props.event._id == prevProps.event._id) return;

    this.listeningStateMeetingRoom(agendaData);
  }

  async getAgendaByUser() {

    console.log('-----------start agenda by user-')
    const { event } = this.props
    let user_id = await this.getCurrentUser()
    try {
      let infoAgenda = await AgendaApi.byEvent(event._id)
      const infoUserAgenda = await Activity.GetUserActivity(event._id, user_id)
      
      console.log('info user agenda-------------------', infoUserAgenda)

      let space = await SpacesApi.byEvent(event._id);
      let agendaData = this.filterUserAgenda(infoAgenda, infoUserAgenda)
      const data = await this.listeningStateMeetingRoom(agendaData);
      data === undefined ? this.setState({ agendaData, spaces: space }) : this.setState({ agendaData: data, spaces: space })
    } catch (e) {
      console.log(e)
    }
  }

  filterUserAgenda(agenda, userAgenda) {
    let agendaData = []
    try {
      for (let i = 0; agenda.data.length > i; i++) {
        for (let a = 0; userAgenda.data.length > a; a++) {
          if (agenda.data[i]._id === userAgenda.data[a].activity_id) {
            agendaData.push(agenda.data[i])
          }
        }
      }

      for (let i = 0; agendaData.length > i; i++) {
        for (let a = 0; userAgenda.data.length > a; a++) {
          if (agendaData[a] !== undefined)
            agendaData[a].attendee_id = userAgenda.data[a]._id
        }
      }

      return agendaData
    } catch (e) {
      console.log(e)
    }
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
          return arr
        });
    });

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
          return data._id
        }
      } catch (error) {
        const { status } = error.response;
      }
    }
  };

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

  deleteRegisterInActivity = async (activityKey) => {
    const { eventId } = this.props;

    Activity.DeleteRegister(eventId, activityKey)
      .then(() => {
        notification.open({
          message: 'Inscripción Eliminada',
        });
      })
      .catch((err) => {
        console.log(err)
      });

    this.getData()
  };
  onClose = (e) => {
    this.setState({
      visible: false,
    });
  };

  gotoActivityList = () => {
    this.setState({ currentActivity: null });
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  render() {
    const { toggleConference, event } = this.props;
    const { currentActivity, survey, loading, showButtonSurvey, showButtonDocuments, agendaData } = this.state;
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
                {/* Contenedor donde se pinta la información de la agenda */}

                {agendaData.map((item, llave) => (
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
                          <div>
                            <span className="card-header-title text-align-card">{item.name}</span>
                          </div>
                        </Row>
                        <hr className="line-head" />
                        <Col className="has-text-left" xs={24} sm={12} md={12} lg={12} xl={16}>
                          <div onClick={
                            (e) => {

                              this.gotoActivity(item)
                            }} className="text-align-card" style={{ marginBottom: "5%" }}>
                            {
                              item.activity_categories.length > 0 && (
                                <>
                                  <b>Tags: </b>
                                  {
                                    item.activity_categories.map((item, key) => (
                                      <>
                                        <Tag key={key} color={item.color ? item.color : "#ffffff"}>{item.name}</Tag>
                                      </>
                                    ))
                                  }
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
                          <Row>
                            <Col span={12}>
                              {/* <Row>
                                <Button type="primary" onClick={(e) => { this.gotoActivity(item) }} className="space-align-block" >
                                  Detalle del Evento
                               </Button>
                              </Row> */}
                              <Row>
                                <Button type="primary" onClick={(e) => { this.deleteRegisterInActivity(item.attendee_id) }} className="space-align-block">
                                  Eliminar Inscripción
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
        )}
      </div>
    );
  }
}

export default AgendaInscriptions