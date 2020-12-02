import React, { useState } from 'react';
import { Tabs, Button, Menu, Row, Col, Card, Avatar, Tooltip } from 'antd';
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
    props.handleActiveTab(key);
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
          <Tabs defaultActiveKey={props.activeTab} activeKey={props.activeTab} onChange={callback}>
            {chat && (
              <TabPane tab={<><CommentOutlined style={{fontSize:'26px', textAlign:'center'}}/><p style={{marginBottom:'0px'}}>Chat</p></>} key='chat'>
                <LiveChat {...props} />
              </TabPane>
            )}
            {surveys && (
              <TabPane tab={<><PieChartOutlined style={{fontSize:'26px', textAlign:'center'}}/><p style={{marginBottom:'0px'}}>Encuestas</p></>} key='surveys'>
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
              <TabPane tab={<><TeamOutlined style={{fontSize:'26px', textAlign:'center'}}/><p style={{marginBottom:'0px'}}>Asistentes</p></>} key='attendees'>
                Asistentes
              </TabPane>
            )}
            {games && (
              <TabPane tab={<><BuildOutlined style={{fontSize:'26px', textAlign:'center'}}/><p style={{marginBottom:'0px'}}>Juegos</p></>} key='games'>
                <ListadoJuegos {...props} />
              </TabPane>
            )}
          </Tabs>
        </div>
      ) : (
        <Menu>
          {chat && (
            <Menu.Item
              key='chat'
              icon={
                <Tooltip placement='leftTop' title='Chat'>
                  <CommentOutlined style={{ fontSize: '21px' }} />
                </Tooltip>
              }
              onClick={() => setCollapsed(collapsed === false ? true : false)}
            />
          )}
          {surveys && (
            <Menu.Item
              key='surveys'
              icon={
                <Tooltip placement='leftTop' title='Surveys'>
                  <PieChartOutlined style={{ fontSize: '21px' }} />
                </Tooltip>
              }
              onClick={() => setCollapsed(collapsed === false ? true : false)}
            />
          )}
          {attendees && (
            <Menu.Item
              key='atteendes'
              icon={
                <Tooltip placement='leftTop' title='Atteendes'>
                  <TeamOutlined style={{ fontSize: '21px' }} />
                </Tooltip>
              }
              onClick={() => setCollapsed(collapsed === false ? true : false)}
            />
          )}
          {games && (
            <Menu.Item
              key='game'
              icon={
                <Tooltip placement='leftTop' title='Games'>
                  <BuildOutlined
                    style={{ fontSize: '21px' }}
                    onClick={() => setCollapsed(collapsed === false ? true : false)}
                  />
                </Tooltip>
              }
            />
          )}
        </Menu>
      )}
    </div>
  );
}
