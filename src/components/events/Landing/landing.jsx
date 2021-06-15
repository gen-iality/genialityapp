import React from 'react';
import { connect } from 'react-redux';
import { UseEventContext } from '../../../Context/eventContext';

/** ant design */
import { Layout, Spin } from 'antd';

/** Components */
import TopBanner from './TopBanner';
import EventSectionRoutes from './EventSectionsRoutes';
import EventSectionsInnerMenu from './EventSectionsInnerMenu';
const { Content } = Layout;

const Landing = () => {
  let cEventContext = UseEventContext();
  if (cEventContext.status === 'LOADING') return <Spin size='small' />;
  return (
    <Content>
      <Layout className='site-layout'>
        <EventSectionsInnerMenu event={cEventContext.value} />
        <Layout className='site-layout'>
          <Content className='site-layout-background'>
            <TopBanner event={cEventContext.value} currentActivity={null} />
            <EventSectionRoutes event={cEventContext.value} />
          </Content>
        </Layout>
      </Layout>
    </Content>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Landing);
