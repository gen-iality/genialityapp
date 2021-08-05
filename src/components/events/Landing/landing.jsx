import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { UseEventContext } from '../../../Context/eventContext';
import { UseCurrentUser } from '../../../Context/userContext';
import { UseUserEvent } from '../../../Context/eventUserContext';

/** ant design */
import { Layout, Spin } from 'antd';

/** Components */
import TopBanner from './TopBanner';
import EventSectionRoutes from './EventSectionsRoutes';
import EventSectionsInnerMenu from './EventSectionsInnerMenu';
import EventSectionMenuRigth from './EventSectionMenuRigth';
import MenuTablets from './Menus/MenuTablets';
import MenuTabletsSocialZone from './Menus/MenuTabletsSocialZone';

/** Functions */
import { listenSurveysData } from '../../../helpers/helperEvent';
import InitSurveysCompletedListener from '../surveys/services/initSurveyCompletedListener';

/** Firebase */
import { firestore } from '../../../helpers/firebase';
const { Content } = Layout;
/** redux surveys */
import { setCurrentSurvey, setSurveyResult } from '../../../redux/survey/actions';

const iniitalstatetabs = {
  attendees: false,
  privateChat: false,
  publicChat: true,
};

const Landing = (props) => {
  let cEventContext = UseEventContext();
  let cUser = UseCurrentUser();
  let cEventUser = UseUserEvent();

  let [generaltabs, setgeneraltabs] = useState(iniitalstatetabs);
  let [totalNewMessages, settotalnewmessages] = useState(0);
  let { currentActivity, tabs, setCurrentSurvey, setSurveyResult } = props;
  const [tabselected, settabselected] = useState('1');
  /** listado de encuestas por actividad */
  const [listOfEventSurveys, setListOfEventSurveys] = useState([]);
  /** loader para el listado de encuestas */
  const [loadingSurveys, setLoadingSurveys] = useState(true);
  /** estado de las encuestas, "abierto, cerrado, en progreso  */
  const [surveyStatusProgress, setSurveyStatusProgress] = useState({});
  const [eventId, seteventId] = useState(null);

  useEffect(() => {
    cEventContext.status === 'LOADED' && seteventId(cEventContext.value._id);

    cEventContext.status === 'LOADED' &&
      firestore
        .collection('events')
        .doc(cEventContext.value._id)
        .onSnapshot(function(eventSnapshot) {
          if (eventSnapshot.exists) {
            if (eventSnapshot.data().tabs !== undefined) {
              setgeneraltabs(eventSnapshot.data().tabs);
            }
          }
        });

    cEventContext.status === 'LOADED' &&
      firestore
        .collection('eventchats/' + cEventContext.value._id + '/userchats/' + cUser.uid + '/' + 'chats/')
        .onSnapshot(function(querySnapshot) {
          let data;
          querySnapshot.forEach((doc) => {
            data = doc.data();

            if (data.newMessages) {
              settotalnewmessages(
                (totalNewMessages += !isNaN(parseInt(data.newMessages.length)) ? parseInt(data.newMessages.length) : 0)
              );
            }
          });
        });

    // console.log('totalNewMessages', totalNewMessages);
  }, [cEventContext.status]);

  //METODO PARA SETEAR NEW MESSAGE
  const notNewMessage = () => {
    settotalnewmessages(0);
  };

  /** Permite abrir o cerrar la encuesta al cambiar el estado desde el cms */
  function visualizarEncuesta(survey) {
    if (survey && survey.isOpened === 'true' && survey !== null) {
      if (currentActivity !== null && survey.isOpened === 'true') {
        setSurveyResult('view');
      } else if (currentActivity !== null && survey.isOpened === 'false') {
        setSurveyResult('results');
      }
      if (status === 'results') {
        setSurveyResult('results');
      }
      setCurrentSurvey(survey);
    } else {
      setCurrentSurvey(survey);
      setSurveyResult('closedSurvey');
    }
  }

  /** Listener que permite obtener la data del estado de las encuestas, "abierto, cerrado, en progreso" */
  useEffect(() => {
    if (cUser.value !== null) {
      const unSuscribe = InitSurveysCompletedListener(cUser, setSurveyStatusProgress);
      return unSuscribe;
    }
  }, [cUser]);

  /** Listener para obtener todas las encuestas por actividad */
  useEffect(() => {
    if (currentActivity) {
      listenSurveysData(eventId, setListOfEventSurveys, setLoadingSurveys, currentActivity, cUser, visualizarEncuesta);
    }
  }, [currentActivity]);

  if (cEventContext.status === 'LOADING' || cEventUser.status === 'LOADING') return <Spin size='small' />;

  return (
    <>
      <Layout className='site-layout'>
        <EventSectionsInnerMenu />
        <MenuTablets />
        <Layout className='site-layout'>
          <Content className='site-layout-background'>
            {props.view && <TopBanner currentActivity={currentActivity} />}
            <EventSectionRoutes
              generaltabs={generaltabs}
              currentActivity={currentActivity}
              surveyStatusProgress={surveyStatusProgress}
              listOfEventSurveys={listOfEventSurveys}
              loadingSurveys={loadingSurveys}
            />
          </Content>
        </Layout>
        <EventSectionMenuRigth
          generalTabs={generaltabs}
          currentActivity={currentActivity}
          notNewMessage={notNewMessage}
          totalNewMessages={totalNewMessages}
          tabs={tabs}
          tabselected={tabselected}
          settabselected={settabselected}
          surveyStatusProgress={surveyStatusProgress}
          listOfEventSurveys={listOfEventSurveys}
          loadingSurveys={loadingSurveys}
        />
        <MenuTabletsSocialZone
          totalNewMessages={totalNewMessages}
          generalTabs={generaltabs}
          notNewMessage={notNewMessage}
          tabselected={tabselected}
          settabselected={settabselected}
          surveyStatusProgress={surveyStatusProgress}
          listOfEventSurveys={listOfEventSurveys}
          loadingSurveys={loadingSurveys}
        />
      </Layout>
    </>
  );
};

const mapStateToProps = (state) => ({
  currentActivity: state.stage.data.currentActivity,
  tabs: state.stage.data.tabs,
  view: state.topBannerReducer.view,
});

const mapDispatchToProps = {
  setCurrentSurvey,
  setSurveyResult,
};
export default connect(mapStateToProps, mapDispatchToProps)(Landing);
