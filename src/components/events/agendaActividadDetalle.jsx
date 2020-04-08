import React from "react";
import Moment from "moment";
import ReactPlayer from "react-player";

export default props => {
  const { currentActivity, gotoActivityList, showIframe } = props;
  return (
    <div className="container-calendar-section">
      <h3 style={{ paddingBottom: 30 }} className="title is-4">
        {currentActivity.name}
      </h3>

      <a
        className=""
        onClick={e => {
          gotoActivityList();
        }}
      >
        <h3 className=""> Regresar a la agenda</h3>
      </a>

      <div className="container_agenda-information is-three-fifths">
        <div className="card agenda_information ">
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
