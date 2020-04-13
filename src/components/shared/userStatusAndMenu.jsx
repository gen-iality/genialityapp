import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import LetterAvatar from "./letterAvatar";
import WithLoading from "./withLoading";
import { Menu, Dropdown, Avatar } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
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
          <button className="button is-primary has-text-weight-bold">
            <FormattedMessage id="header.create_event" defaultMessage="Create Event" />
          </button>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <a className="navbar-item has-text-weight-bold has-text-grey-light" onClick={logout}>
          <FormattedMessage id="header.logout" defaultMessage="Log Out" />
        </a>
      </Menu.Item>
    </Menu>
  );

  let loggedOutUser = (
    <div style={{ flex: 1, textAlign: "right" }}>
      <button className="button is-primary has-text-weight-bold" onClick={logout}>
        <FormattedMessage id="header.login" defaultMessage="Sign In" />
      </button>
    </div>
  );

  let loggedInuser = (
    <Dropdown className={"is-pulled-right"} overlay={menu} trigger="click">
      <a style={{ flex: 1, textAlign: "right" }} className="ant-dropdown-link" onClick={e => e.preventDefault()}>
        &nbsp;&nbsp;&nbsp;{name}&nbsp;&nbsp;
        <Avatar size="large" src={photo}>
          {name && name.charAt(0)}
        </Avatar>
        <DownOutlined />
        {/* icon={<UserOutlined />} {name} */}
      </a>
    </Dropdown>
  );

  //<img src={photo} alt={`avatar_${name}`} className="author-image is-hidden-mobile" />
  return <React.Fragment>{user ? loggedInuser : loggedOutUser}</React.Fragment>;
};

export default WithLoading(userStatusAndMenu);
