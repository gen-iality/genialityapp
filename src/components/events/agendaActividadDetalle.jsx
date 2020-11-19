import Moment from "moment";
import ReactPlayer from "react-player";
import React, { useState, useEffect } from "react";
import * as Cookie from "js-cookie";
import API, { EventsApi, SurveysApi } from "../../helpers/request";
import { withRouter } from "react-router-dom";
import SurveyComponent from "./surveys";
import { PageHeader, Row, Col, Button, List, Avatar, Card } from "antd";
import AttendeeNotAllowedCheck from "./shared/attendeeNotAllowedCheck";
import DocumentsList from "../documents/documentsList";
import ModalSpeaker from "./modalSpeakers";

let AgendaActividadDetalle = (props) => {
  let [usuarioRegistrado, setUsuarioRegistrado] = useState(false);
  let [currentUser, setCurrentUser] = useState(false);
  let [event, setEvent] = useState(false);
  let [idSpeaker, setIdSpeaker] = useState(false);
  let [showSurvey, setShowSurvey] = useState(false);
  let [orderedHost, setOrderedHost] = useState([])

  useEffect((params) => {
    console.log('actividad detalle', props)
  }, [])

  useEffect(() => {
    (async () => {
      //Id del evento
      var id = props.match.params.event;
      const event = await EventsApi.landingEvent(id);
      setEvent(event);

      if (!currentUser) {
        let evius_token = Cookie.get("evius_token");
        if (!evius_token) return;

        const resp = await API.get(`/auth/currentUser?evius_token=${Cookie.get("evius_token")}`);
        if (resp.status !== 200 && resp.status !== 202) return;
        const data = resp.data;
        setCurrentUser(data);
      }

      try {
        const respuesta = await API.get("api/me/eventusers/event/" + id);
        let surveysData = await SurveysApi.getAll(event._id);
        const currentActivityId = props.currentActivity._id

        if (surveysData.data.length > 0) {
          //Si hay una actividad que haga match con el listado de encuestas entonces habilitamos el componente survey
          surveysData.data.map((item) => {
            if (item.activity_id === currentActivityId) {
              setShowSurvey(true)
            }
          })
        }

        if (respuesta.data && respuesta.data.data && respuesta.data.data.length) {
          setUsuarioRegistrado(true);
        }
      } catch (err) {
        console.error(err)
      }

      function orderHost() {
        let hosts = props.currentActivity.hosts
        hosts.sort(function (a, b) {
          return a.order - b.order
        })
        setOrderedHost(hosts)
      }
      orderHost()
    })();
  }, [props.match.params.event, props.currentActivity, currentUser]);

  async function getSpeakers(idSpeaker) {
    setIdSpeaker(idSpeaker);
  }

  const { currentActivity, gotoActivityList, toggleConference, image_event } = props;
  return (
    <div className="columns container-calendar-section is-centered">
      <div className=" container_agenda-information container-calendar is-three-fifths">
        <div className="card agenda_information ">
          <PageHeader
            className="site-page-header"
            onBack={() => {
              gotoActivityList();
            }}
            title={currentActivity.name}
          />
          <header className="card-header columns has-padding-left-7">
            <div className="is-block is-11 column is-paddingless">
              {/* Hora del evento */}
              <p className="card-header-title has-padding-left-0 ">
                {Moment(currentActivity.datetime_start).format("h:mm a")} -{" "}
                {Moment(currentActivity.datetime_end).format("h:mm a")}
              </p>
              {
                currentActivity.space && (
                  /* Lugar del evento */
                  < p className="has-text-left is-size-6-desktop">
                    <b>Lugar:</b> {currentActivity.space.name}
                  </p>
                )
              }

              {currentActivity.video ? (
                <div className="column is-centered mediaplayer">
                  <ReactPlayer
                    width={"100%"}
                    style={{
                      display: "block",
                      margin: "0 auto",
                    }}
                    url={currentActivity.video}
                    //url="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/eviuswebassets%2FLa%20asamblea%20de%20copropietarios_%20una%20pesadilla%20para%20muchos.mp4?alt=media&token=b622ad2a-2d7d-4816-a53a-7f743d6ebb5f"
                    controls
                  />
                </div>
              ) :
                (
                  <img className="activity_image" src={currentActivity.image ? currentActivity.image : image_event} alt='Activity' />
                )}
                {/*logo quemado de aval para el evento de magicland */}
                {
                event._id === "5f99a20378f48e50a571e3b6" && (
                  <Row justify="center">
                    <Col span={8}>
                      <img src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Magicland%2Fbanner.jpg?alt=media&token=4aab5da2-bbba-4a44-9bdd-d2161ea58b0f" alt="aval"/>
                    </Col>
                    <Col span={8}>
                      <img src="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Magicland%2Fgrupo-aval.gif?alt=media&token=5fd99d79-3d24-483c-b280-a495b0315b84" alt="aval"/>
                    </Col>
                  </Row>
                )
              }
              {currentActivity.secondvideo && (
                <div className="column is-centered mediaplayer">
                  <strong>Pt. 2</strong>
                  <ReactPlayer
                    width={"100%"}
                    style={{
                      display: "block",
                      margin: "0 auto",
                    }}
                    url={currentActivity.secondvideo}
                    //url="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/eviuswebassets%2FLa%20asamblea%20de%20copropietarios_%20una%20pesadilla%20para%20muchos.mp4?alt=media&token=b622ad2a-2d7d-4816-a53a-7f743d6ebb5f"
                    controls
                  />
                </div>
              )}


              <p className="has-text-left is-size-6-desktop">
                {usuarioRegistrado && (
                  <Button
                    type="primary"
                    disabled={currentActivity.meeting_id ? false : true}
                    onClick={() =>
                      toggleConference(
                        true,
                        currentActivity.meeting_id,
                        currentActivity
                      )
                    }>
                    {currentActivity.meeting_id ? "Ir Conferencia en Vivo" : "Aún no empieza Conferencia Virtual"}
                  </Button>
                )}
              </p>

              {/* Nombre del evento */}

              {/* {currentActivity.meeting_video && (
                <ReactPlayer
                  style={{
                    display: "block",
                    margin: "0 auto",
                  }}
                  width="100%"
                  height="auto"
                  url={currentActivity.meeting_video}
                  controls
                />
              )} */}
            </div>
          </header>

          <div className="card-content has-text-left container_calendar-description">
            <div className="calendar-category has-margin-top-7">
              {/* Tags de categorias */}
              {currentActivity.activity_categories.map((cat, key) => (
                <span
                  key={key}
                  style={{
                    background: cat.color,
                    color: cat.color ? "white" : "",
                  }}
                  className="tag category_calendar-tag">
                  {cat.name}
                </span>
              ))}

              <span className="tag category_calendar-tag">
                {currentActivity.meeting_id ? "Tiene espacio virtual" : "No tiene espacio Virtual"}
              </span>
            </div>

            {/* Boton de para acceder a la conferencia */}

            {/*
             event.allow_register
              -Si es un usuario anónimo y evento privado
              --Evento Restringido: Ingresa al sistema con tu usuario para poder  acceder al evento, 
              recuerda que debes estar previamente registrado al evento
              --Botón de Login: [Ir a Ingreso] Se debe mostrar el botón para llevar al login
              después del login idealmente treaerlo de regreso al evento

              -Si es un usuario logueado, evento privado pero no esta registrado en el evento
              --Evento Restringido: Debes estar previamente registrado al evento para acceder al espacio en vivo
                comunicate con el organizador del evento
              
             */}

            <div
              className="is-size-5-desktop has-margin-top-10 has-margin-bottom-10"
              dangerouslySetInnerHTML={{ __html: currentActivity.description }}
            />

            <Row>
              <Col span={24}>
                <AttendeeNotAllowedCheck
                  event={event}
                  currentUser={currentUser}
                  usuarioRegistrado={usuarioRegistrado}
                  currentActivity={currentActivity}
                />
              </Col>
            </Row>

            <hr />
            <hr />
            <div>
              {
                showSurvey && (
                  <div style={{}} className="has-text-left is-size-6-desktop">
                    <p>
                      <b>Encuestas:</b>
                    </p>
                    <SurveyComponent event={event} activity={currentActivity} usuarioRegistrado={usuarioRegistrado} />
                  </div>
                )
              }
            </div>

            {currentActivity.hosts.length === 0 ? (
              <div></div>
            ) : (
                <div className="List-conferencistas">
                  <p style={{ marginTop: "5%", marginBottom: "5%" }} className="has-text-left is-size-6-desktop">
                    {
                      orderedHost.length > 0 ? (
                        <>
                          <p>
                            <b>Panelistas:</b>
                          </p>
                          <Col xs={24} sm={22} md={18} lg={18} xl={22} style={{ margin: "0 auto" }}>
                            <Card style={{ textAlign: "left", paddingBottom: 17 }}>
                              <List
                                itemLayout="horizontal"
                                dataSource={orderedHost}
                                renderItem={(item) => (
                                  <List.Item>
                                    <List.Item.Meta
                                      avatar={
                                        <Avatar
                                          size={80}
                                          src={
                                            item.image
                                              ? item.image
                                              : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                          }
                                        />
                                      }
                                      title={<strong>{item.name}</strong>}
                                      description={item.profession}
                                    />
                                    <div className="btn-list-confencista"><Button className="button_lista" onClick={() => getSpeakers(item._id)}>Ver detalle</Button></div>
                                  </List.Item>
                                )}
                              />
                              {idSpeaker ? <ModalSpeaker showModal={true} eventId={event._id} speakerId={idSpeaker} /> : <></>}
                            </Card>
                          </Col>
                        </>
                      ) : (
                          <></>
                        )
                    }
                  </p>
                </div>
              )}

            {currentActivity && currentActivity.selected_document && currentActivity.selected_document.length > 0 && (
              <div>
                {console.log('selected document', currentActivity.selected_document)}
                <div style={{ marginTop: "5%", marginBottom: "5%" }} className="has-text-left is-size-6-desktop">
                  <b>Documentos:</b> &nbsp;
                  <div>
                    <DocumentsList data={currentActivity.selected_document} />
                  </div>
                </div>
              </div>
            )}

            {currentUser.names ? (
              <div />
            ) : (
                <div>
                  {currentActivity.meeting_id ? (
                    <div>
                      <Button
                        type="primary"
                        disabled={currentActivity.meeting_id ? false : true}
                        onClick={() =>
                          toggleConference(
                            true,
                            currentActivity.meeting_id,
                            currentActivity
                          )
                        }>
                        Conferencia en Vivo en anónimo
                    </Button>
                    </div>
                  ) : (
                      <div />
                    )}
                </div>
              )}

            <hr></hr>
            <br />
            <br />
            {/* Descripción del evento */}

            <div
              className="card-footer is-12 is-flex"
              style={{
                borderTop: "none",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}>
              {/* <button
                  <div
                    className="is-size-5-desktop has-margin-bottom-10"
                    dangerouslySetInnerHTML={{
                      __html: currentActivity.description
                    }}
                  />
                  <div
                    className="card-footer is-12 is-flex"
                    style={{
                      borderTop: "none",
                      justifyContent: "space-between",
                      alignItems: "flex-end"
                    }}
                  >
                    {/* <button
            className="button button-color-agenda has-text-light is-pulled-right is-medium"
            onClick={() => this.registerInActivity(agenda._id)}
          >
            Inscribirme
          </button> */}

              <a
                className=""
                onClick={() => {
                  gotoActivityList();
                }}>
                <Button>Regresar a la agenda</Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default withRouter(AgendaActividadDetalle);
