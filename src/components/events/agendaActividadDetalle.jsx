import Moment from "moment";
import ReactPlayer from "react-player";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FormattedDate, FormattedMessage, FormattedTime } from "react-intl";
import * as Cookie from "js-cookie";
import API, { OrganizationApi, EventsApi } from "../../helpers/request";
import { firestore } from "../../helpers/firebase";
import { addLoginInformation, showMenu } from "../../redux/user/actions";

import { NavLink, Link, withRouter } from "react-router-dom";
import { List, Avatar } from "antd";
import SurveyComponent from "./surveys/surveyComponent";
import { PageHeader, Alert, Row, Col, Tag, List, Button, Drawer } from "antd";
import AttendeeNotAllowedCheck from "./shared/attendeeNotAllowedCheck";

let agendaActividadDetalle = props => {
  let [usuarioRegistrado, setUsuarioRegistrado] = useState(false);
  let [currentUser, setCurrentUser] = useState(false);
  let [event, setEvent] = useState(false);

  useEffect(() => {
    (async () => {
      //Id del evento
      var id = props.match.params.event;
      const event = await EventsApi.landingEvent(id);
      setEvent(event);

      if (currentUser) return;

      let evius_token = Cookie.get("evius_token");
      console.log("token", evius_token);
      if (!evius_token) return;

      const resp = await API.get(`/auth/currentUser?evius_token=${Cookie.get("evius_token")}`);
      console.log("respuesta status", resp.status !== 202);
      if (resp.status !== 200 && resp.status !== 202) return;

      const data = resp.data;

      setCurrentUser(data);

      const userRef = firestore
        .collection(`${id}_event_attendees`)
        .where("properties.email", "==", data.email)
        .get()
        .then(snapshot => {
          if (snapshot.empty) {
            toast.error("Usuario no inscrito a este evento, contacte al administrador");
            console.log("No matching documents.");
            return;
          }

          console.log("USUARIO REGISTRADO.");

          snapshot.forEach(doc => {
            var user = firestore.collection(`${id}_event_attendees`).doc(doc.id);
            console.log(doc.id, "=>", doc.data());
            user
              .update({
                updated_at: new Date(),
                checked_in: true,
                checked_at: new Date()
              })
              .then(() => {
                // Disminuye el contador si la actualizacion en la base de datos se realiza
                console.log("Document successfully updated!");
                toast.success("Usuario Chequeado");
                setUsuarioRegistrado(true);
              })
              .catch(error => {
                console.error("Error updating document: ", error);
                toast.error(<FormattedMessage id="toast.error" defaultMessage="Error :(" />);
              });
          });
        })
        .catch(err => {
          console.log("Error getting documents", err);
        });

      console.log("data ", data);
    })();
  }, []);

  const { showDrawer, onClose, survey, currentActivity, gotoActivityList, showIframe, visible } = props;
  return (
    <div className="columns container-calendar-section is-centered">
      <div className=" container_agenda-information container-calendar is-three-fifths">
        <div className="card agenda_information ">
          <PageHeader
            className="site-page-header"
            onBack={e => {
              gotoActivityList();
            }}
            title={currentActivity.name}
          />
          <header className="card-header columns has-padding-left-7">
            <div className="is-block is-11 column is-paddingless">
              {/* Hora del evento */}
              <p className="card-header-title ">
                {Moment(currentActivity.datetime_start).format("h:mm a")} -{" "}
                {Moment(currentActivity.datetime_end).format("h:mm a")}
              </p>

              {/* Nombre del evento */}
              <span className="card-header-title has-text-left"></span>
              {currentActivity.meeting_video && (
                <ReactPlayer style={{ maxWidth: "100%" }} url={currentActivity.meeting_video} controls />
              )}
            </div>
          </header>

          <div className="card-content has-text-left container_calendar-description">
            {/* Lugar del evento */}
            <p className="has-text-left is-size-6-desktop">
              <b>Lugar:</b> {currentActivity.space.name}
            </p>
            <div className="calendar-category has-margin-top-7">
              {/* Tags de categorias */}
              {currentActivity.activity_categories.map((cat, key) => (
                <span
                  key={key}
                  style={{
                    background: cat.color,
                    color: cat.color ? "white" : ""
                  }}
                  className="tag category_calendar-tag">
                  {cat.name}
                </span>
              ))}
            </div>
            <div>
              <div className="has-text-left is-size-6-desktop">
                <b>Encuestas</b>
                <div>
                  {/* Se enlista la encuesta y se valida si esta activa o no, si esta activa se visualizará el boton de responder */}
                  <List
                    itemLayout="horizontal"
                    dataSource={survey.data}
                    renderItem={item => (
                      <List.Item
                        actions={[
                          item.publish === "true" ? (
                            <Button type="primary" onClick={showDrawer}>
                              Contestar Encuesta
                            </Button>
                          ) : (
                            <div></div>
                          )
                        ]}>
                        <List.Item.Meta
                          title={
                            <div>
                              <p>{item.survey}</p>
                              {item.publish === "true" ? (
                                <div>
                                  <Drawer
                                    title={item.survey}
                                    placement="right"
                                    closable={false}
                                    onClose={onClose}
                                    visible={visible}>
                                    <SurveyComponent idSurvey={item._id} eventId={item.event_id} />
                                  </Drawer>
                                </div>
                              ) : (
                                <div>
                                  <Drawer
                                    title={item.survey}
                                    placement="right"
                                    closable={false}
                                    onClose={onClose}
                                    visible={false}>
                                    <SurveyComponent idSurvey={item._id} eventId={item.event_id} />
                                  </Drawer>
                                </div>
                              )}
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </div>
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

            <h2 className="button is-success"> Tiene Espacio Virtual </h2>
            {console.log(usuarioRegistrado, currentUser)}
            <Row>
              <Col span={24}>
                <AttendeeNotAllowedCheck
                  event={event}
                  currentUser={currentUser}
                  usuarioRegistrado={usuarioRegistrado}
                  currentActivity={currentActivity}
                />

                {usuarioRegistrado && (
                  <Button
                    type="primary"
                    disabled={currentActivity.meeting_id ? false : true}
                    onClick={() => showIframe(true, currentActivity.meeting_id)}>
                    {currentActivity.meeting_id ? "Ir Conferencia en Vivo" : "Aún no empieza Conferencia Virtual"}
                  </Button>
                )}
              </Col>
            </Row>

            <hr />
            <hr />
            {/* Descripción del evento */}

            {currentActivity.hosts.length === 0 ? (
              <div></div>
            ) : (
              <div>
                <p style={{ marginTop: "5%", marginBottom: "5%" }} className="has-text-left is-size-6-desktop">
                  <b>Conferencista:</b> &nbsp;
                  <div>
                    <List
                      itemLayout="horizontal"
                      dataSource={currentActivity.hosts}
                      renderItem={item => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <Avatar
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
                        </List.Item>
                      )}
                    />
                  </div>
                </p>
              </div>
            )}
            {/* Conferencistas del evento */}
            <div>
              <p className="has-text-left is-size-6-desktop">
                <b>Encuestas</b>
                <div>
                  {/* Se enlista la encuesta y se valida si esta activa o no, si esta activa se visualizará el boton de responder */}
                  <List
                    itemLayout="horizontal"
                    dataSource={survey.data}
                    renderItem={item => (
                      <List.Item
                        actions={[
                          item.publish === "true" ? (
                            <Button type="primary" onClick={showDrawer}>
                              Contestar Encuesta
                            </Button>
                          ) : (
                            <div></div>
                          )
                        ]}>
                        <List.Item.Meta
                          title={
                            <div>
                              <p>{item.survey}</p>
                              {item.publish === "true" ? (
                                <div>
                                  <Drawer
                                    title={item.survey}
                                    placement="right"
                                    closable={false}
                                    onClose={onClose}
                                    visible={visible}>
                                    <SurveyComponent idSurvey={item._id} eventId={item.event_id} />
                                  </Drawer>
                                </div>
                              ) : (
                                <div>
                                  <Drawer
                                    title={item.survey}
                                    placement="right"
                                    closable={false}
                                    onClose={onClose}
                                    visible={false}>
                                    <SurveyComponent idSurvey={item._id} eventId={item.event_id} />
                                  </Drawer>
                                </div>
                              )}
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </p>
            </div>
            {/* Boton de para acceder a la conferencia */}
            <button
              className="button is-success is-outlined is-pulled-right has-margin-top-20"
              disabled={currentActivity.meeting_id ? false : true}
              onClick={() => showIframe(true, currentActivity.meeting_id)}>
              {currentActivity.meeting_id ? "Conferencia en Vivo" : "Sin Conferencia Virtual"}
            </button>

            <hr></hr>
            <br />
            <br />
            {/* Descripción del evento */}

            <div
              className="card-footer is-12 is-flex"
              style={{
                borderTop: "none",
                justifyContent: "space-between",
                alignItems: "flex-end"
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
                onClick={e => {
                  gotoActivityList();
                }}>
                <h3 className=""> Regresar a la agenda</h3>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(agendaActividadDetalle);
