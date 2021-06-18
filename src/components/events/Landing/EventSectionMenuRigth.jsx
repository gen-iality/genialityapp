import React, { useState, useEffect } from 'react';
import { Layout, Button } from 'antd';
import { MenuUnfoldOutlined, ArrowRightOutlined } from '@ant-design/icons';
import MenuRigth from './Menus/MenuRigth';
const { Sider } = Layout;
const EventSectionMenuRigth = (props) => {
  const [isCollapsed, setisCollapsed] = useState(true);

  function handleCollapsed() {
    setisCollapsed(!isCollapsed);
  }

  console.log('propsaja', props);

  return (
    <Sider
      className='collapse-chatEvent'
      style={{ backgroundColor: props.event.styles.toolbarDefaultBg }}
      trigger={null}
      width={400}
      collapsed={isCollapsed}>
      <div className='Chat-Event'>
        {isCollapsed ? (
          <>
            <MenuRigth
              event={props.event}
              handleCollapsed={handleCollapsed}
              currentActivity={props.currentActivity}
              tabs={props.tabs}
              generalTabs={props.generalTabs}
            />
          </>
        ) : (
          <>
            <Button
              className='animate__animated animate__headShake animate__slower animate__infinite'
              type='link'
              onClick={handleCollapsed}>
              <ArrowRightOutlined style={{ fontSize: '24px', color: props.event.styles.textMenu }} />
            </Button>

            {/* <SocialZone
              updateChat={this.state.updateChat}
              collapse={this.state.collapsed}
              totalMessages={this.state.totalNewMessages}
              loadDataUser={this.loadDataUser}
              agendarCita={this.AgendarCita}
              obtenerPerfil={this.obtenerUserPerfil}
              notificacion={this.addNotification}
              sendFriendship={this.SendFriendship}
              perfil={this.collapsePerfil}
              tcollapse={this.toggleCollapsed}
              optionselected={this.updateOption}
              tab={this.state.tabSelected}
              section={this.state.section}
              containNetWorking={this.state.containNetWorking}
              eventSurveys={this.state.eventSurveys}
              generalTabs={this.state.generalTabs}
              publishedSurveys={this.state.publishedSurveys}
              notNewMessages={this.notNewMessage}
            /> */}
          </>
        )}
      </div>
    </Sider>
  );
};

export default EventSectionMenuRigth;
