import React, { Fragment, useState, useEffect } from 'react';
import { Card, Button, Avatar, Row, Col, Tooltip, Typography, Spin } from 'antd';
import { AgendaApi } from '../../helpers/request';
import { firestore } from '../../helpers/firebase';
import Moment from 'moment-timezone';
import { FieldTimeOutlined, SettingOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import ENVIVO from '../../EnVivo.svg';
import { UseEventContext } from '../../Context/eventContext';
import { UseUserEvent } from '../../Context/eventUserContext';
import { Link } from 'react-router-dom';
import * as StageActions from '../../redux/stage/actions';

const { gotoActivity } = StageActions;
const { Title } = Typography;

let MeetingConferenceButton = ({ activity, zoomExternoHandleOpen, event, setActivity, eventUser }) => {
  const [infoActivity, setInfoActivity] = useState({});

  useEffect(() => {
    setInfoActivity(activity);
  }, [activity, event]);

  switch (infoActivity.habilitar_ingreso) {
    case 'open_meeting_room':
      return (
        <>
          <Button
            size='large'
            type='primary'
            className='buttonVirtualConference'
            onClick={() => {
              if (activity.platform === 'zoomExterno') {
                zoomExternoHandleOpen(activity, eventUser);
              } else {
                setActivity(activity);
              }
            }}>
            <FormattedMessage id='live.join' defaultMessage='Ingresa aquí' />
          </Button>
        </>
      );

    case 'closed_meeting_room':
      return <></>;

    case 'ended_meeting_room':
      return <></>;

    default:
      return <h1 style={{ fontWeight: '400', fontSize: '45px' }}></h1>;
  }
};

const VirtualConference = () => {
  let cEvent = UseEventContext();
  let cEventUser = UseUserEvent();
  let urlactivity = `/landing/${cEvent.value._id}/activity/`;
  let urlAgenda = `/landing/${cEvent.value._id}/agenda/`;

  const [infoAgendaArr, setinfoAgenda] = useState([]);
  const [agendageneral, setagendageneral] = useState(null);
  const [bandera, setbandera] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await AgendaApi.byEvent(cEvent.value._id);
      // let withMetting = response.data.filter((activity) => activity.meeting_id != null || '' || undefined);
      setagendageneral(response.data);

      setbandera(!bandera);
    }
    fetchData();
  }, []);

  useEffect(() => {
    agendageneral &&
      firestore
        .collection('events')
        .doc(cEvent.value._id)
        .collection('activities')
        .onSnapshot((infoActivity) => {
          let arratem = [];

          infoActivity.docs.map((doc) => {
            agendageneral.map((item) => {
              if (item._id == doc.id) {
                let activity;
                let { habilitar_ingreso, isPublished, meeting_id, platform, vimeo_id } = doc.data();
                if (
                  habilitar_ingreso != 'ended_meeting_room' &&
                  isPublished &&
                  habilitar_ingreso != '' &&
                  (meeting_id != null || vimeo_id != null)
                ) {
                  activity = { ...item, habilitar_ingreso, isPublished, meeting_id, platform };
                  arratem.push(activity);
                }
              }
            });
          });

          //ordenar
          let activitiesorder = arratem.sort((a, b) => a.updated_at - b.updated_at);
          let orderactivities = [];
          orderactivities.push(activitiesorder[0]);

          setinfoAgenda(orderactivities);
        });
  }, [agendageneral, firestore]);

  return (
    <Fragment>
      {infoAgendaArr.length > 0 &&
        infoAgendaArr
          .filter((item) => {
            return (
              item?.habilitar_ingreso &&
              (item?.habilitar_ingreso == 'open_meeting_room' || item?.habilitar_ingreso == 'closed_meeting_room') &&
              (item?.isPublished === true || item?.isPublished === 'true')
            );
          })

          .map((item, key) => (
            <>
              <Card
                actions={[
                  <Link key='setting' to={`${urlAgenda}`}>
                    <Button type='primary' key='setting'>
                      {' '}
                      Ver mas actividades
                    </Button>
                    ,
                  </Link>,
                ]}
                key={key}
                hoverable
                style={{
                  height: 'auto',
                  maxHeight: '300px',
                  minHeight: '204px',
                  marginTop: '8px',
                  marginBottom: '8px',
                }}
                className='animate__animated animate__slideInRight'>
                <Link to={item.habilitar_ingreso == 'open_meeting_room' && `${urlactivity}${item._id}`}>
                  <Row justify='center' align='middle' gutter={[8, 8]}>
                    <Col xs={8} sm={8} md={6} lg={6} xl={6} xxl={6}>
                      <div
                        style={{ justifyContent: 'center', alignContent: 'center', display: 'grid', height: '140px' }}>
                        {item.habilitar_ingreso == 'open_meeting_room' ? (
                          <>
                            <img src={ENVIVO} style={{ height: '70px' }} />
                            <span style={{ textAlign: 'center', fontSize: '18px' }}>
                              {<FormattedMessage id='live' defaultMessage='En vivo' />}
                            </span>
                          </>
                        ) : item.habilitar_ingreso == 'closed_meeting_room' ? (
                          <>
                            <FieldTimeOutlined style={{ fontSize: '70px', color: '#FAAD14' }} />
                            <span style={{ textAlign: 'center', fontSize: '18px' }}>
                              {<FormattedMessage id='live.closed' defaultMessage='Iniciará pronto' />}
                            </span>
                          </>
                        ) : (
                          ''
                        )}
                      </div>
                    </Col>
                    <Col xs={16} sm={16} md={12} lg={12} xl={12} xxl={12}>
                      <div style={{ alignContent: 'center', display: 'grid', height: '100%', alignItems: 'center' }}>
                        <Title
                          level={4}
                          ellipsis={{
                            rows: 3, // Determina la cantidad de filas que se muestran antes de cortar el texto.
                            expandable: true,
                            symbol: (
                              <span style={{ color: '#2D7FD6', fontSize: '14px' }}>
                                {Moment.locale() == 'en' ? 'More activities' : 'Ver más actividades'}{' '}
                                {/* Se valido de esta forma porque el componente FormattedMessage no hacia
                             efecto en la prop del componente de Ant design */}
                              </span>
                            ),
                          }}>
                          {item.name}
                        </Title>
                        {item.habilitar_ingreso == 'open_meeting_room' ? (
                          ''
                        ) : (
                          <h2 style={{ color: '#7c909a', fontSize: '16px' }}>
                            {Moment(item.datetime_start).format('LL')}
                            <span>&nbsp;&nbsp;&nbsp;</span>
                            {Moment.tz(item.datetime_start, 'YYYY-MM-DD h:mm', 'America/Bogota')
                              .tz(Moment.tz.guess())
                              .format('h:mm A')}
                            {' - '}
                            {Moment.tz(item.datetime_end, 'YYYY-MM-DD h:mm', 'America/Bogota')
                              .tz(Moment.tz.guess())
                              .format('h:mm A')}
                            <span className='ultrasmall-mobile'>
                              {Moment.tz(item.datetime_end, 'YYYY-MM-DD HH:mm', 'America/Bogota')
                                .tz(Moment.tz.guess())
                                .format(' (Z)')}
                            </span>
                          </h2>
                        )}
                      </div>
                      <div>
                        <MeetingConferenceButton
                          activity={item}
                          event={cEvent.value}
                          setActivity={gotoActivity}
                          eventUser={cEventUser.value}
                        />
                      </div>
                    </Col>
                    <Col xs={0} sm={0} md={6} lg={6} xl={6} xxl={6}>
                      <div
                        style={{ justifyContent: 'center', alignContent: 'center', display: 'grid', height: '153px' }}>
                        {item.hosts && (
                          <div className='Virtual-Conferences'>
                            <Avatar.Group
                              maxCount={2}
                              size={{ xs: 20, sm: 20, md: 40, lg: 50, xl: 80, xxl: 80 }}
                              maxStyle={{ backgroundColor: '#50D3C9', fontSize: '3vw' }}>
                              {item.hosts.length < 3
                                ? item.hosts.map((host, key) => {
                                    return (
                                      <Tooltip title={host.name} key={key}>
                                        <Avatar
                                          src={host.image}
                                          size={{ xs: 50, sm: 50, md: 50, lg: 85, xl: 85, xxl: 85 }}
                                        />
                                      </Tooltip>
                                    );
                                  })
                                : item.hosts.map((host, key) => {
                                    return (
                                      <Tooltip title={host.name} key={key}>
                                        <Avatar
                                          key={key}
                                          src={host.image}
                                          size={{ xs: 20, sm: 20, md: 40, lg: 50, xl: 80, xxl: 80 }}
                                        />
                                      </Tooltip>
                                    );
                                  })}
                            </Avatar.Group>
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Link>
              </Card>
            </>
          ))}
    </Fragment>
  );
};

export default VirtualConference;
