import React from "react";
import Moment from "moment";
import ReactPlayer from "react-player";
import { List, Button, Drawer } from 'antd';
import { NavLink, Link, withRouter } from 'react-router-dom';
import SurveyComponent from "./surveys/surveyComponent";
import { PageHeader } from 'antd';

let agendaActividadDetalle = (props) => {
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
              {
                currentActivity.meeting_video && <ReactPlayer
                  style={{ maxWidth: "100%" }}
                  url={currentActivity.meeting_video}
                  controls
                />
              }
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
                  className="tag category_calendar-tag"
                >
                  {cat.name}
                </span>
              ))}
            </div>
            <div>
              <p className="has-text-left is-size-6-desktop">
                <b>Encuestas</b>
                <div>
                  {/* Se enlista la encuesta y se valida si esta activa o no, si esta activa se visualizará el boton de responder */}
                  <List itemLayout="horizontal" dataSource={survey.data} renderItem={item => (
                    <List.Item actions={
                      [
                        item.publish === "true" ?
                          <Button type="primary" onClick={showDrawer}>
                            Contestar Encuesta
                          </Button>
                          :
                          <div></div>
                      ]
                    }>
                      <List.Item.Meta
                        title={
                          <div>
                            <p>{item.survey}</p>
                          </div>
                        }
                      />
                      <List.Item>
                        {
                          console.log(item),
                          <div>

                          </div>
                        }
                      </List.Item>

                      <Drawer
                          title={item.survey}
                          placement="right"
                          closable={false}
                          onClose={onClose}
                          visible={visible}
                        >
                          <SurveyComponent idSurvey={item._id} eventId={item.event_id} />
                        </Drawer>
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
              onClick={() => showIframe(true, currentActivity.meeting_id)}
            >
              {currentActivity.meeting_id
                ? "Conferencia en Vivo"
                : "Sin Conferencia Virtual"}
            </button>

            <hr></hr>
            <br />
            <br />
            {/* Descripción del evento */}

            <div
              className="is-size-5-desktop has-margin-bottom-10"
              dangerouslySetInnerHTML={{
                __html: currentActivity.description
              }}
            />

            {/* Conferencistas del evento */}
            <p className="has-text-left is-size-6-desktop">
              <b>Conferencista:</b> &nbsp;
              {currentActivity.hosts.map((speaker, key) => (
                <span key={key}>{speaker.name}, &nbsp;</span>
              ))}
            </p>

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
                }}
              >
                <h3 className=""> Regresar a la agenda</h3>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(agendaActividadDetalle) 