import React from 'react';
import { Layout, Drawer, Button, Col, Row, Badge, notification, message } from 'antd';
import { MenuUnfoldOutlined, MessageOutlined } from '@ant-design/icons';
import SocialZone from '../../socialZone/socialZone';
import MenuRigth from './Menus/MenuRigth';
const { Sider } = Layout;
const InteractiveZone = () => {
  return (
    <>
      {/* aqui esta el boton del chat mobile */}
      <div className='chat-evius_mobile'>
        <Button
          shape='circle'
          icon={
            <Badge count={this.state.totalNewMessages}>
              <MessageOutlined style={{ fontSize: '20px' }} />
            </Badge>
          }
          size='large'
          onClick={this.showDrawerMobile}
          style={this.state.visibleChat == true ? { display: 'none' } : {}}></Button>
      </div>
      <Drawer
        height={450}
        placement={this.state.placementBottom}
        closable={true}
        onClose={this.onClose}
        visible={this.state.visibleChat}
        maskClosable={true}
        className='drawerMobile'>
        <SocialZone
          updateChat={this.state.updateChat}
          collapse={this.state.collapsed}
          totalMessages={this.state.totalNewMessages}
          agendarCita={this.AgendarCita}
          loadDataUser={this.loadDataUser}
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
        />
      </Drawer>
      {/* aqui empieza el chat del evento desktop */}
      {(this.state.generalTabs?.attendees ||
        this.state.generalTabs?.publicChat ||
        this.state.generalTabs?.privateChat) && (
        <Sider
          className='collapse-chatEvent'
          style={{ backgroundColor: this.props.cEvent.styles?.toolbarMenuSocial }}
          trigger={null}
          theme='light'
          collapsible
          collapsed={this.state.collapsed}
          width={400}>
          <div className='Chat-Event'>
            {this.state.collapsed ? (
              <>
                {/* MENU DERECHO */}
                <MenuRigth state={this.state} toggleCollapsed={this.toggleCollapsed} />
              </>
            ) : (
              <>
                <Button type='link' onClick={this.toggleCollapsed}>
                  <MenuUnfoldOutlined style={{ fontSize: '24px' }} />
                </Button>

                <SocialZone
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
                />
              </>
            )}
          </div>
        </Sider>
      )}
    </>
  );
};

export default InteractiveZone;
