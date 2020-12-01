import React, { useState } from 'react';
import { Tabs, Row, Button, Menu } from 'antd';
import {
  CommentOutlined,
  PieChartOutlined,
  TeamOutlined,
  RightOutlined,
  LeftOutlined,
  BuildOutlined,
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
    <div style={{ position: 'relative' }}>
      <Button
        onClick={() => setCollapsed(collapsed === false ? true : false)}
        style={{ position: 'absolute', right: '103%' }}>
        {React.createElement(collapsed ? RightOutlined : LeftOutlined, {
          className: 'trigger',
          onClick: () => setCollapsed(collapsed === false ? true : false),
        })}
      </Button>
      {collapsed === true ? (
        <div style={{ padding: '7%' }}>
          <Tabs defaultActiveKey='1' onChange={callback}>
            {games && (
              <TabPane tab={<BuildOutlined />} key='1'>
                <ListadoJuegos {...props} />
              </TabPane>
            )}
            {chat && (
              <TabPane tab={<CommentOutlined />} key='2'>
                <LiveChat {...props} />
              </TabPane>
            )}
            {attendees && (
              <TabPane tab={<PieChartOutlined />} key='3'>
                Asistentes
              </TabPane>
            )}
            {surveys && (
              <TabPane tab={<TeamOutlined />} key='4'>
                Encuestas
              </TabPane>
            )}
          </Tabs>
        </div>
      ) : (
        <Menu defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} mode='inline'>
          {games && <Menu.Item key='game' icon={<BuildOutlined />} />}
          <Menu.Item key='chat' icon={<CommentOutlined />}></Menu.Item>
          <Menu.Item key='surveys' icon={<PieChartOutlined />}></Menu.Item>
          <Menu.Item key='atteendes' icon={<TeamOutlined />}></Menu.Item>
        </Menu>
      )}
    </div>
  );
}
