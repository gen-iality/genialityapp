import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'moment';
import ReactPlayer from 'react-player';
import { FormattedMessage, useIntl } from 'react-intl';
import API, { EventsApi, SurveysApi } from '../../helpers/request';
import { PageHeader, Row, Col, Button, List, Avatar, Card, Tabs } from 'antd';
import { firestore } from '../../helpers/firebase';
import AttendeeNotAllowedCheck from './shared/attendeeNotAllowedCheck';
import ModalSpeaker from './modalSpeakers';
import DocumentsList from '../documents/documentsList';
import RootPage from './surveys/rootPage';
import * as StageActions from '../../redux/stage/actions';
import Game from './game';
import styles from './agendaActividadDetalle.module.css';
import EnVivo from '../../EnVivo.svg';
import {
  CaretRightOutlined,
  CommentOutlined,
  LoadingOutlined,
  PieChartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import RankingTrivia from './zoomComponent/rankingTrivia';
const { TabPane } = Tabs;

const { gotoActivity } = StageActions;

let AgendaActividadDetalle = (props) => {
  // Informacion del usuario Actual, en caso que no haya sesion viene un null por props
  let [usuarioRegistrado, setUsuarioRegistrado] = useState(false);
  let [event, setEvent] = useState(false);
  let [idSpeaker, setIdSpeaker] = useState(false);
  let [showSurvey, setShowSurvey] = useState(false);
  let [orderedHost, setOrderedHost] = useState([]);
  const [meetingState, setMeetingState] = useState(null);
  const [meeting_id, setMeeting_id] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [contentDisplayed, setContentDisplayed] = useState('');
  const intl = useIntl();
  const url_conference = `https://gifted-colden-fe560c.netlify.com/?meetingNumber=`;
  const [currentSurvey, setcurrentSurvey] = useState(null);
  const [videoStyles, setVideoStyles] = useState(null);

  const [activeTab, setActiveTab] = useState('description');
  let option = props.option;
  console.log("OPTION AGENDA");
  console.log(option)
  let eventInfo=props.eventInfo;
  
  console.log("EVENT INFO");
  console.log(eventInfo);

  const [tabSel, settabSel] = useState('description');

  useEffect(() => {
    console.log('start detail activity');

    return () => {
      props.gotoActivity(null);
    };
  }, []);

  useEffect(() => {
    const checkContentToDisplay = () => {
      if (platform !== '' && platform === null && meeting_id !== '' && meeting_id !== null) {
        setContentDisplayed('videoconference');
      }
    };
    checkContentToDisplay();
  }, [platform, meeting_id]);

  useEffect(() => {
    if (option === 'surveyDetalle' || option === 'game') {
      setVideoStyles({
        zIndex: '90000',
        position: 'fixed',
        right: '0',
        bottom: '0',
        width: '170px',
        transition: '300ms',
        width:'100% !important'
      });
    } else {
      setVideoStyles({ width: '100%', height: '450px', transition: '300ms' });
    }
  }, [option]);
  function callback(key) {
    setActiveTab(key);
  }

  async function listeningStateMeetingRoom(event_id, activity_id) {
    firestore
      .collection('events')
      .doc(event_id)
      .collection('activities')
      .doc(activity_id)
      .onSnapshot((infoActivity) => {
        if (!infoActivity.exists) return;
        const { habilitar_ingreso, meeting_id, platform } = infoActivity.data();
        setMeetingState(habilitar_ingreso);
        setMeeting_id(meeting_id);
        setPlatform(platform);
      });
  }

  const mountCurrentSurvey = (survey) => {
    setcurrentSurvey(survey);
  };

  const unMountCurrentSurvey = () => {
    setcurrentSurvey(null);
  };
  console.log('ACTIVITY=>' + props.currentActivity);
  useEffect(() => {
    (async () => {
      //Id del evento

      var id = props.match.params.event;
      const event = await EventsApi.landingEvent(id);
      setEvent(event);
      console.log("EVENTO")
      console.log(event);

      await listeningStateMeetingRoom(event._id, props.currentActivity._id);

      try {
        const respuesta = await API.get('api/me/eventusers/event/' + id);
        let surveysData = await SurveysApi.getAll(event._id);
        const currentActivityId = props.currentActivity._id;

        if (surveysData.data.length > 0) {
          //Si hay una actividad que haga match con el listado de encuestas entonces habilitamos el componente survey
          surveysData.data.map((item) => {
            if (item.activity_id === currentActivityId) {
              setShowSurvey(true);
            }
          });
        }

        if (respuesta.data && respuesta.data.data && respuesta.data.data.length) {
          setUsuarioRegistrado(true);
        }
      } catch (err) {
        console.error(err);
      }

      function orderHost() {
        let hosts = props.currentActivity.hosts;
        hosts.sort(function(a, b) {
          return a.order - b.order;
        });
        setOrderedHost(hosts);
      }
      orderHost();
    })();
  }, [props.match.params.event, props.currentActivity]);

  async function getSpeakers(idSpeaker) {
    setIdSpeaker(idSpeaker);
  }

  const getMeetingPath = (platform) => {
    const { displayName, email } = props.userInfo;
    if (platform === 'zoom') {
      return url_conference + meeting_id + `&userName=${displayName}` + `&email=${email}`;
    } else if (platform === 'vimeo') {
      return `https://player.vimeo.com/video/${meeting_id}`;
    }
  };

  const { currentActivity, gotoActivity, toggleConference, image_event } = props;

  return (
    <div className='is-centered'>
      <div className=' container_agenda-information container-calendar2 is-three-fifths'>
        <Card
          style={{ padding: '0 !important' }}
          title={
            <Row>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '7vh',
                  width: '5vw',
                }}>
                <Col style={{ marginLeft: '2vw' }}>
                  <Row type='flex' style={{ alignItems: 'center', justifyContent: 'center' }}>
                    {meetingState === 'ended_meeting_room' && (currentActivity.image || image_event) ? (
                      <CommentOutlined style={{ fontSize: '30px' }} />
                    ) : meetingState === '' || meetingState == null ? (
                      <CommentOutlined style={{ fontSize: '30px' }} />
                    ) : meetingState === 'closed_meeting_room' ? (
                      <LoadingOutlined style={{ fontSize: '30px' }} />
                    ) : meetingState === 'ended_meeting_room' && currentActivity.video ? (
                      <CaretRightOutlined style={{ fontSize: '30px' }} />
                    ) : (
                      <img style={{ height: '4vh', width: '4vh' }} src={EnVivo} alt='React Logo' />
                    )}
                  </Row>
                  <Row style={{ height: '2vh', fontSize: 11, fontWeight: 'normal' }}>
                    {meetingState === 'ended_meeting_room' && (currentActivity.image || image_event)
                      ? 'Terminada'
                      : meetingState === '' || meetingState == null
                      ? ' '
                      : meetingState === 'closed_meeting_room'
                      ? 'Por iniciar'
                      : meetingState === 'ended_meeting_room' && currentActivity.video
                      ? 'Grabada'
                      : 'En vivo'}
                  </Row>
                </Col>
              </div>
              <Col style={{ marginLeft: '2.5vw', marginTop: '1vh' }}>
                <div style={{ height: '5vh' }}>
                  <Row style={{ height: '3.0vh' }}>{currentActivity.name} </Row>
                  <Row style={{ height: '2.5vh', fontSize: 14, fontWeight: 'normal' }}>
                    {currentActivity.space.name}{' '}
                  </Row>
                </div>
              </Col>
            </Row>
          }
          extra={
            event._id === '5f99a20378f48e50a571e3b6' ||
            event._id === '5fca68b7e2f869277cfa31b0' ||
            event.id === '60061bfac8c0284c432069c8' ? (
              <></>
            ) : (
              <>
                <div style={{ paddingRight: '2vw', height: '5vh', textAlign: 'right !important', display: 'block' }}>
                  <Col>
                    <Row
                      style={{
                        fontSize: 14,
                        height: '3.0vh',
                        fontWeight: 'normal',
                        textAlign: 'right',
                        display: 'block',
                      }}>
                      {Moment(currentActivity.datetime_start).format('DD MMM YYYY')}{' '}
                    </Row>
                    <Row
                      style={{
                        fontSize: 14,
                        fontWeight: 'normal',
                        textAlign: 'right',
                        display: 'block',
                        height: '2.5vh',
                      }}>
                      
                        {Moment(currentActivity.datetime_start).format('h:mm a')} -{' '}
                        {Moment(currentActivity.datetime_end).format('h:mm a')}
                      
                    </Row>
                  </Col>
                </div>
              </>
            )
          }
          className={
            event._id === '5fca68b7e2f869277cfa31b0' || event._id === '5f99a20378f48e50a571e3b6'
              ? 'magicland-agenda_information'
              : 'agenda_information'
          }>
          <header className='card-header columns '>
            <div className='is-block is-12 column is-paddingless'>
              {/* Hora del evento */}
              {/* <p className='card-header-title has-padding-left-0 '>
                {Moment(currentActivity.datetime_start).format('h:mm a')} -{' '}
                {Moment(currentActivity.datetime_end).format('h:mm a')}
              </p> */}

              {/*   ******************surveyDetalle=> PARA MOSTRAR DETALLE DE ENCUESTAS  ****************  */}

              {meetingState === 'open_meeting_room' &&
                // option !== 'surveyDetalle' &&
                // option !== 'games' &&
                platform !== '' &&
                platform !== null && (
                  <iframe
                    src={getMeetingPath(platform)}
                    frameBorder='0'
                    allow='autoplay; fullscreen; camera *;microphone *'
                    allowFullScreen
                    allowusermedia
                    style={videoStyles}
                    //style={conferenceStyles}
                  ></iframe>
                )}

              {option == 'surveyDetalle' && (
                <div style={{ width: props.collapsed ? '98%' : '98%-389px' }}>
                  <RootPage
                  // event={event}
                  // currentUser={props.userEntered}
                  // activity={props.activity}
                  // availableSurveysBar={true}
                  // style={{ zIndex: 9999, width: props.collapsed ? '95vw' : '50vw-389px', height: '100%' }}
                  // mountCurrentSurvey={mountCurrentSurvey}
                  // unMountCurrentSurvey={unMountCurrentSurvey}
                  />
                </div>
              )}

              {option == 'game' && <Game />}

              {(meetingState === '' || meetingState == null) && option !== 'surveyDetalle' && option !== 'game' && (
                <div className='column is-centered mediaplayer'>
                  <img
                    className='activity_image'
                    style={{ width: '100%', height: '60vh' }}
                    src={ eventInfo.styles.banner_image? eventInfo.styles.banner_image: currentActivity.image?currentActivity.image:image_event }
                    alt='Activity'
                  />
                </div>
              )}

              {meetingState === 'closed_meeting_room' && option !== 'surveyDetalle' && option !== 'game' && (
                <div className='column is-centered mediaplayer'>
                  <img
                    className='activity_image'
                    style={{ width: '100%', height: '60vh' }}
                    src={ eventInfo.styles.banner_image? eventInfo.styles.banner_image: currentActivity.image?currentActivity.image:image_event }
                    alt='Activity'
                  />
                </div>
              )}

              {meetingState === 'ended_meeting_room' &&
              currentActivity.video &&
              option !== 'surveyDetalle' &&
              option !== 'game' ? (
                <div className='column is-centered mediaplayer'>
                  <ReactPlayer
                    width={'100%'}
                    style={{
                      display: 'block',
                      margin: '0 auto',
                    }}
                    url={currentActivity.video}
                    //url="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/eviuswebassets%2FLa%20asamblea%20de%20copropietarios_%20una%20pesadilla%20para%20muchos.mp4?alt=media&token=b622ad2a-2d7d-4816-a53a-7f743d6ebb5f"
                    controls
                  />
                </div>
              ) : (
                <>
                  {meetingState === 'ended_meeting_room' &&
                    (currentActivity.image || image_event) &&
                    option !== 'surveyDetalle' &&
                    option !== 'game' && (
                      <div>
                        <img
                          className='activity_image'
                          style={{ width: '100%', height: '60vh' }}
                          src={ eventInfo.styles.banner_image? eventInfo.styles.banner_image: currentActivity.image?currentActivity.image:image_event }
                          alt='Activity'
                        />
                      </div>
                    )}
                </>
              )}
              {/*logo quemado de aval para el evento de magicland */}
              {(event._id === '5f99a20378f48e50a571e3b6' || event._id === '5fca68b7e2f869277cfa31b0') && (
                <Row justify='center' style={{ marginTop: '6%' }}>
                  <Col span={24}>
                    <img
                      src='https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Magicland%2Fbanner.jpg?alt=media&token=4aab5da2-bbba-4a44-9bdd-d2161ea58b0f'
                      alt='aval'
                    />
                  </Col>
                </Row>
              )}
              {currentActivity.secondvideo && (
                <div className='column is-centered mediaplayer'>
                  <strong>Pt. 2</strong>
                  <ReactPlayer
                    width={'100%'}
                    style={{
                      display: 'block',
                      margin: '0 auto',
                    }}
                    url={currentActivity.secondvideo}
                    //url="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/eviuswebassets%2FLa%20asamblea%20de%20copropietarios_%20una%20pesadilla%20para%20muchos.mp4?alt=media&token=b622ad2a-2d7d-4816-a53a-7f743d6ebb5f"
                    controls
                  />
                </div>
              )}
              {/*event._id === '5fca68b7e2f869277cfa31b0' || event._id === '5f99a20378f48e50a571e3b6' ? (
                <></>
              ) : (
                <p className='has-text-left is-size-6-desktop'>
                  {usuarioRegistrado && meetingState && (
                    <Button
                      type='primary'
                      disabled={meetingState === 'open_meeting_room' && meeting_id ? false : true}
                      onClick={() => toggleConference(true, meeting_id, currentActivity)}>
                      {meeting_id && meetingState === 'open_meeting_room' && intl.formatMessage({ id: 'live.join' })}
                      {meeting_id &&
                        meetingState === 'closed_meeting_room' &&
                        intl.formatMessage({ id: 'live.closed' })}
                      {meeting_id && meetingState === 'ended_meeting_room' && intl.formatMessage({ id: 'live.ended' })}
                    </Button>
                  )}
                </p>
              )*/}
              {/* <p className='has-text-left is-size-6-desktop'>

                {usuarioRegistrado && (
                  
                  <Button
                    type='primary'
                    disabled={currentActivity.meeting_id ? false : true}
                    onClick={() => toggleConference(true, currentActivity.meeting_id, currentActivity)}>
                    {currentActivity.meeting_id ? 'Ir Conferencia en Vivo' : 'Aún no empieza Conferencia Virtual'}

                  </Button>
                )}
              </p> */}

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

          {event._id === '5fca68b7e2f869277cfa31b0' || event._id === '5f99a20378f48e50a571e3b6' ? (
            <></>
          ) : (
            <div className='calendar-category has-margin-top-7'>
              {/* Tags de categorias */}
              {/*currentActivity.activity_categories.map((cat, key) => (
                <span
                  key={key}
                  style={{
                    background: cat.color,
                    color: cat.color ? 'white' : '',
                  }}
                  className='tag category_calendar-tag'>
                  {cat.name}
                </span>
              ))*/}

              {/* <span className='tag category_calendar-tag'>
                {currentActivity.meeting_id || currentActivity.vimeo_id
                  ? 'Tiene espacio virtual'
                  : 'No tiene espacio Virtual'}
              </span> */}
            </div>
          )}
          <div className='card-content has-text-left container_calendar-description'>
            {/*<div className='calendar-category has-margin-top-7'>
              {/* Tags de categorias */}
            {/* {currentActivity.activity_categories.map((cat, key) => (
                <span
                  key={key}
                  style={{
                    background: cat.color,
                    color: cat.color ? 'white' : '',
                  }}
                  className='tag category_calendar-tag'>
                  {cat.name}
                </span>
              ))}

              <span className='tag category_calendar-tag'>               
                {currentActivity.meeting_id ? 'Tiene espacio virtual' : 'No tiene espacio Virtual'}
              </span> }
            </div>*/}

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

            {/* <div
              className='is-size-5-desktop has-margin-top-10 has-margin-bottom-10'
              dangerouslySetInnerHTML={{ __html: currentActivity.description }}
           />*/}
            {event._id === '5f99a20378f48e50a571e3b6' || event._id === '5fca68b7e2f869277cfa31b0' ? (
              <></>
            ) : (
              <Row>
                <Col span={24}>
                  <AttendeeNotAllowedCheck
                    event={event}
                    currentUser={props.userInfo}
                    usuarioRegistrado={usuarioRegistrado}
                    currentActivity={currentActivity}
                  />
                </Col>
              </Row>
            )}

            <Tabs defaultActiveKey={activeTab} activeKey={activeTab} onChange={callback}>
              {
                <TabPane
                  tab={
                    <>
                      <p style={{ marginBottom: '0px' }}>Descripción</p>
                    </>
                  }
                  key='description'>
                  <div dangerouslySetInnerHTML={{__html: event.description}}></div>
                </TabPane>
              }
              {
                <TabPane
                  tab={
                    <>
                      <p style={{ marginBottom: '0px' }}>Panelistas</p>
                    </>
                  }
                  key='panel'>
                  <Row justify='space-between'></Row>
                  <>
                    {' '}
                    {currentActivity.hosts.length === 0 ? (
                      <div></div>
                    ) : (
                      <div className='List-conferencistas'>
                        <p style={{ marginTop: '5%', marginBottom: '5%' }} className='has-text-left is-size-6-desktop'>
                          {orderedHost.length > 0 ? (
                            <>
                              <Col xs={24} sm={22} md={18} lg={18} xl={22} style={{ margin: '0 auto' }}>
                                <Card style={{ textAlign: 'left' }}>
                                  <List
                                    itemLayout='horizontal'
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
                                                  : 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                                              }
                                            />
                                          }
                                          title={<strong>{item.name}</strong>}
                                          description={item.profession}
                                        />
                                        <div className='btn-list-confencista'>
                                          <Button className='button_lista' onClick={() => getSpeakers(item._id)}>
                                            Ver detalle
                                          </Button>
                                        </div>
                                      </List.Item>
                                    )}
                                  />
                                  {idSpeaker ? (
                                    <ModalSpeaker showModal={true} eventId={event._id} speakerId={idSpeaker} />
                                  ) : (
                                    <></>
                                  )}
                                </Card>
                              </Col>
                            </>
                          ) : (
                            <></>
                          )}
                        </p>
                      </div>
                    )}
                  </>
                </TabPane>
              }

              {
                <TabPane
                  tab={
                    <>
                      <p style={{ marginBottom: '0px' }}>Documentos</p>
                    </>
                  }
                  key='docs'>
                     {currentActivity && currentActivity.selected_document && currentActivity.selected_document.length > 0 && (
                      <div>
                        <div style={{ marginTop: '5%', marginBottom: '5%' }} className='has-text-left is-size-6-desktop'>
                          <b>Documentos:</b> &nbsp;
                          <div>
                            <DocumentsList data={currentActivity.selected_document} />
                          </div>
                        </div>
                      </div>
                    )}
                </TabPane>
              }
            </Tabs>

            {/* <div>
              {showSurvey && (
                <div style={{}} className='has-text-left is-size-6-desktop'>
                  <p>
                    <b>Encuestas:</b>
                  </p>
                  <SurveyComponent event={event} activity={currentActivity} usuarioRegistrado={usuarioRegistrado} />
                </div>
              )}
            </div>*/}

         

            {props.userInfo && props.userInfo.names ? (
              <div />
            ) : (
              <div>
                {meeting_id ? (
                  <div>
                    <Button
                      type='primary'
                      disabled={meeting_id ? false : true}
                      onClick={() => toggleConference(true, meeting_id, currentActivity)}>
                      Conferencia en Vivo en anónimo
                    </Button>
                  </div>
                ) : (
                  <div />
                )}
              </div>
            )}

            {/* Descripción del evento */}

            <div
              className='card-footer is-12 is-flex'
              style={{
                borderTop: 'none',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
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
            </div>
          </div>
          {/*<div style={{ clear: 'both' }}>
            <a
              className=''
              onClick={() => {
                gotoActivity(null);
              }}>
              <Button>{intl.formatMessage({ id: 'button.return' })}</Button>
            </a>
          </div>*/}
        </Card>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  option: state.stage.data.mainStage,
  userInfo: state.user.data,
  eventInfo: state.event.data,
});

const mapDispatchToProps = {
  gotoActivity,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AgendaActividadDetalle));
