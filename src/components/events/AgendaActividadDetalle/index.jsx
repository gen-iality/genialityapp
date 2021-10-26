import React, { useState, useEffect, useContext } from 'react';
import { withRouter, Link } from 'react-router-dom';
import {
  ArrowLeftOutlined,
  CaretRightOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import Moment from 'moment-timezone';
import ReactPlayer from 'react-player';
import { useIntl } from 'react-intl';
import { Row, Col, Button, List, Avatar, Card, Tabs, Badge, Typography, Form, Input, Alert } from 'antd';
import WithEviusContext from '../../../Context/withContext';
import { setTopBanner } from '../../../redux/topBanner/actions';
import { Activity, AgendaApi } from '../../../helpers/request';
import { setVirtualConference } from '../../../redux/virtualconference/actions';
import HelperContext from '../../../Context/HelperContext';
import { UseSurveysContext } from '../../../Context/surveysContext';
import { isMobile } from 'react-device-detect';
import { firestore } from '../../../helpers/firebase';
import * as SurveyActions from '../../../redux/survey/actions';
import { CheckinActiviy } from './utils';
import SurveyDrawer from '../surveys/components/surveyDrawer';
import HeaderColumnswithContext from './HeaderColumns';
import HCOActividad from './HOC_Actividad';
import { activitiesCode, cityValid, codeActivity } from '../../../helpers/constants';
const { setCurrentSurvey, setSurveyVisible, setHasOpenSurveys, unsetCurrentSurvey } = SurveyActions;

const AgendaActividadDetalle = (props) => {
  let {
    chatAttendeChats,
    HandleOpenCloseMenuRigth,
    isCollapsedMenuRigth,
    currentActivity,
    handleChangeCurrentActivity,
  } = useContext(HelperContext);
  let [orderedHost, setOrderedHost] = useState([]);
  let cSurveys = UseSurveysContext();
  const [videoStyles, setVideoStyles] = useState(null);
  const [videoButtonStyles, setVideoButtonStyles] = useState(null);
  let [idSpeaker, setIdSpeaker] = useState(false);
  let [blockActivity, setblockActivity] = useState(false);

  const intl = useIntl();
  {
    Moment.locale(window.navigator.language);
  }

  async function listeningStateMeetingRoom(event_id, activity_id) {
    firestore
      .collection('events')
      .doc(event_id)
      .collection('activities')
      .doc(activity_id)
      .onSnapshot((infoActivity) => {
        if (!infoActivity.exists) return;
        const data = infoActivity.data();
        const { habilitar_ingreso, meeting_id, platform, tabs } = data;
        let currentemp = currentActivity;
        currentemp.meeting_id = meeting_id;
        currentemp.platform = platform;
        currentemp.habilitar_ingreso = habilitar_ingreso;
        currentemp.tabs = tabs;
        // console.log('currentemp', currentemp);
        handleChangeCurrentActivity(currentemp);
      });
  }

  async function getSpeakers(idSpeaker) {
    setIdSpeaker(idSpeaker);
  }

  useEffect(() => {
    CheckinActiviy(props.cEvent.value._id, props.match.params.activity_id, props.cEventUser, props.cUser);

    async function getActividad() {
      return await AgendaApi.getOne(props.match.params.activity_id, props.cEvent.value._id);
    }

    function orderHost(hosts) {
      hosts.sort(function(a, b) {
        return a.order - b.order;
      });
      setOrderedHost(hosts);
    }

    getActividad().then((result) => {
      handleChangeCurrentActivity(result);
      orderHost(result.hosts);
      cSurveys.set_current_activity(result);
    });

    props.setTopBanner(false);
    props.setVirtualConference(false);
    if (isCollapsedMenuRigth) {
      HandleOpenCloseMenuRigth(false);
    }

    return () => {
      props.setTopBanner(true);
      props.setVirtualConference(true);
      if(!isCollapsedMenuRigth){
        HandleOpenCloseMenuRigth(true);
      }
      handleChangeCurrentActivity(null);
    };
  }, []);

  useEffect(() => {
    async function GetStateMeetingRoom() {
      await listeningStateMeetingRoom(props.cEvent.value._id, currentActivity._id);
    }

    if (currentActivity) {
      GetStateMeetingRoom();
      cSurveys.set_current_activity(currentActivity);
    }
  }, [currentActivity]);

  useEffect(() => {
    if (chatAttendeChats === '4') {
      const sharedProperties = {
        position: 'fixed',
        right: '0',
        width: '170px',
      };

      const verticalVideo = isMobile ? { top: '5%' } : { bottom: '0' };

      setVideoStyles({
        ...sharedProperties,
        ...verticalVideo,
        zIndex: '100',
        transition: '300ms',
      });

      const verticalVideoButton = isMobile ? { top: '9%' } : { bottom: '27px' };

      setVideoButtonStyles({
        ...sharedProperties,
        ...verticalVideoButton,
        zIndex: '101',
        cursor: 'pointer',
        display: 'block',
        height: '96px',
      });
    } else {
      setVideoStyles({ width: '100%', height: '80vh', transition: '300ms' });
      setVideoButtonStyles({ display: 'none' });
    }
  }, [chatAttendeChats, isMobile]);

  // VALIDAR ACTIVIDADES POR CODIGO
  useEffect(() => {
    if (props.cEvent.value && props.cUser) {
      if (props.cEvent.value?._id == '61200dfb2c0e5301fa5e9d86') {
        if (activitiesCode.includes(activity_id)) {
          if (props.cEventUser.value) {
            if (
              codeActivity.includes(props.cEventUser.value?.properties.codigo) ||
              cityValid.includes(props.cEventUser.value?.properties.ciudad)
            ) {
              setblockActivity(false);
            } else {
              setblockActivity(true);
            }
          }
        }
      } else {
        setblockActivity(false);
      }
    }
  }, [props.cEvent.value, props.cEventUser.value, props.cUser.value]);

  return !blockActivity ? (
    <div className='is-centered'>
      <div className=' container_agenda-information container-calendar2 is-three-fifths'>
        <Card style={{ padding: '1 !important' }} className='agenda_information'>
          <HeaderColumnswithContext isVisible={true} />
          <HCOActividad />
        </Card>
      </div>
      {/* Drawer encuestas */}
      <SurveyDrawer
        colorFondo={props.cEvent.value.styles.toolbarDefaultBg}
        colorTexto={props.cEvent.value.styles.textMenu}
      />
    </div>
  ) : (
    <Card style={{ padding: '1 !important' }} className={'agenda_information'}>
      <Row align='middle'>
        <HCOActividad />
      </Row>
      <Row>
        <Alert
          showIcon
          style={{ width: '100%', marginTop: 40, marginBottom: 40, textAlign: 'center', fontSize: '19px' }}
          message={
            <>
              ¿Quieres acceder a la membresía del taller? ingresa aqui:{' '}
              <a style={{ color: '#3273dc' }} target='_blank' href='https://iberofest.co/producto/edc/'>
                https://iberofest.co/producto/edc/
              </a>{' '}
            </>
          }
          type='warning'
        />
      </Row>
    </Card>
  );
};

const mapStateToProps = (state) => ({
  mainStageContent: state.stage.data.mainStage,
  userInfo: state.user.data,
  currentActivity: state.stage.data.currentActivity,
  currentSurvey: state.survey.data.currentSurvey,
  hasOpenSurveys: state.survey.data.hasOpenSurveys,
  tabs: state.stage.data.tabs,
  generalTabs: state.tabs.generalTabs,
  permissions: state.permissions,
  isVisible: state.survey.data.surveyVisible,
  viewSocialZoneNetworking: state.spaceNetworkingReducer.view,
});

const mapDispatchToProps = {
  setTopBanner,
  setVirtualConference,
  setHasOpenSurveys,
};

let AgendaActividadDetalleWithContext = WithEviusContext(AgendaActividadDetalle);
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AgendaActividadDetalleWithContext));
