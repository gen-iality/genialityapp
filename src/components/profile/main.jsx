import React from 'react';
import { Avatar, Card, Col, Layout, Menu, Row, Space, Statistic, Tabs, Typography } from 'antd';
import { ArrowUpOutlined, LikeOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { TabPane } = Tabs;

const MainProfile = () => {
  return (
    <Layout style={{ height: '90.8vh' }}>
      <Sider
        width={300}
        style={{ backgroundColor: '#ffffff' }}
        breakpoint='lg'
        collapsedWidth='0'
        zeroWidthTriggerStyle={{ top: '-40px', width: '40px', right: '-40px' }}>
        <Row justify='center'>
          <Space
            size={5}
            direction='vertical'
            style={{ textAlign: 'center', paddingLeft: '15px', paddingRight: '15px' }}>
            <Avatar size={150} src={'https://i.pravatar.cc/300'} />
            <Typography.Text style={{ fontSize: '20px', width: '250px' }}>Nombre del usuario</Typography.Text>
            <Typography.Text type='secondary' style={{ fontSize: '16px', width: '220px', wordBreak: 'break-all' }}>
              usuario@email.com
            </Typography.Text>
          </Space>

          <Col style={{ padding: '30px' }} span={24}>
            <Card>
              <Statistic
                title='Eventos creados'
                value={11.28}
                precision={2}
                valueStyle={{ color: '#3f8600', fontSize:'26px' }}
              />
            </Card>
          </Col>
        </Row>
      </Sider>
      <Layout>
        <Content style={{ margin: '0px', padding: '10px' }}>
          <Tabs defaultActiveKey='1'>
            <TabPane tab='Todo' key='1'>
              Tab 1
            </TabPane>
            <TabPane tab='Organiaciones' key='2'>
              Tab 2
            </TabPane>
            <TabPane tab='Eventos creados' key='3'>
              Tab 3
            </TabPane>
            <TabPane tab='Registros a eventos' key='4'>
              Tab 4
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainProfile;
