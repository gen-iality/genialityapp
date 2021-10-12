import React, { useState, useEffect } from 'react';
import { Avatar, Card, Col, Layout, Menu, Row, Space, Statistic, Tabs, Typography, Grid, Divider } from 'antd';
import { AppstoreFilled } from '@ant-design/icons';
import OrganizationCard from './organizationCard';
import NewCard from './newCard';
import ExploreEvents from './exploreEvents';
import withContext from '../../Context/withContext';

const { Content, Sider } = Layout;
const { TabPane } = Tabs;
const { useBreakpoint } = Grid;

const MainProfile = (props) => {
  const [activeTab, setActiveTab] = useState()
  const screens = useBreakpoint();
  const selectedTab = props.match.params.tab;

  useEffect(() => {
    switch (selectedTab) {
      case 'organization':
        setActiveTab('2')
        break;
      case 'events':
        setActiveTab('3')
        break;
      case 'tickets':
        setActiveTab('4')
        break;
      default:
        setActiveTab('1');
    }
  }, [])
  console.log('pantallas', screens);

  return (
    <Layout style={{ height: '90.8vh' }}>
      <Sider
        defaultCollapsed={true}
        width={!screens.xs ? 300 : '92vw'}
        style={{ backgroundColor: '#ffffff', paddingTop:'10px', paddingBottom:'10px' }}
        breakpoint='lg'
        collapsedWidth='0'
        zeroWidthTriggerStyle={{ top: '-40px', width: '50px' }}>
        <Row justify='center' gutter={[10, 20]}>
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
          <Col span={24}>
            <Menu style={{ width: '100%', border: 'none' }} mode='inline'>
              <Menu.Item key='m1'>Option 1</Menu.Item>
              <Menu.Item key='m2'>Option 2</Menu.Item>
              <Menu.Item key='m3'>Option 3</Menu.Item>
              <Menu.Item key='m4'>Option 4</Menu.Item>
            </Menu>
          </Col>
          <Col style={{ padding: '30px' }} span={24}>
            <Card style={{ textAlign: 'center', borderRadius: '15px' }}>
              <Statistic
                title={<span style={{ fontSize: '18px' }}>Eventos creados</span>}
                value={5}
                precision={0}
                valueStyle={{ color: '#3f8600', fontSize: '50px' }}
              />
            </Card>
          </Col>
        </Row>
      </Sider>
      <Layout>
        <Content style={{ margin: '0px', padding: '10px', overflowY: 'auto' }}>
          <Tabs
          defaultActiveKey={activeTab}
          activeKey={activeTab}
          onTabClick={(key) => {
            setActiveTab(key);
          }}>
            {!screens.xs && (
              <TabPane
                tab={
                  <Space size={0}>
                    <AppstoreFilled /> Todos
                  </Space>
                }
                key='1'>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Divider orientation='left'>Eventos creado</Divider>
                    <Row gutter={[16, 16]}>
                      <Col key={'index'} xs={24} sm={12} md={12} lg={8} xl={6}>
                        <NewCard entityType='event' />
                      </Col>
                      {/* aqui empieza el mapeo de eventCard.jsx maximo 4 */}
                      <Col key={'index'} xs={24} sm={12} md={12} lg={8} xl={6}>
                        <Card
                          cover={<img style={{ objectFit: 'cover' }} src='https://picsum.photos/300/200' />}
                          style={{ width: '100%' }}></Card>
                      </Col>
                      {/* aqui termina el mapeo de eventCard.jsx maximo 4  */}
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Divider orientation='left'>Eventos en los que estoy registrado</Divider>
                    <Row gutter={[16, 16]}>
                      <Col span={24}>
                        <ExploreEvents/>
                      </Col>
                      {/* <Col key={'index'} xs={24} sm={12} md={12} lg={8} xl={6}>
                        <Card
                          cover={<img style={{ objectFit: 'cover' }} src='https://picsum.photos/300/200' />}
                          style={{ width: '100%' }}></Card>
                      </Col> */}
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Divider orientation='left'>Organizaciones</Divider>
                    <Row gutter={[16, 16]}>
                      <Col key={'index1'} xs={12} sm={8} md={8} lg={6} xl={4} xxl={4}>
                        <NewCard entityType='organization' />
                      </Col>
                      {/* aqui empieza el mapeo maximo 6 */}
                      <Col key={'index1'} xs={12} sm={8} md={8} lg={6} xl={4} xxl={4}>
                        <OrganizationCard />
                      </Col>
                      {/* aqui termina el mapeo maximo 6 */}
                    </Row>
                  </Col>
                </Row>
              </TabPane>
            )}
            <TabPane tab='Organizaciones' key='2'>
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={8} md={8} lg={6} xl={4} xxl={4}>
                  <NewCard entityType='organization' />
                </Col>
                <Col key={'index'} xs={12} sm={8} md={8} lg={6} xl={4} xxl={4}>
                  <OrganizationCard />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab='Eventos creados' key='3'>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={12} lg={8} xl={6}>
                  <NewCard entityType='event' />
                </Col>
                <Col key={'index'} xs={24} sm={12} md={12} lg={8} xl={6}>
                  <Card
                    cover={<img style={{ objectFit: 'cover' }} src='https://picsum.photos/300/200' />}
                    style={{ width: '100%' }}></Card>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab='Registros a eventos' key='4'>
              <Row gutter={[16, 16]}>
                <Col key={'index'} xs={24} sm={12} md={12} lg={8} xl={6}>
                  <Card
                    cover={<img style={{ objectFit: 'cover' }} src='https://random.imagecdn.app/300/200' />}
                    style={{ width: '100%' }}></Card>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    </Layout>
  );
};

export default withContext(MainProfile);
