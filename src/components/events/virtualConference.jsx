import React, { Component, Fragment, useState, useEffect } from 'react';
import { Card, Button, Alert } from 'antd';
import WithUserEventRegistered from '../shared/withUserEventRegistered';
import { AgendaApi } from '../../helpers/request';
import { firestore } from '../../helpers/firebase';
import Moment from 'moment';
import { Avatar } from 'antd';
import { connect } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
//const { Meta } = Card;
import * as StageActions from '../../redux/stage/actions';

const { gotoActivity } = StageActions;

const MeetingConferenceButton = ({
  activity,
  toggleConference,
  usuarioRegistrado,
  event,
  showSection,
  setActivity,
}) => {
  const [infoActivity, setInfoActivity] = useState({});
  const [infoEvent, setInfoEvent] = useState({});
  const intl = useIntl();

  useEffect(() => {
    setInfoActivity(activity);
    setInfoEvent(event);
  }, [activity, event]);

  switch (infoActivity.habilitar_ingreso) {
    case 'open_meeting_room':
      return (
        <>
          {(usuarioRegistrado && event.visibility === 'ORGANIZATION') || event.visibility !== 'ORGANIZATION' ? (
            <>
              <Button
                size='large'
                type='primary'
                className='buttonVirtualConference'
                onClick={() => {
                  //toggleConference(true, infoActivity.meeting_id, infoActivity);
                  setActivity(activity);
                  showSection('agenda', true);
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
    console.log('AGENDA INFO');
    console.log(infoAgenda);
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
    console.log('ACTIVIDADES 1');
    console.log(infoAgenda.data);
    await this.listeningStateMeetingRoom(infoAgenda.data);
    console.log('ACTIVIDADES RESULTANTE');
    console.log(this.state.infoAgendaArr);

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
        {
          <div>
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
                <div key={key}>
                  <Card avatar={<Avatar src='' />} bordered={true} style={{ marginBottom: '3%' }}>
                    {/* Experimento de estilo <Meta
                                        avatar={ <><Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /> <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /></> }
                                        title="Card titlesfas fdas dfa sdf asdf as as as df"
                                        description="This is the description"
                                    /> */}
                    <h1 style={{ fontSize: '120%', fontWeight: 'Bold' }}>{item.name}</h1>
                    <p>
                      {Moment(item.datetime_start).format('D ')}
                      <span>&nbsp;de&nbsp;</span>
                      {item.datetime_start &&
                        Moment(item.datetime_start)
                          .format('MMMM')
                          .charAt(0)
                          .toUpperCase()}
                      {item.datetime_start &&
                        Moment(item.datetime_start)
                          .format('MMMM')
                          .slice(1)}
                      <span>&nbsp;&nbsp;&nbsp;</span>
                      {Moment(item.datetime_start).format('h:mm A')} {' - '}
                      {Moment(item.datetime_end).format('h:mm A')}
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
                    />
                    {item.related_meetings &&
                      item.related_meetings.map((item, key) => (
                        <>
                          {item.state === 'open_meeting_room' && (
                            <Button
                              disabled={item.meeting_id || item.vimeo_id ? false : true}
                              onClick={() =>
                                //toggleConference(true, item.meeting_id ? item.meeting_id : item.vimeo_id, item)
                                showSection('agenda')
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
                  </Card>
                </div>
              ))}
          </div>
        }
      </Fragment>
    );
  }
}

const mapDispatchToProps = {
  gotoActivity,
};

export default connect(null, mapDispatchToProps)(WithUserEventRegistered(VirtualConference));
