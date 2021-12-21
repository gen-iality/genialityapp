import React, { useEffect, useState, useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import WithLoading from './withLoading';
import { Menu, Dropdown, Avatar, Button, Col, Row, Space } from 'antd';
import {
  ContactsOutlined,
  DownOutlined,
  LogoutOutlined,
  ScheduleOutlined,
  SolutionOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setViewPerfil } from '../../redux/viewPerfil/actions';
import withContext from '../../Context/withContext';
import TicketConfirmationOutlineIcon from '@2fd/ant-design-icons/lib/TicketConfirmationOutline';
import AccountOutlineIcon from '@2fd/ant-design-icons/lib/AccountOutline';
import BadgeAccountOutlineIcon from '@2fd/ant-design-icons/lib/BadgeAccountOutline';
import CalendarCheckOutlineIcon from '@2fd/ant-design-icons/lib/CalendarCheckOutline';
import HexagonMultipleOutlineIcon from '@2fd/ant-design-icons/lib/HexagonMultipleOutline';
import LogoutIcon from '@2fd/ant-design-icons/lib/Logout';
const MenuStyle = {
  flex: 1,
  textAlign: 'right',
};

const ItemStyle = {
  backgroundColor: 'white',
  //border: '1px solid #cccccc',
  minWidth: 150,
  padding: 5,
  margin: 5,
};

const UserStatusAndMenu = (props) => {
  let { cEventUser } = props;
  let user = props.user;
  let photo = props.photo;
  let name = props.name;
  let logout = props.logout;
  const [visible, setVisible] = useState(true);

  function linkToTheMenuRouteS(menuRoute) {
    window.location.href = `${window.location.origin}${menuRoute}`;
  }
  useEffect(() => {
    if (props.eventId && props.eventId == '60cb7c70a9e4de51ac7945a2') setVisible(false);
    console.log('aja', !props.cUser?.value?.isAnonymous);
  }, [props.eventId]);

  let menu = !props.anonimususer ? (
    <Menu>
      <Menu.Item
        icon={<AccountOutlineIcon style={{ fontSize: '18px' }} />}
        onClick={() => linkToTheMenuRouteS(`/myprofile`)}>
        <FormattedMessage id='header.profile' defaultMessage='Mi Perfil' />
      </Menu.Item>
      {props.location.pathname.includes('landing') && cEventUser.value && cEventUser.status === 'LOADED' && (
        <Menu.Item
          onClick={() => {
            props.setViewPerfil({ view: true, perfil: { _id: props.userEvent?._id, properties: props.userEvent } });
          }}
          icon={<BadgeAccountOutlineIcon style={{ fontSize: '18px' }} />}>
          <FormattedMessage id='header.my_data_event' defaultMessage='Mis datos en el evento' />
        </Menu.Item>
      )}
      <Menu.Divider />
      {visible && (
        <Menu.Item
          icon={<TicketConfirmationOutlineIcon style={{ fontSize: '18px' }} />}
          onClick={() => linkToTheMenuRouteS(`/myprofile/tickets`)}>
          <FormattedMessage id='header.my_tickets' defaultMessage='Mis Entradas / Ticket' />
        </Menu.Item>
      )}
      {visible && (
        <Menu.Item
          icon={<CalendarCheckOutlineIcon style={{ fontSize: '18px' }} />}
          onClick={() => linkToTheMenuRouteS(`/myprofile/events`)}>
          <FormattedMessage id='header.my_events' defaultMessage='Administrar Mis Eventos' />
        </Menu.Item>
      )}
      {visible && (
        <Menu.Item
          icon={<HexagonMultipleOutlineIcon style={{ fontSize: '18px' }} />}
          onClick={() => {
            linkToTheMenuRouteS(`/myprofile/organization`);
          }}>
          <FormattedMessage id='header.my_organizations' defaultMessage='Administrar Mis Eventos' />
        </Menu.Item>
      )}
      <Menu.Divider />
      {visible && (
        <Menu.Item
          onClick={() =>
            linkToTheMenuRouteS(
              window.location.toString().includes('admin/organization')
                ? `/create-event/${props.userEvent._id}/?orgId=${window.location.pathname.split('/')[3]}`
                : window.location.toString().includes('organization') &&
                  !window.location.toString().includes('myprofile')
                ? `/create-event/${props.userEvent._id}/?orgId=${props.eventId}`
                : `/create-event/${props.userEvent._id}`
            )
          }>
          <Button block type='primary' size='medium'>
            <FormattedMessage id='header.create_event' defaultMessage='Crear Evento' />
          </Button>
        </Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item danger icon={<LogoutIcon style={{ fontSize: '18px' }} />} onClick={logout}>
        <FormattedMessage id='header.logout' defaultMessage='Salir' />
      </Menu.Item>
    </Menu>
  ) : (
    <Menu>
      {!props.anonimususer ? (
        <Menu.Item style={ItemStyle}>{`Bienvenido ${props.cUser?.value?.names}`}</Menu.Item>
      ) : (
        <Menu.Item style={ItemStyle}>{`Por favor inicie sesión`}</Menu.Item>
      )}
    </Menu>
  );

  let loggedOutUser = <div style={MenuStyle}></div>;

  let loggedInuser = (
    <Row style={MenuStyle}>
      <Col style={MenuStyle}>
        <Dropdown arrow overlay={menu} placement='bottomRight'>
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

  return <>{user ? loggedInuser : loggedOutUser}</>;
};

const mapDispatchToProps = {
  setViewPerfil,
};
let UserStatusAndMenuWithContext = withContext(UserStatusAndMenu);
export default connect(null, mapDispatchToProps)(WithLoading(withRouter(UserStatusAndMenuWithContext)));
