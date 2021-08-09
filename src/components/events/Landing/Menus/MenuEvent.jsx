import React, { useContext } from 'react';
import { Badge, Col, Menu, Row } from 'antd';
import { useRouteMatch, Link } from 'react-router-dom';
import * as iconComponents from '@ant-design/icons';
import { stylesMenuItems } from '../helpers/csshelpers';
import {UseEventContext} from '../../../../Context/eventContext'
import { HelperContext } from '../../../../Context/HelperContext';


const MenuEvent = ({isMobile }) => {
  let { url } = useRouteMatch();
  let cEvent = UseEventContext();
  let { totalsolicitudes } = useContext(HelperContext);
  

  let event = cEvent.value;
  


  return (
    <>
      {!isMobile ? (
        <Menu style={stylesMenuItems} mode='inline' defaultSelectedKeys={['1']}>
          {Object.keys(event.itemsMenu).map((key) => {
            //icono personalizado
            let IconoComponente = iconComponents[event.itemsMenu[key].icon];
            {console.log("MENU ITEM")}
            {console.log(event.itemsMenu)}
          return(
             key=='networking'? ( 
               
               <Menu.Item
                style={{ position: 'relative', color: event.styles.textMenu }}
                key={event.itemsMenu[key].section}
                className='MenuItem_event'>
                  <Badge  count={totalsolicitudes}>
                <Col>
                <Row><IconoComponente style={{ margin: '0 auto', fontSize: '22px', color: event.styles.textMenu }} />   </Row>             
               <Row><Link
                  className='menuEvent_section-text'
                  style={{ color: event.styles.textMenu }}
                  to={`${url}/${event.itemsMenu[key].section}`}>
                  {` ${event.itemsMenu[key].name}`}
                </Link>
                </Row>
                </Col>
                </Badge>
              </Menu.Item>
             ):
             key !=='networking' &&(
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
              </Menu.Item>))
            
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
