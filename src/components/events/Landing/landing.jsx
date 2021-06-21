import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { UseEventContext } from '../../../Context/eventContext';
import { UseCurrentUser } from '../../../Context/userContext';

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

  let [generaltabs, setgeneraltabs] = useState(iniitalstatetabs);
  let [totalNewMessages, settotalnewmessages] = useState(0);
  let { currentActivity, tabs } = props;
  const [tabselected, settabselected] = useState('1');

  useEffect(() => {
    console.log('cUser', cUser);
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

    console.log('totalNewMessages', totalNewMessages);
  }, [cEventContext.status]);

  //METODO PARA SETEAR NEW MESSAGE
  const notNewMessage = () => {
    console.log('se ejecuta el borrar mensajes');
    settotalnewmessages(0);
  };

  if (cEventContext.status === 'LOADING') return <Spin size='small' />;

  return (
    <Content>
      <Layout className='site-layout'>
        <EventSectionsInnerMenu event={cEventContext.value} />
        <MenuTablets event={cEventContext.value} />
        <Layout className='site-layout'>
          <Content className='site-layout-background'>
            <TopBanner event={cEventContext.value} currentActivity={currentActivity} />
            <EventSectionRoutes event={cEventContext.value} />
          </Content>
        </Layout>
        <EventSectionMenuRigth
          cEvent={cEventContext.value}
          cUser={cUser}
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
          cEvent={cEventContext.value}
          cUser={cUser}
          tabselected={tabselected}
          settabselected={settabselected}
        />
      </Layout>
    </Content>
  );
};

const mapStateToProps = (state) => ({
  currentActivity: state.stage.data.currentActivity,
  tabs: state.stage.data.tabs,
});

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Landing);
