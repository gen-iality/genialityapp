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
            {attendees && (
              <TabPane tab={<PieChartOutlined style={{ fontSize: '26px' }} />} key='3'>
                Asistentes
              </TabPane>
            )}
            {surveys && (
              <TabPane tab={<TeamOutlined style={{ fontSize: '26px' }} />} key='4'>
                Encuestas
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
