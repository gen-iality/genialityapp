import React from 'react';
import { Layout, Spin, Menu } from 'antd';
import * as iconComponents from '@ant-design/icons';
import ScrollTo from 'react-scroll-into-view';
import { imageCenter, stylesMenuItems } from './helpers/csshelpers';
import { Link, useRouteMatch } from 'react-router-dom';
const { Sider } = Layout;

const EventSectionsInnerMenu = ({ event }) => {
  console.log('carajo', event);
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
          <div className='items-menu_Landing '>
            {event.styles && <img src={event.styles.event_image} style={imageCenter} />}

            <ScrollTo selector='#visualizar'>
              <Menu mode='inline' defaultSelectedKeys={['1']} style={stylesMenuItems}>
                {event.itemsMenu &&
                  Object.keys(event.itemsMenu).map((key) => {
                    if (event.itemsMenu[key] && event.itemsMenu[key].permissions == 'assistants' && !event.user) {
                      return null;
                    }

                    if (event.itemsMenu[key].section === 'login' && !event.isEnabledLogin) {
                      return null;
                    }

                    let IconoComponente = iconComponents[event.itemsMenu[key].icon];

                    return (
                      <Menu.Item
                        style={{ position: 'relative' }}
                        key={event.itemsMenu[key].section}
                        className='MenuItem_event'
                        onClick={() => event.showSection(event.itemsMenu[key].section)}>
                        <IconoComponente style={{ margin: '0 auto', fontSize: '22px', color: event.styles.textMenu }} />
                        <span className='menuEvent_section-text' style={{ color: event.styles.textMenu }}>
                          {` ${event.itemsMenu[key].name}`}
                        </span>
                      </Menu.Item>
                    );
                  })}
              </Menu>
            </ScrollTo>
          </div>
        </Sider>
      </div>

      {/* <h1>EVENTO: {event?._id}</h1>
      <ul>
        <li>
          <Link to={`${url}/documents`}>documents</Link>
        </li>
        <li>
          <Link to={`${url}/speakers`}>Speakers</Link>
        </li>
        <li>
          <Link to={`${url}/surveys`}>Surveys</Link>
        </li>
        <li>
          <Link to={`${url}/partners`}>Partners</Link>
        </li>
        <li>
          <Link to={`${url}/faqs`}>faqs</Link>
        </li>
        <li>
          <Link to={`${url}/certs`}>Certificates</Link>
        </li>
      </ul> */}
    </>
  );
};
export default EventSectionsInnerMenu;
