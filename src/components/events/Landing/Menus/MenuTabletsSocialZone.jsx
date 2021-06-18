import React, { useState } from 'react';
import { Button, Badge, Drawer } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
const MenuTabletsSocialZone = (props) => {
  const [isDrawerVisible, setisDrawerVisible] = useState(false);
  return (
    <>
      <div className='chat-evius_mobile'>
        <Button
          shape='circle'
          icon={
            <Badge count={props.totalNewMessages}>
              <MessageOutlined style={{ fontSize: '20px' }} />
            </Badge>
          }
          size='large'
          onClick={() => setisDrawerVisible(!isDrawerVisible)}
          // style={this.state.visibleChat == true ? { display: 'none' } : {}}
        ></Button>
      </div>

      <Drawer
        height={450}
        placement='bottom'
        closable={true}
        onClose={() => setisDrawerVisible(!isDrawerVisible)}
        visible={isDrawerVisible}
        maskClosable={true}
        className='drawerMobile'>
        {/* <SocialZone
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
          notNewMessages={this.notNewMessage}
        /> */}
      </Drawer>
    </>
  );
};

export default MenuTabletsSocialZone;
