import React from 'react';
import { FormattedMessage } from 'react-intl';
import WithLoading from './withLoading';
import { Menu, Dropdown, Avatar, Button, Col, Row, Space } from 'antd';
import { DownOutlined, LogoutOutlined } from '@ant-design/icons';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setViewPerfil } from '../../redux/viewPerfil/actions';
import { EventsApi } from '../../helpers/request';
import { useEffect } from 'react';

const MenuStyle = {
  flex: 1,
  textAlign: 'right',
};

const ItemStyle = {
  backgroundColor: 'white',
  //border: '1px solid #cccccc',
  padding: 5,
  margin: 5,
};

let UserStatusAndMenu = (props) => {
  let user = props.user;
  let photo = props.photo;
  let name = props.name;
  let logout = props.logout;
  let eventId = props.eventId; 
  useEffect(() => {
   /* if (props.eventId && props.userEvent) {
      eventuserData();
    }

    async function eventuserData() {     
      let user = await EventsApi.getEventUser(props.userEvent._id, props.eventId);
    }*/
  }, [props.eventId && props.userEvent]);

  let menu = (
    <Menu>
      <Menu.Item style={ItemStyle}>
        <NavLink
          onClick={(e) => {
            e.preventDefault();
            props.location.pathname.includes('landing')
              ? props.setViewPerfil({ view: true, perfil: { _id: props.userEvent._id, properties: props.userEvent } })
              : null;
          }}
          to={''}>
          <FormattedMessage id='header.profile' defaultMessage='Mi Perfil' />
        </NavLink>
      </Menu.Item>
      <Menu.Item style={ItemStyle}>
        <Link to={`/tickets/${eventId}`}>
          <FormattedMessage id='header.my_tickets' defaultMessage='Mis Entradas / Ticket' />
        </Link>
      </Menu.Item>
      <Menu.Item style={ItemStyle}>
        <NavLink exact to={`/eventEdit/${eventId}#events`}>
          <FormattedMessage id='header.my_events' defaultMessage='Administrar Mis Eventos' />
        </NavLink>
      </Menu.Item>

      <Menu.Item style={ItemStyle}>
        <Link to={'/create-event'}>
          <Button type='primary' size='medium'>
            <FormattedMessage id='header.create_event' defaultMessage='Crear Evento' />
          </Button>
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item style={ItemStyle}>
        <a onClick={logout}>
          <LogoutOutlined />
          <FormattedMessage id='header.logout' defaultMessage='Log Out' />
        </a>
      </Menu.Item>
    </Menu>
  );

  let loggedOutUser = <div style={MenuStyle}></div>;

  let loggedInuser = (
    <Row style={MenuStyle}>
      <Col style={MenuStyle}>
        <Dropdown arrow overlay={menu}>
          <a onClick={(e) => e.preventDefault()}>
            <Space
              className='shadowHover'
              style={{
                height: '40px',
                backgroundColor: 'white',
                borderRadius: '50px',
                paddingLeft: '5px',
                paddingRight: '5px',
              }}>
              {photo ? (
                <Avatar src={photo} />
              ) : (
                <Avatar className='avatar_menu-user'>
                  {name && name.charAt(0).toUpperCase()}
                  {name && name.substring(name.indexOf(' ') + 1, name.indexOf(' ') + 2)}
                </Avatar>
              )}
              <span className='name_menu-user'>{name}</span>
              <DownOutlined style={{ fontSize: '12px' }} />
            </Space>
          </a>
        </Dropdown>
      </Col>
    </Row>
  );

  return <React.Fragment>{user ? loggedInuser : loggedOutUser}</React.Fragment>;
};

const mapDispatchToProps = {
  setViewPerfil,
};

export default connect(null, mapDispatchToProps)(WithLoading(withRouter(UserStatusAndMenu)));
