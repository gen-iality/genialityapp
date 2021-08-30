import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Avatar, Card, Space, Timeline, Comment } from 'antd';
import { useHistory } from 'react-router-dom';

import Moment from 'moment-timezone';
import './style.scss';
import { firestore } from '../../../helpers/firebase';
import Icon, { LoadingOutlined, CaretRightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import * as StageActions from '../../../redux/stage/actions';
import AccessPoint from '@2fd/ant-design-icons/lib/AccessPoint';
import ReactPlayer from 'react-player';

const { gotoActivity } = StageActions;

function AgendaActivityItem(props) {
  let history = useHistory();
  let urlactivity = `/landing/${props.event._id}/activity/`;

  function HandleGoActivity(activity_id) {
    history.push(`${urlactivity}${activity_id}`);
  }

  const [isRegistered, setIsRegistered] = useState(false);
  const [related_meetings, setRelatedMeetings] = useState();
  const [meetingState, setMeetingState] = useState(null);
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
      });
  }

  return (
    <>
      {(item.isPublished == null || item.isPublished == undefined || item.isPublished) && (
        <Row
          justify='start'
          align='middle'
          onClick={() => {
            if (item.platform === 'zoomExterno' && item.habilitar_ingreso === 'open_meeting_room') {
              const { eventUser, zoomExternoHandleOpen } = props;
              zoomExternoHandleOpen(item, eventUser);
            } else {
              // props.gotoActivity(item);
              HandleGoActivity(item._id);
            }
          }}>
          {/* aquie empieza la agenda en estilo mobile */}
          <Col xs={24} sm={24} md={0} lg={0} xxl={0}>
            {/* card de agenda en mobile */}
            <Card
              hoverable
              className='card-agenda-mobile agendaHover efect-scale'
              bodyStyle={{
                padding: '10px',
                border: `solid 2px ${event.styles.toolbarDefaultBg}`,
                borderRadius: '15px',
              }}>
              <Row gutter={[8, 8]}>
                <Col span={6}>
                  {!props.hasDate && (
                    <div className='agenda-hora'>
                      {item.datetime_start
                        ? Moment.tz(item.datetime_start, 'YYYY-MM-DD HH:mm', 'America/Bogota')
                            .tz(timeZone)
                            .format('hh:mm a')
                        : ''}
                      {item.datetime_start && (
                        <p className='ultrasmall-mobile'>
                          {Moment.tz(item.datetime_start, 'YYYY-MM-DD HH:mm', 'America/Bogota')
                            .tz(timeZone)
                            .format(' (Z)')}
                        </p>
                      )}
                    </div>
                  )}
                  {/* aqui se encuenta el estado de agenda en la mobile */}
                  <div style={{ textAlign: 'center' }} className='contenedor-estado-agenda'>
                    <Space direction='vertical' size={1}>
                      {meetingState == 'open_meeting_room' ? (
                        <AccessPoint style={{ fontSize: '35px', marginTop: '10px', color: '#DD1616' }} />
                      ) : meetingState == 'closed_meeting_room' ? (
                        <LoadingOutlined style={{ fontSize: '35px', marginTop: '10px' }} />
                      ) : meetingState == 'ended_meeting_room' && item.video ? (
                        <CaretRightOutlined style={{ fontSize: '35px', marginTop: '10px' }} />
                      ) : meetingState == 'ended_meeting_room' ? (
                        <CheckCircleOutlined style={{ fontSize: '35px', marginTop: '10px' }} />
                      ) : (
                        <></>
                      )}

                      <span style={{ fontSize: '10px' }}>
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
                </Col>
                <Col span={18} style={{ textAlign: 'left' }}>
                  <Space direction='vertical'>
                    <Row gutter={[10, 10]} style={{ textAlign: 'left' }}>
                      <Col span={24}>
                        <div className='tituloM'>{item.name}.</div>
                        <span className='lugarM'>{item && item.space && item.space.name}</span>
                      </Col>
                    </Row>
                    <Row gutter={[4, 4]}>
                      {item.hosts.length > 0 &&
                        (item.hosts.length < 4 ? (
                          <>
                            {item.hosts.map((speaker, key) => (
                              <Col key={key} span={8} style={{ fontSize: '75%' }}>
                                <table>
                                  <tr>
                                    <th>
                                      <Avatar size={25} src={speaker.image} />
                                    </th>
                                    <th style={{ marginRight: '12px' }}>
                                      <div style={{ marginLeft: '12px', fontSize: '9px', marginRight: '12px' }}>
                                        {speaker.name}
                                      </div>
                                    </th>
                                  </tr>
                                </table>
                              </Col>
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
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>
          {/* aqui empieza la parte de agenda en desktop */}
          <Col xs={0} sm={0} md={24} lg={24} xxl={24}>
            {/* card de la genda en desktop */}
            <Card
              style={{ borderRadius: '15px', border: `solid 2px ${event.styles.toolbarDefaultBg}`, overflow:'hidden',maxHeight: '300px', minHeight:'210px' }}
              hoverable
              className='card-agenda-desktop agendaHover efect-scale'
              bodyStyle={{ padding: '10px' }}>
              <Row gutter={[8, 8]}>
                <Col md={4} lg={4} xl={4} className='agenda-hora'>
                  <div>
                    {!props.hasDate && item.datetime_end ? (
                      <Timeline>
                        <Timeline.Item color={event.styles.toolbarDefaultBg}>
                          <div>
                            {!props.hasDate && item.datetime_start
                              ? Moment.tz(item.datetime_start, 'YYYY-MM-DD h:mm', 'America/Bogota')
                                  .tz(timeZone)
                                  .format('h:mm a')
                              : ''}
                            {!props.hasDate && item.datetime_start && (
                              <p className='ultrasmall'>
                                {Moment.tz(item.datetime_start, 'YYYY-MM-DD HH:mm', 'America/Bogota')
                                  .tz(timeZone)
                                  .format(' (Z') +
                                  ' ' +
                                  timeZone +
                                  ') '}
                              </p>
                            )}
                            <div style={{ textAlign: 'center' }} className='contenedor-estado-agenda'>
                              {meetingState == 'open_meeting_room' ? (
                                <AccessPoint style={{ fontSize: '45px', marginTop: '10px', color: '#DD1616' }} />
                              ) : meetingState == 'closed_meeting_room' ? (
                                <LoadingOutlined style={{ fontSize: '45px', marginTop: '10px' }} />
                              ) : meetingState == 'ended_meeting_room' && item.video ? (
                                <CaretRightOutlined style={{ fontSize: '45px', marginTop: '-8px' }} />
                              ) : meetingState == 'ended_meeting_room' ? (
                                <CheckCircleOutlined style={{ fontSize: '45px', marginTop: '10px' }} />
                              ) : (
                                <></>
                              )}

                              {(meetingState == '' || meetingState == null) && <></>}
                              <p style={{ fontSize: '12px' }}>
                                {meetingState == 'open_meeting_room'
                                  ? intl.formatMessage({ id: 'live' })
                                  : meetingState == 'ended_meeting_room' && item.video
                                  ? intl.formatMessage({ id: 'live.ended.video' })
                                  : meetingState == 'ended_meeting_room'
                                  ? intl.formatMessage({ id: 'live.ended' })
                                  : meetingState == 'closed_meeting_room'
                                  ? intl.formatMessage({ id: 'live.closed' })
                                  : '     '}
                              </p>
                            </div>
                          </div>
                        </Timeline.Item>
                        <Timeline.Item color={event.styles.toolbarDefaultBg} style={{ paddingBottom: '0px' }}>
                          {!props.hasDate &&
                            item.datetime_end &&
                            Moment.tz(item.datetime_end, 'YYYY-MM-DD HH:mm', 'America/Bogota')
                              .tz(timeZone)
                              .format('h:mm a')}
                          {!props.hasDate && item.datetime_end && (
                            <p className='ultrasmall'>
                              {Moment.tz(item.datetime_end, 'YYYY-MM-DD HH:mm', 'America/Bogota')
                                .tz(timeZone)
                                .format(' (Z') +
                                ' ' +
                                timeZone +
                                ') '}
                            </p>
                          )}
                        </Timeline.Item>
                      </Timeline>
                    ) : (
                      <div style={{ textAlign: 'center', marginTop: '25%', marginBottom: '25%' }}>
                        {meetingState == 'open_meeting_room' ? (
                          <AccessPoint style={{ fontSize: '60px', marginTop: '10px', color: '#DD1616' }} />
                        ) : meetingState == 'closed_meeting_room' ? (
                          <LoadingOutlined style={{ fontSize: '60px', marginTop: '10px' }} />
                        ) : meetingState == 'ended_meeting_room' && item.video ? (
                          <CaretRightOutlined style={{ fontSize: '60px', marginTop: '10px' }} />
                        ) : meetingState == 'ended_meeting_room' ? (
                          <CheckCircleOutlined style={{ fontSize: '60px', marginTop: '10px' }} />
                        ) : (
                          <></>
                        )}

                        {(meetingState == '' || meetingState == null) && <></>}
                        <p style={{ fontSize: '16px' }}>
                          {meetingState == 'open_meeting_room'
                            ? intl.formatMessage({ id: 'live' })
                            : meetingState == 'ended_meeting_room' && item.video
                            ? intl.formatMessage({ id: 'live.ended.video' })
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
                        <div className='titulo'>{item.name}.</div>
                        <span className='lugar'>{item && item.space && item.space.name}</span>
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
                                    <div
                                      style={{
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                        WebkitLineClamp: '2',
                                        WebkitBoxOrient: 'vertical',
                                        width: '90%',
                                      }}
                                      dangerouslySetInnerHTML={{ __html: item.description }}
                                    />
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
                                  <Avatar size={25} src={speaker.image} />
                                  {speaker.name}
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
                  </Space>
                </Col>
                <Col md={6} lg={5} xl={5} style={{ textAlign: 'right' }}>
                  {meetingState == 'ended_meeting_room' && item.video ? (
                    <ReactPlayer
                      light={true}
                      width={'100%'}
                      height={'100%'}
                      url={item !== null && item.video}
                    />
                  ) : (
                    <img
                      className='agenda-imagen'
                      src={
                        item.image
                          ? item.image
                          : event_image
                          ? event_image
                          : 'https://via.placeholder.com/300/FFFFFF/FFFFFF?Text=imagen'
                      }
                    />
                  )}
                </Col>
              </Row>
            </Card>
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
