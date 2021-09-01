import React, { useState, useEffect, useContext } from 'react';
import { withRouter, Link } from 'react-router-dom';
import {
  ArrowLeftOutlined,
  CaretRightOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import Moment from 'moment-timezone';
import ReactPlayer from 'react-player';
import { useIntl } from 'react-intl';
import { TicketsApi, Activity, AgendaApi } from '../../helpers/request';
import { Row, Col, Button, List, Avatar, Card, Tabs, Badge, Typography, Form, Input, Alert } from 'antd';
import { firestore } from '../../helpers/firebase';
import ModalSpeaker from './modalSpeakers';
import DocumentsList from '../documents/documentsList';
import * as StageActions from '../../redux/stage/actions';
import * as SurveyActions from '../../redux/survey/actions';
import Game from './game';
import EnVivo from '../../EnVivo.svg';
import SurveyList from '../events/surveys/surveyList';
import listenSurveysData from '../events/surveys/services/listenSurveysDataToAgendaActividadDetalle';
import { eventUserUtils } from '../../helpers/helperEventUser';
import { useParams } from 'react-router-dom';
import { setTopBanner } from '../../redux/topBanner/actions';
import { setSpaceNetworking } from '../../redux/networking/actions';

import withContext from '../../Context/withContext';
import { UseCurrentUser } from '../../Context/userContext';
import { UseSurveysContext } from '../../Context/surveysContext';
import { HelperContext } from '../../Context/HelperContext';

import { useHistory } from 'react-router-dom';
import SurveyDrawer from './surveys/components/surveyDrawer';

const { TabPane } = Tabs;
const { gotoActivity, setMainStage, setTabs } = StageActions;
const { setCurrentSurvey, setSurveyVisible, setHasOpenSurveys, unsetCurrentSurvey } = SurveyActions;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 10 },
};

let AgendaActividadDetalle = (props) => {
  let cSurveys = UseSurveysContext();
  let cUser = UseCurrentUser();

  let { activity_id } = useParams();
  let [idSpeaker, setIdSpeaker] = useState(false);
  let [orderedHost, setOrderedHost] = useState([]);
  const [meetingState, setMeetingState] = useState(null);
  const [meeting_id, setMeeting_id] = useState(null);
  const [platform, setPlatform] = useState(null);
  const totalAttendees = useState(0);
  const totalAttendeesCheckedin = useState(0);
  const [names, setNames] = useState(null);
  const [email, setEmail] = useState(null);
  const [currentActivity, setcurrentActivity] = useState(null);
  let urlBack = `/landing/${props.cEvent.value._id}/agenda`;
  let history = useHistory();
  let { HandleOpenCloseMenuRigth, isCollapsedMenuRigth } = useContext(HelperContext);

  const configfast = useState({});

  const { Title } = Typography;

  const intl = useIntl();

  //obtener la actividad por id
  useEffect(() => {
    async function getActividad() {
      return await AgendaApi.getOne(activity_id, props.cEvent.value._id);
    }

    function orderHost(hosts) {
      hosts.sort(function(a, b) {
        return a.order - b.order;
      });
      setOrderedHost(hosts);
    }

    getActividad().then((result) => {
      setcurrentActivity(result);
      orderHost(result.hosts);
      props.gotoActivity(result);
      cSurveys.set_current_activity(result);
    });

    props.setTopBanner(false);
    props.setVirtualConference(false);
    HandleOpenCloseMenuRigth(false);
    return () => {
      props.setTopBanner(true);
      props.setVirtualConference(true);
      HandleOpenCloseMenuRigth(!isCollapsedMenuRigth);
    };
  }, []);

  // Estado para controlar los estilos del componente de videoconferencia y boton para restaurar tamaño
  const [videoStyles, setVideoStyles] = useState(null);
  const [videoButtonStyles, setVideoButtonStyles] = useState(null);

  // Array que contiene las actividades del espacio (que comparten el mismo meeting_id y platform)
  const [activitiesSpace, setActivitiesSpace] = useState([]);

  const [activeTab, setActiveTab] = useState('description');
  let mainStageContent = props.mainStageContent;

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
      if (props.cEventUser && cUser.value) {
        console.log('====================================');
        console.log(' props.cEventUser.value', props.cEventUser.value);
        console.log('====================================');
        TicketsApi.checkInAttendee(props.cEvent.value._id, props.cEventUser.value._id);
        Activity.checkInAttendeeActivity(props.cEvent.value._id, activity_id, cUser.value._id);
      }
    } catch (e) {
      console.error('fallo el checkin:', e);
    }

    if (cUser && cUser?.displayName && cUser?.email) {
      let innerName =
        cUser && cUser.properties && cUser.properties.casa
          ? '(' + cUser.properties.casa + ')' + cUser.displayName
          : cUser.displayName;
      setNames(innerName);
      setEmail(cUser.email);
    }

    //Escuchando el estado de la actividad

    (async function() {
      await listeningStateMeetingRoom(props.cEvent.value._id, activity_id);
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
      await listeningStateMeetingRoom(props.cEvent.value._id, activity_id);
    })();
  }, [activity_id]);

  useEffect(() => {
    async function listeningSpaceRoom() {
      if (meeting_id === null || platform === null) return false;
      firestore
        .collection('events')
        .doc(props.cEvent.value._id)
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
  }, [meeting_id, platform, props.cEvent.value]);

  useEffect(() => {
    if (/*mainStageContent === 'surveyDetalle' ||*/ mainStageContent === 'game') {
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
  }, [mainStageContent, isMobile]);

  function handleChangeLowerTabs(tab) {
    setActiveTab(tab);

    if (tab === 'games') {
      props.setMainStage('game');
    }
  }

  function redirectRegister() {
    history.push(`/landing/${props.cEvent.value._id}/tickets`);
  }

  async function getSpeakers(idSpeaker) {
    setIdSpeaker(idSpeaker);
  }

  const getMeetingPath = (platform) => {
    if (platform === 'zoom') {
      const url_conference = `https://gifted-colden-fe560c.netlify.com/?meetingNumber=`;
      return (
        url_conference +
        meeting_id +
        `&userName=${
          cUser.displayName ? cUser.displayName : cUser.names ? cUser.names : 'Guest' + Math.floor(Math.random() * 1000)
        }` +
        `&email=${cUser.email ? cUser.email : 'emaxxxxxxil@gmail.com'}` +
        `&disabledChat=${props.generalTabs.publicChat || props.generalTabs.privateChat}` +
        `&host=${eventUserUtils.isHost(cUser, props.cEvent.value)}`
      );
    } else if (platform === 'vimeo') {
      return `https://player.vimeo.com/video/${meeting_id}`;
    } else if (platform === 'dolby') {
      return `https://eviusmeets.netlify.app/?username=${names}&email=${email}`;
    }
  };

  const { image_event } = props;
  const colorTexto = props.cEvent.value.styles.textMenu;
  const colorFondo = props.cEvent.value.styles.toolbarDefaultBg;

  const imagePlaceHolder =
    'https://via.placeholder.com/1500x540/' +
    colorFondo.replace('#', '') +
    '/' +
    colorTexto.replace('#', '') +
    '?text=EVIUS.co';

  useEffect(() => {
    if (currentActivity) {
      cSurveys.set_current_activity(currentActivity);
      listenSurveysData(props.cEvent.value, currentActivity, cUser, (data) => {
        props.setHasOpenSurveys(data.hasOpenSurveys);
      });
    }
  }, [props.cEvent.value, currentActivity]);

  {
    Moment.locale(window.navigator.language);
  }

  const openZoomExterno = () => {
    const { zoomExternoHandleOpen, eventUser, currentActivity } = props;
    zoomExternoHandleOpen(currentActivity, eventUser);
  };

  useEffect(() => {
    if (/*mainStageContent === 'surveyDetalle' ||*/ mainStageContent === 'game') {
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
  }, [mainStageContent, isMobile]);

  async function listeningStateMeetingRoom(event_id, activity_id) {
    // console.log("que esta llegando",event_id,activity_id);
    //
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

  const handleSignInForm = (values) => {
    setNames(values.names);
    setEmail(values.email);
  };

  const mediaQueryMatches = () => {
    let screenWidth = window.innerWidth;
    screenWidth <= 768 ? setIsMobile(true) : setIsMobile(false);
  };

  useEffect(() => {
    if (currentActivity) {
      listenSurveysData(props.cEvent.value, currentActivity, cUser, (data) => {
        props.setHasOpenSurveys(data.hasOpenSurveys);
      });
    }
  }, [props.cEvent.value, currentActivity]);

  {
    Moment.locale(window.navigator.language);
  }

  return (
    <div className='is-centered'>
      <div className=' container_agenda-information container-calendar2 is-three-fifths'>
        <Card
          style={{ padding: '1 !important' }}
          className={
            props.cEvent.value._id === '5fca68b7e2f869277cfa31b0' ||
            props.cEvent.value._id === '5f99a20378f48e50a571e3b6'
              ? 'magicland-agenda_information'
              : 'agenda_information'
          }>
          <Row align='middle'>
            <Col
              xs={{ order: 2, span: 8 }}
              sm={{ order: 2, span: 8 }}
              md={{ order: 1, span: 4 }}
              lg={{ order: 1, span: 4 }}
              xl={{ order: 1, span: 4 }}
              style={{ padding: '4px' }}>
              <Link to={`${urlBack}`}>
                <Row style={{ paddingLeft: '10px' }}>
                  <Button type='primary' shape='round' icon={<ArrowLeftOutlined />} size='small'>
                    {intl.formatMessage({ id: 'button.back.agenda' })}
                  </Button>
                </Row>
              </Link>
            </Col>
            <Col
              xs={{ order: 2, span: 4 }}
              sm={{ order: 2, span: 4 }}
              md={{ order: 1, span: 2 }}
              lg={{ order: 1, span: 2 }}
              xl={{ order: 1, span: 2 }}
              style={{ padding: '4px' }}>
              <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Col>
                  {meetingState === 'open_meeting_room' ? (
                    <img style={{ height: '4vh', width: '4vh' }} src={EnVivo} alt='React Logo' />
                  ) : meetingState === 'ended_meeting_room' && currentActivity !== null && currentActivity.video ? (
                    <CaretRightOutlined style={{ fontSize: '30px' }} />
                  ) : meetingState === 'ended_meeting_room' && currentActivity !== null ? (
                    <CheckCircleOutlined style={{ fontSize: '30px' }} />
                  ) : meetingState === '' || meetingState == null ? (
                    <></>
                  ) : meetingState === 'closed_meeting_room' ? (
                    <LoadingOutlined style={{ fontSize: '30px' }} />
                  ) : (
                    ''
                  )}
                </Col>
              </Row>
              <Row
                style={{
                  height: '2vh',
                  fontSize: 11,
                  fontWeight: 'normal',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {meetingState === 'open_meeting_room'
                  ? 'En vivo'
                  : meetingState === 'ended_meeting_room' && currentActivity !== null && currentActivity.video
                  ? 'Grabado'
                  : meetingState === 'ended_meeting_room' && currentActivity !== null
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
                  {currentActivity !== null && currentActivity.name}
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
                    {props.cEvent.value._id === '5f99a20378f48e50a571e3b6' ||
                    props.cEvent.value._id === '5fca68b7e2f869277cfa31b0' ||
                    props.cEvent.value.id === '60061bfac8c0284c432069c8' ? (
                      <></>
                    ) : (
                      <div>
                        {Moment.tz(
                          currentActivity !== null && currentActivity.datetime_start,
                          'YYYY-MM-DD h:mm',
                          'America/Bogota'
                        )
                          .tz(Moment.tz.guess())
                          .format('DD MMM YYYY')}{' '}
                        {Moment.tz(
                          currentActivity !== null && currentActivity.datetime_start,
                          'YYYY-MM-DD h:mm',
                          'America/Bogota'
                        )
                          .tz(Moment.tz.guess())
                          .format('h:mm a z')}{' '}
                        -{' '}
                        {Moment.tz(
                          currentActivity !== null && currentActivity.datetime_end,
                          'YYYY-MM-DD h:mm',
                          'America/Bogota'
                        )
                          .tz(Moment.tz.guess())
                          .format('h:mm a z')}
                      </div>
                    )}
                  </div>

                  {currentActivity !== null && currentActivity.space && currentActivity.space.name}
                </Row>
              </div>
            </Col>
          </Row>

          <header>
            <div>
              {/* Hora del evento */}
              {/* <p className='card-header-title has-padding-left-0 '>
                {Moment(currentActivity.datetime_start).format('h:mm a')} -{' '}
                {Moment(currentActivity.datetime_end).format('h:mm a')}
              </p> */}

              {/*   ******************surveyDetalle=> PARA MOSTRAR DETALLE DE ENCUESTAS  ****************  */}

              {meetingState === 'open_meeting_room' &&
              // mainStageContent !== 'surveyDetalle' &&
              // mainStageContent !== 'games' &&

              platform !== '' &&
              platform !== null ? (
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
                      ) : (props.currentUser && currentActivity !== null && currentActivity.requires_registration) ||
                        (currentActivity !== null && !currentActivity.requires_registration) ? (
                        <>
                          <iframe
                            src={getMeetingPath(platform)}
                            frameBorder='0'
                            allow='autoplay; fullscreen; camera *;microphone *'
                            allowFullScreen
                            allowusermedia
                            className='video'></iframe>
                          <div style={videoButtonStyles} onClick={() => props.setMainStage(null)}></div>
                        </>
                      ) : (
                        <Alert
                          message='Advertencia'
                          description='Debes estar previamente registrado al evento para acceder al espacio en vivo, si estas registrado en el evento ingresa al sistema con tu usuario para poder acceder al evento'
                          type='warning'
                          showIcon
                        />
                      )}
                    </>
                  )}
                </>
              ) : (
                meetingState == 'open_meeting_room' && (
                  <Row style={{ fontSize: '25px', margin: 10 }} justify='center'>
                    FALTA ASIGNAR EL ESPACIO EN VIVO
                  </Row>
                )
              )}

              {/* {mainStageContent == 'surveyDetalle' && (
                <div style={{ width: props.collapsed ? '98%' : '98%-389px' }}>
                  <SurveyDetailPage
                  // event={event}
                  // currentUser={props.userEntered}
                  // activity={props.activity}
                  // availableSurveysBar={true}
                  // style={{ zIndex: 9999, width: props.collapsed ? '95vw' : '50vw-389px', height: '100%' }}
                  // mountCurrentSurvey={mountCurrentSurvey}
                  // unMountCurrentSurvey={unMountCurrentSurvey}
                  />
                </div>
              )} */}
              {mainStageContent == 'surveyDetalle' && (
                <>
                  <h1>Encuestas MainStage</h1>
                </>
              )}
              {mainStageContent == 'game' && <Game />}

              {(meetingState === '' || meetingState == null) &&
                currentActivity != null &&
                currentActivity.video == null && (
                  <div className='column is-centered mediaplayer'>
                    <img
                      className='activity_image'
                      style={{ width: '100%', height: '60vh', objectFit: 'cover' }}
                      src={
                        props.cEvent.value.styles?.banner_image
                          ? props.cEvent.value.styles?.banner_image
                          : currentActivity?.image
                          ? currentActivity?.image
                          : image_event
                          ? image_event
                          : imagePlaceHolder
                      }
                      alt='Activity'
                    />
                  </div>
                )}

              {meetingState === 'closed_meeting_room' &&
                mainStageContent !== 'surveyDetalle' &&
                mainStageContent !== 'game' && (
                  <div className='column is-centered mediaplayer'>
                    <img
                      className='activity_image'
                      style={{ width: '100%', height: '60vh', objectFit: 'cover' }}
                      src={
                        props.cEvent.status == 'LOADED' && props.cEvent.value.styles.banner_image
                          ? props.cEvent.value.styles?.banner_image
                          : currentActivity?.image
                          ? currentActivity?.image
                          : image_event
                          ? image_event
                          : imagePlaceHolder
                      }
                      alt='Activity'
                    />
                  </div>
                )}
                              
              {(meetingState === 'ended_meeting_room' || !meetingState) &&
              currentActivity !== null &&
              currentActivity.video &&
              mainStageContent !== 'surveyDetalle' &&
              mainStageContent !== 'game' ? (
                <div className='column is-centered mediaplayer'>
                  <ReactPlayer
                    width={'100%'}
                    style={{
                      display: 'block',
                      margin: '0 auto',
                    }}
                    url={currentActivity !== null && currentActivity.video}
                    //url="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/eviuswebassets%2FLa%20asamblea%20de%20copropietarios_%20una%20pesadilla%20para%20muchos.mp4?alt=media&token=b622ad2a-2d7d-4816-a53a-7f743d6ebb5f"
                    controls
                  />
                </div>
              ) : (
                <>
                  {meetingState === 'ended_meeting_room' &&
                    ((currentActivity !== null && currentActivity.image) || image_event) &&
                    mainStageContent !== 'surveyDetalle' &&
                    mainStageContent !== 'game' && (
                      <div>
                        <img
                          className='activity_image'
                          style={{ width: '100%', height: '60vh', objectFit: 'cover' }}
                          src={
                            props.cEvent.value.styles.banner_image
                              ? props.cEvent.value.styles.banner_image
                              : currentActivity.image
                              ? currentActivity.image
                              : image_event
                              ? image_event
                              : imagePlaceHolder
                          }
                          alt='Activity'
                        />
                      </div>
                    )}
                </>
              )}

              {/*logo quemado de aval para el evento de magicland */}
              {(props.cEvent.value._id === '5f99a20378f48e50a571e3b6' ||
                props.cEvent.value._id === '5fca68b7e2f869277cfa31b0') && (
                <Row justify='center' style={{ marginTop: '6%' }}>
                  <Col span={24}>
                    <img
                      src='https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/Magicland%2Fbanner.jpg?alt=media&token=4aab5da2-bbba-4a44-9bdd-d2161ea58b0f'
                      alt='aval'
                    />
                  </Col>
                </Row>
              )}
              {currentActivity !== null && currentActivity.secondvideo && (
                <div className='column is-centered mediaplayer'>
                  <strong>Pt. 2</strong>
                  <ReactPlayer
                    width={'100%'}
                    style={{
                      display: 'block',
                      margin: '0 auto',
                    }}
                    url={currentActivity !== null && currentActivity.secondvideo}
                    //url="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/eviuswebassets%2FLa%20asamblea%20de%20copropietarios_%20una%20pesadilla%20para%20muchos.mp4?alt=media&token=b622ad2a-2d7d-4816-a53a-7f743d6ebb5f"
                    controls
                  />
                </div>
              )}
            </div>
          </header>

          {props.cEvent.value._id === '5fca68b7e2f869277cfa31b0' ||
          props.cEvent.value._id === '5f99a20378f48e50a571e3b6' ? (
            <></>
          ) : (
            <div className='calendar-category has-margin-top-7'></div>
          )}
          <div className='card-content has-text-left container_calendar-description'>
            <Tabs defaultActiveKey={activeTab} activeKey={activeTab} onChange={handleChangeLowerTabs}>
              {
                <TabPane
                  tab={
                    <>
                      <p style={{ marginBottom: '0px' }}>{intl.formatMessage({ id: 'title.description' })}</p>
                    </>
                  }
                  key='description'>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: currentActivity !== null && currentActivity.description,
                    }}></div>
                  <br />
                  {(currentActivity !== null && currentActivity.hosts.length === 0) ||
                  props.cEvent.value._id === '601470367711a513cc7061c2' ? (
                    <div></div>
                  ) : (
                    <div className='List-conferencistas'>
                      <Title level={5}>{intl.formatMessage({ id: 'title.panelists' })} </Title>
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
                                              {intl.formatMessage({
                                                id: 'button.more.information',
                                              })}
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

              {currentActivity !== null &&
                currentActivity.selected_document &&
                currentActivity.selected_document.length > 0 && (
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
                          <DocumentsList data={currentActivity !== null && currentActivity.selected_document} />
                        </div>
                      </div>
                    </div>
                  </TabPane>
                )}

              {props.tabs && (
                // && (props.tabs.surveys === true || props.tabs.surveys === 'true')
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
                  {cUser.value !== null ? (
                    <SurveyList eventSurveys={props.eventSurveys} />
                  ) : (
                    <div style={{ paddingTop: 30 }}>
                      <Alert
                        showIcon
                        message='Para poder responder una encuesta debes ser usuario del sistema'
                        type='warning'
                      />
                      <Row style={{ marginTop: 30 }} justify='center'>
                        <Button onClick={redirectRegister}>Registrarme</Button>
                      </Row>
                    </div>
                  )}
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

            <div
              className='card-footer is-12 is-flex'
              style={{
                borderTop: 'none',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
              }}></div>
          </div>

          {/* <Link to={`${urlBack}`}>
            <Row style={{ paddingLeft: '10px' }}>
              <ArrowLeftOutlined>
                <span>AJA</span>
              </ArrowLeftOutlined>
            </Row>
          </Link> */}
        </Card>
      </div>
      {/* Drawer encuestas */}
      <SurveyDrawer colorFondo={colorFondo} colorTexto={colorTexto} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  mainStageContent: state.stage.data.mainStage,
  userInfo: state.user.data,
  currentActivity: state.stage.data.currentActivity,
  currentSurvey: state.survey.data.currentSurvey,
  hasOpenSurveys: state.survey.data.hasOpenSurveys,
  tabs: state.stage.data.tabs,
  generalTabs: state.tabs.generalTabs,
  permissions: state.permissions,
  isVisible: state.survey.data.surveyVisible,
  viewSocialZoneNetworking: state.spaceNetworkingReducer.view,
});

const mapDispatchToProps = {
  gotoActivity,
  setMainStage,
  setCurrentSurvey,
  setSurveyVisible,
  setHasOpenSurveys,
  setTabs,
  setTopBanner,
  unsetCurrentSurvey,
  setSpaceNetworking,
};

let AgendaActividadDetalleWithContext = withContext(AgendaActividadDetalle);
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AgendaActividadDetalleWithContext));
