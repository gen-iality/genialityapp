import React, { Component } from 'react';
import { connect } from 'react-redux';

import { UseEventContext } from '../../../Context/eventContext';
import EventSectionRoutes from './EventSectionsRoutes';
import EventSectionsInnerMenu from './EventSectionsInnerMenu';
import { Layout } from 'antd';
const { Content, Sider } = Layout;

const Landing = () => {
  let cEventContext = UseEventContext();
  if (cEventContext === null) return <h1>Cargando...</h1>;
  return (
    <Content>
      <Layout className='site-layout'>
        <Layout className='site-layout'>
          <Content className='site-layout-background'>
            <EventSectionsInnerMenu event={cEventContext} />
            <EventSectionRoutes event={cEventContext} />
          </Content>
        </Layout>
      </Layout>
    </Content>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Landing);
