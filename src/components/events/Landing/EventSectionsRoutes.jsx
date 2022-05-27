import { useEffect } from 'react';
import { Redirect, Route, Switch, useRouteMatch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setVirtualConference } from '../../../redux/virtualconference/actions';
import { setSpaceNetworking } from '../../../redux/networking/actions';
import { useHelper } from '../../../context/helperContext/hooks/useHelper';
import { setSectionPermissions } from '../../../redux/sectionPermissions/actions';
import { useParams } from 'react-router-dom';
import { UseUserEvent } from '../../../context/eventUserContext';
import { useCheckinUser } from '../../../helpers/HelperAuth';
import loadable from '@loadable/component';
import initUserPresence from '../../../containers/userPresenceInEvent';
import withContext from '../../../context/withContext';
import { UseCurrentUser } from '@/context/userContext';

//Code spliting
const DocumentsForm = loadable(() => import('../../documents/front/documentsLanding'));
const SpeakersForm = loadable(() => import('../speakers'));
const SurveyForm = loadable(() => import('../surveys'));
const FaqsForm = loadable(() => import('../../faqsLanding'));
const Partners = loadable(() => import('../Partners'));
const Agenda = loadable(() => import('../agendaLanding'));
const EventHome = loadable(() => import('../eventHome'));
const WallForm = loadable(() => import('../../wall/index'));
const Ferias = loadable(() => import('../ferias/index'));
const VirtualConferenceBig = loadable(() => import('../virtualConferenceBig'));
const CertificadoLanding = loadable(() => import('../../certificados/cerLanding'));
const MyAgendaIndepend = loadable(() => import('../../networking/myAgendaIndepend'));
const NetworkingForm = loadable(() => import('../../networking'));
const InformativeSection2 = loadable(() => import('../informativeSections/informativeSection2'));
const InformativeSection = loadable(() => import('../informativeSections/informativeSection'));
const Noticias = loadable(() => import('../noticias'));
const Productos = loadable(() => import('../producto/index'));
const MessageRegister = loadable(() => import('../registrationForm/messageRegister'));
const ListVideoCard = loadable(() => import('../../shared/listVideoCard'));
const Videos = loadable(() => import('../videos'));
const InfoEvent = loadable(() => import('../../shared/infoEvent'));
const ResponsePayu = loadable(() => import('../../shared/infoEvent'));
const AgendaActividadDetalle = loadable(() => import('../../events/AgendaActividadDetalle/index'));
const MySection = loadable(() => import('../newSection'));
const ThisRouteCanBeDisplayed = loadable(() => import('./helpers/thisRouteCanBeDisplayed'));

const EventSectionRoutes = (props) => {
  let { path } = useRouteMatch();
  let { event_id, event_name } = useParams();
  let { GetPermissionsEvent } = useHelper();
  let cEventUser = UseUserEvent();
  let cUser = UseCurrentUser();

  //redirigir a evento Cancilleria
  if (event_id === '610976f24e10472fb738d65b') {
    window.location.replace('https://cancilleria.evius.co/landing/610976f24e10472fb738d65b/evento');
  }

  const obtenerFirstSection = () => {
    if (props.cEvent.value == null) return;
    let firstroute = Object.keys(props.cEvent.value.itemsMenu).filter((item) => item !== 'tickets');
    let firstrouteValues = Object.values(props.cEvent.value.itemsMenu).filter((item) => item.section !== 'tickets');

    let index = -1;
    if (firstroute && firstrouteValues) {
      if (firstroute.length > 0 && firstrouteValues.length > 0) {
        for (let i = 0; i < firstrouteValues.length; i++) {
          if (firstrouteValues[ i ]?.position == '1') {
            index = i;
            break;
          }
        }
        if (index > -1) {
          return firstroute[ index ];
        } else {
          return firstroute[ 0 ];
        }
      }
    }
  };

  useEffect(() => {
    //presencia de usuario
    if (props.cEvent.value && cUser.value) {
      initUserPresence(props.cEvent.value._id);
    }
  }, [ props.cEvent.value, cUser.value ]);

  useEffect(() => {
    GetPermissionsEvent();

    if (window.location.pathname.includes('/event/Gorilla-Logic/evento')) {
      window.location.replace('https://app.evius.co/landing/618c502f8ceb9e109464f1c4');
    }
  }, []);

  useEffect(() => {
    if (cEventUser.value && props.cEvent.value) {
      // console.log(props.cEvent.value.type_event)
      if (props.cEvent.value.type_event === "onlineEvent") {
        useCheckinUser(cEventUser.value, props.cEvent.value._id);
      }
    }
  }, [ cEventUser.status, props.cEvent.value ]);

  const validateTypeUrl = () => {
    let url;
    if (event_name) {
      url = `/event/${event_name}/${obtenerFirstSection()}`;
    } else {
      url = `/landing/${event_id}/${obtenerFirstSection()}`;
    }

    return url;
  };

  return (
    <>
      {props.viewVirtualconference && (
        <>
          {props.cEvent.value?.styles?.show_title &&
            (props.cEvent.value?.styles.show_title === true || props.cEvent.value?.styles?.show_title === 'true') && (
              <InfoEvent />
            )}
          <VirtualConferenceBig />
          {props.cEvent.value?.styles?.show_video_widget &&
            (props.cEvent.value?.styles?.show_video_widget === true ||
              props.cEvent.value?.styles?.show_video_widget === 'true') && (
              <ListVideoCard idevent={props.cEvent.value} />
            )}
        </>
      )}

      <Switch>
        <Route exact path={`${path}/`}>
          {props.cEvent.value?.itemsMenu && <Redirect to={validateTypeUrl()} />}
        </Route>

        <Route path={`${path}/documents`}>
          <ThisRouteCanBeDisplayed>
            <DocumentsForm key='documents' />
          </ThisRouteCanBeDisplayed>
        </Route>

        <Route path={`${path}/interviews`}>
          <ThisRouteCanBeDisplayed>
            <MyAgendaIndepend key='interviews' />
          </ThisRouteCanBeDisplayed>
        </Route>

        <Route path={`${path}/networking`}>
          <ThisRouteCanBeDisplayed>
            <NetworkingForm key='networking' />
          </ThisRouteCanBeDisplayed>
        </Route>

        <Route path={`${path}/informativeSection1`}>
          <ThisRouteCanBeDisplayed>
            <InformativeSection2 key='informativeSection1' />
          </ThisRouteCanBeDisplayed>
        </Route>

        <Route path={`${path}/informativeSection`}>
          <ThisRouteCanBeDisplayed>
            <InformativeSection key='informativeSection' />
          </ThisRouteCanBeDisplayed>
        </Route>

        <Route path={`${path}/my_section`}>
          <ThisRouteCanBeDisplayed>
            <MySection key='my_section' />
          </ThisRouteCanBeDisplayed>
        </Route>

        <Route path={`${path}/activity/:activity_id`}>
          <ThisRouteCanBeDisplayed>
            <AgendaActividadDetalle
              socialzonetabs={{
                ...props?.generaltabs,
              }}
              key='activity'
            />
          </ThisRouteCanBeDisplayed>
        </Route>

        <Route path={`${path}/speakers`}>
          <ThisRouteCanBeDisplayed>
            <SpeakersForm key='speakers' />
          </ThisRouteCanBeDisplayed>
        </Route>
        <Route path={`${path}/survey`}>
          <ThisRouteCanBeDisplayed>
            <SurveyForm key='survey' />
          </ThisRouteCanBeDisplayed>
        </Route>
        <Route path={`${path}/partners`}>
          <ThisRouteCanBeDisplayed>
            <Partners key='partners' />
          </ThisRouteCanBeDisplayed>
        </Route>
        <Route path={`${path}/faqs`}>
          <ThisRouteCanBeDisplayed>
            <FaqsForm key='faqs' />
          </ThisRouteCanBeDisplayed>
        </Route>

        <Route path={`${path}/evento`}>
          <ThisRouteCanBeDisplayed>
            <EventHome key='evento' />
          </ThisRouteCanBeDisplayed>
        </Route>

        <Route path={`${path}/wall`}>
          <ThisRouteCanBeDisplayed>
            <WallForm key='wall' />
          </ThisRouteCanBeDisplayed>
        </Route>
        <Route path={`${path}/videos`}>
          <ThisRouteCanBeDisplayed>
            <Videos key='videos' />
          </ThisRouteCanBeDisplayed>
        </Route>

        <Route path={`${path}/ferias`}>
          <ThisRouteCanBeDisplayed>
            <Ferias key='ferias' />
          </ThisRouteCanBeDisplayed>
        </Route>
        <Route path={`${path}/noticias`}>
          <ThisRouteCanBeDisplayed>
            <Noticias key='noticias' />
          </ThisRouteCanBeDisplayed>
        </Route>

        <Route path={`${path}/certs`}>
          <ThisRouteCanBeDisplayed>
            <CertificadoLanding key='certs' />
          </ThisRouteCanBeDisplayed>
        </Route>
        <Route path={`${path}/producto`}>
          <ThisRouteCanBeDisplayed>
            <Productos key='producto' />
          </ThisRouteCanBeDisplayed>
        </Route>
        <Route path={`${path}/agenda`}>
          <ThisRouteCanBeDisplayed>
            <Agenda
              key='agenda'
              activity={props.currentActivity}
              generalTabs={props.generalTabs}
              setVirtualConference={props.setVirtualConference}
            />
          </ThisRouteCanBeDisplayed>
        </Route>
        <Route path={`${path}/success/:type?`}>
          <MessageRegister />
        </Route>
        <Route path={`${path}/responsePayu`}>
          <ResponsePayu />
        </Route>
      </Switch>
    </>
  );
};

const mapStateToProps = (state) => ({
  viewVirtualconference: state.virtualConferenceReducer.view,
  viewSocialZoneNetworking: state.spaceNetworkingReducer.view,
  sectionPermissions: state.viewSectionPermissions.view,
});

const mapDispatchToProps = {
  setVirtualConference,
  setSpaceNetworking,
  setSectionPermissions,
};

let eventSectionsContext = withRouter(withContext(EventSectionRoutes));
export default connect(mapStateToProps, mapDispatchToProps)(eventSectionsContext);
