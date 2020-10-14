import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Tag, Avatar, Alert, Card } from 'antd';
import ReactPlayer from 'react-player';
import Moment from 'moment';
import './style.scss';
import { firestore } from '../../../helpers/firebase';

export default function AgendaActivityItem({
  item,
  Surveys,
  Documents,
  btnDetailAgenda,
  toggleConference,
  event_image,
  gotoActivity,
  registerStatus,
  registerInActivity,
  eventId,
  userId,
  show_inscription
}) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [related_meetings, setRelatedMeetings] = useState();

  useEffect(() => {
    if (registerStatus) {
      setIsRegistered(registerStatus);
    }

    listeningStateMeetingRoom();
  }, [registerStatus, listeningStateMeetingRoom]);

  const listeningStateMeetingRoom = async () => {
    await firestore
      .collection('languageState')
      .doc(item._id)
      .onSnapshot((info) => {
        if (!info.exists) return;
        let related_meetings = info.data().related_meetings;
        setRelatedMeetings(related_meetings);
      });
  };

  return (
    <div className='container_agenda-information'>
      <div className='card agenda_information'>
        <Row align='middle'>
          <Row>
            {eventId != '5f8099c29564bf4ee44da4f3' && (
              <span className='date-activity'>
                {Moment(item.datetime_start).format('DD MMMM YYYY') ===
                Moment(item.datetime_end).format('DD MMMM YYYY') ? (
                  <>
                    {Moment(item.datetime_start).format('DD MMMM YYYY h:mm a')} -{' '}
                    {Moment(item.datetime_end).format('h:mm a')}
                  </>
                ) : (
                  Moment(item.datetime_start).format('DD MMMM YYYY hh:mm') -
                  Moment(item.datetime_end).format('DD MMMM YYYY hh:mm')
                )}
              </span>
            )}
            <p>
              <span className='card-header-title text-align-card'>{item.name}</span>
            </p>
          </Row>
          <hr className='line-head' />
          <Col className='has-text-left' xs={24} sm={12} md={12} lg={12} xl={16}>
            {/* <span className='tag category_calendar-tag'>
              {item.meeting_id || item.vimeo_id ? 'Tiene espacio virtual' : 'No tiene espacio Virtual'}
            </span> */}
            <div
              onClick={() => {
                gotoActivity(item);
              }}
              className='text-align-card'
              style={{ marginBottom: '5%' }}>
              {item.activity_categories.length > 0 && (
                <>
                  <b>Tags: </b>
                  {item.activity_categories.map((item) => (
                    <>
                      <Tag color={item.color ? item.color : '#ffffff'}>{item.name}</Tag>
                    </>
                  ))}
                </>
              )}
            </div>
            <div className='text-align-card'>
              {item.hosts.length > 0 && (
                <>
                  <b>Presenta: </b>
                  <br />
                  <br />
                  <Row>
                    {item.hosts.map((speaker, key) => (
                      <Col key={key} lg={24} xl={12} xxl={12} style={{ marginBottom: 13 }}>
                        <span style={{ fontSize: 20, fontWeight: 500 }}>
                          <Avatar size={50} src={speaker.image} /> {speaker.name} &nbsp;
                        </span>
                      </Col>
                    ))}
                  </Row>
                </>
              )}
            </div>
            <div className='text-align-card'>
              {
                <>
                  <Row>
                    <div
                      className='is-size-5-desktop has-margin-top-10 has-margin-bottom-10'
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  </Row>
                </>
              }
            </div>
            <Row>
              <Col span={12}>
                {show_inscription === 'true' && (
                  <Button
                    type='primary'
                    onClick={() => registerInActivity(item._id, eventId, userId, setIsRegistered)}
                    className='space-align-block button-Agenda'
                    disabled={isRegistered}>
                    {isRegistered ? 'Inscrito' : 'Inscribirme'}
                  </Button>
                )}

                {btnDetailAgenda === 'true' && (
                  <Button
                    type='primary'
                    onClick={() => {
                      gotoActivity(item);
                    }}
                    className='space-align-block button-Agenda'>
                    Detalle de actividad
                  </Button>
                )}
                {Documents &&
                  Documents.length > 0 &&
                  Documents.filter((element) => element.activity_id === item._id).length > 0 && (
                    <Button
                      type='primary'
                      onClick={() => {
                        gotoActivity(item);
                      }}
                      className='space-align-block button-Agenda'>
                      Documentos
                    </Button>
                  )}
                {Surveys &&
                  Surveys.length > 0 &&
                  Surveys.filter((element) => element.activity_id === item._id).length > 0 && (
                    <Button
                      type='primary'
                      onClick={() => {
                        gotoActivity(item);
                      }}
                      className='space-align-block button-Agenda'>
                      Encuestas
                    </Button>
                  )}
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={8}>
            {!item.habilitar_ingreso && <img src={item.image ? item.image : event_image} />}
            <div>
              {item.habilitar_ingreso === 'closed_meeting_room' && (
                <>
                  <img src={item.image ? item.image : event_image} />
                  <Alert
                    message={`La sesión inicia: ${Moment(item.datetime_start).format(
                      'DD MMMM YYYY h:mm a'
                    )} ${' - '} ${Moment(item.datetime_end).format('h:mm a')}`}
                    type='warning'
                  />
                </>
              )}
              {item.habilitar_ingreso === 'ended_meeting_room' && (
                <>
                  {item.video ? (
                    item.video && (
                      <>
                        <Alert message='Conferencia Terminada. Observa el video Aquí' type='success' />
                        <ReactPlayer
                          width={'100%'}
                          style={{
                            display: 'block',
                            margin: '0 auto'
                          }}
                          url={item.video}
                          //url="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/eviuswebassets%2FLa%20asamblea%20de%20copropietarios_%20una%20pesadilla%20para%20muchos.mp4?alt=media&token=b622ad2a-2d7d-4816-a53a-7f743d6ebb5f"
                          controls
                          config={{
                            file: { attributes: { controlsList: 'nodownload' } }
                          }}
                        />
                      </>
                    )
                  ) : (
                    <>
                      <img src={item.image ? item.image : event_image} />
                      <Alert
                        message={`La Conferencia ha Terminado: ${Moment(item.datetime_start).format(
                          'DD MMMM YYYY h:mm a'
                        )} ${' - '} ${Moment(item.datetime_end).format('h:mm a')}`}
                        type='info'
                      />
                    </>
                  )}
                </>
              )}
              {item.habilitar_ingreso === 'open_meeting_room' && (
                <>
                  <img
                    onClick={() => item.meeting_id && toggleConference(true, item.meeting_id, item)}
                    src={item.image ? item.image : event_image}
                  />
                  <div>
                    <Button
                      block
                      type='primary'
                      disabled={item.meeting_id ? false : true}
                      onClick={() => toggleConference(true, item.meeting_id, item)}>
                      {item.meeting_id ? 'Observa aquí la Conferencia en Vivo' : 'Aún no empieza Conferencia Virtual'}
                    </Button>
                  </div>
                  <br />
                  <Row>
                    {related_meetings &&
                      related_meetings.map((item, key) => (
                        <>
                          {item.state === 'open_meeting_room' && (
                            <Button
                              disabled={item.meeting_id || item.vimeo_id ? false : true}
                              onClick={() =>
                                toggleConference(true, item.meeting_id ? item.meeting_id : item.vimeo_id, item)
                              }
                              type='primary'
                              className='button-Agenda'
                              key={key}>
                              {item.informative_text}
                            </Button>
                          )}
                          {item.state === 'closed_meeting_room' && (
                            <Alert message={`La  ${item.informative_text} no ha iniciado`} type='info' />
                          )}

                          {item.state === 'ended_meeting_room' && (
                            <Alert message={`La ${item.informative_text} ha terminado`} type='info' />
                          )}
                        </>
                      ))}
                  </Row>
                </>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
