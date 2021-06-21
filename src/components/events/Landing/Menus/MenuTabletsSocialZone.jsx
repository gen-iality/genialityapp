import React, { useState } from 'react';
import { Button, Badge, Drawer } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import SocialZone from '../../../socialZone/socialZone';
const MenuTabletsSocialZone = (props) => {
  const [isDrawerVisible, setisDrawerVisible] = useState(false);
  let [optionselected, setOptionselected] = useState(1);

  return (
    <>
      <div className='chat-evius_mobile  animate__animated animate__pulse animate__slower animate__infinite'>
        <Button
          style={{ backgroundColor: props.cEvent.styles.toolbarDefaultBg }}
          shape='circle'
          icon={
            <Badge count={props.totalNewMessages}>
              <MessageOutlined style={{ fontSize: '20px', color: props.cEvent.styles.textMenu }} />
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
        <SocialZone
          // updateChat={this.state.updateChat}
          // collapse={this.state.collapsed}
          totalMessages={props.totalNewMessages}
          // agendarCita={this.AgendarCita}
          // loadDataUser={this.loadDataUser}
          // obtenerPerfil={this.obtenerUserPerfil}
          // notificacion={this.addNotification}
          // sendFriendship={this.SendFriendship}
          // perfil={this.collapsePerfil}
          // tcollapse={this.toggleCollapsed}
          optionselected={optionselected}
          tab={1}
          // section={this.state.section}
          // containNetWorking={this.state.containNetWorking}
          // eventSurveys={this.state.eventSurveys}
          generalTabs={props.generalTabs}
          // publishedSurveys={this.state.publishedSurveys}
          notNewMessages={props.notNewMessage}
          cEvent={props.cEvent}
          cUser={props.cUser}
          tabselected={props.tabselected}
          settabselected={props.settabselected}
        />
      </Drawer>
    </>
  );
};

export default MenuTabletsSocialZone;
