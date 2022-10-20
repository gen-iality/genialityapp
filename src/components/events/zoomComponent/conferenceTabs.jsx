import { useState, createElement } from 'react';
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
import ListadoJuegos from './listadoJuegos';
import LiveChat from './liveChat';
import RankingTrivia from './rankingTrivia';

const { TabPane } = Tabs;

export default function ConferenceTabsComponent(props) {
  const [collapsed, setCollapsed] = useState(false);

  function callback(key) {
    props.handleActiveTab(key);
  }

  function handleClick(key) {
    props.handleActiveTab(key);
  }

  const { chat, surveys, games, attendees, activeTab } = props;
  return (
    <div className='zoom-collapsed'>
      <Button onClick={() => setCollapsed(collapsed === false ? true : false)} className='zoom-collapsed_button'>
        {createElement(collapsed ? RightOutlined : LeftOutlined, {
          className: 'trigger',
          onClick: () => setCollapsed(collapsed === false ? true : false),
        })}
      </Button>
      {collapsed === false ? (
        <div className='zoom-collapsed_tabs'>
          <Tabs defaultActiveKey={activeTab} activeKey={activeTab} onChange={callback}>
            {chat && (
              <TabPane
                tab={
                  <>
                    <CommentOutlined style={{ fontSize: '26px', textAlign: 'center' }} />
                    <p style={{ marginBottom: '0px' }}>Chat</p>
                  </>
                }
                key='chat'>
                <LiveChat {...props} />
              </TabPane>
            )}

            {attendees && (
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
            )}
            {games && (
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
              onClick={() => {
                setCollapsed(collapsed === false ? true : false);
                handleClick('chat');
              }}
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
              onClick={() => {
                setCollapsed(collapsed === false ? true : false);
                handleClick('surveys');
              }}
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
              onClick={() => {
                setCollapsed(collapsed === false ? true : false);
                handleClick('attendees');
              }}
            />
          )}
          {games && (
            <Menu.Item
              key='game'
              icon={
                <Tooltip placement='leftTop' title='Games'>
                  <BuildOutlined
                    style={{ fontSize: '21px' }}
                    onClick={() => {
                      setCollapsed(collapsed === false ? true : false);
                      handleClick('games');
                    }}
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
