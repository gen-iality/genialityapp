import React from 'react';
import { Button, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { drawerButton, imageCenter } from '../helpers/csshelpers';
import MenuEvent from '../../menuEvent';
const MenuTablets = (props) => {
  return (
    <>
      {/* Boton que abre el menu para dispositivos > tablet  */}
      <div className='hiddenMenu_Landing'></div>

      {/*Aqui empieza el menu para dispositivos < tablet*/}
      <div className='hiddenMenuMobile_Landing'>
        <Button block style={drawerButton} onClick={props.showDrawer}>
          <MenuOutlined style={{ fontSize: '15px' }} />
          <div>Menu</div>
        </Button>
      </div>
      <Drawer
        title={props.cEvent.name}
        placement={props.placement}
        closable={true}
        onClose={props.onClose}
        visible={props.visible}
        maskClosable={true}
        bodyStyle={{
          padding: '0px',
          backgroundColor:
            props.cEvent.styles && props.cEvent.styles.toolbarDefaultBg
              ? props.cEvent.styles.toolbarDefaultBg
              : 'white',
        }}>
        {props.cEvent.styles && <img src={props.cEvent.styles.event_image} style={imageCenter} />}
        <MenuEvent
          notifications={props.totalNotficationsN}
          eventId={props.cEvent._id}
          user={props.cUser}
          itemsMenu={props.cEvent.itemsMenu}
          showSection={props.showSection}
          styleText={props.cEvent.styles && props.cEvent.styles.textMenu ? props.cEvent.styles.textMenu : '#222222'}
        />
      </Drawer>
    </>
  );
};

export default MenuTablets;
