import React, { Fragment, useState } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Divider, Menu, Row } from 'antd';
import { EventsApi } from '../../../helpers/request';
import { useEffect } from 'react';
import { MenuItems } from './utils';
import { ApartmentOutlined } from '@ant-design/icons';
import EviusLogo from '././../../../eviuslogo.png';

const { SubMenu } = Menu;

const MenuConfig = (props) => {
  const [controller, setcontroller] = useState({
    contentTab: true,
    generalTab: false,
    peopleTab: true,
    commTab: true,
    checkInTab: true,
    ticketTab: true,
    stylesTab: true,
    guestTab: true,
    url: window.location.href,
    collapsed: false,
    organizationId: '',
  });

  const eventOrganization = async (eventId) => {
    const currentEvent = await EventsApi.getOne(eventId);
    const organizationId = currentEvent.organizer_id;
    setcontroller({ ...controller, organizationId });
  };

  useEffect(() => {
    const { pathname } = props.location;
    const splitted = pathname.split('/');
    eventOrganization(splitted[2]);
  }, []);

  const handleClick = (e) => {
    if (!navigator.onLine) e.preventDefault();
  };

  return (
    <Fragment>
      <Menu
        defaultSelectedKeys={['datos-evento']}
        defaultOpenKeys={['main']}
        theme='dark'
        style={{
          overflow: 'auto',
          background: '#1B1E28',
        }}
        inlineCollapsed={controller.collapsed}>
        <Row justify='center' style={{ padding: 10 }}>
          <img
            style={{
              width: '50%',
            }}
            src={EviusLogo}
          />
          <Divider style={{ background: 'gray' }} />
        </Row>
        {renderMenuItems(controller, props)}

        <SubMenu
          key='sub9'
          title={
            <span>
              <ApartmentOutlined />
              <span>Administrar organizaciones</span>
            </span>
          }>
          <Menu.Item key='30'>
            Panel de administración
            <NavLink onClick={handleClick} to={`/admin/organization/${controller.organizationId}`}></NavLink>
          </Menu.Item>
        </SubMenu>
      </Menu>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  permissions: state.permissions,
});

const renderMenuItems = (controller, props) => {
  return (
    <>
      {MenuItems.map((item, index) => {
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                {item.icon}
                <span>{item.name}</span>
              </span>
            }>
            {item.items.map((subItem) => (
              <Menu.Item key={subItem.key}>
                <NavLink to={props.match.url + subItem.path}>{subItem.name}</NavLink>
              </Menu.Item>
            ))}
          </SubMenu>
        );
      })}
    </>
  );
};

export default connect(mapStateToProps)(withRouter(MenuConfig));
