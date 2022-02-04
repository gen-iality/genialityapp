import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'moment-timezone';
import { useIntl } from 'react-intl';
import { Row, Card, Alert } from 'antd';
import WithEviusContext from '../../../Context/withContext';
import { setTopBanner } from '../../../redux/topBanner/actions';
import { AgendaApi } from '../../../helpers/request';
import { setVirtualConference } from '../../../redux/virtualconference/actions';
import HelperContext from '../../../Context/HelperContext';
import { UseSurveysContext } from '../../../Context/surveysContext';
import { isMobile } from 'react-device-detect';
import * as SurveyActions from '../../../redux/survey/actions';
import { CheckinActiviy } from './utils';
import SurveyDrawer from '../surveys/components/surveyDrawer';
import HCOActividad from './HOC_Actividad';
import { activitiesCode, cityValid, codeActivity } from '../../../helpers/constants';
import AditionalInformation from './AditionalInformation';
import ImageComponentwithContext from './ImageComponent';
const { setHasOpenSurveys } = SurveyActions;

const AgendaActividadDetalle = (props) => {
  let { chatAttendeChats, HandleOpenCloseMenuRigth, currentActivity, handleChangeCurrentActivity } = useContext(
    HelperContext
  );
  let [orderedHost, setOrderedHost] = useState([]);
  let cSurveys = UseSurveysContext();
  const [videoStyles, setVideoStyles] = useState(null);
  const [videoButtonStyles, setVideoButtonStyles] = useState(null);
  let [blockActivity, setblockActivity] = useState(false);
  const [activity, setactivity] = useState('');

  const intl = useIntl();
  {
    Moment.locale(window.navigator.language);
  }

  useEffect(() => {
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
      setactivity(result);
      orderHost(result.hosts);
      cSurveys.set_current_activity(result);
    });

    props.setTopBanner(false);
    props.setVirtualConference(false);

    HandleOpenCloseMenuRigth(false);
    if (props.socialzonetabs?.publicChat || props.socialzonetabs?.privateChat || props.socialzonetabs?.attendees) {
      HandleOpenCloseMenuRigth(false);
    } else {
      HandleOpenCloseMenuRigth(true);
    }

    return () => {
      props.setTopBanner(true);
      props.setVirtualConference(true);
      HandleOpenCloseMenuRigth(true);
      handleChangeCurrentActivity(null);
      setactivity(null);
    };
  }, []);

  useEffect(() => {
    if (currentActivity) {
      cSurveys.set_current_activity(currentActivity);
      CheckinActiviy(props.cEvent.value._id, currentActivity._id, props.cEventUser, props.cUser);
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
        if (activitiesCode.includes(props.match.params.activity_id)) {
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

  return (
    <div>
      <div className=' container_agenda-information container-calendar2'>
        <Card style={{ padding: '1 !important' }} className='agenda_information'>
          {/* <HeaderColumnswithContext isVisible={true} /> */}
          {!blockActivity ? (
            <>
              {props.match.params.activity_id === '61992d5f020bde260e068402' &&
              props.cEventUser.value.user.rol_id !== '619d0c9161162b7bd16fcb82' ? (
                <Alert
                  showIcon
                  style={{ width: '100%', marginTop: 40, marginBottom: 40, textAlign: 'center', fontSize: '19px' }}
                  message={
                    <>
                      {`Hola ${props.cEventUser.value.user.displayName} 👋, Este contenido es exclusivo para usuarios con paquete UNIVERSO`}
                    </>
                  }
                  type='warning'
                />
              ) : (
                <HCOActividad />
              )}
            </>
          ) : (
            <>
              <Row>
                <ImageComponentwithContext />
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
            </>
          )}
          <AditionalInformation orderedHost={orderedHost} />
        </Card>
      </div>
      {/* Drawer encuestas */}
      <SurveyDrawer
        colorFondo={props.cEvent.value.styles.toolbarDefaultBg}
        colorTexto={props.cEvent.value.styles.textMenu}
      />
    </div>
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
