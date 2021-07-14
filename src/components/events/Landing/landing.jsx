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

/** Firebase */
import { firestore } from '../../../helpers/firebase';
const { Content } = Layout;

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
  let { currentActivity, tabs } = props;
  const [tabselected, settabselected] = useState('1');


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

    // console.log('totalNewMessages', totalNewMessages);
  }, [cEventContext.status]);

  //METODO PARA SETEAR NEW MESSAGE
  const notNewMessage = () => {
    settotalnewmessages(0);
  };

  if (cEventContext.status === 'LOADING' || cEventUser.status === 'LOADING') return <Spin size='small' />;


  return (
    <>
      <Layout className='site-layout'>
        <EventSectionsInnerMenu  />
        <MenuTablets  />
        <Layout className='site-layout'>
          <Content className='site-layout-background'>
            {props.view && <TopBanner  currentActivity={currentActivity} />}
            <EventSectionRoutes
              generaltabs={generaltabs}
              currentActivity={currentActivity}
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
        />
        <MenuTabletsSocialZone
          totalNewMessages={totalNewMessages}
          generalTabs={generaltabs}
          notNewMessage={notNewMessage}
          tabselected={tabselected}
          settabselected={settabselected}
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

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Landing);
