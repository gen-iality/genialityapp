import React, { Fragment, useState, useEffect } from 'react';
import { Card, Button, Avatar, Row, Col, Tooltip, Typography, Spin } from 'antd';
import { AgendaApi } from '../../helpers/request';
import { firestore } from '../../helpers/firebase';
import Moment from 'moment-timezone';
import { FieldTimeOutlined, SettingOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import ENVIVO from '../../Assets/img/EnVivo.svg';
import { UseEventContext } from '../../context/eventContext';
import { UseUserEvent } from '../../context/eventUserContext';
import { Link } from 'react-router-dom';
import * as StageActions from '../../redux/stage/actions';
import { truncate } from 'lodash-es';

const { gotoActivity } = StageActions;
const { Title, Text } = Typography;

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
              <div key={key} hoverable className='animate__animated animate__slideInRight'>
                <Link to={item.habilitar_ingreso == 'open_meeting_room' ? `${urlactivity}${item._id}` : `${urlAgenda}`}>
                  <Row justify='center' align='middle' gutter={[8, 8]}>
                    <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                      <div
                        className='animate__animated animate__pulse animate__infinite animate__slow'
                        style={{ justifyContent: 'center', alignContent: 'center', display: 'grid' }}>
                        {item.habilitar_ingreso == 'open_meeting_room' ? (
                          <>
                            <img src={ENVIVO} style={{ height: '30px' }} />
                            <span className='ultrasmall-mobile' style={{ textAlign: 'center' }}>
                              {<FormattedMessage id='live' defaultMessage='En vivo' />}
                            </span>
                          </>
                        ) : item.habilitar_ingreso == 'closed_meeting_room' ? (
                          <>
                            <FieldTimeOutlined style={{ fontSize: '30px', color: '#FAAD14' }} />
                            <span className='ultrasmall-mobile' style={{ textAlign: 'center' }}>
                              {<FormattedMessage id='live.closed' defaultMessage='Iniciará pronto' />}
                            </span>
                          </>
                        ) : (
                          ''
                        )}
                      </div>
                    </Col>

                    <Col xs={18} sm={18} md={12} lg={12} xl={12} xxl={12}>
                      <div style={{ alignContent: 'center', display: 'grid', height: '100%', alignItems: 'center' }}>
                        <Text strong={truncate} ellipsis={{ rows: 1, expandable: true }}>
                          <a>{item.name}</a>
                        </Text>
                        <Text>
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
                          <a>{item.habilitar_ingreso == 'open_meeting_room' ? ' Ingresar' : ' Ver'}</a>
                        </Text>
                      </div>
                      {/* <div>
                        <MeetingConferenceButton
                          activity={item}
                          event={cEvent.value}
                          setActivity={gotoActivity}
                          eventUser={cEventUser.value}
                        />
                      </div> */}
                    </Col>
                    <Col xs={0} sm={0} md={6} lg={6} xl={6} xxl={6}>
                      <div style={{ justifyContent: 'center', alignContent: 'center', display: 'grid' }}>
                        {item.hosts && (
                          <div className='Virtual-Conferences'>
                            <Avatar.Group
                              maxCount={2}
                              size={{ xs: 18, sm: 18, md: 35, lg: 50, xl: 50, xxl: 50 }}
                              maxStyle={{ backgroundColor: '#50D3C9', fontSize: '3vw' }}>
                              {item.hosts.length < 3
                                ? item.hosts.map((host, key) => {
                                    return (
                                      <Tooltip title={host.name} key={key}>
                                        <Avatar
                                          src={host.image}
                                          size={{ xs: 40, sm: 40, md: 40, lg: 55, xl: 55, xxl: 55 }}
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
                                          size={{ xs: 18, sm: 18, md: 35, lg: 50, xl: 50, xxl: 50 }}
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
              </div>
            </>
          ))}
    </Fragment>
  );
};

export default VirtualConference;
