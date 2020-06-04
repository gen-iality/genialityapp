import Moment from "moment";
import ReactPlayer from "react-player";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FormattedDate, FormattedMessage, FormattedTime } from "react-intl";
import * as Cookie from "js-cookie";
import API, { OrganizationApi, EventsApi, SpeakersApi } from "../../helpers/request";
import { firestore } from "../../helpers/firebase";
import { addLoginInformation, showMenu } from "../../redux/user/actions";

import { NavLink, Link, withRouter } from "react-router-dom";
import SurveyComponent from "./surveys";
import { PageHeader, Alert, Row, Col, Tag, Button, List, Avatar, Card, Modal } from "antd";
import AttendeeNotAllowedCheck from "./shared/attendeeNotAllowedCheck";

import DocumentsList from "../documents/documentsList";
import { UserOutlined } from "@ant-design/icons";
import ModalSpeaker from "./modalSpeakers";

let agendaActividadDetalle = (props) => {
  let [usuarioRegistrado, setUsuarioRegistrado] = useState(false);
  let [currentUser, setCurrentUser] = useState(false);
  let [event, setEvent] = useState(false);
  let [modalVisible, setModalVisible] = useState(false);
  let [idSpeaker, setIdSpeaker] = useState(false);

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



      //      me / eventusers / event / { event_id }

      try {
        const respuesta = await API.get("api/me/eventusers/event/" + id);
        console.log("respuesta", respuesta.data.data);
        if (respuesta.data && respuesta.data.data && respuesta.data.data.length) {
          setUsuarioRegistrado(true);
        }
      } catch (e) {

      }

    })();
  }, [props.match.params.event]);

  async function getSpeakers(idSpeaker) {
    setIdSpeaker(idSpeaker);
  }

  const { showDrawer, onClose, survey, currentActivity, gotoActivityList, toggleConference, visible } = props;
  return (
    <div className="columns container-calendar-section is-centered">
      <div className=" container_agenda-information container-calendar is-three-fifths">
        <div className="card agenda_information ">
          <PageHeader
            className="site-page-header"
            onBack={(e) => {
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
              {/* Lugar del evento */}
              <p className="has-text-left is-size-6-desktop">
                <b>Lugar:</b> {currentActivity.space.name}
              </p>
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
              <span className="card-header-title has-text-left"></span>
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

              {!currentActivity.meeting_video && currentActivity.image && (
                <img className="activity_image" src={currentActivity.image} />
              )}
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
              <div style={{}} className="has-text-left is-size-6-desktop">
                <p>
                  <b>Encuestas:</b>
                </p>
                <SurveyComponent event={event} activity={currentActivity} usuarioRegistrado={usuarioRegistrado} />
              </div>
            </div>

            {currentActivity.hosts.length === 0 ? (
              <div></div>
            ) : (
                <div>
                  <p style={{ marginTop: "5%", marginBottom: "5%" }} className="has-text-left is-size-6-desktop">
                    <p>
                      <b>Conferencistas:</b>
                    </p>
                    <Col xs={24} sm={22} md={18} lg={18} xl={22} style={{ margin: "0 auto" }}>
                      <Card style={{ textAlign: "left" }}>
                        <List
                          itemLayout="horizontal"
                          dataSource={currentActivity.hosts}
                          renderItem={(item) => (
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
                              <Button onClick={() => getSpeakers(item._id)}>Ver detalle</Button>
                            </List.Item>
                          )}
                        />
                        {idSpeaker ? <ModalSpeaker showModal={true} eventId={event._id} speakerId={idSpeaker} /> : <></>}
                      </Card>
                    </Col>
                  </p>
                </div>
              )}

            {currentActivity && currentActivity.selected_document && currentActivity.selected_document.length > 0 && (
              <div>
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
                onClick={(e) => {
                  gotoActivityList();
                }}>
                <Button>Regresar a la agenda</Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(agendaActividadDetalle);
