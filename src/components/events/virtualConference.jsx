import React, { Component, Fragment, useState, useEffect } from 'react';
import { Card, Button, Alert,Avatar, Row, Col, Tooltip } from 'antd';
import WithUserEventRegistered from '../shared/withUserEventRegistered';
import { AgendaApi } from '../../helpers/request';
import { firestore } from '../../helpers/firebase';
import Moment from 'moment-timezone';
import { HistoryOutlined, UserOutlined, AntDesignOutlined  } from '@ant-design/icons';
import { connect } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
//const { Meta } = Card;
import * as StageActions from '../../redux/stage/actions';

const { gotoActivity } = StageActions;

const MeetingConferenceButton = ({
  activity,
  zoomExternoHandleOpen,
  usuarioRegistrado,
  event,
  showSection,
  setActivity,
  eventUser,
}) => {
  const [infoActivity, setInfoActivity] = useState({});
  //const [infoEvent, setInfoEvent] = useState({});
  const intl = useIntl();

  useEffect(() => {
    setInfoActivity(activity);
    //setInfoEvent(event);
  }, [activity, event]);

  switch (infoActivity.habilitar_ingreso) {
    case 'open_meeting_room':
      return (
        <>
          {true|| event.visibility !== 'ORGANIZATION' ? (
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
                    showSection('agenda', true);
                  }
                }}>
                <FormattedMessage id='live.join' defaultMessage='Ingresa aquí' />
              </Button>
            </>
          ) : (
            <>
              <Button size='large' type='primary' className='buttonVirtualConference' disabled='true'>
                <FormattedMessage id='live.private_access' defaultMessage='Ingreso privado' />
              </Button>
            </>
          )}
        </>
      );

    case 'closed_meeting_room':
      return <Alert message={intl.formatMessage({ id: 'live.join.disabled' })} type='warning' showIcon />;

    case 'ended_meeting_room':
      return <Alert message='El evento ha terminado' type='info' showIcon />;

    default:
      return <Alert message='Cargando...' type='warning' showIcon />;
  }
};

class VirtualConference extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      infoAgendaArr: [],
      usuarioRegistrado: this.props.usuarioRegistrado || undefined,
      event: this.props.event || undefined,
      survey: [],
    };
  }

  async componentDidMount() {
    if (!this.props.event) return;

    let filteredAgenda = await this.filterVirtualActivities(this.props.event._id);

    this.setState({ infoAgendaArr: filteredAgenda });
    //this.listeningStateMeetingRoom;
  }

  async componentDidUpdate(prevProps) {
    //Cargamos solamente los espacios virtuales de la agenda

    //Si aún no ha cargado el evento no podemos hacer nada más
    if (!this.props.event) return;

    //Revisamos si el evento sigue siendo el mismo, no toca cargar nada
    if (prevProps.event && this.props.event._id === prevProps.event._id) return;

    let filteredAgenda = await this.filterVirtualActivities(this.props.event._id);
    this.setState(
      { event: this.props.event, usuarioRegistrado: this.props.usuarioRegistrado, infoAgendaArr: filteredAgenda }
      // this.listeningStateMeetingRoom
    );
  }

  listeningStateMeetingRoom = (infoAgenda) => {
    infoAgenda.forEach((activity, index, arr) => {
      firestore
        .collection('events')
        .doc(this.props.event._id)
        .collection('activities')
        .doc(activity._id)
        .onSnapshot((infoActivity) => {
          if (!infoActivity.exists) return;
          let { habilitar_ingreso, isPublished, meeting_id, platform } = infoActivity.data();
          let updatedActivityInfo = { ...arr[index], habilitar_ingreso, isPublished, meeting_id, platform };

          arr[index] = updatedActivityInfo;

          arr.forEach((activity, index, arr) => {
            firestore
              .collection('languageState')
              .doc(activity._id)
              .onSnapshot((info) => {
                if (!info.exists) return;
                let { related_meetings } = info.data();
                let updatedActivityInfo = { ...arr[index], related_meetings };

                arr[index] = updatedActivityInfo;
                this.setState({ infoAgendaArr: arr });
              });
            this.setState({ infoAgendaArr: arr });
          });
        });
    });
  };

  async filterVirtualActivities(event_id) {
    let infoAgendaArr = [];

    if (!event_id) return infoAgendaArr;
    const infoAgenda = await AgendaApi.byEvent(event_id);

    await this.listeningStateMeetingRoom(infoAgenda.data);

    //Mostramos solamente las conferencias que tengan una sala virtual asignada
    for (const prop in this.stateinfoAgendaArr) {
      if (infoAgenda.data[prop].meeting_id) {
        infoAgendaArr.push(infoAgenda.data[prop]);
      }
    }

    return infoAgendaArr;
  }

  render() {
    const { infoAgendaArr, event, usuarioRegistrado } = this.state;
    const { toggleConference, showSection, gotoActivity } = this.props;
    if (!infoAgendaArr || infoAgendaArr.length <= 0) return null;
    return (
      <Fragment>
        {/* <Card bordered={ true }>
                            <span>Sesiones</span>
                        </Card> */}

        {infoAgendaArr
          .filter((item) => {
            return (
              item.habilitar_ingreso &&
              (item.habilitar_ingreso == 'open_meeting_room' || item.habilitar_ingreso == 'closed_meeting_room') &&
              (item.isPublished === true || item.isPublished === 'true')
            );
          })
          .map((item, key) => (
            <>
            <Card>
              <Row justify='center' gutter={[16,16]} align='middle'>
                <Col md={6} lg={6} xl={6} xxl={6}>
                  <div style={{justifyContent:'center', display:'flex'}}>
                    <HistoryOutlined  style={{fontSize:'85px'}} />
                  </div> 
                </Col>
                <Col md={12} lg={12} xl={12} xxl={12}>
                  <div>
                    <h1 style={{fontWeight:'bold', fontSize:'17px'}}>Asamblea general</h1>
                    <h2 style={{color:'#7c909a'}}>26 de abril de 2021 7:00 pm a 9:00 pm</h2>
                  </div>
                  <div>
                    <h2 style={{color:'#7c909a'}}>el evento empieza en </h2>
                    <h1 style={{fontWeight:'400', fontSize:'45px'}}>1 D 22 H 53 m 09 s</h1>
                  </div>
                </Col>
                <Col md={6} lg={6} xl={6} xxl={6}>
                  <div>
                  <Avatar.Group>
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                    <Avatar
                      style={{
                        backgroundColor: '#f56a00',
                      }}
                    >
                      K
                    </Avatar>
                    <Tooltip title="Ant User" placement="top">
                      <Avatar
                        style={{
                          backgroundColor: '#87d068',
                        }}
                        icon={<UserOutlined />}
                      />
                    </Tooltip>
                    <Avatar
                      style={{
                        backgroundColor: '#1890ff',
                      }}
                      icon={<AntDesignOutlined />}
                    />
                  </Avatar.Group>
                  </div>
                </Col>
              </Row> 
            </Card>
            <br/>
            <div key={key}>
              <Card hoverable avatar={<Avatar src='' />} bordered={true} style={{ marginBottom: '3%' }}>
                {/* Experimento de estilo <Meta
                                        avatar={ <><Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /> <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /></> }
                                        title="Card titlesfas fdas dfa sdf asdf as as as df"
                                        description="This is the description"
                                    /> */}
                 <h1 style={{ fontSize: '120%', fontWeight: 'Bold' }}>{item.name}</h1>
                <p>
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
                </p>

                {item.hosts && (
                  <div className='Virtual-Conferences'>
                    {item.hosts.map((host, key) => {
                      return (
                        <div style={{ margin: '0px 14px' }} key={key}>
                          <Avatar src={host.image} />
                          <div>{host.name}</div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <MeetingConferenceButton
                  activity={item}
                  toggleConference={toggleConference}
                  event={event}
                  usuarioRegistrado={usuarioRegistrado}
                  showSection={showSection}
                  setActivity={gotoActivity}
                  zoomExternoHandleOpen={this.props.zoomExternoHandleOpen}
                  eventUser={this.props.eventUser}
                /> 
              </Card>
            </div>
            </>
          ))}
      </Fragment>
    );
  }
}

const mapDispatchToProps = {
  gotoActivity,
};

export default connect(null, mapDispatchToProps)(WithUserEventRegistered(VirtualConference));
