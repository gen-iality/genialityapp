import React, { useState } from 'react';
import { Tabs, Button, Menu, Row, Col, Card, Avatar } from 'antd';
import {
  CommentOutlined,
  PieChartOutlined,
  TeamOutlined,
  RightOutlined,
  LeftOutlined,
  BuildOutlined,
  ArrowLeftOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import ListadoJuegos from './listadoJuegos';
import LiveChat from './liveChat';

const { TabPane } = Tabs;

export default function ConferenceTabsComponent(props) {
  function callback(key) {
    console.log(key);
  }
  let [collapsed, setCollapsed] = useState(false);
  const { chat, surveys, games, attendees } = props;
  return (
    <div className='zoom-collapsed'>
      <Button onClick={() => setCollapsed(collapsed === false ? true : false)} className='zoom-collapsed_button'>
        {React.createElement(collapsed ? RightOutlined : LeftOutlined, {
          className: 'trigger',
          onClick: () => setCollapsed(collapsed === false ? true : false),
        })}
      </Button>
      {collapsed === true ? (
        <div className='zoom-collapsed_tabs'>
          <Tabs defaultActiveKey='1' onChange={callback}>
            {games && (
              <TabPane tab={<BuildOutlined style={{ fontSize: '26px' }} />} key='1'>
                <ListadoJuegos {...props} />
              </TabPane>
            )}
            {chat && (
              <TabPane tab={<CommentOutlined style={{ fontSize: '26px' }} />} key='2'>
                <LiveChat {...props} />
              </TabPane>
            )}
            {surveys && (
              <TabPane tab={<PieChartOutlined style={{ fontSize: '26px' }} />} key='3'>
                <Row justify='space-between'>
                  <Col span={4}>
                    <ArrowLeftOutlined onClick={() => props.changeContentDisplayed('conference')} />
                  </Col>
                  <Col span={14}>
                    <h2 style={{ fontWeight: '700' }}> Volver a la Conferencia </h2>
                  </Col>
                  <Col span={4}>
                    <VideoCameraOutlined />
                  </Col>
                </Row>
                <Card
                  hoverable
                  onClick={() => props.changeContentDisplayed('surveys')}
                  style={{ cursor: 'pointer', marginTop: '12px' }}>
                  <Row justify='space-between'>
                    <Col span={6}>
                      <Avatar size={38} icon={<PieChartOutlined />} style={{ backgroundColor: '#87d068' }} />
                    </Col>
                    <Col span={18}>
                      <h2 style={{ fontWeight: '700' }}>Ir a encuestas</h2>
                    </Col>
                  </Row>
                </Card>
              </TabPane>
            )}
            {attendees && (
              <TabPane tab={<TeamOutlined style={{ fontSize: '26px' }} />} key='4'>
                Asistentes
              </TabPane>
            )}
          </Tabs>
        </div>
      ) : (
        <Menu defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} mode='inline'>
          {games && <Menu.Item key='game' icon={<BuildOutlined style={{ fontSize: '21px' }} />} />}
          {chat && <Menu.Item key='chat' icon={<CommentOutlined style={{ fontSize: '21px' }} />}></Menu.Item>}
          {surveys && <Menu.Item key='surveys' icon={<PieChartOutlined style={{ fontSize: '21px' }} />}></Menu.Item>}
          {attendees && <Menu.Item key='atteendes' icon={<TeamOutlined style={{ fontSize: '21px' }} />}></Menu.Item>}
        </Menu>
      )}
    </div>
  );
}
