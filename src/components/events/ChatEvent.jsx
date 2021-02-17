import React, { useState, useEffect } from 'react';
import { Tabs, Button, Menu, Row, Col, Tooltip } from 'antd';
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


const { TabPane } = Tabs;

export default function ChatEvent(){
  let [collapsed, setCollapsed] = useState(false);


  return (
    <div className='zoom-collapsed'>
      <Button onClick={() => setCollapsed(collapsed === false ? true : false)} className='zoom-collapsed_button'>
        {React.createElement(collapsed ? RightOutlined : LeftOutlined, {
          className: 'trigger',
          onClick: () => setCollapsed(collapsed === false ? true : false),
        })}
      </Button>
      {collapsed === false ? (
        <div className='zoom-collapsed_tabs'>
          <Tabs>
              <TabPane
                tab={
                  <>
                    <CommentOutlined style={{ fontSize: '26px', textAlign: 'center' }} />
                    <p style={{ marginBottom: '0px' }}>Chat</p>
                  </>
                }
                key='chat'>

              </TabPane>
              <TabPane
                tab={
                  <>
                    <PieChartOutlined style={{ fontSize: '26px', textAlign: 'center' }} />
                    <p style={{ marginBottom: '0px' }}>Encuestas</p>
                  </>
                }
                key='surveys'>
              </TabPane>
              <TabPane
                tab={
                  <>
                    <TeamOutlined style={{ fontSize: '26px', textAlign: 'center' }} />
                    <p style={{ marginBottom: '0px' }}>Asistentes</p>
                  </>
                }
                key='attendees'>
                Asistentes
              </TabPane>
              <TabPane
                tab={
                  <>
                    <img
                      src='https://cdn0.iconfinder.com/data/icons/gaming-console/128/2-512.png'
                      style={{ width: '32px' }}
                      alt='Games'
                    />
                    <p style={{ marginBottom: '0px' }}>Juego</p>
                  </>
                }
                key='games'>
              </TabPane>
          </Tabs>
        </div>
      ) : (
        <Menu>
            <Menu.Item
              key='chat'
              icon={
                <Tooltip placement='leftTop' title='Chat'>
                  <CommentOutlined style={{ fontSize: '21px' }} />
                </Tooltip>
              }
              onClick={() => {
                setCollapsed(collapsed === false ? true : false);
              }}
            />
            <Menu.Item
              key='surveys'
              icon={
                <Tooltip placement='leftTop' title='Surveys'>
                  <PieChartOutlined style={{ fontSize: '21px' }} />
                </Tooltip>
              }
              onClick={() => {
                setCollapsed(collapsed === false ? true : false);
              }}
            />
            <Menu.Item
              key='atteendes'
              icon={
                <Tooltip placement='leftTop' title='Atteendes'>
                  <TeamOutlined style={{ fontSize: '21px' }} />
                </Tooltip>
              }
              onClick={() => {
                setCollapsed(collapsed === false ? true : false);
              }}
            />
          
            <Menu.Item
              key='game'
              icon={
                <Tooltip placement='leftTop' title='Games'>
                  <BuildOutlined
                    style={{ fontSize: '21px' }}
                    onClick={() => {
                      setCollapsed(collapsed === false ? true : false);
                    }}
                  />
                </Tooltip>
              }
            />
        </Menu>
      )}
    </div>
  );
}
