import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { UseEventContext } from '../../../Context/eventContext';
import { UseCurrentUser } from '../../../Context/userContext';
import { UseUserEvent } from '../../../Context/eventUserContext';
import { HelperContext } from '../../../Context/HelperContext';
/** ant design */
import { Layout, Spin, notification, Button, Drawer, Modal, Result, Typography } from 'antd';

/** Components */
import TopBanner from './TopBanner';
import EventSectionRoutes from './EventSectionsRoutes';
import EventSectionsInnerMenu from './EventSectionsInnerMenu';
import EventSectionMenuRigth from './EventSectionMenuRigth';
import MenuTablets from './Menus/MenuTablets';
import MenuTabletsSocialZone from './Menus/MenuTabletsSocialZone';

/** Firebase */
import { firestore } from '../../../helpers/firebase';
const { Content } = Layout;

import { setUserAgenda } from '../../../redux/networking/actions';
import { DesktopOutlined, LoadingOutlined, IssuesCloseOutlined, NotificationOutlined } from '@ant-design/icons';

import EviusFooter from './EviusFooter';
import AppointmentModal from '../../networking/appointmentModal';

/** Google tag manager */
import { EnableGTMByEVENT } from './helpers/tagManagerHelper';
/** Google Analytics */
import { EnableAnalyticsByEVENT } from './helpers/analyticsHelper';
/** Facebook Pixel */
import { EnableFacebookPixelByEVENT } from './helpers/facebookPixelHelper';
import { Ripple } from 'react-preloaders';
import ModalRegister from './modalRegister';

const iniitalstatetabs = {
  attendees: false,
  privateChat: false,
  publicChat: true,
};

const IconRender = (type) => {
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

const Landing = (props) => {
  let cEventContext = UseEventContext();
  let cUser = UseCurrentUser();
  let cEventUser = UseUserEvent();
  let { isNotification, ChangeActiveNotification, eventPrivate } = useContext(HelperContext);
  const [register, setRegister] = useState(null);

  const ButtonRender = (status, activity) => {
    return status == 'open' ? (
      <Button
        type='primary'
        size='small'
        onClick={() =>
          window.location.replace(`${window.location.origin}/landing/${cEventContext.value._id}/activity/${activity}`)
        }>
        Ir a la actividad
      </Button>
    ) : null;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('register') !== null) {
      setRegister(urlParams.get('register'));
    }
  }, []);
  //PARA OBTENER PARAMETRO AL LOGUEARME
  const NotificationHelper = ({ message, type, activity }) => {
    notification.open({
      message: 'Nueva notificación',
      description: message,
      icon: IconRender(type),
      onClose: () => {
        ChangeActiveNotification(false, 'none', 'none');
      },
      btn: ButtonRender(type, activity),
    });
  };

  useEffect(() => {
    if (isNotification.notify) {
      NotificationHelper(isNotification);
    }
  }, [isNotification]);

  let [generaltabs, setgeneraltabs] = useState(iniitalstatetabs);
  let [totalNewMessages, settotalnewmessages] = useState(0);
  let { currentActivity, tabs } = props;

  useEffect(() => {
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
  }, [cEventContext.status]);

  if (cEventContext.status === 'LOADING' || cEventUser.status === 'LOADING') return <Spin />;

  return (
    <>
      {register !== null && <ModalRegister register={register} setRegister={setRegister} event={cEventContext.value} />}
      <Layout>
        <AppointmentModal
          targetEventUserId={props.userAgenda?.eventUserId}
          targetEventUser={props.userAgenda}
          closeModal={() => {
            props.setUserAgenda(null);
          }}
        />

        <EventSectionsInnerMenu />
        <MenuTablets />

        <Layout className='site-layout'>
          <Content
            className='site-layout-background'
            style={{
              // paddingBottom: '15vh',
              backgroundSize: 'cover',
              background: `${cEventContext.value && cEventContext.value?.styles?.containerBgColor}`,
              backgroundImage: `url(${cEventContext.value && cEventContext.value?.styles?.BackgroundImage})`,
            }}>
            {props.view && <TopBanner currentActivity={currentActivity} />}

            <EventSectionRoutes generaltabs={generaltabs} currentActivity={currentActivity} />
          </Content>
          <EviusFooter />
        </Layout>
        <EventSectionMenuRigth
          generalTabs={generaltabs}
          currentActivity={currentActivity}
          totalNewMessages={totalNewMessages}
          tabs={tabs}
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

const mapStateToProps = (state) => ({
  currentActivity: state.stage.data.currentActivity,
  tabs: state.stage.data.tabs,
  view: state.topBannerReducer.view,
  userAgenda: state.spaceNetworkingReducer.userAgenda,
});

const mapDispatchToProps = {
  setUserAgenda,
};
export default connect(mapStateToProps, mapDispatchToProps)(Landing);
