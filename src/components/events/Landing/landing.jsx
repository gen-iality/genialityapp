import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { UseEventContext } from '../../../Context/eventContext';

/** ant design */
import { Layout, Spin } from 'antd';

/** Components */
import TopBanner from './TopBanner';
import EventSectionRoutes from './EventSectionsRoutes';
import EventSectionsInnerMenu from './EventSectionsInnerMenu';
import EventSectionMenuRigth from './EventSectionMenuRigth';
import MenuTablets from './Menus/MenuTablets';

/** Firebase */
import { firestore } from '../../../helpers/firebase';

const { Content } = Layout;

const Landing = (props) => {
  let cEventContext = UseEventContext();
  const [generaltabs, setgeneraltabs] = useState({});
  const { currentActivity, tabs } = props;

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
  }, []);

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
          event={cEventContext.value}
          generalTabs={generaltabs}
          currentActivity={currentActivity}
          tabs={tabs}
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
