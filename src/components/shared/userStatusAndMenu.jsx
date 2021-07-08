import React from 'react';
import { FormattedMessage } from 'react-intl';
import WithLoading from './withLoading';
import { Menu, Dropdown, Avatar, Button, Col, Row } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setViewPerfil } from '../../redux/viewPerfil/actions';

const MenuStyle = {
  flex: 1,
  textAlign: 'right',
};

let userStatusAndMenu = (props) => {
  let user = props.user;
  let photo = props.photo;
  let name = props.name;
  let logout = props.logout;
  let eventId = props.eventId;

  let menu = (
    <Menu>
      <Menu.Item>
        <NavLink
          onClick={(e) => {
            e.preventDefault();
            props.location.pathname.includes('landing') ? props.setViewPerfil(false) : null;
          }}
          to={''}>
          <FormattedMessage id='header.profile' defaultMessage='Perfil' />
        </NavLink>
      </Menu.Item>
      <Menu.Item>
        <Link to={`/tickets/${eventId}`}>
          <FormattedMessage id='header.my_tickets' defaultMessage='Mis Entradas / Ticket' />
        </Link>
      </Menu.Item>
      <Menu.Item>
        <NavLink exact to={`/eventEdit/${eventId}#events`}>
          <FormattedMessage id='header.my_events' defaultMessage='Administrar Mis Eventos' />
        </NavLink>
      </Menu.Item>
      {/* <Menu.Item>
        <Link to={`/purchase/${eventId}`}>
          <FormattedMessage id="header.purchase" defaultMessage="Compras" />
        </Link>
      </Menu.Item> */}
      <Menu.Item>
        <Link to={'/create-event'}>
          <Button type='primary'>
            <FormattedMessage id='header.create_event' defaultMessage='Crear Evento' />
          </Button>
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <a onClick={logout}>
          <LogoutOutlined /> &nbsp;&nbsp;
          <FormattedMessage id='header.logout' defaultMessage='Log Out' />
        </a>
      </Menu.Item>
    </Menu>
  );

  let loggedOutUser = (
    <div style={MenuStyle}>
      {/* <Button type="primary" className="btn-log" onClick={logout}>
        <FormattedMessage id="header.login" defaultMessage="Sign In" />
      </Button> */}
    </div>
  );

  let loggedInuser = (
    <Row style={MenuStyle}>
      <Col style={MenuStyle}>
        <Dropdown overlay={menu}>
          <a onClick={(e) => e.preventDefault()}>
            {photo ? (
              <Avatar src={photo} />
            ) : (
              <Avatar className='avatar_menu-user'>
                {name && name.charAt(0).toUpperCase()}
                {name && name.substring(name.indexOf(' ') + 1, name.indexOf(' ') + 2)}
              </Avatar>
            )}
            <span className='name_menu-user'>&nbsp;&nbsp;{name}&nbsp;&nbsp;</span>
          </a>
        </Dropdown>
      </Col>
    </Row>
  );

  //<img src={photo} alt={`avatar_${name}`} className="author-image is-hidden-mobile" />
  return <React.Fragment>{user ? loggedInuser : loggedOutUser}</React.Fragment>;
};

const mapDispatchToProps = {
  setViewPerfil,
};

export default connect(null, mapDispatchToProps)(WithLoading(withRouter(userStatusAndMenu)));
