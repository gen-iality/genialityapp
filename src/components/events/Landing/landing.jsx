import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useEventContext } from '@context/eventContext';
import { useCurrentUser } from '@context/userContext';
import { useUserEvent } from '@context/eventUserContext';
import { useHistory, Link, useLocation } from 'react-router-dom';
/** ant design */
import { Layout, Spin, notification, Button, Result, Steps, Tooltip } from 'antd';
/* import 'react-toastify/dist/ReactToastify.css'; */
const { Content } = Layout;
const { Step } = Steps;

import { setUserAgenda } from '../../../redux/networking/actions';
import {
  DesktopOutlined,
  LoadingOutlined,
  IssuesCloseOutlined,
  NotificationOutlined,
  MinusCircleFilled,
} from '@ant-design/icons';

/** Google tag manager */
import { EnableGTMByEVENT } from './helpers/tagManagerHelper';
/** Google Analytics */
import { EnableAnalyticsByEVENT } from './helpers/analyticsHelper';
/** Facebook Pixel */
import { EnableFacebookPixelByEVENT } from './helpers/facebookPixelHelper';

import loadable from '@loadable/component';
import { DispatchMessageService } from '@context/MessageService.tsx';
import WithEviusContext from '@context/withContext';
import { checkinAttendeeInEvent } from '@helpers/HelperAuth';
import { useHelper } from '@context/helperContext/hooks/useHelper';
import initBroadcastViewers from '@containers/broadcastViewers';
import DateEvent from '../dateEvent';
import dayjs from 'dayjs';
import { AgendaApi } from '@helpers/request';
import { firestore } from '@helpers/firebase';

import CourseProgressBar from '@components/events/courseProgressBar/CourseProgressBar';

const EviusFooter = loadable(() => import('./EviusFooter'));
const AppointmentModal = loadable(() => import('../../networking/appointmentModal'));
const ModalRegister = loadable(() => import('./modalRegister'));
const ModalLoginHelpers = loadable(() => import('../../authentication/ModalLoginHelpers'));
const ModalPermission = loadable(() => import('../../authentication/ModalPermission'));
const ModalFeedback = loadable(() => import('../../authentication/ModalFeedback'));
const ModalNoRegister = loadable(() => import('../../authentication/ModalNoRegister'));

/** Components */
const TopBanner = loadable(() => import('./TopBanner'));
const EventSectionRoutes = loadable(() => import('./EventSectionsRoutes'));
const EventSectionsInnerMenu = loadable(() => import('./EventSectionsInnerMenu'));
const EventSectionMenuRigth = loadable(() => import('./EventSectionMenuRigth'));
const MenuTablets = loadable(() => import('./Menus/MenuTablets'));
const MenuTabletsSocialZone = loadable(() => import('./Menus/MenuTabletsSocialZone'));

const iniitalstatetabs = {
  attendees: false,
  privateChat: false,
  publicChat: false,
};

const IconRender = type => {
  let iconRender;
  switch (type) {
    case 'open':
      iconRender = <DesktopOutlined style={{ color: '#108ee9' }} />;
      break;

    case 'close':
      iconRender = <LoadingOutlined style={{ color: 'red' }} />;
      break;

    case 'ended':
      iconRender = <IssuesCloseOutlined />;
      break;

    case 'networking':
      iconRender = <NotificationOutlined />;
      break;
  }
  return iconRender;
};

const Landing = props => {
  const cEventContext = useEventContext();
  const cUser = useCurrentUser();
  const cEventUser = useUserEvent();
  const { isNotification, ChangeActiveNotification, currentActivity, register, setRegister } = useHelper();

  const [activitiesAttendee, setActivitiesAttendee] = useState([]);
  const [activities, setActivities] = useState([]);
  const history = useHistory();
  const location = useLocation();

  const loadData = async () => {
    const { data } = await AgendaApi.byEvent(cEventContext.value?._id)
    setActivities(data);
    const existentActivities = data.map(async activity => {
      const activity_attendee = await firestore
        .collection(`${activity._id}_event_attendees`)
        .doc(cEventUser.value?._id)
        .get(); //checkedin_at
      if (activity_attendee.exists) {
        let datos = activity_attendee.data();
        datos = { ...datos, hola: 123, activity_id: activity._id, activity_attendee: activity_attendee.id };

        //...activity_attendee.data(), activity_id: activity._id, activity_attendee: activity_attendee.id()
        return datos;
        // setActivities_attendee((past) => [...past, activity_attendee.data()]);
      }
      return null;
    });
    // Filter existent activities and set the state
    setActivitiesAttendee(
      // Promises don't bite :)
      (await Promise.all(existentActivities)).filter(item => !!item),
    );
  };

  function reloadActivityAttendee() {
    loadData();
  }

  useEffect(() => {
    if (!cEventContext.value?._id) return
    if (!cEventUser.value?._id) {
      window.location.href = `/organization/${cEventContext.value?.organizer._id}/events`
    }
  }, [cEventUser.value, cEventContext.value])

  useEffect(() => {
    if (!cEventContext.value?._id) return;
    if (!cEventUser.value?._id) return;
    setActivitiesAttendee([]);
    loadData();
    console.info('event is asked', cEventContext.value?._id)
  }, [cEventContext.value, cEventUser.value]);

  useEffect(() => {
    loadData()
  }, [location])

  useEffect(() => {
    DispatchMessageService({
      type: 'loading',
      msj: '¡Estamos configurando la mejor experiencia para tí!',
      action: 'show',
    });
  }, []);

  const ButtonRender = (status, activity) => {
    return status == 'open' ? (
      <Button
        type="primary"
        size="small"
        onClick={() =>
          window.location.replace(`${window.location.origin}/landing/${cEventContext.value._id}/activity/${activity}`)
        }
      >
        Ir a la lección
      </Button>
    ) : null;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('register') !== null) {
      setRegister(urlParams.get('register'));
    }
  }, []);
  // Para obtener parametro al loguearme
  const NotificationHelper = ({ message, type, activity }) => {
    notification.open({
      message: 'Nueva notificación',
      description: message,
      icon: IconRender(type),
      onClose: () => {
        ChangeActiveNotification(false, 'none', 'none');
      },
      btn: ButtonRender(type, activity),
      duration: type == 'ended' || type == 'open' ? 7 : 3,
    });
  };

  useEffect(() => {
    if (isNotification.notify) {
      NotificationHelper(isNotification);
    }
  }, [isNotification]);

  const [generaltabs, setgeneraltabs] = useState(iniitalstatetabs);
  // eslint-disable-next-line prefer-const
  let [totalNewMessages, settotalnewmessages] = useState(0);

  useEffect(() => {
    if (cEventContext.status === 'LOADED') {
      import('../../../helpers/firebase').then(fb => {
        fb.firestore
          .collection('events')
          .doc(cEventContext.value?._id)
          .onSnapshot(function(eventSnapshot) {
            if (eventSnapshot.exists) {
              if (eventSnapshot.data().tabs !== undefined) {
                setgeneraltabs(eventSnapshot.data().tabs);
              }
            }
          });

        fb.firestore
          .collection('eventchats/' + cEventContext.value._id + '/userchats/' + cUser.uid + '/' + 'chats/')
          .onSnapshot(function(querySnapshot) {
            let data;
            querySnapshot.forEach(doc => {
              data = doc.data();

              if (data.newMessages) {
                settotalnewmessages(
                  (totalNewMessages += !isNaN(parseInt(data.newMessages.length))
                    ? parseInt(data.newMessages.length)
                    : 0),
                );
              }
            });
          });

        if (cEventUser.status == 'LOADED' && cEventUser.value != null && cEventContext.status == 'LOADED') {
          if (cEventContext.value.type_event !== 'onlineEvent') {
            checkinAttendeeInEvent(cEventUser.value, cEventContext.value._id);
          }
        }
      });
    }
  }, [cEventContext.status, cEventUser.status, cEventUser.value, location]);

  if (cEventContext.status === 'LOADING') return <Spin />;

  return (
    <>
      <ModalLoginHelpers />
      {cEventContext.value.visibility !== 'ANONYMOUS' && <ModalPermission />}
      <ModalFeedback />
      {/*update: modal de actualizar || register: modal de registro */}
      {register !== null && cEventContext.value.visibility !== 'ANONYMOUS' && (
        <ModalRegister register={register} setRegister={setRegister} event={cEventContext.value} />
      )}
      <Layout>
        <AppointmentModal
          targetEventUserId={props.userAgenda?.eventUserId}
          targetEventUser={props.userAgenda}
          cEventUser={cEventUser}
          cEvent={cEventContext}
          closeModal={() => {
            props.setUserAgenda(null);
          }}
        />
        <CourseProgressBar
          eventId={cEventContext.value._id}
          activities={activities}
          linkFormatter={activityId => `/landing/${cEventContext.value._id}/activity/${activityId}`}
          count={activitiesAttendee.length}
          activitiesAttendee={activitiesAttendee}
          onChange={reloadActivityAttendee}
        />
        <EventSectionsInnerMenu />
        <MenuTablets />
        <Layout className="site-layout">
          <Content
            className="site-layout-background"
            style={{
              // paddingBottom: '15vh',
              backgroundSize: 'cover',
              background: `${cEventContext.value && cEventContext.value?.styles?.containerBgColor}`,
              backgroundImage: `url(${cEventContext.value && cEventContext.value?.styles?.BackgroundImage})`,
            }}
          >
            {props.view && <TopBanner currentActivity={currentActivity} />}
            <EventSectionRoutes
              generaltabs={generaltabs}
              currentActivity={currentActivity}
              setActivitiesAttendee={setActivitiesAttendee}
            />
            <EviusFooter />
          </Content>
        </Layout>
        <EventSectionMenuRigth
          generalTabs={generaltabs}
          currentActivity={currentActivity}
          totalNewMessages={totalNewMessages}
          tabs={props.tabs}
        />
        <MenuTabletsSocialZone
          totalNewMessages={totalNewMessages}
          currentActivity={currentActivity}
          generalTabs={generaltabs}
        />
        <EnableGTMByEVENT />
        <EnableAnalyticsByEVENT />
        <EnableFacebookPixelByEVENT />
      </Layout>
    </>
  );
};

const mapStateToProps = state => ({
  currentActivity: state.stage.data.currentActivity,
  tabs: state.stage.data.tabs,
  view: state.topBannerReducer.view,
  userAgenda: state.spaceNetworkingReducer.userAgenda,
});

const mapDispatchToProps = {
  setUserAgenda,
};

export default connect(mapStateToProps, mapDispatchToProps)(WithEviusContext(Landing));
