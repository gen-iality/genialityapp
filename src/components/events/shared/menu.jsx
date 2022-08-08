import { Fragment, useState } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Col, Divider, Menu, Row } from 'antd';
import { EventsApi } from '../../../helpers/request';
import { useEffect } from 'react';
import { MenuItems } from './utils';
import { ApartmentOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { imageUtils } from '../../../Utilities/ImageUtils';
import OpenInNewIcon from '@2fd/ant-design-icons/lib/OpenInNew';

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
    collapsed: true,
    organizationId: '',
  });

  const eventId = props.match.params.event;

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
  // cosole.log('Test request');
  return (
    <Menu
      // defaultOpenKeys={['main']}
      mode='vertical'
      theme='dark'
      style={{
        overflow: 'auto',
        background: '#1B1E28',
      }}
      inlineCollapsed={props.collapsed}>
      <div style={{ textAlign: 'end', marginBottom: '15px', marginTop: '15px' }}>
        <Button
          type='primary'
          onClick={props.collapseMenu}
          style={{ width: '100%', textAlign: 'end', background: '#1B1E28', border: 'none' }}>
          {props.collapsed ? (
            <RightOutlined style={{ fontSize: '20px' }} />
          ) : (
            <LeftOutlined style={{ fontSize: '20px' }} />
          )}
        </Button>
      </div>

      <Row justify='center' style={{ textAlign: 'center' }}>
        <Col span={24}>
          <img
            style={{
              width: '80%',
              marginBottom: '15px',
            }}
            src={`${import.meta.env.VITE_LOGO_SVG_DARK}`}
          />
        </Col>
        <Col span={24}>
          <Button
            icon={props.collapsed ? <OpenInNewIcon /> : ''}
            type='primary'
            size='middle'
            target='_blank'
            href={`${window.location.origin}/landing/${eventId}`}>
            {props.collapsed ? '' : 'Ir al evento'}
          </Button>
        </Col>
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
