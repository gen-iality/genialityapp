import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import LetterAvatar from "./letterAvatar";
import WithLoading from "./withLoading";
import { Menu, Dropdown, Avatar, Button, Col, Row } from "antd";
import { DownOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link, withRouter } from "react-router-dom";

const MenuStyle = {
  flex: 1,
  textAlign: "right"
}

let userStatusAndMenu = props => {
  let user = props.user;
  let menuOpen = props.menuOpen;
  let photo = props.photo;
  let name = props.name;

  let logout = props.logout;
  let openMenu = props.openMenu;
  let eventId = props.eventId;

  let menu = (
    <Menu>
      <Menu.Item>
        <Link to={`/profile/${eventId}`}>
          <FormattedMessage id="header.profile" defaultMessage="Perfil" />
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to={`/tickets/${eventId}`}>
          <FormattedMessage id="header.my_tickets" defaultMessage="Mis Entradas / Ticket" />
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to={`/eventEdit/${eventId}#events`}>
          <FormattedMessage id="header.my_events" defaultMessage="Administrar Mis Eventos" />
        </Link>
      </Menu.Item>
      {/* <Menu.Item>
        <Link to={`/purchase/${eventId}`}>
          <FormattedMessage id="header.purchase" defaultMessage="Compras" />
        </Link>
      </Menu.Item> */}
      <Menu.Item>
        <Link to={"/create-event"}>
          <Button type="primary">
            <FormattedMessage id="header.create_event" defaultMessage="Crear Evento" />
          </Button>
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <a onClick={logout}>
          <LogoutOutlined /> &nbsp;&nbsp;
          <FormattedMessage id="header.logout" defaultMessage="Log Out" />
        </a>
      </Menu.Item>
    </Menu>
  );

  let loggedOutUser = (
    <div style={MenuStyle}>
      <Button type="primary" onClick={logout}>
        <FormattedMessage id="header.login" defaultMessage="Sign In" />
      </Button>
    </div>
  );

  let loggedInuser = (
    <Row style={MenuStyle}>
      <Col style={MenuStyle}>
        <Dropdown overlay={menu}>
          <a onClick={e => e.preventDefault()}>
            {photo ? <Avatar src={photo} /> : <Avatar className="avatar_menu-user">{name && name.charAt(0).toUpperCase()}{name && name.substring(name.indexOf(" ") + 1, name.indexOf(" ") + 2)}</Avatar>}
            <span className="name_menu-user">&nbsp;&nbsp;{name}&nbsp;&nbsp;</span>
          </a>
        </Dropdown>
      </Col>
    </Row>
  );

  //<img src={photo} alt={`avatar_${name}`} className="author-image is-hidden-mobile" />
  return <React.Fragment>{user ? loggedInuser : loggedOutUser}</React.Fragment>;
};

export default WithLoading(userStatusAndMenu);
