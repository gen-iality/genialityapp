import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'moment-timezone';
import ReactPlayer from 'react-player';
import { FormattedMessage, useIntl } from 'react-intl';
import API, { EventsApi, TicketsApi, Activity } from '../../helpers/request';
import { Row, Col, Button, List, Avatar, Card, Tabs, Badge, PageHeader, Typography, Form, Input } from 'antd';
import { firestore } from '../../helpers/firebase';
import AttendeeNotAllowedCheck from './shared/attendeeNotAllowedCheck';
import ModalSpeaker from './modalSpeakers';
import DocumentsList from '../documents/documentsList';
import RootPage from './surveys/rootPage';
import * as StageActions from '../../redux/stage/actions';
import * as SurveyActions from '../../redux/survey/actions';
import Game from './game';
import EnVivo from '../../EnVivo.svg';
import { CaretRightOutlined, CheckCircleOutlined, LoadingOutlined, UserOutlined } from '@ant-design/icons';
import SurveyList from '../events/surveys/surveyList';
import SurveyDetail from '../events/surveys/surveyDetail';
import { listenSurveysData } from '../events/surveys/services';

const { TabPane } = Tabs;

const { gotoActivity, setMainStage, setTabs } = StageActions;
const { setCurrentSurvey, setSurveyVisible, setHasOpenSurveys } = SurveyActions;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 10 },
};

let AgendaActividadDetalle = (props) => {
  // Informacion del usuario Actual, en caso que no haya sesion viene un null por props
  let [usuarioRegistrado, setUsuarioRegistrado] = useState(false);
  let [event, setEvent] = useState(false);
  let [idSpeaker, setIdSpeaker] = useState(false);
  let [orderedHost, setOrderedHost] = useState([]);
  const [meetingState, setMeetingState] = useState(null);
  const [meeting_id, setMeeting_id] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [totalAttendees, setTotalAttendees] = useState(0);
  const [totalAttendeesCheckedin, setTotalAttendeesCheckedin] = useState(0);
  const [names, setNames] = useState(null);
  const [email, setEmail] = useState(null);

  const [configfast, setConfigfast] = useState({});
  const { eventInfo } = props;

  const { Title } = Typography;

  const intl = useIntl();

  // Estado para controlar los estilos del componente de videoconferencia y boton para restaurar tamaño
  const [videoStyles, setVideoStyles] = useState(null);
  const [videoButtonStyles, setVideoButtonStyles] = useState(null);

  // Array que contiene las actividades del espacio (que comparten el mismo meeting_id y platform)
  const [activitiesSpace, setActivitiesSpace] = useState([]);

  // Estado del espacio virtual
  const [stateSpace, setStateSpace] = useState(true);

  const [activeTab, setActiveTab] = useState('description');
  let option = props.option;

  //Estado para detección si la vista es para mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detectar el tamaño del screen al cargar el componente y se agrega listener para detectar cambios de tamaño
    mediaQueryMatches();
    window.addEventListener('resize', mediaQueryMatches);

    if (props.collapsed) {
      props.toggleCollapsed(1);
    }

    // Al cargar el componente se realiza el checkin del usuario en la actividad
    try {
      if (props.eventUser) {
        TicketsApi.checkInAttendee(eventInfo._id, props.eventUser._id);
        Activity.checkInAttendeeActivity(eventInfo._id, props.currentActivity._id, props.eventUser.account_id);
      }
    } catch (e) {
      console.error('fallo el checkin:', e);
    }

    if (props?.userInfo && props.userInfo?.displayName && props.userInfo?.email) {
      let innerName =
        props.eventUser && props.eventUser.properties.casa && props.eventUser.properties.casa
          ? '(' + props.eventUser.properties.casa + ')' + props.userInfo.displayName
          : props.userInfo.displayName;
      setNames(innerName);
      setEmail(props.userInfo.email);
    }

    //Escuchando el estado de la actividad

    (async function() {
      await listeningStateMeetingRoom(props.eventInfo._id, props.currentActivity._id);
    })();

    // Desmontado del componente
    return () => {
      props.gotoActivity(null);
      props.setMainStage(null);
      props.setCurrentSurvey(null);
      props.setSurveyVisible(false);
      window.removeEventListener('resize', mediaQueryMatches);
    };
  }, []);

  useEffect(() => {
    (async function() {
      await listeningStateMeetingRoom(props.eventInfo._id, props.currentActivity._id);
    })();
  }, [props.currentActivity._id]);

  /**
   * Calculating total real attendees this could be done less costly
   * in the backend using cloud funtions.
   */

  useEffect(() => {
    async function listeningAsistentes() {
      if (event === null || event == undefined || event == false) return false;

      firestore
        .collection(`event_config`)
        .doc(event._id)
        .onSnapshot((doc) => {
          setConfigfast(doc.data());
        });

      const asistentesRef = firestore.collection(`${event._id}_event_attendees`);
      asistentesRef.onSnapshot((snapshot) => {
        const list = [];
        let cuantos = 0;
        let checkedin = 0;
        snapshot.forEach(function(doc) {
          if (doc.exists) {
            cuantos++;
            if (doc.data().checkedin_at) {
              checkedin++;
            }
            //list.push(response);
          }
        });
        setTotalAttendees(cuantos);
        setTotalAttendeesCheckedin(checkedin);
      });
    }

    (async () => {
      //await listeningAsistentes();
    })();
  }, [event]);

  useEffect(() => {
    async function listeningSpaceRoom() {
      if (meeting_id === null || platform === null) return false;
      firestore
        .collection('events')
        .doc(eventInfo._id)
        .collection('activities')
        .where('meeting_id', '==', meeting_id)
        .where('platform', '==', platform)
        .onSnapshot((snapshot) => {
          const list = [];
          snapshot.forEach(function(doc) {
            if (doc.exists) {
              const response = doc.data();
              list.push(response);
            }
          });

          setActivitiesSpace(list);
        });
    }

    (async () => {
      await listeningSpaceRoom();
    })();
  }, [meeting_id, platform, eventInfo]);

  useEffect(() => {
    const openActivities = activitiesSpace.filter((activity) => activity.habilitar_ingreso === 'open_meeting_room');

    if (openActivities.length > 0) {
      setStateSpace(true);
    } else {
      setStateSpace(false);
    }
  }, [activitiesSpace]);

  useEffect(() => {
    if (option === 'surveyDetalle' || option === 'game') {
      const sharedProperties = {
        position: 'fixed',
        right: '0',
        width: '170px',
      };

      const verticalVideo = isMobile ? { top: '5%' } : { bottom: '0' };

      setVideoStyles({
        ...sharedProperties,
        ...verticalVideo,
        zIndex: '100',
        transition: '300ms',
      });

      const verticalVideoButton = isMobile ? { top: '9%' } : { bottom: '27px' };

      setVideoButtonStyles({
        ...sharedProperties,
        ...verticalVideoButton,
        zIndex: '101',
        cursor: 'pointer',
        display: 'block',
        height: '96px',
      });
    } else {
      setVideoStyles({ width: '100%', height: '80vh', transition: '300ms' });
      setVideoButtonStyles({ display: 'none' });
    }
  }, [option, isMobile]);

  function handleChangeLowerTabs(tab) {
    setActiveTab(tab);

    if (tab === 'games') {
      props.setMainStage('game');
    }
  }

  async function listeningStateMeetingRoom(event_id, activity_id) {
    // console.log("ACTIVIDAD SELECTED=>"+activity_id)
    firestore
      .collection('events')
      .doc(event_id)
      .collection('activities')
      .doc(activity_id)
      .onSnapshot((infoActivity) => {
        if (!infoActivity.exists) return;
        const data = infoActivity.data();
        const { habilitar_ingreso, meeting_id, platform, tabs } = data;
        setMeeting_id(meeting_id);
        setPlatform(platform);
        setMeetingState(habilitar_ingreso);
        props.setTabs(tabs);
      });
  }

  // No tener 2 encuestas publicadas al tiempo
  // Si se cierra una automaticamente se carga un nuevo current survey
  // afectando el objetivo del snapshot que es detectar cuando se despublica

  // useEffect(() => {
  //   if (props.currentSurvey !== null &&  props.currentSurvey.isPublished === 'false') {

  //   }
  // }, [props.currentSurvey]);

  useEffect(() => {
    (async () => {
      //Id del evento

      var id = props.eventInfo._id;
      const event = await EventsApi.landingEvent(id);
      setEvent(event);

      try {
        const respuesta = await API.get('api/me/eventusers/event/' + id);

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
  }, [props.eventInfo._id, props.currentActivity]);

  async function getSpeakers(idSpeaker) {
    setIdSpeaker(idSpeaker);
  }

  const getMeetingPath = (platform) => {
    if (platform === 'zoom') {
      const url_conference = `https://gifted-colden-fe560c.netlify.com/?meetingNumber=`;

      return (
        url_conference +
        meeting_id +
        `&userName=${props.userInfo.displayName ? props.userInfo.displayName : 'Guest'}` +
        `&email=${props.userInfo.email ? props.userInfo.email : 'emaxxxxxxil@gmail.com'}` +
        `&disabledChat=${props.generalTabs.publicChat || props.generalTabs.privateChat}`
      );
    } else if (platform === 'vimeo') {
      return `https://player.vimeo.com/video/${meeting_id}`;
    } else if (platform === 'dolby') {
      return `https://eviusmeets.netlify.app/?username=${names}&email=${email}`;
    }
  };

  const handleSignInForm = (values) => {
    setNames(values.names);
    setEmail(values.email);
  };

  const mediaQueryMatches = () => {
    let screenWidth = window.innerWidth;
    screenWidth <= 768 ? setIsMobile(true) : setIsMobile(false);
  };

  const { currentActivity, image_event } = props;

  useEffect(() => {
    if (props.currentActivity !== null) {
      listenSurveysData(props.eventInfo, props.currentActivity, props.userInfo, (data) => {
        props.setHasOpenSurveys(data.hasOpenSurveys);
      });
    }
  }, [props.event, props.currentActivity]);

  {
    Moment.locale(window.navigator.language);
  }

  const openZoomExterno = () => {
    const { zoomExternoHandleOpen, eventUser, currentActivity } = props;
    zoomExternoHandleOpen(currentActivity, eventUser);
  };

  return (
    <div className='is-centered'>
      <div className=' container_agenda-information container-calendar2 is-three-fifths'>
        <Card
          style={{ padding: '1 !important' }}
          className={
            event._id === '5fca68b7e2f869277cfa31b0' || event._id === '5f99a20378f48e50a571e3b6'
              ? 'magicland-agenda_information'
              : 'agenda_information'
          }>
          <Row align='middle'>
            <Col
              xs={{ order: 2, span: 4 }}
              sm={{ order: 2, span: 4 }}
              md={{ order: 1, span: 2 }}
              lg={{ order: 1, span: 2 }}
              xl={{ order: 1, span: 2 }}
              style={{ padding: '4px' }}>
              <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
                {meetingState === 'open_meeting_room' || stateSpace ? (
                  <img style={{ height: '4vh', width: '4vh' }} src={EnVivo} alt='React Logo' />
                ) : meetingState === 'ended_meeting_room' && currentActivity.video ? (
                  <CaretRightOutlined style={{ fontSize: '30px' }} />
                ) : meetingState === 'ended_meeting_room' && (currentActivity.image || image_event) ? (
                  <CheckCircleOutlined style={{ fontSize: '30px' }} />
                ) : meetingState === '' || meetingState == null ? (
                  <></>
                ) : meetingState === 'closed_meeting_room' ? (
                  <LoadingOutlined style={{ fontSize: '30px' }} />
                ) : (
                  ''
                )}
              </Row>
              <Row
                style={{
                  height: '2vh',
                  fontSize: 11,
                  fontWeight: 'normal',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {meetingState === 'open_meeting_room' || stateSpace
                  ? 'En vivo'
                  : meetingState === 'ended_meeting_room' && currentActivity.video
                  ? 'Grabado'
                  : meetingState === 'ended_meeting_room' && (currentActivity.image || image_event)
                  ? 'Terminada'
                  : meetingState === 'closed_meeting_room'
                  ? 'Por iniciar'
                  : ''}
              </Row>
            </Col>
            <Col
              xs={{ order: 3, span: 20 }}
              sm={{ order: 3, span: 20 }}
              md={{ order: 2, span: 18 }}
              lg={{ order: 2, span: 16 }}
              xl={{ order: 2, span: 18 }}
              style={{ display: 'flex' }}>
              <div style={{ padding: '8px' }}>
                <Row style={{ textAlign: 'left', fontWeight: 'bolder' }}>
                  {currentActivity.name}
                  {configfast && configfast.enableCount && (
                    <>
                      ( &nbsp;
                      {configfast && configfast.totalAttendees ? configfast.totalAttendees : totalAttendees}
                      {'/'} {totalAttendeesCheckedin}{' '}
                      {'(' +
                        Math.round(
                          (totalAttendeesCheckedin /
                            (configfast.totalAttendees ? configfast.totalAttendees : totalAttendees)) *
                            100 *
                            100
                        ) /
                          100 +
                        '%)'}
                      )
                    </>
                  )}
                </Row>
                <Row style={{ height: '2.5vh', fontSize: 10, fontWeight: 'normal' }}>
                  <div
                    xs={{ order: 1, span: 24 }}
                    sm={{ order: 1, span: 24 }}
                    md={{ order: 1, span: 24 }}
                    lg={{ order: 3, span: 6 }}
                    xl={{ order: 3, span: 4 }}>
                    {event._id === '5f99a20378f48e50a571e3b6' ||
                    event._id === '5fca68b7e2f869277cfa31b0' ||
                    event.id === '60061bfac8c0284c432069c8' ? (
                      <></>
                    ) : (
                      <div>
                        {Moment.tz(currentActivity.datetime_start, 'YYYY-MM-DD h:mm', 'America/Bogota')
                          .tz(Moment.tz.guess())
                          .format('DD MMM YYYY')}{' '}
                        {Moment.tz(currentActivity.datetime_start, 'YYYY-MM-DD h:mm', 'America/Bogota')
                          .tz(Moment.tz.guess())
                          .format('h:mm a z')}{' '}
                        -{' '}
                        {Moment.tz(currentActivity.datetime_end, 'YYYY-MM-DD h:mm', 'America/Bogota')
                          .tz(Moment.tz.guess())
                          .format('h:mm a z')}
                      </div>
                    )}
                  </div>

                  {currentActivity && currentActivity.space && currentActivity.space.name}
                </Row>
              </div>
            </Col>
          </Row>

          <header className='card-header columns '>
            <div className='is-block is-12 column is-paddingless'>
              {/* Hora del evento */}
              {/* <p className='card-header-title has-padding-left-0 '>
                {Moment(currentActivity.datetime_start).format('h:mm a')} -{' '}
                {Moment(currentActivity.datetime_end).format('h:mm a')}
              </p> */}

              {/*   ******************surveyDetalle=> PARA MOSTRAR DETALLE DE ENCUESTAS  ****************  */}

              {(meetingState === 'open_meeting_room' || stateSpace) &&
                // option !== 'surveyDetalle' &&
                // option !== 'games' &&

                platform !== '' &&
                platform !== null && (
                  <>
                    {platform === 'dolby' && names === null && email === null ? (
                      <Card title='Ingresa tus datos para entrar a la transmisión'>
                        <Form style={{ padding: '16px 8px' }} onFinish={handleSignInForm} {...layout}>
                          <Form.Item
                            name='names'
                            label='Nombre'
                            rules={[
                              {
                                required: true,
                              },
                            ]}>
                            <Input />
                          </Form.Item>
                          <Form.Item
                            name='email'
                            label='Email'
                            rules={[
                              {
                                required: true,
                                type: 'email',
                                message: 'Ingrese un email valido',
                              },
                            ]}>
                            <Input />
                          </Form.Item>
                          <Form.Item {...tailLayout}>
                            <Button type='primary' htmlType='submit'>
                              Entrar
                            </Button>
                          </Form.Item>
                        </Form>
                      </Card>
                    ) : (
                      <>
                        {platform === 'zoomExterno' ? (
                          openZoomExterno()
                        ) : (props.currentUser && !props.event.allow_register) || (props.event.allow_register)&&  (
                          <>
                            <iframe
                              src={getMeetingPath(platform)}
                              frameBorder='0'
                              allow='autoplay; fullscreen; camera *;microphone *'
                              allowFullScreen
                              allowusermedia
                              style={videoStyles}></iframe>
                            <div style={videoButtonStyles} onClick={() => props.setMainStage(null)}></div>
                          </>
                        )}
                      </>
                    )}
                  </>
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

              {(meetingState === '' || meetingState == null) &&
                stateSpace === false &&
                option !== 'surveyDetalle' &&
                option !== 'game' && (
                  <div className='column is-centered mediaplayer'>
                    <img
                      className='activity_image'
                      style={{ width: '100%', height: '60vh', objectFit: 'cover' }}
                      src={
                        eventInfo.styles.banner_image
                          ? eventInfo.styles.banner_image
                          : currentActivity.image
                          ? currentActivity.image
                          : image_event
                      }
                      alt='Activity'
                    />
                  </div>
                )}

              {meetingState === 'closed_meeting_room' &&
                option !== 'surveyDetalle' &&
                option !== 'game' &&
                stateSpace === false && (
                  <div className='column is-centered mediaplayer'>
                    <img
                      className='activity_image'
                      style={{ width: '100%', height: '60vh', objectFit: 'cover' }}
                      src={
                        eventInfo.styles.banner_image
                          ? eventInfo.styles.banner_image
                          : currentActivity.image
                          ? currentActivity.image
                          : image_event
                      }
                      alt='Activity'
                    />
                  </div>
                )}

              {meetingState === 'ended_meeting_room' &&
              currentActivity.video &&
              stateSpace === false &&
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
                    stateSpace === false &&
                    option !== 'surveyDetalle' &&
                    option !== 'game' && (
                      <div>
                        <img
                          className='activity_image'
                          style={{ width: '100%', height: '60vh', objectFit: 'cover' }}
                          src={
                            eventInfo.styles.banner_image
                              ? eventInfo.styles.banner_image
                              : currentActivity.image
                              ? currentActivity.image
                              : image_event
                          }
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

            <Tabs defaultActiveKey={activeTab} activeKey={activeTab} onChange={handleChangeLowerTabs}>
              {
                <TabPane
                  tab={
                    <>
                      <p style={{ marginBottom: '0px' }}>Descripción</p>
                    </>
                  }
                  key='description'>
                  <div dangerouslySetInnerHTML={{ __html: currentActivity.description }}></div>
                  <br />
                  {currentActivity.hosts.length === 0 || props.eventInfo._id === '601470367711a513cc7061c2' ? (
                    <div></div>
                  ) : (
                    <div className='List-conferencistas'>
                      <Title level={5}>Panelistas </Title>
                      <p style={{ marginTop: '5%', marginBottom: '5%' }} className='has-text-left is-size-6-desktop'>
                        {orderedHost.length > 0 ? (
                          <>
                            <Col xs={24} sm={22} md={18} lg={18} xl={22} style={{ margin: '0 auto' }}>
                              <Card style={{ textAlign: 'left' }}>
                                <List
                                  itemLayout='horizontal'
                                  dataSource={orderedHost}
                                  renderItem={(item) => (
                                    <List.Item style={{ padding: 16 }}>
                                      <List.Item.Meta
                                        style={{
                                          display: 'flex',
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                        }}
                                        avatar={
                                          item.image ? (
                                            <Avatar size={80} src={item.image} />
                                          ) : (
                                            <Avatar size={80} icon={<UserOutlined />} />
                                          )
                                        }
                                        title={<strong>{item.name}</strong>}
                                        description={item.profession}
                                      />
                                      <div className='btn-list-confencista'>
                                        {item.description !== '<p><br></p>' &&
                                          item.description !== null &&
                                          item.description !== undefined && (
                                            <Button className='button_lista' onClick={() => getSpeakers(item._id)}>
                                              Ver detalle
                                            </Button>
                                          )}
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
                </TabPane>
              }

              {currentActivity && currentActivity.selected_document && currentActivity.selected_document.length > 0 && (
                <TabPane
                  tab={
                    <>
                      <p style={{ marginBottom: '0px' }}>Documentos</p>
                    </>
                  }
                  key='docs'>
                  <div>
                    <div style={{ marginTop: '5%', marginBottom: '5%' }} className='has-text-left is-size-6-desktop'>
                      <b>Documentos:</b> &nbsp;
                      <div>
                        <DocumentsList data={currentActivity.selected_document} />
                      </div>
                    </div>
                  </div>
                </TabPane>
              )}

              {props.tabs && (props.tabs.surveys === true || props.tabs.surveys === 'true') && (
                <TabPane
                  tab={
                    <>
                      <p style={{ marginBottom: '0px' }} className='lowerTabs__mobile-visible'>
                        <Badge dot={props.hasOpenSurveys} size='default'>
                          Encuestas
                        </Badge>
                      </p>
                    </>
                  }>
                  {props.currentSurvey === null ? <SurveyList eventSurveys={props.eventSurveys} /> : <SurveyDetail />}
                </TabPane>
              )}
              {props.tabs && (props.tabs.games === true || props.tabs.games === 'true') && (
                <TabPane
                  tab={
                    <>
                      <p className='lowerTabs__mobile-visible' style={{ marginBottom: '0px' }}>
                        Juegos
                      </p>{' '}
                    </>
                  }
                  key='games'></TabPane>
              )}
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

            {/* {props.userInfo && props.userInfo.names ? (
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
            )} */}

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

          <Row style={{ paddingLeft: '10px' }}>
            <PageHeader
              onBack={() => {
                props.showSection('agenda');
              }}
              subTitle={intl.formatMessage({ id: 'button.back.agenda' })}
            />
          </Row>
        </Card>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  option: state.stage.data.mainStage,
  userInfo: state.user.data,
  eventInfo: state.event.data,
  currentActivity: state.stage.data.currentActivity,
  currentSurvey: state.survey.data.currentSurvey,
  hasOpenSurveys: state.survey.data.hasOpenSurveys,
  tabs: state.stage.data.tabs,
  generalTabs: state.tabs.generalTabs,
});

const mapDispatchToProps = {
  gotoActivity,
  setMainStage,
  setCurrentSurvey,
  setSurveyVisible,
  setHasOpenSurveys,
  setTabs,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AgendaActividadDetalle));
