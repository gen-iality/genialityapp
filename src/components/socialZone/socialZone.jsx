import { withRouter } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Tabs, Row, Badge, Button, Alert } from 'antd';
import SurveyList from '../events/surveys/surveyList';
import { connect } from 'react-redux';
import * as StageActions from '../../redux/stage/actions';
import { setCurrentSurvey } from '../../redux/survey/actions';
import * as notificationsActions from '../../redux/notifications/actions';
import ChatList from './ChatList';
import GameList from '../events/game/gameList';
import { UseEventContext } from '../../context/eventContext';
import { UseCurrentUser } from '../../context/userContext';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { useHelper } from '../../context/helperContext/hooks/useHelper';
import ThisRouteCanBeDisplayed, { recordTypeForThisEvent } from '../events/Landing/helpers/thisRouteCanBeDisplayed';
import { TabChatAttendee } from '@/zonasocial/components/TabChatAttendee';
import QuestionsAndAnswers from '../trivia/types/QuestionsAndAnswers';
import { get, getDatabase, onValue, ref, update } from 'firebase/database';

const { setMainStage } = StageActions;
const { TabPane } = Tabs;
const callback = () => {};
const { setNotification } = notificationsActions;
const styleTabAttende = {
  backgroundColor: '#ffffff4d',
  padding: 5,
  borderRadius: '10px',
};

const SocialZone = function(props) {
  //contextos
  const cEvent = UseEventContext();
  const cUser = UseCurrentUser();
  const { HandleChatOrAttende, chatAttendeChats, totalPrivateMessages, currentActivity, tabsGenerals } = useHelper();
  const [currentUser, setCurrentUser] = useState(null);
  const history = useHistory();
  const [typeEvent, settypeEvent] = useState();
  //------------states Q&A ---------------------------
  const [questions, setQuestions] = useState([]);
  console.log("array de preguntas:", questions)
  //--- maneja el mostrar o no el icono de preguntas, falta implementar
  // const [showQuestions, setShowQuestions] = useState(false);

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

  // ------- Start funcions Q&A ---------------------------->
  /* -----------------------------------------------------------------
  // Muestra las preguntas a todos los demas usuarios y las ordena de mayor a menor votos
  ----------------------------------------------------------------------   */
  useEffect(() => {
    const db = getDatabase();
    const questionsRef = ref(db, 'events/general/questions');
    onValue(questionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const questionsArray = Object.keys(data).map((key) => ({
          ...data[key],
          id: key,
        }));
        /* setQuestions(questionsArray.sort((a, b) => b.counterVotes - a.counterVotes)); */
        setQuestions(questionsArray)
      } else {
        setQuestions([]);
      }
    });
  }, []);

  /* -----------------------------------------------------------------
  // Agrega las preguntas al array
  ----------------------------------------------------------------------   */
  const handleAddQuestion = (question) => {
    console.log('handleAddQuestion called:', question);
    setQuestions((prevQuestions) => [...prevQuestions, question]);
  };

  /* -----------------------------------------------------------------
  // obtiene la pregunta por su id y le suma a su propiedad que contiene el numero de votos, además las ordena de mayor a menor votos"
  ----------------------------------------------------------------------   */
  const handleVoteQuestion = async (id) => {
    const db = getDatabase();
    const questionRef = ref(db, `events/general/questions/${id}`);
    const snapshot = await get(questionRef);
    if (snapshot.exists()) {
      const currentVotes = snapshot.val().counterVotes || 0;
      const newVotes = currentVotes + 1;
      await update(questionRef, { counterVotes: newVotes });

      // Actualizar el estado local
      setQuestions((prevQuestions) =>
        prevQuestions
          .map((question) => (question.id === id ? { ...question, counterVotes: newVotes } : question))
          .sort((a, b) => b.counterVotes - a.counterVotes)
      );
    } else {
      console.log('La pregunta no existe.');
    }
  };

  //---------------End funcions Q&A ---------------->

  return (
    <Tabs
      destroyInactiveTabPane
      style={{ marginTop: '-15px' }}
      defaultActiveKey='1'
      onChange={callback}
      activeKey={chatAttendeChats}
      onTabClick={(key) => {
        HandleChatOrAttende(key);
      }}>
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
        {typeEvent !== 'UN_REGISTERED_PUBLIC_EVENT' && props.generalTabs?.attendees && (
          <TabPane
            style={styleTabAttende}
            tab={
              <>
                {props.generalTabs?.attendees && (
                  <div style={{ color: cEvent.value.styles.textMenu }}>
                    <FormattedMessage id='tabs.attendees.socialzone' defaultMessage='Asistentes' />{' '}
                  </div>
                )}
              </>
            }
            key='2'>
            <TabChatAttendee colorTextMenu={cEvent.value.styles.textMenu} eventId={cEvent.value._id} />
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
                  <FormattedMessage id='tabs.surveys.socialzone' defaultMessage='Encuestas' />
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
                    message='Para poder responder una encuesta debes ser usuario del sistema'
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
      {/* Renderiza el componente  Q&A y le envia el array de "questions", los handles y el nombre del usuario que hace la pregunta */}
      {/* <TabPane
        className='asistente-chat-list'
        tab={
          <>
            {props.generalTabs.publicChat && (
              <Badge onClick={() => HandleChatOrAttende('1')} size='small' count={totalPrivateMessages}>
                <div style={{ color: cEvent.value.styles.textMenu }}>Q&A</div>
              </Badge>
            )}
          </>
        }
        key='4'>
        <ThisRouteCanBeDisplayed>
          <QuestionsAndAnswers
            questions={questions}
            onAddQuestion={handleAddQuestion}
            onVoteQuestion={handleVoteQuestion}
            currentUser={cUser.value.names}
          />
        </ThisRouteCanBeDisplayed>
      </TabPane> */}
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
