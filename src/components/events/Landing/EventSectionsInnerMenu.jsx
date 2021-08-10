import React from 'react';
import { Layout, Spin, Avatar, Row, Image } from 'antd';
import { imageCenter } from './helpers/csshelpers';
import MenuEvent from './Menus/MenuEvent';
import { EyeOutlined } from '@ant-design/icons';
import { UseEventContext } from '../../../Context/eventContext';
const { Sider } = Layout;

const EventSectionsInnerMenu = () => {
  let cEvent = UseEventContext();
  let event = cEvent.value;

  if (!event) return <Spin size='small' />;
  return (
    <>
      <div className='hiddenMenu_Landing'>
        <Sider
          className='containerMenu_Landing'
          style={{
            backgroundColor: event.styles && event.styles.toolbarDefaultBg ? event.styles.toolbarDefaultBg : 'white',
          }}
          trigger={null}
          width={110}>
          <Row justify='center' style={{ margin: 5 }}>
            {event.styles && event.styles.event_image && (
              <Image
                preview={{ mask: <EyeOutlined /> }}
                alt='Logo'
                src={event.styles.event_image}
                style={{ backgroundColor: event.styles.toolbarDefaultBg, objectFit: 'cover' }}
              />
            )}
          </Row>
          <div className='items-menu_Landing'>
            <MenuEvent />
          </div>
        </Sider>
      </div>
    </>
  );
};
export default EventSectionsInnerMenu;
