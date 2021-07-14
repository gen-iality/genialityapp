import React from 'react';
import { Menu } from 'antd';
import { useRouteMatch, Link } from 'react-router-dom';
import * as iconComponents from '@ant-design/icons';
import { stylesMenuItems } from '../helpers/csshelpers';
import {UseEventContext} from '../../../../Context/eventContext'

const MenuEvent = ({isMobile }) => {
  let { url } = useRouteMatch();
  let cEvent = UseEventContext();
  let event = cEvent.value;


  return (
    <>
      {!isMobile ? (
        <Menu style={stylesMenuItems} mode='inline' defaultSelectedKeys={['1']}>
          {Object.keys(event.itemsMenu).map((key) => {
            //icono personalizado
            let IconoComponente = iconComponents[event.itemsMenu[key].icon];
            return (
              <Menu.Item
                style={{ position: 'relative', color: event.styles.textMenu }}
                key={event.itemsMenu[key].section}
                className='MenuItem_event'>
                <IconoComponente style={{ margin: '0 auto', fontSize: '22px', color: event.styles.textMenu }} />

                <Link
                  className='menuEvent_section-text'
                  style={{ color: event.styles.textMenu }}
                  to={`${url}/${event.itemsMenu[key].section}`}>
                  {` ${event.itemsMenu[key].name}`}
                </Link>
              </Menu.Item>
            );
          })}
        </Menu>
      ) : (
        isMobile && (
          <Menu style={stylesMenuItems} mode='vertical' defaultSelectedKeys={['1']}>
            {Object.keys(event.itemsMenu).map((key) => {
              //icono personalizado
              let IconoComponente = iconComponents[event.itemsMenu[key].icon];
              return (
                <Menu.Item
                  style={{ position: 'relative', color: event.styles.textMenu }}
                  key={event.itemsMenu[key].section}
                  className='MenuItem_event'>
                  <IconoComponente style={{ margin: '0 auto', fontSize: '22px', color: event.styles.textMenu }} />

                  <Link
                    className='menuEvent_section-text'
                    style={{ color: event.styles.textMenu }}
                    to={`${url}/${event.itemsMenu[key].section}`}>
                    {` ${event.itemsMenu[key].name}`}
                  </Link>
                </Menu.Item>
              );
            })}
          </Menu>
        )
      )}
    </>
  );
};

export default MenuEvent;
