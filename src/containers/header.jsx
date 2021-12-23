import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { app } from '../helpers/firebase';
import { ApiUrl } from '../helpers/constants';
// import { OrganizationApi, EventsApi } from '../helpers/request';
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
import ModalLoginHelpers from '../components/authentication/ModalLoginHelpers';
import ModalAuth from '../components/authentication/ModalAuth';

const { setEventData } = eventActions;
const { addLoginInformation, showMenu } = userActions;

const { Header } = Layout;
const zIndex = {
  zIndex: '1',
};
const initialDataGeneral = {
  selection: [],
  name: '',
  user: false,
  menuOpen: false,
  timeout: false,
  modal: false,
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
  anonimususer: false,
};

const Headers = (props) => {
  const { cUser, showMenu, loginInfo, cHelper } = props;
  const [headerIsLoading, setHeaderIsLoading] = useState(true);
  const [dataGeneral, setdataGeneral] = useState(initialDataGeneral);

  const modalClose = () => {
    setdataGeneral({ ...dataGeneral, modalVisible: false, tabModal: '' });
  };
  const logout = () => {
    app
      .auth()
      .signOut()
      .then(() => {
        window.location.reload();
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
    showMenu();
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

  async function LoadCurrentUser() {
    let { value, status } = cUser;

    if (!value && status === 'LOADED') return setHeaderIsLoading(false), setdataGeneral(initialDataGeneral);
    if (!value) return;

    setdataGeneral({
      name: value?.names || value?.name,
      userEvent: { ...value, properties: { names: value.names || value.name } },
      photo: value?.picture
        ? value?.picture
        : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
      uid: value?.user?.uid,
      id: value?.user?._id,
      user: true,
      anonimususer: value?.isAnonymous || false,
    });
    setHeaderIsLoading(false);
    // }
  }

  useEffect(() => {
    LoadCurrentUser();
  }, [cUser?.value]);

  return (
    <React.Fragment>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%', left: 0, top: 0 }}>
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

            {headerIsLoading ? (
              <Spin />
            ) : !dataGeneral.userEvent && !window.location.href.toString().includes('landing') ? (
              <Space>
                <Button
                  icon={<LockOutlined />}
                  style={{ backgroundColor: '#52C41A', color: '#FFFFFF' }}
                  size='large'
                  onClick={() => setdataGeneral({ ...dataGeneral, modalVisible: true, tabModal: '1' })}>
                  Iniciar sesión
                </Button>
                <Button
                  size='large'
                  onClick={() => setdataGeneral({ ...dataGeneral, modalVisible: true, tabModal: '2' })}>
                  Registrarme
                </Button>
              </Space>
            ) : dataGeneral.userEvent != null && !dataGeneral.anonimususer ? (
              <UserStatusAndMenu
                user={dataGeneral.user}
                menuOpen={dataGeneral.menuOpen}
                photo={
                  dataGeneral.photo
                    ? dataGeneral.photo
                    : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                }
                name={dataGeneral.name ? dataGeneral.name : ''}
                userEvent={dataGeneral.userEvent}
                eventId={dataGeneral.eventId}
                logout={() => logout()}
                openMenu={() => openMenu()}
                loginInfo={loginInfo}
              />
            ) : (
              dataGeneral.userEvent != null &&
              dataGeneral.anonimususer && (
                <UserStatusAndMenu
                  user={dataGeneral.user}
                  menuOpen={dataGeneral.menuOpen}
                  photo={'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                  name={cUser.value?.names}
                  userEvent={dataGeneral.userEvent}
                  eventId={dataGeneral.eventId}
                  logout={() => logout()}
                  openMenu={() => console.log('openMenu')}
                  loginInfo={loginInfo}
                  anonimususer={true}
                />
              )
            )}
            {/* {(window.location.href.toString().includes('events') ||
              window.location.href.toString().split('/').length == 4) &&
              !window.location.href.toString().includes('organization') && ( */}
            <ModalAuth
              tab={dataGeneral.tabModal}
              closeModal={modalClose}
              organization='register'
              visible={dataGeneral.modalVisible}
            />
            {/* )} */}
            {<ModalLoginHelpers organization={1} />}
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
