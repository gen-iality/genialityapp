import { withRouter } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Tabs, Row, Badge, Button, Alert, Space } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import SurveyList from '../events/surveys/surveyList';
import { connect } from 'react-redux';
import * as StageActions from '../../redux/stage/actions';
import { setCurrentSurvey } from '../../redux/survey/actions';
import AttendeList from './attendees/index';
import * as notificationsActions from '../../redux/notifications/actions';
import ChatList from './ChatList';
import GameList from '../events/game/gameList';
import { useRef } from 'react';
import { useEventContext } from '@context/eventContext';
import { useCurrentUser } from '@context/userContext';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useHelper } from '@context/helperContext/hooks/useHelper';
import ThisRouteCanBeDisplayed, { recordTypeForThisEvent } from '../events/Landing/helpers/thisRouteCanBeDisplayed';



const { setMainStage } = StageActions;
const { TabPane } = Tabs;
const callback = () => {};
const { setNotification } = notificationsActions;
const styleTabAttendes = {
  width: '95%',
  marginTop: '12px',
  backgroundColor: '#ffffff4d',
  padding: 5,
  borderRadius: '10px',
};

let SocialZone = function(props) {
  //contextos
  let cEvent = useEventContext();
  let cUser = useCurrentUser();
  let {
    attendeeList,
    HandleChatOrAttende,
    chatAttendeChats,
    totalPrivateMessages,
    currentActivity,
    tabsGenerals,
  } = useHelper();
  const [currentUser, setCurrentUser] = useState(null);
  let [busqueda, setBusqueda] = useState(null);
  let [strAttende, setstrAttende] = useState();
  let [isFiltered, setIsFiltered] = useState(false);
  let busquedaRef = useRef();
  let history = useHistory();
  const [typeEvent, settypeEvent] = useState();
  const [countAttendeesOnline, SetCountAttendeesOnline] = useState(0);

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
      busquedaRef.current.value = '';
    }
  };
  useEffect(() => {
    if (chatAttendeChats) {
      if (chatAttendeChats == 4) {
        props.setMainStage('otherTab');
      }
    }
  }, [chatAttendeChats]);

  function redirectRegister() {
    history.push(`/landing/${cEvent.value._id}/tickets`);
  }

  useEffect(() => {
    let eventype = recordTypeForThisEvent(cEvent);
    settypeEvent(eventype);
  }, [cEvent]);

  return (
    <div className='siderContentFixed'>
      <Tabs
      defaultActiveKey='1'
      onChange={callback}
      activeKey={chatAttendeChats}
      onTabClick={(key) => {
        HandleChatOrAttende(key);
      }}
      tabBarExtraContent={{left: props.ToggleVisibilityButton}}>
     
     <TabPane
            className='asistente-chat-list'
            tab={
              <>
                {props.generalTabs.publicChat && (
                  <Badge onClick={() => HandleChatOrAttende('1')} size='small' count={totalPrivateMessages}>
                    <div style={{ color: cEvent.value.styles.textMenu }}>Chats</div>
                  </Badge>
                )}
              </>
            }
            key='1'>
            <ThisRouteCanBeDisplayed>
              <ChatList
                typeEvent={typeEvent}
                key='ChatList'
                props={props}
                setCurrentUser={setCurrentUser}
                generalTabs={props.generalTabs}
              />
            </ThisRouteCanBeDisplayed>
          </TabPane>
      

      <>
        {typeEvent !== 'UN_REGISTERED_PUBLIC_EVENT' && (
          <TabPane
            style={styleTabAttendes}
            tab={
              <>
                {props.generalTabs?.attendees && (
                  <div style={{ color: cEvent.value.styles.textMenu }}>
                    <FormattedMessage id='tabs.attendees.socialzone' defaultMessage='Asistentes' />{' '}
                    {countAttendeesOnline.length > 0 && <>({countAttendeesOnline.length})</>}
                  </div>
                )}
              </>
            }
            key='2'>
            <ThisRouteCanBeDisplayed>
              <div key='AttendeList'>
                <Row>
                  <Space size={10} style={{ width: '100%' }}>
                    {!Object.keys(attendeeList).length ? (
                      ''
                    ) : (
                      <div
                        className='control'
                        style={{
                          marginBottom: '10px',
                          marginRight: '5px',
                          color: 'white',
                          width: '100%',
                        }}>
                        <input
                          style={{ color: cEvent.value.styles.textMenu }}
                          ref={busquedaRef}
                          autoFocus
                          type='text'
                          name={'name'}
                          onChange={handleChange}
                          placeholder='Buscar participante...'
                        />
                      </div>
                    )}
                    {!Object.keys(attendeeList).length
                      ? null
                      : busqueda !== null && (
                          <Button
                            icon={!isFiltered ? <SearchOutlined /> : <CloseOutlined />}
                            shape='round'
                            onClick={searhAttende}>
                            {!isFiltered && 'Buscar'}
                            {isFiltered && 'Borrar'}
                          </Button>
                        )}
                  </Space>
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
                      SetCountAttendeesOnline={SetCountAttendeesOnline}
                    />
                  )}
                </div>
              </div>
            </ThisRouteCanBeDisplayed>
          </TabPane>
        )}
      </>

      {currentActivity !== null && typeEvent !== 'UN_REGISTERED_PUBLIC_EVENT' && (
        <TabPane
          className='asistente-survey-list asistente-list'
          tab={
            <div style={{ marginBottom: '0px' }}>
              <Badge dot={props.hasOpenSurveys} size='default'>
                <span style={{ color: cEvent.value.styles.textMenu }}>
                  <FormattedMessage id='tabs.surveys.socialzone' defaultMessage='Evaluaciones' />
                </span>
              </Badge>
            </div>
          }
          key='3'>
          <ThisRouteCanBeDisplayed>
            <div key='SurveyList'>
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
                    message='Para poder responder una evaluación debes ser usuario del sistema'
                    type='warning'
                  />
                  <Row style={{ marginTop: 30 }} justify='center'>
                    <Button onClick={redirectRegister}>Registrarme</Button>
                  </Row>
                </div>
              )}
            </div>
          </ThisRouteCanBeDisplayed>
        </TabPane>
      )}

      {tabsGenerals !== null &&
        (tabsGenerals?.games === true || tabsGenerals?.games === 'true') &&
        currentActivity?.habilitar_ingreso === 'open_meeting_room' && (
          <TabPane
            className='asistente-survey-list asistente-list'
            tab={
              <>
                <p
                  style={{
                    marginBottom: '0px',
                    color: cEvent.value.styles.textMenu,
                  }}>
                  <FormattedMessage id='tabs.games.socialzone' defaultMessage='Juegos' />
                </p>
              </>
            }
            key='4'>
            <>
              {cEvent.value._id == '619d09f7cbd9a47c2d386372' ? (
                <GameList key='GameList' />
              ) : (
                <ThisRouteCanBeDisplayed>
                  <GameList key='GameList' />
                </ThisRouteCanBeDisplayed>
              )}
            </>
          </TabPane>
        )}
    </Tabs>
    </div>
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
