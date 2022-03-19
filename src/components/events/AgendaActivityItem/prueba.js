import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Avatar, Card, Space, Timeline, Comment } from 'antd';

import Moment from 'moment-timezone';
import './style.scss';
import { firestore } from '../../../helpers/firebase';
import Icon, { LoadingOutlined, CaretRightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import * as StageActions from '../../../redux/stage/actions';

const EnVivoSvg = () => (
  <svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M10.1002 7.58557C10.4751 7.96063 10.6857 8.46924 10.6857 8.99957C10.6857 9.5299 10.4751 10.0385 10.1002 10.4136C8.79999 11.7136 7.76862 13.257 7.06497 14.9557C6.36131 16.6543 5.99915 18.4749 5.99915 20.3136C5.99915 22.1522 6.36131 23.9728 7.06497 25.6715C7.76862 27.3701 8.79999 28.9135 10.1002 30.2136C10.2912 30.3981 10.4435 30.6188 10.5484 30.8628C10.6532 31.1068 10.7083 31.3692 10.7107 31.6348C10.713 31.9003 10.6624 32.1637 10.5618 32.4095C10.4612 32.6553 10.3127 32.8786 10.1249 33.0664C9.93716 33.2541 9.71386 33.4027 9.46806 33.5032C9.22227 33.6038 8.95891 33.6544 8.69335 33.6521C8.42779 33.6498 8.16536 33.5946 7.92135 33.4898C7.67734 33.385 7.45665 33.2326 7.27216 33.0416C5.60068 31.3701 4.27479 29.3858 3.37019 27.2019C2.46559 25.018 2 22.6774 2 20.3136C2 17.9498 2.46559 15.6091 3.37019 13.4252C4.27479 11.2413 5.60068 9.25703 7.27216 7.58557C7.64721 7.21063 8.15583 7 8.68616 7C9.21648 7 9.7251 7.21063 10.1002 7.58557ZM29.9002 7.58557C30.2752 7.21063 30.7838 7 31.3142 7C31.8445 7 32.3531 7.21063 32.7282 7.58557C34.3996 9.25703 35.7255 11.2413 36.6301 13.4252C37.5347 15.6091 38.0003 17.9498 38.0003 20.3136C38.0003 22.6774 37.5347 25.018 36.6301 27.2019C35.7255 29.3858 34.3996 31.3701 32.7282 33.0416C32.5437 33.2326 32.323 33.385 32.079 33.4898C31.835 33.5946 31.5725 33.6498 31.307 33.6521C31.0414 33.6544 30.778 33.6038 30.5322 33.5032C30.2865 33.4027 30.0632 33.2541 29.8754 33.0664C29.6876 32.8786 29.5391 32.6553 29.4385 32.4095C29.338 32.1637 29.2873 31.9003 29.2897 31.6348C29.292 31.3692 29.3471 31.1068 29.452 30.8628C29.5568 30.6188 29.7091 30.3981 29.9002 30.2136C31.2003 28.9135 32.2317 27.3701 32.9353 25.6715C33.639 23.9728 34.0012 22.1522 34.0012 20.3136C34.0012 18.4749 33.639 16.6543 32.9353 14.9557C32.2317 13.257 31.2003 11.7136 29.9002 10.4136C29.5252 10.0385 29.3146 9.5299 29.3146 8.99957C29.3146 8.46924 29.5252 7.96063 29.9002 7.58557ZM15.7582 13.2416C16.1331 13.6166 16.3437 14.1252 16.3437 14.6556C16.3437 15.1859 16.1331 15.6945 15.7582 16.0696C15.2009 16.6267 14.7589 17.2882 14.4573 18.0162C14.1557 18.7443 14.0004 19.5246 14.0004 20.3126C14.0004 21.1006 14.1557 21.8809 14.4573 22.6089C14.7589 23.3369 15.2009 23.9984 15.7582 24.5556C15.9438 24.7414 16.0911 24.962 16.1916 25.2047C16.292 25.4474 16.3437 25.7076 16.3436 25.9703C16.3435 26.233 16.2916 26.4931 16.191 26.7357C16.0904 26.9784 15.943 27.1989 15.7572 27.3846C15.5713 27.5703 15.3508 27.7175 15.108 27.818C14.8653 27.9184 14.6051 27.9701 14.3424 27.97C14.0798 27.9699 13.8196 27.918 13.577 27.8174C13.3343 27.7168 13.1138 27.5694 12.9282 27.3836C11.0534 25.5083 10.0003 22.9652 10.0003 20.3136C10.0003 17.6619 11.0534 15.1188 12.9282 13.2436C13.1139 13.0576 13.3345 12.9101 13.5773 12.8095C13.8201 12.7088 14.0803 12.657 14.3432 12.657C14.606 12.657 14.8662 12.7088 15.109 12.8095C15.3518 12.9101 15.5724 13.0576 15.7582 13.2436V13.2416ZM24.2422 13.2416C24.4279 13.0556 24.6485 12.9081 24.8913 12.8075C25.1341 12.7068 25.3943 12.655 25.6572 12.655C25.92 12.655 26.1802 12.7068 26.423 12.8075C26.6658 12.9081 26.8864 13.0556 27.0722 13.2416C28.001 14.1702 28.7379 15.2727 29.2406 16.4861C29.7433 17.6996 30.002 19.0001 30.002 20.3136C30.002 21.627 29.7433 22.9276 29.2406 24.141C28.7379 25.3544 28.001 26.457 27.0722 27.3856C26.6969 27.7609 26.1879 27.9717 25.6572 27.9717C25.1264 27.9717 24.6174 27.7609 24.2422 27.3856C23.8669 27.0103 23.656 26.5013 23.656 25.9706C23.656 25.4398 23.8669 24.9309 24.2422 24.5556C25.367 23.4304 25.9989 21.9046 25.9989 20.3136C25.9989 18.7226 25.367 17.1967 24.2422 16.0716C24.0562 15.8858 23.9087 15.6652 23.808 15.4225C23.7074 15.1797 23.6556 14.9194 23.6556 14.6566C23.6556 14.3937 23.7074 14.1335 23.808 13.8907C23.9087 13.6479 24.0562 13.4273 24.2422 13.2416ZM20.0002 18.3136C20.5306 18.3136 21.0393 18.5243 21.4144 18.8994C21.7894 19.2744 22.0002 19.7831 22.0002 20.3136V20.3336C22.0002 20.864 21.7894 21.3727 21.4144 21.7478C21.0393 22.1229 20.5306 22.3336 20.0002 22.3336C19.4697 22.3336 18.961 22.1229 18.5859 21.7478C18.2109 21.3727 18.0002 20.864 18.0002 20.3336V20.3136C18.0002 19.7831 18.2109 19.2744 18.5859 18.8994C18.961 18.5243 19.4697 18.3136 20.0002 18.3136Z'
      fill='#DD1616'
    />
  </svg>
);

const { gotoActivity } = StageActions;

function AgendaActivityItem(props) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [related_meetings, setRelatedMeetings] = useState();
  const [meetingState, setMeetingState] = useState(null);
  const intl = useIntl();
  const EnvivoIcon = (props) => <Icon component={EnVivoSvg} {...props} />;
  const timeZone = Moment.tz.guess();
  let { item, event_image, registerStatus } = props;

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
    console.log('DATE HAS');
    console.log(props.hasDate);
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
              props.gotoActivity(item);
            }
          }}>
          {/* aquie empieza la agenda en estilo mobile */}
          <Col xs={24} sm={24} md={0} lg={0} xxl={0}>
            {/* card de agenda en mobile */}
            <Card hoverable className='card-agenda-mobile agendaHover efect-scale' bodyStyle={{ padding: '10px' }}>
              <Row gutter={[8, 8]}>
                <Col span={4}>
                  {!props.hasDate && (
                    <div className='agenda-hora'>
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
                    <div className='contenedor-estado-agenda'>
                      {meetingState == 'open_meeting_room' ? (
                        <EnvivoIcon style={{ fontSize: '35px', marginTop: '10px' }} />
                      ) : meetingState == 'closed_meeting_room' ? (
                        <LoadingOutlined style={{ fontSize: '35px', marginTop: '10px' }} />
                      ) : meetingState == 'ended_meeting_room' && item.video ? (
                        <CaretRightOutlined style={{ fontSize: '35px', marginTop: '10px' }} />
                      ) : meetingState == 'ended_meeting_room' ? (
                        <CheckCircleOutlined style={{ fontSize: '35px', marginTop: '10px' }} />
                      ) : (
                        <></>
                      )}

                      <span style={{ fontSize: '8px' }}>
                        {meetingState == 'open_meeting_room'
                          ? 'En vivo'
                          : meetingState == 'ended_meeting_room' && item.video
                          ? 'Grabado'
                          : meetingState == 'ended_meeting_room'
                          ? 'Finalizado'
                          : meetingState == 'closed_meeting_room'
                          ? 'Por iniciar'
                          : '     '}
                      </span>
                    </div>
                  )}
                </Col>
                <Col span={20} style={{ textAlign: 'left' }}>
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
            <Card hoverable className='card-agenda-desktop agendaHover efect-scale' bodyStyle={{ padding: '10px' }}>
              <Row gutter={[8, 8]}>
                <Col md={4} lg={4} xl={4}>
                  <div className='agenda-hora'>
                    {!props.hasDate && item.datetime_end && (
                      <Timeline>
                        <Timeline.Item color='#1cdcb7'>
                          {!props.hasDate && item.datetime_start
                            ? Moment.tz(
                                item.datetime_start,
                                'YYYY-MM-DD h:mm',
                                props.event?.timezone ? props.event.timezone : 'America/Bogota'
                              )
                                .tz(timeZone)
                                .format('h:mm a')
                            : ''}
                          {!props.hasDate && item.datetime_start && (
                            <p className='ultrasmall'>
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
                            <div className='contenedor-estado-agenda'>
                              {meetingState == 'open_meeting_room' ? (
                                <EnvivoIcon style={{ fontSize: '45px', marginTop: '10px' }} />
                              ) : meetingState == 'closed_meeting_room' ? (
                                <LoadingOutlined style={{ fontSize: '45px', marginTop: '10px' }} />
                              ) : meetingState == 'ended_meeting_room' && item.video ? (
                                <CaretRightOutlined style={{ fontSize: '45px', marginTop: '10px' }} />
                              ) : meetingState == 'ended_meeting_room' ? (
                                <CheckCircleOutlined style={{ fontSize: '45px', marginTop: '10px' }} />
                              ) : (
                                <></>
                              )}

                              {(meetingState == '' || meetingState == null) && <></>}
                              <p style={{ fontSize: '14px' }}>
                                {meetingState == 'open_meeting_room'
                                  ? intl.formatMessage({ id: 'live' })
                                  : meetingState == 'ended_meeting_room' && item.video
                                  ? intl.formatMessage({ id: 'live.ended.video' })
                                  : meetingState == 'ended_meeting_room'
                                  ? intl.formatMessage({ id: 'live.ended' })
                                  : meetingState == 'closed_meeting_room'
                                  ? intl.formatMessage({ id: 'live.by_start' })
                                  : '     '}
                              </p>
                            </div>
                          )}
                        </Timeline.Item>
                        <Timeline.Item color='#1cdcb7' style={{ paddingBottom: '0px' }}>
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
                      </Timeline>
                    )}
                  </div>
                </Col>
                <Col md={12} lg={15} xl={15} className='agenda-contenido'>
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
                <Col md={8} lg={5} xl={5}>
                  {item.image && <img className='agenda-imagen' src={item.image ? item.image : event_image} />}
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
