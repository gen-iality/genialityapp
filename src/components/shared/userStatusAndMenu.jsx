import React, { useEffect, useState, useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import WithLoading from './withLoading';
import { Menu, Dropdown, Avatar, Button, Col, Row, Space } from 'antd';
import { DownOutlined, LogoutOutlined } from '@ant-design/icons';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setViewPerfil } from '../../redux/viewPerfil/actions';
import withContext from '../../Context/withContext';

const MenuStyle = {
  flex: 1,
  textAlign: 'right',
};

const ItemStyle = {
  backgroundColor: 'white',
  //border: '1px solid #cccccc',
  minWidth:150,
  padding: 5,
  margin: 5,
};

const UserStatusAndMenu = (props) => {
  let user = props.user;
  let photo = props.photo;
  let name = props.name;
  let logout = props.logout;
  const [visible,setVisible]=useState(true)

  function linkToTheMenuRouteS(menuRoute) {
    window.location.href = `${window.location.origin}${menuRoute}`
  }
  useEffect(()=>{
    if(props.eventId && props.eventId=='60cb7c70a9e4de51ac7945a2')
    setVisible(false)
  },[props.eventId])
  let menu = (
      !props.cUser?.value?.isAnonymous ?  
      <Menu>
        <Menu.Item style={ItemStyle}>
          <NavLink
            onClick={(e) => {
              e.preventDefault();
              props.location.pathname.includes('landing')
                ? props.setViewPerfil({ view: true, perfil: { _id: props.userEvent?._id, properties: props.userEvent } })
                : null;
            }}
            to={''}>
            <FormattedMessage id='header.profile' defaultMessage='Mi Perfil' />
          </NavLink>
        </Menu.Item>
        {visible && <Menu.Item style={ItemStyle} onClick={()=> linkToTheMenuRouteS(`/myprofile/tickets`)}>
            <FormattedMessage id='header.my_tickets' defaultMessage='Mis Entradas / Ticket' />
        </Menu.Item>}
        {visible && <Menu.Item style={ItemStyle} onClick={()=> linkToTheMenuRouteS(`/myprofile/events`)}>
            <FormattedMessage id='header.my_events' defaultMessage='Administrar Mis Eventos' />
        </Menu.Item>}
        {visible && <Menu.Item style={ItemStyle} onClick={()=>{ linkToTheMenuRouteS(`/myprofile/organization`)}}>
            <FormattedMessage id='header.my_organizations' defaultMessage='Administrar Mis Eventos' />
        </Menu.Item>}

       {visible && <Menu.Item style={ItemStyle} onClick={()=> linkToTheMenuRouteS(window.location.toString().includes('admin/organization')?`/create-event/${props.userEvent._id}/?orgId=${window.location.pathname.split('/')[3]}`:window.location.toString().includes('organization')?`/create-event/${props.userEvent._id}/?orgId=${props.eventId}`:`/create-event/${props.userEvent._id}`)}>
            <Button type='primary' size='medium'>
              <FormattedMessage id='header.create_event' defaultMessage='Crear Evento' />
            </Button>
        </Menu.Item>}
        <Menu.Divider />
        <Menu.Item style={ItemStyle}>
          <a onClick={logout}>
            <LogoutOutlined />
            <FormattedMessage id='header.logout' defaultMessage='Log Out' />
          </a>
        </Menu.Item>
      </Menu> :  <Menu>
      <Menu.Item style={ItemStyle}>
      {`Bienvenido ${props.cUser?.value?.names}`}
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

  return <>{user ? loggedInuser : loggedOutUser}</>;
};

const mapDispatchToProps = {
  setViewPerfil,
};
let UserStatusAndMenuWithContext = withContext(UserStatusAndMenu);
export default connect(null, mapDispatchToProps)(WithLoading(withRouter(UserStatusAndMenuWithContext)));
