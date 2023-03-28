import {Card, Layout } from 'antd';
import React from 'react';
import ConfigObservers from '../components/Configurations/ConfigObservers';
import Meta from 'antd/lib/card/Meta';
import TypeMeenting from '../components/Configurations/TypeMeenting';
const {Content} = Layout
export default function Configuration() {
  return (
    <Layout>
      <Content style={{ display: 'flex', justifyContent: 'space-around' , padding: 10}}>
        <Card
          hoverable
          style={{ width: 540 }}
          >
          <Meta title='Configuracion de observadores'/>
          <ConfigObservers />
        </Card>
        
        <Card
          hoverable
          style={{ width: 540 }}
          >
        <Meta title='Configuracion de tipos'/>
        <TypeMeenting />
        </Card>
      </Content>
    </Layout>
  );
}
