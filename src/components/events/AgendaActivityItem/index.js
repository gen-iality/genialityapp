import React, { useState, useEffect } from 'react'
import { Button, Row, Col, Tag, Avatar, Alert } from "antd";
import ReactPlayer from "react-player";
import Moment from "moment";

export default function AgendaActivityItem({
  item, 
  showButtonSurvey,
  showButtonDocuments,
  toggleConference,
  event_image,
  gotoActivity,
  registerStatus,
  registerInActivity,
  eventId,
  userId
}) {

const [isRegistered, setIsRegistered] = useState(false)

useEffect(() => {
  setIsRegistered(registerStatus)  
},[registerStatus])

return (
  <div className="container_agenda-information">
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
            )
            : (
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
              <div onClick={() => { gotoActivity(item) }} className="text-align-card" style={{ marginBottom: "5%" }}>
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
                          <Col key={key} lg={24} xl={12} xxl={12} style={{ marginBottom: 13 }}>
                            <span  style={{ fontSize: 20, fontWeight: 500 }}>
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
                  <Row>
                    <Button 
                    type="primary" 
                    onClick={() => registerInActivity(
                      item._id, 
                      eventId, 
                      userId, 
                      setIsRegistered)} className="space-align-block" 
                    disabled={isRegistered}>
                      {isRegistered ? 'Inscrito' : 'Inscribirme'}
                    </Button>
                  </Row>
                </Col>

                <Col span={12}>
                  <Row>
                    {
                      showButtonDocuments && (
                        <Button type="primary" onClick={() => { gotoActivity(item) }} className="space-align-block">
                          Documentos
                        </Button>
                      )
                    }
                  </Row>
                  <Row>
                    {
                      showButtonSurvey && (
                        <Button type="primary" onClick={() => { gotoActivity(item) }} className="space-align-block">
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
                  <img src={item.image ? item.image : event_image} />
                )
              }
              <div>
                {
                  item.habilitar_ingreso === "closed_meeting_room" && (
                    <>
                      <img src={item.image ? item.image : event_image} />
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
                            <img src={item.image ? item.image : event_image} />
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
                      } src={item.image ? item.image : event_image} />
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
      )
}
