import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import LetterAvatar from "./letterAvatar";
import WithLoading from "./withLoading";
import { Menu, Dropdown, Avatar, Button, Col, Row } from "antd";
import { DownOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link, withRouter } from "react-router-dom";

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
          <FormattedMessage id="header.profile" defaultMessage="Profile" />
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to={`/profile/${eventId}#events`}>
          <FormattedMessage id="header.my_events" defaultMessage="Eventos" />
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to={`/profile/${eventId}#events`}>
          <FormattedMessage id="header.my_tickets" defaultMessage="Ticket" />
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to={"/create-event"}>
          <Button type="primary">
            <FormattedMessage id="header.create_event" defaultMessage="Create Event" />
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
    <div style={{ flex: 1, textAlign: "right" }}>
      <Button type="primary" onClick={logout}>
        <FormattedMessage id="header.login" defaultMessage="Sign In" />
      </Button>
    </div>
  );

  let loggedInuser = (
    <Row style={{ flex: 1, textAlign: "right" }}>
      <Col style={{ flex: 1, textAlign: "right" }}>
        <Dropdown overlay={menu}>
          <a onClick={e => e.preventDefault()}>
            <Avatar size="large" src={photo}>
              {name && name.charAt(0)}
            </Avatar>
            &nbsp;&nbsp;&nbsp;{name}&nbsp;&nbsp;
            <DownOutlined />
            {/* icon={<UserOutlined />} {name} */}
          </a>
        </Dropdown>
      </Col>
    </Row>
  );

  //<img src={photo} alt={`avatar_${name}`} className="author-image is-hidden-mobile" />
  return <React.Fragment>{user ? loggedInuser : loggedOutUser}</React.Fragment>;
};

export default WithLoading(userStatusAndMenu);
