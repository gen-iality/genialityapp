import React, { Component, useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { app } from '../helpers/firebase';
import * as Cookie from 'js-cookie';
import { ApiUrl } from '../helpers/constants';
import privateInstance, { OrganizationApi, getCurrentUser, EventsApi, EventFieldsApi } from '../helpers/request';
import LogOut from '../components/shared/logOut';
import ErrorServe from '../components/modal/serverError';
import UserStatusAndMenu from '../components/shared/userStatusAndMenu';
import { connect } from 'react-redux';
import * as userActions from '../redux/user/actions';
import * as eventActions from '../redux/event/actions';
import MenuOld from '../components/events/shared/menu';
import { Menu, Drawer, Button, Col, Row, Layout, Space, Spin } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, LockOutlined } from '@ant-design/icons';
import withContext from '../Context/withContext';
import ModalAuth from '../components/authentication/ModalAuth';
import ModalLoginHelpers from '../components/authentication/ModalLoginHelpers';

const { setEventData } = eventActions;
const { addLoginInformation, showMenu } = userActions;

const { Header } = Layout;
const zIndex = {
  zIndex: '1',
};

const Headers = (props) => {
  const [dataGeneral, setdataGeneral] = useState({
    selection: [],
    organizations: [],
    name: '',
    user: false,
    menuOpen: false,
    timeout: false,
    modal: false,
    loader: false,
    create: false,
    valid: true,
    serverError: false,
    showAdmin: false,
    showEventMenu: false,
    tabEvtType: true,
    tabEvtCat: true,
    eventId: null,
    userEvent: null,
    modalVisible: false,
    tabModal: '1',
    loadingUser: true,
    anonimususer: false,
  });

  const [organizationsMine, setorganizationsMine] = useState([]);
  const [loadedData, setloadedData] = useState(false);

  const modalClose = () => {
    setdataGeneral({ ...dataGeneral, modalVisible: false, tabModal: '' });
  };

  const logout = () => {
    app
      .auth()
      .signOut()
      .then(() => {
        window.location.replace(window.location.origin + '');
      })
      .catch(function(error) {
        console.log('error', error);
      });
  };

  const openMenu = () => {
    setdataGeneral({ ...dataGeneral, menuOpen: !dataGeneral.menuOpen, filterOpen: false });
  };

  const goReport = (e) => {
    e.preventDefault();
    window.location.replace(`${ApiUrl}/events/reports`);
  };

  const handleMenuEvent = () => {
    setdataGeneral({ ...dataGeneral, showEventMenu: !dataGeneral.showEventMenu });
    props.showMenu();
  };

  const handleMenu = (location) => {
    const splited = location.pathname.split('/');
    if (splited[1] === '') {
      setdataGeneral({ ...dataGeneral, showAdmin: false, menuOpen: false });
    } else if (splited[1] === 'eventadmin' || splited[1] === 'orgadmin') {
      setdataGeneral({ ...dataGeneral, showAdmin: false, menuOpen: false, showEventMenu: false });
      window.scrollTo(0, 0);
    } else {
      setdataGeneral({ ...dataGeneral, showAdmin: false, menuOpen: false, showEventMenu: false });
    }
  };

  const showDrawer = () => {
    setdataGeneral({ ...dataGeneral, showEventMenu: true });
  };

  const onClose = () => {
    setdataGeneral({ ...dataGeneral, showEventMenu: false });
  };

  const setEventId = () => {
    const path = window.location.pathname.split('/');
    let eventId = path[2] || path[1];
    return eventId;
  };

  const LoadMineOrganizations = () => {
    OrganizationApi.mine().then((organizationsMine) => {
      setorganizationsMine(organizationsMine);
    });
  };

  async function LoadCurrentUser() {
    const eventId = setEventId();
    /*app.auth().onAuthStateChanged((user) => {
        if (user) {
          user.getIdToken().then(async function(idToken) {
            privateInstance.get(`/auth/currentUser?evius_token=${idToken}`).then((response) => {
              EventsApi.getStatusRegister(eventId, response.data.email).then((responseStatus) => {
                let data = responseStatus.data[0];
                const name =
                  data != null
                    ? data?.properties?.name || data?.properties?.names
                    : data?.properties?.name || data?.properties?.names;

                // console.log('aja=>>', responseStatus.data[0]);
                // console.log('organizationsMine', organizationsMine);
                // console.log('data', data);

                setdataGeneral({
                  ...dataGeneral,
                  name,
                  userEvent: data,
                  photo: data?.properties.picture
                    ? data?.properties.picture
                    : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
                  uid: data?.user.uid,
                  id: data?.user._id,
                  user: true,
                  loader: false,
                  organizations: organizationsMine,
                  loadingUser: false,
                  anonimususer: false,
                });
                setloadedData(true);
                // props.addLoginInformation(data);
                // handleMenu(window.location);
              });
            });
          });
        }
      });*/
    //PARA VALIDAR SI ESTÁ DENTRO DE UN EVENTO
    if (eventId) {
      try {
        EventsApi.getStatusRegister(eventId, props.cUser?.value?.email).then((responseStatus) => {
          //EXISTE EVENT USER
          if (responseStatus.data.length > 0) {
            let data = responseStatus.data[0];
            setdataGeneral({
              name: data.properties?.names || data.properties?.name,
              userEvent: { ...data?.properties, properties: data.properties },
              photo: data?.properties.picture
                ? data?.properties.picture
                : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
              uid: data?.user?.uid,
              id: data?.user?._id,
              user: true,
              loader: false,
              organizations: organizationsMine,
              loadingUser: false,
              anonimususer: false,
            });
          } else {
            // EL USUARIO TIENE SESION PERO NO ESTA REGISTRADO EN EL EVENTO
            let data = props.cUser?.value;
            setdataGeneral({
              name: data?.names || data?.name,
              userEvent: { ...data, properties: { names: data.names || data.name } },
              photo: data?.picture
                ? data?.picture
                : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
              uid: data?.user?.uid,
              id: data?.user?._id,
              user: true,
              loader: false,
              organizations: organizationsMine,
              loadingUser: false,
              anonimususer: false,
            });
          }
        });
      } catch (e) {
        console.log('error', e);
      }
    } else {
      //SOLO EXISTE USER
      let data = props.cUser?.value;
      setdataGeneral({
        name: data?.names || data?.name,
        userEvent: { ...data, properties: { names: data.names || data.name } },
        photo: data?.picture
          ? data?.picture
          : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
        uid: data?.user?.uid,
        id: data?.user?._id,
        user: true,
        loader: false,
        organizations: organizationsMine,
        loadingUser: false,
        anonimususer: false,
      });
    }
  }

  useEffect(() => {
    // console.log('loadedData', loadedData);
    if (props.cUser.value !== undefined && props.cUser.value !== null) {
      LoadMineOrganizations();
      LoadCurrentUser();

      // logout();
    }
  }, [props.cUser.value, props.cEvent.value]);

  // useEffect(() => {
  //   console.log('datageneral', dataGeneral);
  // }, [dataGeneral]);

  return (
    <React.Fragment>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <Menu theme='light' mode='horizontal'>
          <Row justify='space-between' align='middle'>
            <Row className='logo-header' justify='space-between' align='middle'>
              <Link to={'/'}>{/* <div className="icon-header" dangerouslySetInnerHTML={{ __html: icon }} /> */}</Link>
              {/* Menú de administrar un evento (esto debería aparecer en un evento no en todo lado) */}
              {dataGeneral?.showAdmin && (
                <Col span={2} offset={3} data-target='navbarBasicExample'>
                  <span className='icon icon-menu' onClick={() => handleMenuEvent()}>
                    <Button style={zIndex} onClick={() => showDrawer()}>
                      {React.createElement(dataGeneral.showEventMenu ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: () => {
                          console.log('CERRAR');
                        },
                      })}
                    </Button>
                  </span>
                </Col>
              )}
            </Row>

            {!dataGeneral.userEvent && !dataGeneral.loadingUser ? (
              !window.location.href.toString().includes('landing') &&
              window.location.href.toString().split('/').length == 4 && (
                <Space>
                  <Button
                    size='large'
                    style={{ backgroundColor: '#52C41A', color: '#FFFFFF' }}
                    onClick={() => setdataGeneral({ ...dataGeneral, modalVisible: true, tabModal: '2' })}>
                    Registrarme
                  </Button>
                  <Button
                    icon={<LockOutlined />}
                    size='large'
                    onClick={() => setdataGeneral({ ...dataGeneral, modalVisible: true, tabModal: '1' })}
                    style={{ marginRight: 5 }}>
                    Iniciar sesión
                  </Button>
                </Space>
              )
            ) : dataGeneral.userEvent != null && !dataGeneral.anonimususer ? (
              <UserStatusAndMenu
                isLoading={dataGeneral.loader}
                user={dataGeneral.user}
                menuOpen={dataGeneral.menuOpen}
                loader={dataGeneral.loader}
                photo={
                  dataGeneral.userEvent.properties?.picture
                    ? dataGeneral.userEvent.properties?.picture
                    : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                }
                name={
                  dataGeneral.userEvent.properties?.name
                    ? dataGeneral.userEvent.properties?.name
                    : dataGeneral.userEvent.properties?.names
                    ? dataGeneral.userEvent.properties?.names
                    : ''
                }
                userEvent={dataGeneral.userEvent}
                eventId={dataGeneral.eventId}
                logout={() => logout()}
                openMenu={() => openMenu()}
                loginInfo={props.loginInfo}
              />
            ) : (
              dataGeneral.userEvent != null &&
              dataGeneral.anonimususer && (
                <UserStatusAndMenu
                  isLoading={dataGeneral.loader}
                  user={dataGeneral.user}
                  menuOpen={dataGeneral.menuOpen}
                  loader={dataGeneral.loader}
                  photo={'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                  name={'Usuario Anonimo'}
                  userEvent={dataGeneral.userEvent}
                  eventId={dataGeneral.eventId}
                  logout={() => console.log('logout')}
                  openMenu={() => console.log('openMenu')}
                  loginInfo={props.loginInfo}
                  anonimususer={true}
                />
              )
            )}

            {/* {(window.location.href.toString().includes('events') ||
              window.location.href.toString().split('/').length == 4) &&
              !window.location.href.toString().includes('organization') && (
                <ModalAuth
                  tab={dataGeneral.tabModal}
                  closeModal={this.modalClose}
                  organization='register'
                  visible={dataGeneral.modalVisible}
                />
              )} */}
            {window.location.href.toString().includes('events') && <ModalLoginHelpers organization={1} />}
          </Row>
        </Menu>
      </Header>

      {/* Menu mobile */}

      {dataGeneral.showAdmin && dataGeneral.showEventMenu && (
        <div id='navbarBasicExample' className={`${eventMenu ? 'is-active' : ''}`}>
          <Drawer
            className='hiddenMenuMobile_Landing'
            title='Administrar evento'
            maskClosable={true}
            bodyStyle={{ padding: '0px' }}
            placement='left'
            closable={true}
            onClose={() => onClose()}
            visible={dataGeneral.showEventMenu}>
            <MenuOld match={window.location.pathname} />
          </Drawer>
        </div>
      )}

      {dataGeneral.timeout && <LogOut />}
      {dataGeneral.serverError && <ErrorServe errorData={errorData} />}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  categories: state.categories.items,
  types: state.types.items,
  loginInfo: state.user.data,
  eventMenu: state.user.menu,
  permissions: state.permissions,
  error: state.categories.error,
  event: state.event.data,
  modalVisible: state.stage.modal,
});

const mapDispatchToProps = {
  setEventData,
  addLoginInformation,
  showMenu,
};

let HeaderWithContext = withContext(withRouter(Headers));
export default connect(mapStateToProps, mapDispatchToProps)(HeaderWithContext);
