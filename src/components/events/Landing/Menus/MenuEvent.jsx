import React, { useContext } from 'react';
import { Badge, Col, Menu, Row } from 'antd';
import { useRouteMatch, Link } from 'react-router-dom';
import * as iconComponents from '@ant-design/icons';
import { stylesMenuItems } from '../helpers/csshelpers';
import { UseEventContext } from '../../../../Context/eventContext';
import { HelperContext } from '../../../../Context/HelperContext';
import { UseUserEvent } from '../../../../Context/eventUserContext';
import { setSectionPermissions } from '../../../../redux/sectionPermissions/actions';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { UseCurrentUser } from '../../../../Context/userContext';

const MenuEvent = ({ isMobile, sectionPermissions, setSectionPermissions }) => {
  let { url } = useRouteMatch();
  let cEvent = UseEventContext();
  let cUser=UseCurrentUser();
  let { totalsolicitudes } = useContext(HelperContext);
  let event = cEvent.value;
  let cEventUser = UseUserEvent();

  const isVisibleSection=(section)=>{
    if((section.permissions && section.permissions=='public') || (section.permissions && section.permissions=='assistants')&& cUser.value!=null) {
      return true;
    }
    return false;
  }

  return (
    <>
      {!isMobile ? (
        <Menu style={stylesMenuItems} mode='inline' defaultSelectedKeys={['1']}>
          {event.itemsMenu &&
            Object.keys(event.itemsMenu).map((key) => {
              //icono personalizado
              let IconoComponente = iconComponents[event.itemsMenu[key].icon];

              return key == 'networking' ? (
                <Menu.Item
                  style={{ position: 'relative', color: event.styles.textMenu }}
                  key={event.itemsMenu[key].section}
                  className='MenuItem_event'>
                  <Badge key={event.itemsMenu[key].section} count={totalsolicitudes}>
                    <Col key={event.itemsMenu[key].section}>
                      <Row key={event.itemsMenu[key].section}>
                        <IconoComponente style={{ margin: '0 auto', fontSize: '22px', color: event.styles.textMenu }} />{' '}
                      </Row>
                      <Row key={event.itemsMenu[key].section}>
                        {event.itemsMenu[key].permissions == 'assistants' && cEventUser.value == null ? (
                          <Link
                            onClick={() => setSectionPermissions({ view: true, section: event.itemsMenu[key].name })}
                            className='menuEvent_section-text'
                            style={{ color: event.styles.textMenu }}
                            to={`${url}/permissions`}>
                            {` ${event.itemsMenu[key].name}`}
                          </Link>
                        ) : (
                          <Link
                            onClick={() => setSectionPermissions({ view: true, section: event.itemsMenu[key].name })}
                            className='menuEvent_section-text'
                            style={{ color: event.styles.textMenu }}
                            to={`${url}/${event.itemsMenu[key].section}`}>
                            {` ${event.itemsMenu[key].name}`}
                          </Link>
                        )}
                      </Row>
                    </Col>
                  </Badge>
                </Menu.Item>
              ) : (
                key !== 'networking' && (
                  <Menu.Item
                    style={{ position: 'relative', color: event.styles.textMenu }}
                    key={event.itemsMenu[key].section}
                    className='MenuItem_event'>
                    <IconoComponente style={{ margin: '0 auto', fontSize: '22px', color: event.styles.textMenu }} />
                    {event.itemsMenu[key].permissions == 'assistants' && cEventUser.value == null ? (
                      <Link
                        onClick={() => setSectionPermissions({ view: true, section: event.itemsMenu[key].name })}
                        className='menuEvent_section-text'
                        style={{ color: event.styles.textMenu }}
                        to={`${url}/permissions`}>
                        {` ${event.itemsMenu[key].name}`}
                      </Link>
                    ) : (
                      <Link
                        onClick={() => setSectionPermissions({ view: true, section: event.itemsMenu[key].name })}
                        className='menuEvent_section-text'
                        style={{ color: event.styles.textMenu }}
                        to={`${url}/${event.itemsMenu[key].section}`}>
                        {` ${event.itemsMenu[key].name}`}
                      </Link>
                    )}
                  </Menu.Item>
                )
              );
            })}
        </Menu>
      ) : (
        isMobile && (
          <Menu style={stylesMenuItems} mode='vertical' defaultSelectedKeys={['1']}>
            {event.itemsMenu &&
              Object.keys(event.itemsMenu).map((key) => {
                //icono personalizado
                let IconoComponente = iconComponents[event.itemsMenu[key].icon];

                return (
                  <Menu.Item
                    style={{ position: 'relative', color: event.styles.textMenu }}
                    key={event.itemsMenu[key].section}
                    className='MenuItem_event'>
                    <IconoComponente style={{ margin: '0 auto', fontSize: '22px', color: event.styles.textMenu }} />

                    {event.itemsMenu[key].permissions == 'assistants' && cEventUser.value == null ? (
                      <Link
                        onClick={() => setSectionPermissions({ view: true, section: event.itemsMenu[key].name })}
                        className='menuEvent_section-text'
                        style={{ color: event.styles.textMenu }}
                        to={`${url}/permissions`}>
                        {` ${event.itemsMenu[key].name}`}
                      </Link>
                    ) : (
                      <Link
                        className='menuEvent_section-text'
                        style={{ color: event.styles.textMenu }}
                        to={`${url}/${event.itemsMenu[key].section}`}>
                        {` ${event.itemsMenu[key].name}`}
                      </Link>
                    )}
                  </Menu.Item>
                );
              })}
          </Menu>
        )
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  sectionPermissions: state.viewSectionPermissions,
});

const mapDispatchToProps = {
  setSectionPermissions,
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuEvent);
