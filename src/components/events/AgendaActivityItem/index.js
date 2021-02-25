import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Row, Col, Tag, Avatar, Alert, Card, Space, Timeline, List } from 'antd';
import ReactPlayer from 'react-player';
import Moment from 'moment';
import './style.scss';
import { firestore } from '../../../helpers/firebase';
import { TagOutlined, CaretRightFilled, UserOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';
import * as StageActions from '../../../redux/stage/actions';



const { gotoActivity } = StageActions;

function AgendaActivityItem(props) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [related_meetings, setRelatedMeetings] = useState();
  const [meetingState, setMeetingState] = useState(null);
  const intl = useIntl();
  let {
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
    show_inscription,
    hideHours,
  } = props;

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
    console.log('item', item);
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
        const { habilitar_ingreso, meeting_id, platform } = infoActivity.data();
        setMeetingState(habilitar_ingreso);

      });
  }




  return (
    <>
      {/* {item.isPublished && (
        <div className='container_agenda-information'>
          <Card
            className='agenda_information'
            title={item.name}
            extra={
              eventId != '5f80b6c93b4b966dfe7cd012' &&
              eventId != '5f80a72272ccfd4e0d44b722' &&
              eventId != '5f80a9b272ccfd4e0d44b728' &&
              eventId != '5f8099c29564bf4ee44da4f3' && (
                <span className='date-activity'>
                  {Moment(item.datetime_start).format('DD MMMM YYYY') ===
                  Moment(item.datetime_end).format('DD MMMM YYYY') ? (
                    <>
                      {`${Moment(item.datetime_start).format('DD MMMM YYYY')} ${
                        !hideHours || hideHours === 'false'
                          ? Moment(item.datetime_start).format('h:mm a') +
                            ' - ' +
                            Moment(item.datetime_end).format('h:mm a')
                          : ''
                      }`}
                    </>
                  ) : (
                    <>{`${Moment(item.datetime_start).format('DD MMMM YYYY')} ${
                      !hideHours || hideHours === 'false' ? Moment(item.datetime_start).format('hh:mm') + ' - ' : ' '
                    } - ${Moment(item.datetime_end).format('DD MMMM YYYY')} ${
                      !hideHours || hideHours === 'false' ? Moment(item.datetime_end).format('hh:mm') + ' - ' : ' '
                    }`}</>
                  )}
                </span>
              )
            }>
            <Row justify='space-between'>
              {item.description === null || item.hosts.length === 0 ? (
                <>
                  <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
                    <div className='img-agenda-event'>
                      {!item.habilitar_ingreso && <img src={item.image ? item.image : event_image} />}
                      {item.habilitar_ingreso === 'closed_meeting_room' && (
                        <>
                          <img src={item.image ? item.image : event_image} />
                          <Alert
                            message={
                              intl.formatMessage({ id: 'live.starts_in' }) +
                              ` ${Moment(item.datetime_start).format('DD MMMM YYYY h:mm a')} ${' - '} ${Moment(
                                item.datetime_end
                              ).format('h:mm a')}`
                            }
                            type='warning'
                          />
                        </>
                      )}
                      {item.habilitar_ingreso === 'ended_meeting_room' && (
                        <>
                          {item.video ? (
                            item.video && (
                              <>
                                <Alert message={intl.formatMessage({ id: 'live.ended.video' })} type='success' />
                                <ReactPlayer
                                  width={'100%'}
                                  style={{
                                    display: 'block',
                                    margin: '0 auto',
                                  }}
                                  url={item.video}
                                  //url="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/eviuswebassets%2FLa%20asamblea%20de%20copropietarios_%20una%20pesadilla%20para%20muchos.mp4?alt=media&token=b622ad2a-2d7d-4816-a53a-7f743d6ebb5f"
                                  controls
                                  config={{
                                    file: { attributes: { controlsList: 'nodownload' } },
                                  }}
                                />
                              </>
                            )
                          ) : (
                            <>
                              <img src={item.image ? item.image : event_image} />
                              <Alert
                                message={`${intl.formatMessage({ id: 'live.ended' })}: ${Moment(
                                  item.datetime_start
                                ).format('DD MMMM YYYY h:mm a')} ${' - '} ${Moment(item.datetime_end).format(
                                  'h:mm a'
                                )}`}
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
                              disabled={item.meeting_id || item.vimeo_id ? false : true}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleConference(
                                  true,
                                  item.meeting_id || item.vimeo_id ? item.meeting_id : item.vimeo_id,
                                  item
                                );
                              }}>
                              {item.meeting_id || item.vimeo_id
                                ? intl.formatMessage({ id: 'live.join' })
                                : intl.formatMessage({ id: 'live.join.disabled' })}
                            </Button>
                          </div>
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
                                    <Alert message={intl.formatMessage({ id: 'live.closed' })} type='info' />
                                  )}

                                  {item.state === 'ended_meeting_room' && (
                                    <Alert message={intl.formatMessage({ id: 'live.ended' })} type='info' />
                                  )}
                                </>
                              ))}
                          </Row>
                        </>
                      )}
                    </div>
                  </Col>
                </>
              ) : (
                <>
                  <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                    <div className='img-agenda-event'>
                      {!item.habilitar_ingreso && <img src={item.image ? item.image : event_image} />}
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
                                    margin: '0 auto',
                                  }}
                                  url={item.video}
                                  //url="https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/eviuswebassets%2FLa%20asamblea%20de%20copropietarios_%20una%20pesadilla%20para%20muchos.mp4?alt=media&token=b622ad2a-2d7d-4816-a53a-7f743d6ebb5f"
                                  controls
                                  config={{
                                    file: { attributes: { controlsList: 'nodownload' } },
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
                              disabled={item.meeting_id || item.vimeo_id ? false : true}
                              onClick={() =>
                                toggleConference(
                                  true,
                                  item.meeting_id || item.vimeo_id ? item.meeting_id : item.vimeo_id,
                                  item
                                )
                              }>
                              {item.meeting_id || item.vimeo_id
                                ? 'Conéctate a la conferencia en vivo'
                                : 'Aún no empieza Conferencia Virtual'}
                            </Button>
                          </div>
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
                  <Col xs={24} sm={24} md={24} lg={12} xl={16} xxl={16}>
                    {item.description !== null && item.description !== '<p><br></p>' && (
                      <div
                        className='description-agenda'
                        style={
                          item.description !== null && item.description !== '<p><br></p>' ? {} : { display: 'none' }
                        }>
                        {
                          <>
                            <Row>
                              <div dangerouslySetInnerHTML={{ __html: item.description }} />
                            </Row>
                          </>
                        }
                      </div>
                    )}

                    {item.hosts.length > 0 && (
                      <>
                        <Row justify='start' className='txt-agenda-Panelistas'>
                          <h4>Panelistas:</h4>
                        </Row>
                        <Row justify='start' className='Agenda-Panelistas'>
                          {item.hosts.map((speaker, key) => (
                            <span key={key} className='Agenda-speaker'>
                              <Col lg={24} xl={24} xxl={24}>
                                <Avatar size={30} src={speaker.image} /> {speaker.name} &nbsp;
                              </Col>
                            </span>
                          ))}
                        </Row>
                      </>
                    )}
                  </Col>
                </>
              )}
            </Row>
            <Row>
              <Col xs={24} sm={24} md={24} lg={8} xxl={8} xl={8}>
                <Row justify='start' align='middle'>
                  <div
                    onClick={() => {
                      gotoActivity(item);
                    }}
                    className='tag-agenda'
                    style={{ marginBottom: '5%' }}>
                    <TagOutlined style={{ marginRight: '12px', fontSize: '15px' }} />
                    {item.activity_categories.length > 0 && (
                      <>
                        {item.activity_categories.map((item) => (
                          <>
                            <Tag>{item.name}</Tag>
                          </>
                        ))}
                      </>
                    )}
                  </div>
                </Row>
              </Col>
              <Col xs={24} sm={24} md={24} lg={16} xl={16} xxl={16}>
                <Row justify='end' align='bottom'>
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
                        props.gotoActivity(item);
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
                </Row>
              </Col>
            </Row>
          </Card>
        </div>
      )} */}
      <Row
        justify='start'
        onClick={() => {
          props.gotoActivity(item);
        }}>
        <Col xs={24} sm={24} md={0} lg={0} xxl={0}>
          <Card bodyStyle={{ padding: '10px' }}>
            <Row gutter={[8, 8]}>
              <Col span={4}>
                <div style={{ fontSize: '8px', marginTop: '6%' }}>
                  {item.datetime_start ? Moment(item.datetime_start).format('h:mm a') : ''}
                </div>
                <div>
                  {' '}
                  o <span style={{ fontSize: '8px' }}>{meetingState=="open_meeting_room"?"En vivo":meetingState=="ended_meeting_room"? "Grab/Term":meetingState=="closed_meeting_room"?"Por iniciar": "sin estado"}</span>
                </div>
              </Col>
              <Col span={20} style={{ textAlign: 'left' }}>
                <Space direction='vertical'>
                  <Row gutter={[10, 10]} style={{ textAlign: 'left' }}>
                    <Col span={24}>
                      <div style={{ fontWeight: '700', textAlign: 'left', fontSize: '12px' }}>
                        {item.name}. 
                      </div>
                      <span style={{ fontSize: '10px', color: 'grey' }}>sala de evento</span>
                    </Col>
                    <Row gutter={[4,4]}>
                      {item.hosts.length > 0 && (
                        <>
                          {item.hosts.map((speaker, key) => (
                            <Col key={key} span={6} style={{ fontSize: '75%' }}>
                              <table>
                                <tr>
                                  <th>
                                    <Avatar   
                                     size={25}                                   
                                     src={speaker.image}
                                    />
                                  </th>
                                  <th style={{marginRight:'12px'}}><div style={{marginLeft:'12px', fontSize:'9px', marginRight:'12px'}}>{speaker.name}</div></th>
                                </tr>
                              </table>
                            </Col>
                          ))}
                        </>
                      )}
                    </Row>
                  </Row>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={0} sm={0} md={24} lg={24} xxl={24}>
          <Card bodyStyle={{ padding: '10px' }}>
            <Row gutter={[8, 8]}>
              <Col span={4}>
                <div style={{ marginTop: '10%' }}>
                  <Timeline>
                    <Timeline.Item color='#1cdcb7'>
                      {item.datetime_start ? Moment(item.datetime_start).format('h:mm a') : ''}
                      <div style={{ height: '79px', fontSize: '8px', marginLeft: '-8px', marginTop: '3%' }}>
                      {meetingState=="open_meeting_room"&& <img
                          src='https://static.thenounproject.com/png/55528-200.png'
                          style={{ height: '80%', width: 'auto' }}
                        />}
                        {meetingState=="closed_meeting_room"&& <img
                          src='https://media2.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif'
                          style={{ height: '80%', width: 'auto' }}
                        />}
                        {meetingState=="ended_meeting_room"&& <img
                          src='https://img.flaticon.com/icons/png/512/0/375.png?size=1200x630f&pad=10,10,10,10&ext=png&bg=FFFFFFFF'
                          style={{ height: '80%', width: 'auto' }}
                        />}
                        {(meetingState=="" || meetingState==null)&& <img
                          src='data:image/png;base64,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'
                          style={{ height: '80%', width: 'auto' }}
                        />}
                         <p>{meetingState=="open_meeting_room"?"En vivo":meetingState=="ended_meeting_room"? "Grab/Term":meetingState=="closed_meeting_room"?"Por iniciar": "sin estado"}</p>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item color='#1cdcb7' style={{ paddingBottom: '0px' }}>
                      {item.datetime_end ? Moment(item.datetime_end).format('h:mm a') : ''}{' '}
                    </Timeline.Item>
                  </Timeline>
                </div>
              </Col>
              <Col span={16} style={{ textAlign: 'left' }}>
                <Space direction='vertical'>
                  <Row gutter={[10, 10]} style={{ textAlign: 'left' }}>
                    <Col span={24}>
                      <div style={{ fontWeight: '700', textAlign: 'left', fontSize: '20px' }}>{item.name}.</div>
                      <span style={{ fontSize: '15px', color: 'grey' }}>sala de evento</span>
                    </Col>
                    <Row>
                      {item.description !== null && item.description !== '<p><br></p>' && (
                        <div
                          style={
                            item.description !== null && item.description !== '<p><br></p>' ? {} : { display: '' }
                          }>
                          {
                            <>
                              <div
                                style={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  width: '22%',
                                }}
                                dangerouslySetInnerHTML={{ __html: item.description }}
                              />
                            </>
                          }
                        </div>
                      )}
                    </Row>
                    <Row>
                      {item.hosts.length > 0 && (
                        <>
                          {item.hosts.map((speaker, key) => (
                            <Col key={key} span={6} style={{ fontSize: '75%' }}>
                              <table>
                                <tr>
                                  <th>
                                    <Avatar                                      
                                     src={speaker.image}
                                    />
                                  </th>
                                  <th><div style={{marginLeft:'12px'}}>{speaker.name}</div></th>
                                </tr>
                              </table>
                            </Col>
                          ))}
                        </>
                      )}
                    </Row>
                  </Row>
                </Space>
              </Col>
              <Col span={4}>
                <img src={item.image ? item.image : event_image} style={{ objectFit:'cover', height:'160px', borderRadius:'3px' }} />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
}

const mapDispatchToProps = {
  gotoActivity,
};

export default connect(null, mapDispatchToProps)(AgendaActivityItem);
