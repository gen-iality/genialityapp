import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Avatar, Card, Space, Timeline, Comment, Badge, Grid, Button, Typography } from 'antd';
import { useHistory } from 'react-router-dom';
import Moment from 'moment-timezone';
import './style.scss';
import { firestore } from '../../../helpers/firebase';
import { LoadingOutlined, CaretRightOutlined, CheckCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';
import * as StageActions from '../../../redux/stage/actions';
import ReactPlayer from 'react-player';
import AccessPointIcon from '@2fd/ant-design-icons/lib/AccessPoint';
import { zoomExternoHandleOpen } from '../../../helpers/helperEvent';
import { UseEventContext } from '../../../context/eventContext';

const { gotoActivity } = StageActions;
const { useBreakpoint } = Grid;

function AgendaActivityItem(props) {
  let history = useHistory();
  const cEvent = UseEventContext();
  let urlactivity =
    cEvent && !cEvent?.isByname ? `/landing/${props.event._id}/activity/` : `/event/${cEvent?.nameEvent}/activity/`;
  const screens = useBreakpoint();
  function HandleGoActivity(activity_id) {
    history.push(`${urlactivity}${activity_id}`);
  }

  const [isRegistered, setIsRegistered] = useState(false);
  const [related_meetings, setRelatedMeetings] = useState();
  const [meetingState, setMeetingState] = useState(null);
  const [typeActivity, setTypeActivity] = useState(null);
  const intl = useIntl();

  const timeZone = Moment.tz.guess();
  let { item, event_image, registerStatus, event } = props;

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
                  borderRadius: '15px',
                  border: `solid 2px ${cEvent.value.styles.textMenu}`,
                  maxHeight: '280px',
                  minHeight: '187px',
                }}
                hoverable
                className='card-agenda-desktop agendaHover efect-scale'
                bodyStyle={{
                  padding: '10px',
                  borderRadius: '15px',
                  backgroundColor: cEvent.value.styles.toolbarDefaultBg,
                }}>
                <Row gutter={[8, 8]}>
                  <Col md={4} lg={4} xl={4} className='agenda-hora'>
                    <div>
                      {!props.hasDate && item.datetime_end ? (
                        <Timeline>
                          <Timeline.Item
                            color={!validateTypeActivity(typeActivity) ? 'transparent' : cEvent.value.styles.textMenu}>
                            <div style={{ color: cEvent.value.styles.textMenu }}>
                              {!props.hasDate && item.datetime_start && validateTypeActivity(typeActivity)
                                ? Moment.tz(
                                    item.datetime_start,
                                    'YYYY-MM-DD h:mm',
                                    props.event?.timezone ? props.event.timezone : 'America/Bogota'
                                  )
                                    .tz(timeZone)
                                    .format('h:mm a')
                                : ''}
                              {!props.hasDate && item.datetime_start && validateTypeActivity(typeActivity) && (
                                <p className='ultrasmall' style={{ color: cEvent.value.styles.textMenu }}>
                                  {Moment.tz(
                                    item.datetime_start,
                                    'YYYY-MM-DD HH:mm',
                                    props.event?.timezone ? props.event.timezone : 'America/Bogota'
                                  )
                                    .tz(timeZone)
                                    .format(' (Z') +
                                    ' ' +
                                    timeZone +
                                    ') '}
                                </p>
                              )}
                              {item.platform && (
                                <div style={{ textAlign: 'center' }} className='contenedor-estado-agenda'>
                                  {meetingState == 'open_meeting_room' ? (
                                    <CaretRightOutlined
                                      style={{
                                        fontSize: '45px',
                                        marginTop: '10px',
                                        color: '#DD1616',
                                      }}
                                    />
                                  ) : meetingState == 'closed_meeting_room' ? (
                                    <LoadingOutlined
                                      style={{
                                        fontSize: '45px',
                                        marginTop: '10px',
                                        color: cEvent.value.styles.textMenu,
                                      }}
                                    />
                                  ) : meetingState == 'ended_meeting_room' && item.video ? (
                                    <CaretRightOutlined
                                      style={{
                                        fontSize: '45px',
                                        marginTop: '10px',
                                        color: cEvent.value.styles.textMenu,
                                      }}
                                    />
                                  ) : meetingState == 'ended_meeting_room' ? (
                                    <CheckCircleOutlined
                                      style={{
                                        fontSize: '45px',
                                        marginTop: '10px',
                                        color: cEvent.value.styles.textMenu,
                                      }}
                                    />
                                  ) : (
                                    <></>
                                  )}

                                  {(meetingState == '' || meetingState == null) && <></>}
                                  <p style={{ fontSize: '12px', color: cEvent.value.styles.textMenu }}>
                                    {meetingState == 'open_meeting_room'
                                      ? intl.formatMessage({ id: 'live' })
                                      : meetingState == 'ended_meeting_room' && item.video
                                      ? intl.formatMessage({
                                          id: 'live.ended.video.modify',
                                        })
                                      : meetingState == 'ended_meeting_room'
                                      ? intl.formatMessage({ id: 'live.ended' })
                                      : meetingState == 'closed_meeting_room'
                                      ? intl.formatMessage({
                                          id: 'live.closed',
                                        })
                                      : '     '}
                                  </p>
                                </div>
                              )}
                            </div>
                          </Timeline.Item>
                          {validateTypeActivity(typeActivity) && (
                            <Timeline.Item
                              color={event.styles.toolbarDefaultBg}
                              style={{ paddingBottom: '5px', color: cEvent.value.styles.textMenu }}>
                              {!props.hasDate &&
                                item.datetime_end &&
                                Moment.tz(
                                  item.datetime_end,
                                  'YYYY-MM-DD HH:mm',
                                  props.event?.timezone ? props.event.timezone : 'America/Bogota'
                                )
                                  .tz(timeZone)
                                  .format('h:mm a')}
                              {!props.hasDate && item.datetime_end && (
                                <p className='ultrasmall'>
                                  {Moment.tz(
                                    item.datetime_end,
                                    'YYYY-MM-DD HH:mm',
                                    props.event?.timezone ? props.event.timezone : 'America/Bogota'
                                  )
                                    .tz(timeZone)
                                    .format(' (Z') +
                                    ' ' +
                                    timeZone +
                                    ') '}
                                </p>
                              )}
                            </Timeline.Item>
                          )}
                        </Timeline>
                      ) : (
                        <div
                          style={{
                            textAlign: 'center',
                            marginTop: '25%',
                            marginBottom: '25%',
                          }}>
                          {meetingState == 'open_meeting_room' ? (
                            <CaretRightOutlined
                              style={{
                                fontSize: '60px',
                                marginTop: '10px',
                                color: '#DD1616',
                              }}
                            />
                          ) : meetingState == 'closed_meeting_room' ? (
                            <LoadingOutlined
                              style={{ fontSize: '60px', marginTop: '10px', color: cEvent.value.styles.textMenu }}
                            />
                          ) : meetingState == 'ended_meeting_room' && item.video ? (
                            <CaretRightOutlined
                              style={{ fontSize: '60px', marginTop: '10px', color: cEvent.value.styles.textMenu }}
                            />
                          ) : meetingState == 'ended_meeting_room' ? (
                            <CheckCircleOutlined
                              style={{ fontSize: '60px', marginTop: '10px', color: cEvent.value.styles.textMenu }}
                            />
                          ) : (
                            <></>
                          )}

                          {(meetingState == '' || meetingState == null) && <></>}
                          <p style={{ fontSize: '16px', color: cEvent.value.styles.textMenu }}>
                            {meetingState == 'open_meeting_room'
                              ? intl.formatMessage({ id: 'live' })
                              : meetingState == 'ended_meeting_room' && item.video
                              ? intl.formatMessage({ id: 'live.ended.video.modify' })
                              : meetingState == 'ended_meeting_room'
                              ? intl.formatMessage({ id: 'live.ended' })
                              : meetingState == 'closed_meeting_room'
                              ? intl.formatMessage({ id: 'live.closed' })
                              : '     '}
                          </p>
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col md={14} lg={15} xl={15} className='agenda-contenido'>
                    <Space direction='vertical'>
                      <Row gutter={[10, 10]}>
                        <Col span={24} style={{ paddingLeft: '0px' }}>
                          <div className='titulo' style={{ color: cEvent.value.styles.textMenu }}>
                            {item.name}.
                          </div>
                          <span className='lugar' style={{ color: cEvent.value.styles.textMenu }}>
                            {item && item.space && item.space.name}
                          </span>
                        </Col>
                        <Row style={{ width: '100%' }}>
                          {item.description !== null && item.description !== '<p><br></p>' && (
                            <div
                              style={
                                item.description !== null && item.description !== '<p><br></p>' ? {} : { display: '' }
                              }>
                              {
                                <>
                                  {/*  */}
                                  <Comment
                                    className='descripcion'
                                    content={
                                      cEvent.value?._id !== '62c5e89176dfb307163c05a9' && (
                                        <div
                                          style={{
                                            overflow: 'hidden',
                                            display: '-webkit-box',
                                            WebkitLineClamp: '3',
                                            WebkitBoxOrient: 'vertical',
                                            width: '100%',
                                            color: cEvent.value.styles.textMenu,
                                          }}
                                          dangerouslySetInnerHTML={{
                                            __html: item.description,
                                          }}
                                        />
                                      )
                                    }
                                  />
                                </>
                              }
                            </div>
                          )}
                        </Row>
                        <Row style={{ marginRight: '8px' }}>
                          {item.hosts.length > 0 &&
                            (item.hosts.length < 4 ? (
                              <>
                                {item.hosts.map((speaker, key) => (
                                  <Space key={key} style={{ marginRight: '8px' }} direction='horizontal'>
                                    <Avatar size={40} src={speaker.image} />
                                    <Typography.Text style={{ color: cEvent.value.styles.textMenu }}>
                                      {speaker.name}
                                    </Typography.Text>
                                    {/* <table>
                                    <tr>
                                      <th>
                                        <Avatar size={25} src={speaker.image} />
                                      </th>
                                      <th style={{ marginRight: '12px' }}>
                                        <div className='speaker-name'>{speaker.name}</div>
                                      </th>
                                    </tr>
                                  </table> */}
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
                        </Row>
                      </Row>
                      {item.habilitar_ingreso === 'open_meeting_room' && (
                        <Button
                          size={screens.xs === true ? 'middle' : 'large'}
                          type='primary'
                          className='buttonVirtualConference'
                          style={{ marginTop: '10px' }}
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
                    </Space>
                  </Col>
                  <Col md={6} lg={5} xl={5} style={{ textAlign: 'right', maxHeight: '220px' }}>
                    {/* {console.log(meetingState, 'meetingState', item.video)} */}
                    {/* Aplicada la condición ya que no mostraba el video */}
                    {(meetingState === 'ended_meeting_room' ||
                      meetingState === '' ||
                      meetingState === null ||
                      meetingState === 'null') && (
                      <>
                        {item.video && (
                          <div
                            style={{
                              position: 'absolute',
                              alignItems: 'center',
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                            }}>
                            <Button
                              style={{
                                borderRadius: '10px',
                                width: '100px',
                                height: '60px',
                                opacity: '0.6',
                                border: 'none',
                              }}
                              icon={<PlayCircleOutlined style={{ fontSize: '50px' }} />}
                            />
                          </div>
                        )}

                        <img
                          className='agenda-imagen'
                          src={
                            item.image
                              ? item.image
                              : event_image
                              ? event_image
                              : 'https://via.placeholder.com/150x100/FFFFFF/FFFFFF?text=imagen'
                          }
                        />
                      </>
                    )}
                  </Col>
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
