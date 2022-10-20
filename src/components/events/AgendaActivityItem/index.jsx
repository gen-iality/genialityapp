import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Avatar, Card, Space, Timeline, Comment, Badge, Grid, Button, Typography } from 'antd';
import { useHistory } from 'react-router-dom';
import Moment from 'moment-timezone';
import './style.scss';
import { firestore } from '@helpers/firebase';
import { AgendaApi } from '@helpers/request';
import { LoadingOutlined, CaretRightOutlined, CheckCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';
import * as StageActions from '../../../redux/stage/actions';
import ReactPlayer from 'react-player';
import AccessPointIcon from '@2fd/ant-design-icons/lib/AccessPoint';
import { zoomExternoHandleOpen } from '@helpers/helperEvent';
import { useEventContext } from '@context/eventContext';
import { useUserEvent } from '@context/eventUserContext';
import LessonViewedCheck from '../../agenda/LessonViewedCheck';
import lessonTypeToString from '../lessonTypeToString';
import QuizProgress from '@components/quiz/QuizProgress';
import { activityContentValues } from '@context/activityType/constants/ui';
import { useCurrentUser } from '@context/userContext';
import { ActivityCustomIcon } from '@components/agenda/components/ActivityCustomIcon';

const { gotoActivity } = StageActions;
const { useBreakpoint } = Grid;

function AgendaActivityItem(props) {
  const history = useHistory();
  const cEvent = useEventContext();
  let urlactivity =
    cEvent && !cEvent?.isByname ? `/landing/${props.event._id}/activity/` : `/event/${cEvent?.nameEvent}/activity/`;
  const screens = useBreakpoint();
  function HandleGoActivity(activity_id) {
    history.push(`${urlactivity}${activity_id}`);
  }
  const currentUser = useCurrentUser();

  const [isRegistered, setIsRegistered] = useState(false);
  const [related_meetings, setRelatedMeetings] = useState();
  const [meetingState, setMeetingState] = useState(null);
  const [typeActivity, setTypeActivity] = useState(null);
  const intl = useIntl();
  const [isTaken, setIsTaken] = useState(false);
  const [meetingId, setMeetingId] = useState(null);

  const timeZone = Moment.tz.guess();
  let { item, event_image, registerStatus, event } = props;

  const cEventUser = useUserEvent();

  // Take data
  useEffect(() => {
    if (!cEventUser || !cEventUser.value) return;

    const loadData = async () => {
      // Ask if that activity (item) is stored in <ID>_event_attendees
      console.log('item._id', item._id)
      let activity_attendee = await firestore
        .collection(`${item._id}_event_attendees`)
        .doc(cEventUser.value._id)
        .get(); //checkedin_at
      if (activity_attendee.exists) {
        // If this activity existes, then it means the lesson was taken
        setIsTaken(activity_attendee.data().checked_in);
      }
    };
    loadData();
    return () => {};
  }, [props.data, cEventUser.value]);

  useEffect(() => {
    if (!item._id || !cEvent.value) return;
    (async () => {
      const document = await firestore
        .collection('events')
        .doc(cEvent.value._id)
        .collection('activities')
        .doc(`${item._id}`)
        .get();
      const activity = document.data();    
      console.log('This activity is', activity);
      setMeetingId(activity?.meeting_id);
    })();
  }, [item._id, cEvent.value]);

  useEffect(() => {
    if (registerStatus) {
      setIsRegistered(registerStatus);
    }
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

    listeningStateMeetingRoom();
  }, [registerStatus, item]);

  useEffect(() => {
    (async () => {
      await listeningStateMeetingRoom(item.event_id, item._id);
    })();
  }, []);

  async function listeningStateMeetingRoom(event_id, activity_id) {
    firestore
      .collection('events')
      .doc(event_id)
      .collection('activities')
      .doc(activity_id)
      .onSnapshot((infoActivity) => {
        if (!infoActivity.exists) return;
        const { habilitar_ingreso } = infoActivity.data();
        setMeetingState(habilitar_ingreso);
        infoActivity?.data()?.typeActivity && setTypeActivity(infoActivity.data().typeActivity);
      });
  }

  const validateTypeActivity = (typeActivity) => {
    switch (typeActivity) {
      case 'url':
        return false;
      case 'video':
        return false;

      default:
        return true;
    }
  };

  return (
    <>
      {(item.isPublished == null || item.isPublished == undefined || item.isPublished) && (
        <Row
          className='agendaHover ' /* efect-scale */
          justify='start'
          align='middle'
          onClick={() => {
            if (item.platform === 'zoomExterno' && item.habilitar_ingreso === 'open_meeting_room') {
              const { eventUser } = props;
              zoomExternoHandleOpen(item, eventUser);
            } else {
              // props.gotoActivity(item);
              HandleGoActivity(item._id);
            }
          }}>
          {/* aquie empieza la agenda en estilo mobile */}
          <Col xs={24} sm={24} md={0} lg={0} xxl={0}>
            {/* card de agenda en mobile */}
            <Badge.Ribbon
              className='animate__animated animate__bounceIn animate__delay-2s'
              placement={'end'}
              style={{ height: 'auto', paddingRight: '15px' }}
              color={item.habilitar_ingreso == 'open_meeting_room' ? 'red' : 'transparent'}
              text={
                item.habilitar_ingreso == 'open_meeting_room' ? (
                  <Space>
                    <AccessPointIcon
                      className='animate__animated animate__heartBeat animate__infinite animate__slower'
                      style={{ fontSize: '24px' }}
                    />
                    <span style={{ textAlign: 'center', fontSize: '15px' }}>
                      {<FormattedMessage id='live' defaultMessage='En vivo' />}
                    </span>
                  </Space>
                ) : (
                  ''
                )
              }>
              <Card
                hoverable
                style={{ backgroundColor: 'transparent' }}
                className='card-agenda-mobile agendaHover efect-scale'
                bodyStyle={{
                  padding: '10px',
                  border: `solid 2px ${cEvent.value.styles.textMenu}`,
                  borderRadius: '15px',
                  backgroundColor: cEvent.value.styles.toolbarDefaultBg,
                }}>
                <Row gutter={[8, 8]}>
                  <Col span={6}>
                    {!props.hasDate && (
                      <div className='agenda-hora' style={{ color: cEvent.value.styles.textMenu }}>
                        {item.datetime_start
                          ? Moment.tz(
                              item.datetime_start,
                              'YYYY-MM-DD HH:mm',
                              props.event?.timezone ? props.event.timezone : 'America/Bogota'
                            )
                              .tz(timeZone)
                              .format('hh:mm a')
                          : ''}
                        {item.datetime_start && (
                          <p className='ultrasmall-mobile'>
                            {Moment.tz(
                              item.datetime_start,
                              'YYYY-MM-DD HH:mm',
                              props.event?.timezone ? props.event.timezone : 'America/Bogota'
                            )
                              .tz(timeZone)
                              .format(' (Z)')}
                          </p>
                        )}
                      </div>
                    )}
                    {/* aqui se encuenta el estado de agenda en la mobile */}
                    {item.platform && (
                      <div style={{ textAlign: 'center' }} className='contenedor-estado-agenda'>
                        <Space direction='vertical' size={1}>
                          {meetingState == 'open_meeting_room' ? (
                            <CaretRightOutlined
                              style={{
                                fontSize: '35px',
                                marginTop: '10px',
                                color: '#DD1616',
                              }}
                            />
                          ) : meetingState == 'closed_meeting_room' ? (
                            <LoadingOutlined
                              style={{ fontSize: '35px', marginTop: '10px', color: cEvent.value.styles.textMenu }}
                            />
                          ) : meetingState == 'ended_meeting_room' && item.video ? (
                            <CaretRightOutlined
                              style={{ fontSize: '35px', marginTop: '10px', color: cEvent.value.styles.textMenu }}
                            />
                          ) : meetingState == 'ended_meeting_room' ? (
                            <CheckCircleOutlined
                              style={{ fontSize: '35px', marginTop: '10px', color: cEvent.value.styles.textMenu }}
                            />
                          ) : (
                            <></>
                          )}

                          <span style={{ fontSize: '10px', color: cEvent.value.styles.textMenu }}>
                            {meetingState == 'open_meeting_room'
                              ? intl.formatMessage({ id: 'live' })
                              : meetingState == 'ended_meeting_room' && item.video
                              ? intl.formatMessage({ id: 'live.ended.video' })
                              : meetingState == 'ended_meeting_room'
                              ? intl.formatMessage({ id: 'live.ended' })
                              : meetingState == 'closed_meeting_room'
                              ? intl.formatMessage({ id: 'live.closed' })
                              : '     '}
                          </span>
                        </Space>
                      </div>
                    )}
                  </Col>
                  <Col span={18} style={{ textAlign: 'left' }}>
                    <Space direction='vertical'>
                      <Row gutter={[10, 10]} style={{ textAlign: 'left' }}>
                        <Col span={24}>
                          <div className='tituloM' style={{ color: cEvent.value.styles.textMenu }}>
                            {item.name}.
                          </div>
                          <span className='lugarM' style={{ color: cEvent.value.styles.textMenu }}>
                            {item && item.space && item.space.name}
                          </span>
                        </Col>
                      </Row>
                      <Row gutter={[4, 4]}>
                        {item.hosts.length > 0 &&
                          (item.hosts.length < 4 ? (
                            <>
                              <Col style={{ fontSize: '75%' }}>
                                <Space>
                                  {item.hosts.map((speaker, key) => (
                                    <Space key={key}>
                                      <Avatar size={28} src={speaker.image} />
                                      <div>{speaker.name}</div>
                                    </Space>
                                  ))}
                                </Space>
                              </Col>
                            </>
                          ) : (
                            <>
                              <Col span={8} style={{ fontSize: '75%' }}>
                                <Avatar.Group
                                  maxCount={3}
                                  maxStyle={{
                                    color: '#ffffff',
                                    backgroundColor: '#1CDCB7',
                                  }}>
                                  {item.hosts.map((speaker, key) => (
                                    <Avatar key={key} src={speaker.image} />
                                  ))}
                                </Avatar.Group>
                              </Col>
                            </>
                          ))}
                      </Row>
                    </Space>
                  </Col>
                </Row>
              </Card>
            </Badge.Ribbon>
          </Col>
          {/* aqui empieza la parte de agenda en desktop */}
          <Col xs={0} sm={0} md={24} lg={24} xxl={24}>
            {/* card de la genda en desktop */}
            <Badge.Ribbon
              className='animate__animated animate__bounceIn animate__delay-2s'
              placement={screens.xs === true ? 'start' : 'end'}
              style={{ height: 'auto', paddingRight: '15px' }}
              color={item.habilitar_ingreso == 'open_meeting_room' ? 'red' : 'transparent'}
              text={
                item.habilitar_ingreso == 'open_meeting_room' ? (
                  <Space>
                    <AccessPointIcon
                      className='animate__animated animate__heartBeat animate__infinite animate__slower'
                      style={{ fontSize: '24px' }}
                    />
                    <span style={{ textAlign: 'center', fontSize: '15px' }}>
                      {<FormattedMessage id='live' defaultMessage='En vivo' />}
                    </span>
                  </Space>
                ) : (
                  ''
                )
              }>
              <Card
                style={{
                  border: `solid 1px rgb(240,240,240)`, // color: ${cEvent.value.styles.textMenu}
                  maxHeight: '280px',
                }}
                hoverable
                className='card-agenda-desktop agendaHover efect-scale shadow-box'
                bodyStyle={{
                  padding: '10px',
                  borderRadius: '5px',
                  backgroundColor: cEvent.value.styles.toolbarDefaultBg,
                }}>
                <Row gutter={[8, 8]} style={{paddingLeft: '10px'}}>
                  <Col
                    md={24}
                    lg={24}
                    xl={24}
                    className='agenda-contenido'
                  >
                    <Space direction='vertical'>
                      <Row gutter={[10, 10]}>
                        <Row span={24} style={{ paddingLeft: '0px' }}>
                          <ActivityCustomIcon style={{marginTop: '0.3em', marginRight: '10px'}} type={item.type?.name}/>
                          <div className='titulo' style={{ color: cEvent.value.styles.textMenu, marginRight: '1rem' }}>
                            {item.name}
                          </div>
                          <div style={{marginRight: '1rem'}}>
                            {meetingId && [activityContentValues.quizing, activityContentValues.survey].includes(item.type?.name) && (
                              <QuizProgress eventId={cEvent.value._id} userId={currentUser.value._id} surveyId={meetingId} />
                            )}
                          </div>
                          <div className='lesson'>
                            <Badge
                              style={{
                                backgroundColor: activityContentValues.url === item.type?.name ? '#CB1313'
                                : [activityContentValues.streaming, activityContentValues.rtmp, activityContentValues.vimeo, activityContentValues.youtube, activityContentValues.meeting, activityContentValues.meet].includes(item.type?.name) ? '#14AA55'
                                : item.type?.name === undefined ? '#5F7FA4' : '#8D6CA1',
                              }}
                              count={lessonTypeToString(item.type?.name || 'Contenido genérico')}
                            />
                          </div>
                          <span className='lugar' style={{ color: cEvent.value.styles.textMenu }}>
                            {item && item.space && item.space.name}
                          </span>
                        </Row>
                      </Row>
                      <Row style={{ marginRight: '8px', marginLeft: '0px' }}>
                          {item.hosts.length > 0 &&
                            (item.hosts.length < 4 ? (
                              <>
                                {item.hosts.map((speaker, key) => (
                                  <Space key={key} style={{ marginRight: '8px' }} direction='horizontal'>
                                    <Avatar size={24} src={speaker.image} />
                                    <Typography.Text style={{ color: cEvent.value.styles.textMenu, fontWeight: '400' }}>
                                      {speaker.name}
                                    </Typography.Text>
                                  </Space>
                                ))}
                              </>
                            ) : (
                              <>
                                <Col span={8} style={{ fontSize: '75%' }}>
                                  <Avatar.Group
                                    maxCount={3}
                                    maxStyle={{
                                      color: '#ffffff',
                                      backgroundColor: '#1CDCB7',
                                    }}>
                                    {item.hosts.map((speaker, key) => (
                                      <Avatar key={key} src={speaker.image} />
                                    ))}
                                  </Avatar.Group>
                                </Col>
                              </>
                            ))}
                            {item.habilitar_ingreso === 'open_meeting_room' && (
                            <Button
                              size={screens.xs === true ? 'small' : 'small'}
                              type='primary'
                              className='buttonVirtualConference'
                              style={{ marginTop: '5px' }}
                              onClick={() => {
                                if (item.platform === 'zoomExterno' && item.habilitar_ingreso === 'open_meeting_room') {
                                  const { eventUser } = props;
                                  zoomExternoHandleOpen(item, eventUser);
                                } else {
                                  // props.gotoActivity(item);
                                  HandleGoActivity(item._id);
                                }
                              }}>
                              <FormattedMessage id='live.join' defaultMessage='Ingresa aquí' />
                            </Button>
                          )}
                        </Row>
                    </Space>
                  </Col>
                  <LessonViewedCheck isTaken={isTaken} />
                </Row>
              </Card>
            </Badge.Ribbon>
          </Col>
        </Row>
      )}
    </>
  );
}

const mapDispatchToProps = {
  gotoActivity,
};

export default connect(null, mapDispatchToProps)(AgendaActivityItem);
