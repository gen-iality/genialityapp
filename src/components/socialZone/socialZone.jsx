import { withRouter } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import { Tabs, Row, Badge, Col, Button, Alert } from 'antd';
import { ArrowLeftOutlined, VideoCameraOutlined, SearchOutlined } from '@ant-design/icons';
import SurveyList from '../events/surveys/surveyList';
import { connect } from 'react-redux';
import * as StageActions from '../../redux/stage/actions';
import { setCurrentSurvey } from '../../redux/survey/actions';
import AttendeList from './attendees/index';
import * as notificationsActions from '../../redux/notifications/actions';
import ChatList from './ChatList';
import GameRanking from '../events/game/gameRanking';
import { useRef } from 'react';
import { UseEventContext } from '../../Context/eventContext';
import { UseCurrentUser } from '../../Context/userContext';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { HelperContext } from '../../Context/HelperContext';
import { useEffect } from 'react';
const { setMainStage } = StageActions;
const { TabPane } = Tabs;
const callback = () => {};
const { setNotification } = notificationsActions;
const styleTabAttendes = {
  backgroundColor: '#ffffff4d',
  padding: 5,
  borderRadius: '10px',
};

let SocialZone = function(props) {
  //contextos
  let cEvent = UseEventContext();
  let cUser = UseCurrentUser();
  let { attendeeList, HandleChatOrAttende, chatAttendeChats, totalPrivateMessages } = useContext(HelperContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [totalNewMessages, setTotalNewMessages] = useState(0);
  let [busqueda, setBusqueda] = useState(null);
  let [strAttende, setstrAttende] = useState();
  let [isFiltered, setIsFiltered] = useState(false);
  let busquedaRef = useRef();
  let history = useHistory();

  const handleChange = async (e) => {
    const { value } = e.target;
    setBusqueda(value);
  };

  const searhAttende = () => {
    if (!isFiltered && (busqueda != undefined || busqueda != '')) {
      setstrAttende(busqueda);
      setIsFiltered(true);
    } else {
      setIsFiltered(false);
      setstrAttende('');
      setBusqueda(null);
      //
      busquedaRef.current.value = '';
    }
  };
  useEffect(() => {
    if (chatAttendeChats) {
      if (chatAttendeChats == 4) {
        props.setMainStage('game');
      }
    }
  }, [chatAttendeChats]);

  function redirectRegister() {
    history.push(`/landing/${cEvent.value._id}/tickets`);
  }
  return (
    <Tabs
      defaultActiveKey='1'
      onChange={callback}
      activeKey={chatAttendeChats}
      onTabClick={(key) => {
        HandleChatOrAttende(key);
      }}>
      {(props.generalTabs.publicChat || props.generalTabs.privateChat) && (
        <TabPane
          id='open_menu_rigth'
          className='asistente-chat-list'
          tab={
            <>
              <Badge
                onClick={() => HandleChatOrAttende('1')}
                size='small'
                // style={{ minWidth: '10px', height: '10px', padding: '0px', color: 'black' }}
                count={totalPrivateMessages}>
                Chats
              </Badge>
            </>
          }
          key='1'>
          <ChatList props={props} setCurrentUser={setCurrentUser} generalTabs={props.generalTabs} />
        </TabPane>
      )}
      {props.generalTabs.attendees && (
        <>
          {' '}
          <TabPane
            style={styleTabAttendes}
            tab={
              <div style={{ color: cEvent.value.styles.textMenu }}>
                <FormattedMessage id='tabs.attendees.socialzone' defaultMessage='Asistentes' />
              </div>
            }
            key='2'>
            <Row>
              <Col sm={21}>
                {!Object.keys(attendeeList).length ? (
                  ''
                ) : (
                  <div className='control' style={{ marginBottom: '10px', marginRight: '5px', color: 'white' }}>
                    <input
                      style={{ color: 'white' }}
                      ref={busquedaRef}
                      autoFocus
                      className='input'
                      type='text'
                      name={'name'}
                      onChange={handleChange}
                      placeholder='Buscar participante...'
                    />
                  </div>
                )}
              </Col>
              <Col sm={2}>
                {!Object.keys(attendeeList).length ? null : (
                  <>
                    {busqueda !== null && (
                      <Button shape='circle' onClick={searhAttende}>
                        {!isFiltered && <SearchOutlined />}
                        {isFiltered && 'X'}
                      </Button>
                    )}
                  </>
                )}
              </Col>
            </Row>
            <div className='asistente-list'>
              {!Object.keys(attendeeList).length ? (
                <Row justify='center'>
                  <p>No hay asistentes aún</p>
                </Row>
              ) : (
                <AttendeList
                  agendarCita={props.agendarCita}
                  notificacion={props.notificacion}
                  sendFriendship={props.sendFriendship}
                  perfil={props.perfil}
                  section={props.section}
                  containNetWorking={props.containNetWorking}
                  busqueda={strAttende}
                />
              )}
            </div>
          </TabPane>
        </>
      )}

      {props.currentActivity !== null && props.tabs && (
        // && (props.tabs.surveys === true || props.tabs.surveys === 'true')
        <TabPane
          className='asistente-survey-list asistente-list'
          tab={
            <div style={{ marginBottom: '0px' }}>
              <Badge dot={props.hasOpenSurveys} size='default'>
                <span style={{ color: cEvent.value.styles.textMenu }}>
                  <FormattedMessage id='tabs.surveys.socialzone' defaultMessage='Encuestas' />
                </span>
              </Badge>
            </div>
          }
          key='3'>
          <Row
            justify='space-between'
            style={{ display: 'pointer' }}
            onClick={() => {
              props.setMainStage(null);
              HandleChatOrAttende('1');
            }}></Row>
          {cUser.value !== null ? (
            <SurveyList
              eventSurveys={props.eventSurveys}
              publishedSurveys={props.publishedSurveys}
              listOfEventSurveys={props.listOfEventSurveys}
              loadingSurveys={props.loadingSurveys}
            />
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

      {props.currentActivity !== null && props.tabs && (props.tabs.games === true || props.tabs.games === 'true') && (
        <TabPane
          className='asistente-survey-list'
          tab={
            <>
              <p
                style={{ marginBottom: '0px', color: cEvent.value.styles.textMenu }}
                className='lowerTabs__mobile-hidden'>
                <FormattedMessage id='tabs.games.socialzone' defaultMessage='Juegos' />
              </p>
            </>
          }
          key='4'>
          <Row justify='space-between'>
            <Col span={4}>
              <ArrowLeftOutlined
                style={{ color: cEvent.value.styles.textMenu }}
                onClick={() => {
                  props.setMainStage(null);
                  HandleChatOrAttende('1');
                }}
              />
            </Col>
            <Col span={14}>
              <h2 style={{ fontWeight: '700', color: cEvent.value.styles.textMenu }}> Volver a la Conferencia </h2>
            </Col>
            <Col span={4}>
              <VideoCameraOutlined style={{ color: cEvent.value.styles.textMenu }} />
            </Col>
          </Row>

          <GameRanking currentUser={currentUser} cEvent={cEvent.value} />
        </TabPane>
      )}
    </Tabs>
  );
};

const mapStateToProps = (state) => ({
  mainStage: state.stage.data.mainStage,
  currentSurvey: state.survey.data.currentSurvey,
  hasOpenSurveys: state.survey.data.hasOpenSurveys,
  currentActivity: state.stage.data.currentActivity,
  event: state.event.data,
  viewNotification: state.notifications.data,
  tabs: state.stage.data.tabs,
});

const mapDispatchToProps = {
  setMainStage,
  setNotification,
  setCurrentSurvey,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SocialZone));
