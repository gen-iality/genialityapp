import React, { useState } from 'react';
import { Button, Drawer, Row, Avatar } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { drawerButton, imageCenter } from '../helpers/csshelpers';
import { UseEventContext } from '../../../../Context/eventContext';
import MenuEvent from './MenuEvent';
const MenuTablets = () => {
  const [isOpen, setisOpen] = useState(false);
  let cEvent = UseEventContext();

  return (
    <>
      <div className='hiddenMenuMobile_Landing'>
        <Button onClick={() => setisOpen(!isOpen)} block style={drawerButton}>
          <MenuOutlined style={{ fontSize: '15px' }} />
          <div>Menu</div>
        </Button>
      </div>

      <Drawer
        title={cEvent.value.name}
        placement='left'
        closable={false}
        onClose={() => setisOpen(!isOpen)}
        visible={isOpen}
        maskClosable={true}
        bodyStyle={{
          padding: '0px',
          backgroundColor:
            cEvent.value.styles && cEvent.value.styles.toolbarDefaultBg
              ? cEvent.value.styles.toolbarDefaultBg
              : 'white',
        }}>
        <Row justify='center'>
          {cEvent.value.styles && (
            <Avatar size={64} icon={<img src={cEvent.value.styles.event_image} style={imageCenter} />} />
          )}
        </Row>

        <MenuEvent isMobile={true} />
      </Drawer>
    </>
  );
};

export default MenuTablets;
