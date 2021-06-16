import React, { useState } from 'react';
import { Button, Drawer, Row, Avatar } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { drawerButton, imageCenter } from '../helpers/csshelpers';
import MenuEvent from './MenuEvent';
const MenuTablets = (props) => {
  const [isOpen, setisOpen] = useState(false);

  return (
    <>
      <div className='hiddenMenuMobile_Landing'>
        <Button onClick={() => setisOpen(!isOpen)} block style={drawerButton}>
          <MenuOutlined style={{ fontSize: '15px' }} />
          <div>Menu</div>
        </Button>
      </div>

      <Drawer
        title={props.event.name}
        placement='left'
        closable={false}
        onClose={() => setisOpen(!isOpen)}
        visible={isOpen}
        maskClosable={true}
        bodyStyle={{
          padding: '0px',
          backgroundColor:
            props.event.styles && props.event.styles.toolbarDefaultBg ? props.event.styles.toolbarDefaultBg : 'white',
        }}>
        <Row justify='center'>
          {props.event.styles && (
            <Avatar size={64} icon={<img src={props.event.styles.event_image} style={imageCenter} />} />
          )}
        </Row>

        <MenuEvent event={props.event} isMobile={true} />

        {/* <MenuEvent
          notifications={props.totalNotficationsN}
          eventId={props.event._id}
          user={props.cUser}
          itemsMenu={props.event.itemsMenu}
          showSection={props.showSection}
          styleText={props.event.styles && props.event.styles.textMenu ? props.event.styles.textMenu : '#222222'}
        /> */}
      </Drawer>
    </>
  );
};

export default MenuTablets;
