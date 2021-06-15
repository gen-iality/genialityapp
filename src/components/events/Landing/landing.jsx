import React, { Component } from 'react';
import { connect } from 'react-redux';

import { UseEventContext } from '../../../Context/eventContext';

/** Components */
import TopBanner from './TopBanner';

import EventSectionRoutes from './EventSectionsRoutes';
import EventSectionsInnerMenu from './EventSectionsInnerMenu';
import { Layout } from 'antd';
const { Content, Sider } = Layout;

const Landing = () => {
  let cEventContext = UseEventContext();
  if (cEventContext.status === 'LOADING') return <h1>Cargando...</h1>;
  return (
    <Content>
      <Layout className='site-layout'>
        <Layout className='site-layout'>
          <Content className='site-layout-background'>
            <TopBanner event={cEventContext.value} currentActivity={null} />
            <EventSectionsInnerMenu event={cEventContext.value} />
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
