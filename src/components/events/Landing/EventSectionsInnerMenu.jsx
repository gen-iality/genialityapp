import React from 'react';
import { Layout, Spin, Avatar, Row } from 'antd';
import { imageCenter } from './helpers/csshelpers';
import { useRouteMatch } from 'react-router-dom';
import MenuEvent from './Menus/MenuEvent';
const { Sider } = Layout;

const EventSectionsInnerMenu = ({ event }) => {
  console.log('render', event);
  let { url } = useRouteMatch();
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
            {event.styles && (
              <Avatar
                size={64}
                icon={
                  <img
                    src={event.styles.event_image}
                    style={(imageCenter, { backgroundColor: event.styles.toolbarDefaultBg })}
                  />
                }
              />
            )}
          </Row>
          <div className='items-menu_Landing'>
            <MenuEvent event={event} />
          </div>
        </Sider>
      </div>
    </>
  );
};
export default EventSectionsInnerMenu;
