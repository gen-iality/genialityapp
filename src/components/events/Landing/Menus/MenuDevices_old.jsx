import React from 'react';
import { Layout } from 'antd';
import { imageCenter } from '../helpers/csshelpers';
import MenuEvent from '../../menuEvent_old';
const { Sider } = Layout;

const MenuDevices = (props) => {
  return (
    <div className='hiddenMenu_Landing'>
      <Sider
        className='containerMenu_Landing'
        style={{
          backgroundColor:
            props.cEvent.styles && props.cEvent.styles.toolbarDefaultBg
              ? props.cEvent.styles.toolbarDefaultBg
              : 'white',
        }}
        trigger={null}
        width={110}>
        <div className='items-menu_Landing '>
          {props.cEvent.styles && <img src={props.cEvent.styles.event_image} style={imageCenter} />}
          <MenuEvent
            itemsMenu={props.cEvent.itemsMenu}
            user={props.cUser}
            eventId={props.cEvent._id}
            showSection={props.showSection}
            collapsed={props.collapsed}
            styleText={props.cEvent.styles && props.cEvent.styles.textMenu ? props.cEvent.styles.textMenu : '#222222'}
          />
        </div>
      </Sider>
    </div>
  );
};

export default MenuDevices;
