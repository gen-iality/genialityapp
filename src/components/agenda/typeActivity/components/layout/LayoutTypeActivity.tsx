import React from 'react';
import { Typography, Layout, Row, Col, Button } from 'antd';

const { Header, Content, Footer } = Layout;

interface propsOptions {
  title?: string;
  children: React.ReactChild;
}

const LayoutTypeActivity = ({ title, children }: propsOptions) => {
  return (
    <Layout>
      <Header style={{ textAlign: 'center', padding: '0px 0px 20px 0px' }}>
        <Typography.Title level={2}>{title}</Typography.Title>
      </Header>
      <Content style={{ padding: '20px 50px 20px 50px' }}>{children}</Content>
      <Footer style={{ backgroundColor: '#fff', padding: '20px 0px 0px 0px' }}>
        <Row justify='end' gutter={[8, 8]} /* style={{ backgroundColor: 'red' }} */>
          <Col>
            <Button>Cancelar/Anterior</Button>
          </Col>
          <Col>
            <Button type='primary'>Siguiente/Crear</Button>
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
};

export default LayoutTypeActivity;
