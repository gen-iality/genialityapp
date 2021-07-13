import React, { useState } from 'react';
import { Button, Badge, Drawer } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import SocialZone from '../../../socialZone/socialZone';
import { UseEventContext } from '../../../../Context/eventContext';

const MenuTabletsSocialZone = (props) => {
  const [isDrawerVisible, setisDrawerVisible] = useState(false);
  let [optionselected, setOptionselected] = useState(1);
  let cEvent = UseEventContext();

  return (
    <>
      <div className='chat-evius_mobile  animate__animated animate__pulse animate__slower animate__infinite'>
        <Button
          style={{ backgroundColor: cEvent.value.styles.toolbarDefaultBg }}
          shape='circle'
          icon={
            <Badge count={props.totalNewMessages}>
              <MessageOutlined style={{ fontSize: '20px', color: cEvent.value.styles.textMenu }} />
            </Badge>
          }
          size='large'
          onClick={() => setisDrawerVisible(!isDrawerVisible)}></Button>
      </div>

      <Drawer
       bodyStyle={{ backgroundColor: cEvent.value.styles.toolbarDefaultBg }}
        height={450}
        placement='bottom'
        closable={true}
        onClose={() => setisDrawerVisible(!isDrawerVisible)}
        visible={isDrawerVisible}
        maskClosable={true}
        className='drawerMobile'>
        <SocialZone
          totalMessages={props.totalNewMessages}
          optionselected={optionselected}
          tab={1}
          generalTabs={props.generalTabs}
          notNewMessages={props.notNewMessage}
          tabselected={props.tabselected}
          settabselected={props.settabselected}
        />
      </Drawer>
    </>
  );
};

export default MenuTabletsSocialZone;
